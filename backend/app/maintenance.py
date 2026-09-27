"""Operator-only maintenance. Run in a trusted shell, never as an HTTP route."""

import argparse
import os
from datetime import UTC, datetime, timedelta
from re import fullmatch

import psycopg
from psycopg import sql
from sqlalchemy import delete, func, select, text
from sqlalchemy.engine import make_url

from app.core.config import get_settings
from app.db.database import SessionLocal
from app.db.models import EmailDelivery, Inquiry, RateWindow


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "command",
        choices=[
            "pending",
            "deliveries",
            "retry-delivery",
            "recent-inquiries",
            "email-status",
            "purge",
            "prepare-runtime-role",
        ],
    )
    parser.add_argument("--days", type=int, default=90)
    parser.add_argument("--status", choices=["pending", "attempting", "sent", "failed"])
    parser.add_argument("--delivery-id")
    parser.add_argument("--limit", type=int, default=20)
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
            args.status = "pending"
            _print_deliveries(db, args.status, args.limit)
        elif args.command == "deliveries":
            _print_deliveries(db, args.status, args.limit)
        elif args.command == "retry-delivery":
            if not args.delivery_id:
                parser.error("retry-delivery requires --delivery-id")
            delivery = db.get(EmailDelivery, args.delivery_id)
            if delivery is None:
                parser.error("email delivery was not found")
            if delivery.status != "failed":
                parser.error("only failed deliveries can be retried")
            delivery.status = "pending"
            delivery.attempt_count = 0
            delivery.claimed_at = None
            delivery.claim_token = None
            delivery.next_attempt_at = datetime.now(UTC)
            delivery.sent_at = None
            delivery.last_error = None
            inquiry = db.get(Inquiry, delivery.inquiry_id)
            if inquiry is not None:
                inquiry.notification_status = "pending"
            db.commit()
            print(f"Queued delivery {delivery.id} for retry.")
        elif args.command == "recent-inquiries":
            if not 1 <= args.limit <= 100:
                parser.error("--limit must be between 1 and 100")
            rows = db.execute(
                select(Inquiry, EmailDelivery)
                .outerjoin(EmailDelivery, EmailDelivery.inquiry_id == Inquiry.id)
                .order_by(Inquiry.created_at.desc())
                .limit(args.limit)
            )
            for inquiry, delivery in rows:
                delivery_state = delivery.status if delivery else "legacy/no delivery"
                print(
                    f"{inquiry.id}\t{inquiry.created_at.isoformat()}\t{inquiry.topic}\t{delivery_state}"
                )
        elif args.command == "email-status":
            settings = get_settings()
            db.execute(text("SELECT 1 FROM email_deliveries LIMIT 1"))
            statuses = {
                status: db.scalar(
                    select(func.count())
                    .select_from(EmailDelivery)
                    .where(EmailDelivery.status == status)
                )
                for status in ("pending", "attempting", "sent", "failed")
            }
            print(f"database=ready email_delivery={settings.email_status}")
            print(" ".join(f"{status}={count}" for status, count in statuses.items()))
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


def _print_deliveries(db, status: str | None, limit: int) -> None:
    if not 1 <= limit <= 100:
        raise SystemExit("--limit must be between 1 and 100")
    statement = select(EmailDelivery).order_by(EmailDelivery.created_at).limit(limit)
    if status:
        statement = statement.where(EmailDelivery.status == status)
    for delivery in db.scalars(statement):
        attempted = delivery.last_attempt_at.isoformat() if delivery.last_attempt_at else "-"
        sent = delivery.sent_at.isoformat() if delivery.sent_at else "-"
        error = delivery.last_error or "-"
        print(
            f"{delivery.id}\t{delivery.inquiry_id}\t{delivery.status}\t"
            f"{delivery.attempt_count}\t{attempted}\t{sent}\t{error}"
        )


if __name__ == "__main__":
    main()
