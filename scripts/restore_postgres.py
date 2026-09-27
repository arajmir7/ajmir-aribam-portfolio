#!/usr/bin/env python3
"""Verify and restore a PostgreSQL dump to an explicitly empty database."""

from __future__ import annotations

import hashlib
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
    if not all((parsed.hostname, parsed.username, parsed.password, parsed.path.strip("/"))):
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


def main() -> None:
    if os.environ.get("RESTORE_CONFIRM") != "restore-into-empty-database":
        raise RuntimeError(
            "Set RESTORE_CONFIRM=restore-into-empty-database after selecting a new empty database"
        )
    if len(sys.argv) != 2:
        raise RuntimeError("Usage: restore_postgres.py <local-dump-path>")
    output = Path(sys.argv[1]).expanduser().resolve()
    checksum_path = Path(f"{output}.sha256")
    if not output.is_file() or not checksum_path.is_file():
        raise RuntimeError("Backup dump or its SHA-256 file is missing")
    checksum_fields = checksum_path.read_text(encoding="ascii").split()
    if len(checksum_fields) != 2 or checksum_fields[1] != output.name:
        raise RuntimeError("Backup SHA-256 file is malformed")
    expected = checksum_fields[0]
    if not re.fullmatch(r"[a-f0-9]{64}", expected):
        raise RuntimeError("Backup SHA-256 file is malformed")
    digest = hashlib.sha256()
    with output.open("rb") as backup_file:
        for chunk in iter(lambda: backup_file.read(1024 * 1024), b""):
            digest.update(chunk)
    if digest.hexdigest() != expected:
        raise RuntimeError("Backup SHA-256 verification failed")
    subprocess.run(
        ["pg_restore", "--list", str(output)],
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
        timeout=60,
    )

    environment, passfile = postgres_environment()
    try:
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


if __name__ == "__main__":
    try:
        main()
    except (RuntimeError, OSError, ValueError, KeyError, subprocess.CalledProcessError) as error:
        print(f"Restore failed: {error}", file=sys.stderr)
        raise SystemExit(1) from None
