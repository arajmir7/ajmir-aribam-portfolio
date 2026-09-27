"""Claim, retry, and complete durable inquiry notification work."""

from dataclasses import dataclass
from datetime import UTC, datetime, timedelta
from uuid import uuid4

from sqlalchemy import and_, or_, select
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import Settings, get_settings
from app.core.logging import log
from app.db.database import SessionLocal
from app.db.models import EmailDelivery, Inquiry
from app.services.notifications import DeliveryFailure, send_notification

MAX_ATTEMPTS = 5
CLAIM_LEASE = timedelta(minutes=2)
RETRY_DELAYS = {
    1: timedelta(seconds=30),
    2: timedelta(minutes=2),
    3: timedelta(minutes=10),
    4: timedelta(minutes=30),
}


@dataclass(frozen=True, slots=True)
class DeliveryClaim:
    delivery_id: str
    inquiry_id: str
    request_id: str
    claim_token: str
    attempt_count: int
    inquiry: Inquiry


def claim_next(
    db: Session,
    now: datetime | None = None,
    *,
    inquiry_id: str | None = None,
) -> DeliveryClaim | None:
    timestamp = now or datetime.now(UTC)
    expired_claim = timestamp - CLAIM_LEASE
    eligible = or_(
        and_(
            EmailDelivery.status == "pending",
            or_(
                EmailDelivery.next_attempt_at.is_(None), EmailDelivery.next_attempt_at <= timestamp
            ),
        ),
        and_(EmailDelivery.status == "attempting", EmailDelivery.claimed_at <= expired_claim),
    )
    query = select(EmailDelivery).where(eligible)
    if inquiry_id is not None:
        query = query.where(EmailDelivery.inquiry_id == inquiry_id)
    delivery = db.scalar(
        query.order_by(EmailDelivery.created_at, EmailDelivery.id)
        .limit(1)
        .with_for_update(skip_locked=True)
    )
    if delivery is None:
        return None
    if delivery.attempt_count >= MAX_ATTEMPTS:
        delivery.status = "failed"
        delivery.claimed_at = None
        delivery.claim_token = None
        delivery.next_attempt_at = None
        delivery.last_error = "attempts_exhausted_after_restart"
        db.commit()
        log("email_delivery_failed", "worker", delivery_id=delivery.id, error=delivery.last_error)
        return None

    inquiry = db.get(Inquiry, delivery.inquiry_id)
    if inquiry is None:
        db.delete(delivery)
        db.commit()
        return None
    token = str(uuid4())
    delivery.status = "attempting"
    delivery.attempt_count += 1
    delivery.last_attempt_at = timestamp
    delivery.claimed_at = timestamp
    delivery.claim_token = token
    delivery.last_error = None
    db.commit()
    return DeliveryClaim(
        delivery_id=delivery.id,
        inquiry_id=inquiry.id,
        request_id=inquiry.request_id,
        claim_token=token,
        attempt_count=delivery.attempt_count,
        inquiry=inquiry,
    )


def finish_claim(
    db: Session,
    claim: DeliveryClaim,
    *,
    failure: DeliveryFailure | None = None,
    provider_message_id: str | None = None,
    now: datetime | None = None,
) -> bool:
    timestamp = now or datetime.now(UTC)
    delivery = db.get(EmailDelivery, claim.delivery_id)
    if delivery is None or delivery.claim_token != claim.claim_token:
        return False
    delivery.claimed_at = None
    delivery.claim_token = None
    if failure is None:
        delivery.status = "sent"
        delivery.sent_at = timestamp
        delivery.provider_message_id = provider_message_id
        delivery.next_attempt_at = None
        delivery.last_error = None
        inquiry = db.get(Inquiry, claim.inquiry_id)
        if inquiry is not None:
            inquiry.notification_status = "sent"
        db.commit()
        log(
            "email_delivery_sent",
            claim.request_id,
            delivery_id=claim.delivery_id,
            attempt_count=claim.attempt_count,
        )
        return True

    delivery.last_error = failure.code
    delivery.sent_at = None
    if failure.retryable and claim.attempt_count < MAX_ATTEMPTS:
        delivery.status = "pending"
        delivery.next_attempt_at = timestamp + RETRY_DELAYS[claim.attempt_count]
    else:
        delivery.status = "failed"
        delivery.next_attempt_at = None
    inquiry = db.get(Inquiry, claim.inquiry_id)
    if inquiry is not None:
        inquiry.notification_status = delivery.status
    db.commit()
    log(
        "email_delivery_failed"
        if delivery.status == "failed"
        else "email_delivery_retry_scheduled",
        claim.request_id,
        delivery_id=claim.delivery_id,
        attempt_count=claim.attempt_count,
        error=failure.code,
        **failure.diagnostics,
    )
    return True


def process_inquiry(
    inquiry_id: str,
    session_factory: sessionmaker = SessionLocal,
    settings: Settings | None = None,
) -> bool:
    configuration = settings or get_settings()
    if configuration.email_status != "configured":
        return False
    with session_factory() as db:
        claim = claim_next(db, inquiry_id=inquiry_id)
    if claim is None:
        return False

    failure = None
    provider_message_id = None
    try:
        provider_message_id = send_notification(claim.inquiry, claim.delivery_id, configuration)
    except DeliveryFailure as error:
        failure = error
    with session_factory() as db:
        finish_claim(
            db,
            claim,
            failure=failure,
            provider_message_id=provider_message_id,
        )
    return True


def process_one(
    session_factory: sessionmaker = SessionLocal,
    settings: Settings | None = None,
) -> bool:
    """Process one due delivery for explicit operator use; no daemon is required."""
    configuration = settings or get_settings()
    if configuration.email_status != "configured":
        return False
    with session_factory() as db:
        claim = claim_next(db)
    if claim is None:
        return False

    failure = None
    provider_message_id = None
    try:
        provider_message_id = send_notification(claim.inquiry, claim.delivery_id, configuration)
    except DeliveryFailure as error:
        failure = error
    with session_factory() as db:
        finish_claim(
            db,
            claim,
            failure=failure,
            provider_message_id=provider_message_id,
        )
    return True
