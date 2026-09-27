"""Operator-only maintenance. Run in a trusted shell, never as an HTTP route."""

import argparse
from datetime import UTC, datetime, timedelta
from uuid import uuid4

from sqlalchemy import delete, func, select, text

from app.core.config import get_settings
from app.db.database import SessionLocal
from app.db.models import EmailDelivery, Inquiry, RateWindow
from app.services.email_outbox import process_inquiry, process_one
from app.services.notifications import send_notification


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "command",
        choices=[
            "pending",
            "deliveries",
            "retry-delivery",
            "dispatch-pending",
            "resend-smoke",
            "recent-inquiries",
            "email-status",
            "purge",
        ],
    )
    parser.add_argument("--days", type=int, default=90)
    parser.add_argument("--status", choices=["pending", "attempting", "sent", "failed"])
    parser.add_argument("--delivery-id")
    parser.add_argument("--limit", type=int, default=20)
    parser.add_argument(
        "--confirm-send",
        action="store_true",
        help="required to send the explicit Resend transport test",
    )
    args = parser.parse_args()
    if args.command == "resend-smoke":
        if not args.confirm_send:
            parser.error("resend-smoke requires --confirm-send to send one real email")
        settings = get_settings()
        if settings.email_status != "configured":
            parser.error("Resend API key, sender, and recipient must be configured")
        now = datetime.now(UTC)
        inquiry = Inquiry(
            id=str(uuid4()),
            name="Portfolio delivery test",
            email=settings.contact_email_to,
            topic="question",
            message="Owner-approved Resend transport smoke test. This is not a visitor inquiry.",
            request_id=f"resend-smoke-{uuid4()}",
            source_origin=settings.contact_allowed_origin or None,
            created_at=now,
        )
        provider_id = send_notification(inquiry, str(uuid4()), settings)
        print(f"Resend accepted the explicit smoke email; provider_message_id={provider_id}.")
        return

    if args.command == "dispatch-pending":
        if not 1 <= args.limit <= 50:
            parser.error("--limit must be between 1 and 50")
        processed = 0
        while processed < args.limit and process_one():
            processed += 1
        print(f"Processed {processed} due outbox deliveries.")
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
            delivery.provider_message_id = None
            delivery.last_error = None
            inquiry = db.get(Inquiry, delivery.inquiry_id)
            if inquiry is not None:
                inquiry.notification_status = "pending"
            db.commit()
            process_inquiry(inquiry.id if inquiry else "")
            db.refresh(delivery)
            print(f"Retried delivery {delivery.id}; state={delivery.status}.")
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
            f"{delivery.attempt_count}\t{attempted}\t{sent}\t"
            f"{delivery.provider_message_id or '-'}\t{error}"
        )


if __name__ == "__main__":
    main()
