"""A small, private inquiry API. Deployment must keep this service off the public edge."""

import hashlib
import hmac
import json
import logging
import os
import smtplib
from datetime import UTC, datetime, timedelta
from email.message import EmailMessage
from typing import Annotated
from uuid import uuid4

from fastapi import BackgroundTasks, Depends, FastAPI, Header, HTTPException, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator
from sqlalchemy import select, text
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models import Inquiry, RateWindow

logging.basicConfig(level=logging.INFO, format="%(message)s")
logger = logging.getLogger("portfolio.inquiry")
app = FastAPI(title="Portfolio inquiry service", docs_url=None, redoc_url=None, openapi_url=None)


class InquiryInput(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    topic: str
    message: str = Field(min_length=10, max_length=4000)
    website: str = Field(default="", max_length=200)

    @field_validator("topic")
    @classmethod
    def valid_topic(cls, value: str) -> str:
        if value not in {"project", "role", "question"}:
            raise ValueError("Choose a valid topic")
        return value


def session():
    with SessionLocal() as db:
        yield db


def log(event: str, request_id: str, **fields):
    logger.info(
        json.dumps({"event": event, "request_id": request_id, **fields}, separators=(",", ":"))
    )


def require_internal_token(token: str | None = Header(default=None, alias="X-Internal-Token")):
    expected = os.environ.get("CONTACT_INTERNAL_TOKEN", "")
    if len(expected) < 32 or not token or not hmac.compare_digest(token, expected):
        raise HTTPException(status_code=403, detail="Forbidden")


def rate_key(client_ip: str) -> str:
    secret = os.environ.get("CONTACT_INTERNAL_TOKEN", "")
    return hmac.new(secret.encode(), client_ip.encode(), hashlib.sha256).hexdigest()


def enforce_rate_limit(db: Session, key: str, now: datetime):
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


def notify(inquiry: Inquiry) -> bool:
    host, sender, recipient = (
        os.environ.get(k, "") for k in ("EMAIL_HOST", "EMAIL_FROM", "EMAIL_TO")
    )
    if not all((host, sender, recipient)):
        return False
    mail = EmailMessage()
    mail["Subject"] = f"Portfolio inquiry: {inquiry.topic}"
    mail["From"] = sender
    mail["To"] = recipient
    mail["Reply-To"] = inquiry.email
    mail.set_content(
        f"Name: {inquiry.name}\nEmail: {inquiry.email}\nTopic: {inquiry.topic}\n\n{inquiry.message}"
    )
    with smtplib.SMTP(host, int(os.environ.get("EMAIL_PORT", "587")), timeout=8) as smtp:
        smtp.starttls()
        if os.environ.get("EMAIL_USER"):
            smtp.login(os.environ["EMAIL_USER"], os.environ.get("EMAIL_PASSWORD", ""))
        smtp.send_message(mail)
    return True


def deliver_notification(inquiry_id: str, request_id: str) -> None:
    """Best-effort email after HTTP success; the committed row remains pending on failure."""
    with SessionLocal() as db:
        inquiry = db.get(Inquiry, inquiry_id)
        if inquiry is None:
            return
        try:
            if notify(inquiry):
                inquiry.notification_status = "sent"
                db.commit()
                log("notification_sent", request_id, inquiry_id=inquiry_id)
        except Exception as exc:
            db.rollback()
            log(
                "notification_failed",
                request_id,
                inquiry_id=inquiry_id,
                error_type=type(exc).__name__,
            )


@app.exception_handler(Exception)
async def safe_error(request: Request, exception: Exception):
    request_id = request.headers.get("x-request-id", "unknown")[:80]
    log("unhandled_error", request_id, error_type=type(exception).__name__)
    return JSONResponse(
        status_code=500, content={"message": "The inquiry service could not complete the request."}
    )


@app.get("/health/live")
def live():
    return {"status": "ok", "revision": os.environ.get("BUILD_REVISION", "unknown")}


@app.get("/health/ready")
def ready(db: Annotated[Session, Depends(session)]):
    if len(os.environ.get("CONTACT_INTERNAL_TOKEN", "")) < 32:
        return JSONResponse(status_code=503, content={"status": "unavailable"})
    try:
        db.execute(text("SELECT 1"))
        db.execute(text("SELECT 1 FROM inquiries LIMIT 1"))
        return {"status": "ready", "revision": os.environ.get("BUILD_REVISION", "unknown")}
    except Exception:
        return JSONResponse(status_code=503, content={"status": "unavailable"})


@app.post("/inquiries", dependencies=[Depends(require_internal_token)])
def create_inquiry(
    payload: InquiryInput,
    request: Request,
    background_tasks: BackgroundTasks,
    db: Annotated[Session, Depends(session)],
):
    request_id = request.headers.get("x-request-id", str(uuid4()))[:80]
    if payload.website:
        log("spam_discarded", request_id)
        return {"message": "Your inquiry was received."}
    client_ip = request.headers.get("x-client-ip", "unknown")[:128]
    try:
        enforce_rate_limit(db, rate_key(client_ip), datetime.now(UTC))
        inquiry = Inquiry(
            name=payload.name,
            email=str(payload.email),
            topic=payload.topic,
            message=payload.message,
            request_id=request_id,
        )
        db.add(inquiry)
        db.commit()
        db.refresh(inquiry)
    except HTTPException:
        db.rollback()
        raise
    except Exception:
        db.rollback()
        log("persistence_failed", request_id)
        raise HTTPException(status_code=503, detail="Inquiry could not be stored") from None
    log("inquiry_stored", request_id, topic=inquiry.topic, inquiry_id=inquiry.id)
    background_tasks.add_task(deliver_notification, inquiry.id, request_id)
    return {"message": "Your inquiry was received.", "request_id": request_id}
