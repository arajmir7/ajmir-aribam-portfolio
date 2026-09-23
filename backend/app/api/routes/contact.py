"""HTTP adapter for the existing private /inquiries contract."""

from typing import Annotated
from uuid import uuid4

from fastapi import APIRouter, BackgroundTasks, Depends, Request
from sqlalchemy.orm import Session

from app.api.dependencies import require_internal_token, session
from app.core.logging import log
from app.schemas.inquiries import InquiryInput
from app.services.inquiries import store_inquiry
from app.services.notifications import deliver_notification

router = APIRouter()


@router.post("/inquiries", dependencies=[Depends(require_internal_token)])
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
    inquiry = store_inquiry(db, payload, request_id, client_ip)
    background_tasks.add_task(deliver_notification, inquiry.id, request_id)
    return {"message": "Your inquiry was received.", "request_id": request_id}
