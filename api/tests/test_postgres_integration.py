"""Runs against a migrated PostgreSQL database when TEST_DATABASE_URL is supplied."""

import os
from uuid import uuid4

import pytest

if not os.environ.get("TEST_DATABASE_URL"):
    pytest.skip("PostgreSQL integration URL not configured", allow_module_level=True)

os.environ["DATABASE_URL"] = os.environ["TEST_DATABASE_URL"]
os.environ["CONTACT_INTERNAL_TOKEN"] = "integration-token-at-least-32-chars-long"

from fastapi.testclient import TestClient  # noqa: E402
from sqlalchemy import select  # noqa: E402

from app.database import SessionLocal  # noqa: E402
from app.main import app  # noqa: E402
from app.models import Inquiry  # noqa: E402


def test_migrated_postgres_persists_inquiry():
    client = TestClient(app)
    unique = str(uuid4())
    response = client.post(
        "/inquiries",
        headers={
            "X-Internal-Token": os.environ["CONTACT_INTERNAL_TOKEN"],
            "X-Client-IP": unique,
            "X-Request-ID": unique,
        },
        json={
            "name": "Database Integration",
            "email": "integration@example.com",
            "topic": "question",
            "message": "This submission verifies PostgreSQL persistence.",
            "website": "",
        },
    )
    assert response.status_code == 200
    with SessionLocal() as db:
        inquiry = db.scalar(select(Inquiry).where(Inquiry.request_id == unique))
        assert inquiry is not None
        assert inquiry.topic == "question"
        db.delete(inquiry)
        db.commit()
