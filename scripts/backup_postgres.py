#!/usr/bin/env python3
"""Create a checked PostgreSQL dump and optionally upload it to encrypted S3."""

from __future__ import annotations

import hashlib
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
from datetime import UTC, datetime
from pathlib import Path
from urllib.parse import parse_qs, unquote, urlsplit
from uuid import uuid4


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


def s3_settings() -> tuple[str, str, str, str]:
    bucket = os.environ.get("BACKUP_S3_BUCKET", "").strip()
    prefix = os.environ.get("BACKUP_S3_PREFIX", "portfolio/prod").strip("/")
    region = os.environ.get("AWS_REGION", "").strip()
    kms_key = os.environ.get("AWS_KMS_KEY_ID", "").strip()
    if (
        not re.fullmatch(r"[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]", bucket)
        or not region
        or not kms_key
        or not re.fullmatch(r"[A-Za-z0-9._/-]+", prefix)
        or ".." in prefix.split("/")
    ):
        raise RuntimeError("Production S3 backup configuration is incomplete or invalid")
    return bucket, prefix, region, kms_key


def aws(*arguments: str, region: str) -> subprocess.CompletedProcess[str]:
    try:
        return subprocess.run(
            ["aws", *arguments, "--region", region],
            check=True,
            capture_output=True,
            text=True,
            timeout=1800,
        )
    except (subprocess.CalledProcessError, subprocess.TimeoutExpired) as error:
        raise RuntimeError("The encrypted backup upload or verification failed") from error


def upload_and_verify(path: Path, uri: str, region: str, bucket: str, kms_arn: str) -> None:
    aws(
        "s3",
        "cp",
        str(path),
        uri,
        "--only-show-errors",
        "--sse",
        "aws:kms",
        "--sse-kms-key-id",
        kms_arn,
        region=region,
    )
    key = uri.removeprefix(f"s3://{bucket}/")
    result = aws(
        "s3api",
        "head-object",
        "--bucket",
        bucket,
        "--key",
        key,
        "--output",
        "json",
        region=region,
    )
    metadata = json.loads(result.stdout)
    if (
        int(metadata.get("ContentLength", 0)) != path.stat().st_size
        or metadata.get("ServerSideEncryption") != "aws:kms"
        or metadata.get("SSEKMSKeyId") != kms_arn
    ):
        raise RuntimeError("An uploaded backup object failed size or KMS verification")


def main() -> None:
    os.umask(0o077)
    environment, passfile = postgres_environment()
    production = os.environ.get("APP_ENV") == "production"
    backup_dir = (
        Path(tempfile.mkdtemp(prefix="portfolio-backup-"))
        if production
        else Path(os.environ.get("BACKUP_DIR", "/tmp/portfolio-backups"))
    )
    backup_dir.mkdir(mode=0o700, parents=True, exist_ok=True)
    timestamp = datetime.now(UTC).strftime("%Y%m%dT%H%M%SZ")
    filename = f"portfolio-{timestamp}-{uuid4().hex[:12]}.dump"
    output = backup_dir / filename
    partial = backup_dir / f".{filename}.partial"
    try:
        subprocess.run(
            ["pg_dump", "--format=custom", "--no-owner", "--no-privileges", "--file", str(partial)],
            check=True,
            env=environment,
            timeout=1800,
        )
        if not partial.is_file() or partial.stat().st_size < 1:
            raise RuntimeError("PostgreSQL returned an empty backup")
        os.replace(partial, output)
        subprocess.run(
            ["pg_restore", "--list", str(output)],
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            timeout=60,
        )
        digest = hashlib.sha256()
        with output.open("rb") as backup_file:
            for chunk in iter(lambda: backup_file.read(1024 * 1024), b""):
                digest.update(chunk)
        checksum = digest.hexdigest()
        checksum_path = output.with_suffix(output.suffix + ".sha256")
        checksum_path.write_text(f"{checksum}  {filename}\n", encoding="ascii")

        if os.environ.get("APP_ENV") == "production":
            bucket, prefix, region, kms_key = s3_settings()
            if not os.environ.get("AWS_ACCESS_KEY_ID") or not os.environ.get(
                "AWS_SECRET_ACCESS_KEY"
            ):
                raise RuntimeError("Production S3 backup credentials are missing")
            key_result = aws(
                "kms",
                "describe-key",
                "--key-id",
                kms_key,
                "--output",
                "json",
                region=region,
            )
            kms_arn = json.loads(key_result.stdout)["KeyMetadata"]["Arn"]
            key = f"{prefix}/{filename}"
            uri = f"s3://{bucket}/{key}"
            for path, destination in (
                (output, uri),
                (checksum_path, f"{uri}.sha256"),
            ):
                upload_and_verify(path, destination, region, bucket, kms_arn)
            complete = backup_dir / f"{filename}.complete"
            complete.write_text(f"{checksum}  {filename}\n", encoding="ascii")
            upload_and_verify(complete, f"{uri}.complete", region, bucket, kms_arn)
            print(f"Encrypted PostgreSQL backup verified at {uri}")
        else:
            print(f"Local PostgreSQL backup verified: {output} ({checksum})")
    finally:
        passfile.unlink(missing_ok=True)
        partial.unlink(missing_ok=True)
        if production:
            shutil.rmtree(backup_dir, ignore_errors=True)


if __name__ == "__main__":
    try:
        main()
    except (RuntimeError, OSError, ValueError) as error:
        print(f"Backup failed: {error}", file=sys.stderr)
        raise SystemExit(1) from None
