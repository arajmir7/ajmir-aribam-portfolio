"""Operator-only maintenance. Run in a trusted shell, never as an HTTP route."""

import argparse
import os
from datetime import UTC, datetime, timedelta
from re import fullmatch

import psycopg
from psycopg import sql
from sqlalchemy import delete, select
from sqlalchemy.engine import make_url

from app.core.config import get_settings
from app.db.database import SessionLocal
from app.db.models import Inquiry, RateWindow


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("command", choices=["pending", "purge", "prepare-runtime-role"])
    parser.add_argument("--days", type=int, default=90)
    args = parser.parse_args()
    if args.command == "prepare-runtime-role":
        settings = get_settings()
        role = os.environ.get("DATABASE_RUNTIME_USER", "").strip()
        password = os.environ.get("DATABASE_RUNTIME_PASSWORD", "")
        if not fullmatch(r"[a-zA-Z][a-zA-Z0-9_]{0,62}", role):
            parser.error("DATABASE_RUNTIME_USER must be a simple PostgreSQL role name")
        if len(password) < 32:
            parser.error("DATABASE_RUNTIME_PASSWORD must contain at least 32 characters")
        migration_url = make_url(settings.migration_database_url)
        if role == migration_url.username:
            parser.error("Runtime and migration database users must be different")
        connect_url = migration_url.set(drivername="postgresql").render_as_string(
            hide_password=False
        )
        with psycopg.connect(connect_url, autocommit=True) as connection:
            role_identifier = sql.Identifier(role)
            role_password = sql.Literal(password)
            migration_identifier = sql.Identifier(migration_url.username)
            database_identifier = sql.Identifier(migration_url.database)
            exists = connection.execute(
                "SELECT 1 FROM pg_roles WHERE rolname = %s", (role,)
            ).fetchone()
            operation = "ALTER ROLE" if exists else "CREATE ROLE"
            connection.execute(
                sql.SQL("{} {} WITH LOGIN PASSWORD {}").format(
                    sql.SQL(operation), role_identifier, role_password
                )
            )
            statements = (
                sql.SQL("GRANT CONNECT ON DATABASE {} TO {}").format(
                    database_identifier, role_identifier
                ),
                sql.SQL("GRANT USAGE ON SCHEMA public TO {}").format(role_identifier),
                sql.SQL(
                    "GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO {}"
                ).format(role_identifier),
                sql.SQL(
                    "GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA public TO {}"
                ).format(role_identifier),
                sql.SQL(
                    "ALTER DEFAULT PRIVILEGES FOR ROLE {} IN SCHEMA public "
                    "GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO {}"
                ).format(migration_identifier, role_identifier),
                sql.SQL(
                    "ALTER DEFAULT PRIVILEGES FOR ROLE {} IN SCHEMA public "
                    "GRANT USAGE, SELECT, UPDATE ON SEQUENCES TO {}"
                ).format(migration_identifier, role_identifier),
            )
            for statement in statements:
                connection.execute(statement)
        print("Prepared the restricted runtime database role.")
        return

    with SessionLocal() as db:
        if args.command == "pending":
            for inquiry in db.scalars(
                select(Inquiry)
                .where(Inquiry.notification_status == "pending")
                .order_by(Inquiry.created_at)
                .limit(100)
            ):
                print(
                    f"{inquiry.id}\t{inquiry.created_at.isoformat()}\t{inquiry.topic}\t{inquiry.email}"
                )
        elif args.command == "purge":
            if not 1 <= args.days <= 365:
                parser.error("--days must be between 1 and 365")
            cutoff = datetime.now(UTC) - timedelta(days=args.days)
            count = db.execute(delete(Inquiry).where(Inquiry.created_at < cutoff)).rowcount
            db.execute(
                delete(RateWindow).where(
                    RateWindow.starts_at < datetime.now(UTC) - timedelta(days=1)
                )
            )
            db.commit()
            print(f"Purged {count} inquiries older than {args.days} days")


if __name__ == "__main__":
    main()
