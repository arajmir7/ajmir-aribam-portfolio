"""HTTP adapter for the existing private /inquiries contract."""

from typing import Annotated
from urllib.parse import urlsplit
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from app.api.dependencies import require_internal_token, session
from app.core.config import get_settings
from app.core.logging import log
from app.schemas.inquiries import InquiryInput
from app.services.email_outbox import process_inquiry
from app.services.inquiries import store_inquiry

router = APIRouter()


@router.post("/inquiries", dependencies=[Depends(require_internal_token)])
def create_inquiry(
    payload: InquiryInput,
    request: Request,
    db: Annotated[Session, Depends(session)],
):
    request_id = request.headers.get("x-request-id", str(uuid4()))[:80]
    idempotency_key = request.headers.get("idempotency-key", str(uuid4())).strip()
    if not idempotency_key or len(idempotency_key) > 80:
        raise HTTPException(status_code=400, detail="A valid idempotency key is required.")
    if payload.website:
        log("spam_discarded", request_id)
        return {"message": "Your inquiry was received."}
    client_ip = request.headers.get("x-client-ip", "unknown")[:128]
    source_origin = _validated_source_origin(request.headers.get("x-source-origin"))
    settings = get_settings()
    if settings.environment == "production" and source_origin != settings.contact_allowed_origin:
        raise HTTPException(status_code=403, detail="Request origin is not allowed.")
    inquiry = store_inquiry(
        db, payload, request_id, client_ip, idempotency_key, source_origin=source_origin
    )
    try:
        process_inquiry(inquiry.id)
    except Exception as error:
        # The inquiry already committed. Delivery can be retried without losing it.
        log("email_delivery_processing_deferred", request_id, error_type=type(error).__name__)
    return {"message": "Your inquiry was received.", "request_id": inquiry.request_id}


def _validated_source_origin(value: str | None) -> str | None:
    if (
        not value
        or len(value) > 253
        or any(ord(char) < 0x21 or ord(char) == 0x7F for char in value)
    ):
        return None
    try:
        parsed = urlsplit(value)
        if (
            parsed.scheme not in {"http", "https"}
            or not parsed.hostname
            or parsed.username is not None
            or parsed.password is not None
            or parsed.path
            or parsed.query
            or parsed.fragment
        ):
            return None
        _ = parsed.port
    except ValueError:
        return None
    return f"{parsed.scheme}://{parsed.netloc}"
