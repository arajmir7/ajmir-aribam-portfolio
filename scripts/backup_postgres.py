#!/usr/bin/env python3
"""Create a verified local PostgreSQL dump with a SHA-256 sidecar."""

from __future__ import annotations

import hashlib
import os
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


def main() -> None:
    os.umask(0o077)
    environment, passfile = postgres_environment()
    backup_dir = Path(os.environ.get("BACKUP_DIR", "./backups")).expanduser().resolve()
    backup_dir.mkdir(mode=0o700, parents=True, exist_ok=True)
    backup_dir.chmod(0o700)
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

        print(f"PostgreSQL backup verified: {output} ({checksum})")
    finally:
        passfile.unlink(missing_ok=True)
        partial.unlink(missing_ok=True)


if __name__ == "__main__":
    try:
        main()
    except (RuntimeError, OSError, ValueError) as error:
        print(f"Backup failed: {error}", file=sys.stderr)
        raise SystemExit(1) from None
