"""Runs against a migrated PostgreSQL database when TEST_DATABASE_URL is supplied."""

import os
from concurrent.futures import ThreadPoolExecutor
from uuid import uuid4

import pytest

if not os.environ.get("TEST_DATABASE_URL"):
    pytest.skip("PostgreSQL integration URL not configured", allow_module_level=True)

os.environ["DATABASE_URL"] = os.environ["TEST_DATABASE_URL"]
os.environ["CONTACT_INTERNAL_TOKEN"] = "integration-token-at-least-32-chars-long"

from fastapi.testclient import TestClient  # noqa: E402
from sqlalchemy import select  # noqa: E402

from app.db.database import SessionLocal  # noqa: E402
from app.db.models import Inquiry, RateWindow  # noqa: E402
from app.main import app  # noqa: E402
from app.schemas.inquiries import InquiryInput  # noqa: E402
from app.services.inquiries import store_inquiry  # noqa: E402


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


def test_postgres_rate_limit_is_atomic_under_concurrency():
    client_ip = str(uuid4())
    payload = InquiryInput(
        name="Concurrent Check",
        email="integration@example.com",
        topic="question",
        message="This submission checks the atomic PostgreSQL rate window.",
        website="",
    )

    def submit(index: int) -> int:
        with SessionLocal() as db:
            try:
                store_inquiry(db, payload, f"concurrent-{index}-{client_ip}", client_ip)
                return 200
            except Exception as error:
                return getattr(error, "status_code", 500)

    with ThreadPoolExecutor(max_workers=10) as executor:
        statuses = list(executor.map(submit, range(10)))
    assert statuses.count(200) == 5
    assert statuses.count(429) == 5
    with SessionLocal() as db:
        for inquiry in db.scalars(
            select(Inquiry).where(Inquiry.request_id.like(f"concurrent-%-{client_ip}"))
        ):
            db.delete(inquiry)
        for window in db.scalars(select(RateWindow)):
            db.delete(window)
        db.commit()
