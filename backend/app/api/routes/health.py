"""Liveness and datastore readiness preserve their existing URLs."""

from typing import Annotated

from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.api.dependencies import session
from app.core.config import get_settings

router = APIRouter()


@router.get("/health/live")
def live():
    return {"status": "ok", "revision": get_settings().build_revision}


@router.get("/health/ready")
def ready(db: Annotated[Session, Depends(session)]):
    settings = get_settings()
    if len(settings.contact_internal_token) < 32:
        return JSONResponse(status_code=503, content={"status": "unavailable"})
    try:
        db.execute(text("SELECT 1"))
        db.execute(text("SELECT 1 FROM inquiries LIMIT 1"))
        return {"status": "ready", "revision": settings.build_revision}
    except Exception:
        return JSONResponse(status_code=503, content={"status": "unavailable"})
