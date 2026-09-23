"""Private API access and database session boundaries."""

import hmac
from collections.abc import Iterator

from fastapi import Header, HTTPException
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.db.database import SessionLocal


def session() -> Iterator[Session]:
    with SessionLocal() as db:
        yield db


def require_internal_token(token: str | None = Header(default=None, alias="X-Internal-Token")):
    expected = get_settings().contact_internal_token
    if len(expected) < 32 or not token or not hmac.compare_digest(token, expected):
        raise HTTPException(status_code=403, detail="Forbidden")
