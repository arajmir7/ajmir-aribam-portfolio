#!/usr/bin/env python3
"""Verify and restore a PostgreSQL dump to an explicitly empty database."""

from __future__ import annotations

import hashlib
import json
import os
import re
import subprocess
import sys
import tempfile
from pathlib import Path
from urllib.parse import parse_qs, unquote, urlsplit


def postgres_environment() -> tuple[dict[str, str], Path]:
    value = os.environ.get("DATABASE_URL", "")
    parsed = urlsplit(value)
    if parsed.scheme not in {"postgres", "postgresql", "postgresql+psycopg"}:
        raise RuntimeError("DATABASE_URL must be a PostgreSQL connection URL")
    if (
        not parsed.hostname
        or not parsed.username
        or not parsed.password
        or not parsed.path.strip("/")
    ):
        raise RuntimeError("DATABASE_URL must include host, credentials, and database")
    host = parsed.hostname
    port = parsed.port or 5432
    database = unquote(parsed.path.strip("/"))
    username = unquote(parsed.username)
    password = unquote(parsed.password)
    if any("\n" in item or "\r" in item for item in (host, database, username, password)):
        raise RuntimeError("DATABASE_URL contains an unsupported newline")

    descriptor, passfile_name = tempfile.mkstemp(prefix="portfolio-pgpass-")
    os.close(descriptor)
    passfile = Path(passfile_name)
    os.chmod(passfile, 0o600)

    def escape(value: str) -> str:
        return value.replace("\\", "\\\\").replace(":", "\\:")

    passfile.write_text(
        ":".join(escape(item) for item in (host, str(port), database, username, password)) + "\n",
        encoding="utf-8",
    )
    environment = os.environ.copy()
    environment.pop("DATABASE_URL", None)
    environment.pop("PGPASSWORD", None)
    environment.update(
        {
            "PGHOST": host,
            "PGPORT": str(port),
            "PGDATABASE": database,
            "PGUSER": username,
            "PGPASSFILE": str(passfile),
        }
    )
    sslmode = parse_qs(parsed.query).get("sslmode", [None])[0]
    if sslmode:
        environment["PGSSLMODE"] = sslmode
    return environment, passfile


def run_aws(*arguments: str) -> None:
    try:
        subprocess.run(
            ["aws", *arguments, "--region", os.environ["AWS_REGION"]],
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            timeout=1800,
        )
    except (KeyError, subprocess.CalledProcessError, subprocess.TimeoutExpired) as error:
        raise RuntimeError("Could not download or verify the encrypted backup") from error


def aws_json(*arguments: str) -> dict[str, object]:
    try:
        result = subprocess.run(
            ["aws", *arguments, "--region", os.environ["AWS_REGION"], "--output", "json"],
            check=True,
            capture_output=True,
            text=True,
            timeout=1800,
        )
        payload = json.loads(result.stdout)
        if not isinstance(payload, dict):
            raise ValueError("expected an object")
        return payload
    except (
        KeyError,
        subprocess.CalledProcessError,
        subprocess.TimeoutExpired,
        ValueError,
    ) as error:
        raise RuntimeError("Could not verify the encrypted backup object") from error


