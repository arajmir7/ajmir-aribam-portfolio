"""Operator-only maintenance. Run in a trusted shell, never as an HTTP route."""

import argparse
from datetime import UTC, datetime, timedelta

from sqlalchemy import delete, select

from app.db.database import SessionLocal
from app.db.models import Inquiry, RateWindow


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("command", choices=["pending", "purge"])
    parser.add_argument("--days", type=int, default=90)
    args = parser.parse_args()
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
