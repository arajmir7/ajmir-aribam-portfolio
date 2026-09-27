"""Inquiry persistence and the database-backed abuse window."""

import hashlib
import hmac
from datetime import UTC, datetime, timedelta
from uuid import uuid4

from fastapi import HTTPException
from sqlalchemy import case, or_, select
from sqlalchemy.dialects.postgresql import insert as postgresql_insert
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.logging import log
from app.db.models import EmailDelivery, Inquiry, RateWindow
from app.schemas.inquiries import InquiryInput


def rate_key(client_ip: str) -> str:
    secret = get_settings().contact_internal_token
    return hmac.new(secret.encode(), client_ip.encode(), hashlib.sha256).hexdigest()


def enforce_rate_limit(db: Session, key: str, now: datetime) -> None:
    if db.get_bind().dialect.name == "postgresql":
        cutoff = now - timedelta(minutes=15)
        statement = (
            postgresql_insert(RateWindow)
            .values(key=key, starts_at=now, count=1)
            .on_conflict_do_update(
                index_elements=[RateWindow.key],
                set_={
                    "starts_at": case(
                        (RateWindow.starts_at <= cutoff, now),
                        else_=RateWindow.starts_at,
                    ),
                    "count": case(
                        (RateWindow.starts_at <= cutoff, 1),
                        else_=RateWindow.count + 1,
                    ),
                },
                where=or_(RateWindow.starts_at <= cutoff, RateWindow.count < 5),
            )
            .returning(RateWindow.count)
        )
        if db.execute(statement).scalar_one_or_none() is None:
            raise HTTPException(status_code=429, detail="Too many inquiries. Please try later.")
        return
    window = db.execute(
        select(RateWindow).where(RateWindow.key == key).with_for_update()
    ).scalar_one_or_none()
    if window is None:
        db.add(RateWindow(key=key, starts_at=now, count=1))
        return
    start = (
        window.starts_at.replace(tzinfo=UTC)
        if window.starts_at.tzinfo is None
        else window.starts_at
    )
    if now - start >= timedelta(minutes=15):
        window.starts_at, window.count = now, 1
    elif window.count >= 5:
        raise HTTPException(status_code=429, detail="Too many inquiries. Please try later.")
    else:
        window.count += 1


def store_inquiry(
    db: Session,
    payload: InquiryInput,
    request_id: str,
    client_ip: str,
    idempotency_key: str | None = None,
    source_origin: str | None = None,
) -> Inquiry:
    idempotency_key = idempotency_key or str(uuid4())
    existing = db.scalar(select(Inquiry).where(Inquiry.idempotency_key == idempotency_key))
    if existing is not None:
        _ensure_same_submission(existing, payload)
        log("inquiry_replayed", request_id, inquiry_id=existing.id)
        return existing

    try:
        enforce_rate_limit(db, rate_key(client_ip), datetime.now(UTC))
        inquiry = Inquiry(
            name=payload.name,
            email=str(payload.email),
            topic=payload.topic,
            message=payload.message,
            request_id=request_id,
            idempotency_key=idempotency_key,
            source_origin=source_origin,
        )
        db.add(inquiry)
        db.flush()
        db.add(EmailDelivery(inquiry_id=inquiry.id, status="pending", attempt_count=0))
        db.commit()
        db.refresh(inquiry)
    except HTTPException:
        db.rollback()
        raise
    except IntegrityError:
        db.rollback()
        existing = db.scalar(select(Inquiry).where(Inquiry.idempotency_key == idempotency_key))
        if existing is not None:
            _ensure_same_submission(existing, payload)
            log("inquiry_replayed", request_id, inquiry_id=existing.id)
            return existing
        log("persistence_failed", request_id)
        raise HTTPException(status_code=503, detail="Inquiry could not be stored") from None
    except Exception:
        db.rollback()
        log("persistence_failed", request_id)
        raise HTTPException(status_code=503, detail="Inquiry could not be stored") from None
    log("inquiry_stored", request_id, topic=inquiry.topic, inquiry_id=inquiry.id)
    return inquiry


def _ensure_same_submission(existing: Inquiry, payload: InquiryInput) -> None:
    if (
        existing.name != payload.name
        or existing.email != str(payload.email)
        or existing.topic != payload.topic
        or existing.message != payload.message
    ):
        raise HTTPException(
            status_code=409,
            detail="The idempotency key was already used for different inquiry details.",
        )