def main() -> None:
    if os.environ.get("RESTORE_CONFIRM") != "restore-into-empty-database":
        raise RuntimeError(
            "Set RESTORE_CONFIRM=restore-into-empty-database after selecting a new empty database"
        )
    if len(sys.argv) != 2:
        raise RuntimeError("Usage: restore_postgres.py <local-dump-path | s3-object-key>")
    environment, passfile = postgres_environment()
    temporary = Path(tempfile.mkdtemp(prefix="portfolio-restore-"))
    remote_source = False
    try:
        source = sys.argv[1]
        if source.startswith("s3://"):
            raise RuntimeError("Pass an S3 object key, not a full URL")
        if "://" in source:
            raise RuntimeError("Backup source must be a local path or S3 object key")
        if not Path(source).expanduser().is_file():
            remote_source = True
            bucket = os.environ.get("BACKUP_S3_BUCKET", "")
            prefix = os.environ.get("BACKUP_S3_PREFIX", "portfolio/prod").strip("/")
            if not re.fullmatch(r"[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]", bucket):
                raise RuntimeError("BACKUP_S3_BUCKET is required to restore from S3")
            if not re.fullmatch(r"[A-Za-z0-9._/-]+", source) or ".." in source.split("/"):
                raise RuntimeError("Invalid S3 object key")
            if not source.startswith(f"{prefix}/"):
                raise RuntimeError("Backup key is outside the configured S3 prefix")
            kms_key = os.environ.get("AWS_KMS_KEY_ID", "").strip()
            if not kms_key:
                raise RuntimeError("AWS_KMS_KEY_ID is required to verify a remote restore")
            key_result = aws_json("kms", "describe-key", "--key-id", kms_key)
            key_metadata = key_result.get("KeyMetadata")
            if not isinstance(key_metadata, dict) or not key_metadata.get("Arn"):
                raise RuntimeError("Configured KMS key could not be verified")
            kms_arn = str(key_metadata["Arn"])
            output = temporary / Path(source).name
            base_uri = f"s3://{bucket}/{source}"
            for object_key in (source, f"{source}.sha256", f"{source}.complete"):
                object_metadata = aws_json(
                    "s3api", "head-object", "--bucket", bucket, "--key", object_key
                )
                if (
                    object_metadata.get("ServerSideEncryption") != "aws:kms"
                    or object_metadata.get("SSEKMSKeyId") != kms_arn
                    or int(object_metadata.get("ContentLength", 0)) < 1
                ):
                    raise RuntimeError(
                        "S3 backup object is not verified with the configured KMS key"
                    )
            run_aws("s3", "cp", base_uri, str(output))
            run_aws("s3", "cp", f"{base_uri}.sha256", f"{output}.sha256")
            run_aws("s3", "cp", f"{base_uri}.complete", f"{output}.complete")
            checksum_path = Path(f"{output}.sha256")
        else:
            output = Path(source).expanduser().resolve()
            checksum_path = Path(f"{output}.sha256")
            if not output.is_file() or not checksum_path.is_file():
                raise RuntimeError("Backup dump or its SHA-256 file is missing")
        checksum_fields = checksum_path.read_text(encoding="ascii").split()
        if len(checksum_fields) != 2 or not re.fullmatch(r"[a-f0-9]{64}", checksum_fields[0]):
            raise RuntimeError("Backup SHA-256 file is malformed")
        expected = checksum_fields[0]
        digest = hashlib.sha256()
        with output.open("rb") as backup_file:
            for chunk in iter(lambda: backup_file.read(1024 * 1024), b""):
                digest.update(chunk)
        actual = digest.hexdigest()
        if not re.fullmatch(r"[a-f0-9]{64}", expected) or actual != expected:
            raise RuntimeError("Backup SHA-256 verification failed")
        complete_path = Path(f"{output}.complete")
        if remote_source:
            complete_fields = (
                complete_path.read_text(encoding="ascii").split() if complete_path.is_file() else []
            )
            if len(complete_fields) != 2 or complete_fields[0] != expected:
                raise RuntimeError("Backup completion marker is missing or invalid")
        subprocess.run(
            ["pg_restore", "--list", str(output)],
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            timeout=60,
        )
        empty = subprocess.run(
            [
                "psql",
                "--no-psqlrc",
                "--tuples-only",
                "--no-align",
                "--set",
                "ON_ERROR_STOP=1",
                "--command",
                "SELECT count(*) FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace "
                "WHERE n.nspname <> 'information_schema' AND n.nspname NOT LIKE 'pg_%' "
                "AND c.relkind IN ('r','p','v','m','S','f')",
            ],
            check=True,
            capture_output=True,
            text=True,
            env=environment,
            timeout=30,
        )
        if empty.stdout.strip() != "0":
            raise RuntimeError("Restore target is not empty; select a new isolated database")
        subprocess.run(
            [
                "pg_restore",
                "--no-owner",
                "--no-privileges",
                "--exit-on-error",
                "--dbname",
                environment["PGDATABASE"],
                str(output),
            ],
            check=True,
            env=environment,
            timeout=1800,
        )
        revision = subprocess.run(
            [
                "psql",
                "--no-psqlrc",
                "--tuples-only",
                "--no-align",
                "--command",
                "SELECT version_num FROM alembic_version",
            ],
            check=True,
            capture_output=True,
            text=True,
            env=environment,
            timeout=30,
        ).stdout.strip()
        if not revision:
            raise RuntimeError("Restored database has no Alembic revision")
        print(f"Restore verified; Alembic revision is {revision}.")
    finally:
        passfile.unlink(missing_ok=True)
        for path in temporary.glob("*"):
            path.unlink(missing_ok=True)
        temporary.rmdir()


if __name__ == "__main__":
    try:
        main()
    except (RuntimeError, OSError, ValueError, KeyError, subprocess.CalledProcessError) as error:
        print(f"Restore failed: {error}", file=sys.stderr)
        raise SystemExit(1) from None
