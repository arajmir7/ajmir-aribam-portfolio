"""Runs against a migrated PostgreSQL database when TEST_DATABASE_URL is supplied."""

import os
from concurrent.futures import ThreadPoolExecutor
from uuid import uuid4

import pytest
from sqlalchemy import text
from sqlalchemy.exc import DBAPIError

if not os.environ.get("TEST_DATABASE_URL"):
    pytest.skip("PostgreSQL integration URL not configured", allow_module_level=True)

os.environ["DATABASE_URL"] = os.environ["TEST_DATABASE_URL"]
os.environ["CONTACT_INTERNAL_TOKEN"] = "integration-token-at-least-32-chars-long"

from fastapi.testclient import TestClient  # noqa: E402
from sqlalchemy import select  # noqa: E402

from app.db.database import SessionLocal  # noqa: E402
from app.db.models import EmailDelivery, Inquiry, RateWindow  # noqa: E402
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
            "X-Source-Origin": "https://portfolio.example.test",
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
        assert inquiry.source_origin == "https://portfolio.example.test"
        delivery = db.scalar(select(EmailDelivery).where(EmailDelivery.inquiry_id == inquiry.id))
        assert delivery is not None
        assert delivery.status == "pending"
        assert delivery.attempt_count == 0
        db.delete(inquiry)
        db.commit()


def test_postgres_replayed_idempotency_key_creates_one_delivery():
    client = TestClient(app)
    key = str(uuid4())
    payload = {
        "name": "Idempotency Check",
        "email": "integration@example.com",
        "topic": "question",
        "message": "A replay must keep a single inquiry and email delivery.",
        "website": "",
    }
    for request_id in (f"{key}-first", f"{key}-replay"):
        response = client.post(
            "/inquiries",
            headers={
                "X-Internal-Token": os.environ["CONTACT_INTERNAL_TOKEN"],
                "X-Client-IP": f"{key}-ip",
                "X-Request-ID": request_id,
                "Idempotency-Key": key,
            },
            json=payload,
        )
        assert response.status_code == 200
    with SessionLocal() as db:
        inquiries = db.scalars(select(Inquiry).where(Inquiry.idempotency_key == key)).all()
        assert len(inquiries) == 1
        deliveries = db.scalars(
            select(EmailDelivery).where(EmailDelivery.inquiry_id == inquiries[0].id)
        ).all()
        assert len(deliveries) == 1
        db.delete(inquiries[0])
        db.commit()


def test_postgres_resend_failure_persists_recoverable_delivery(monkeypatch):
    from app.services.notifications import DeliveryFailure

    client = TestClient(app)
    key = str(uuid4())
    monkeypatch.setenv("RESEND_API_KEY", "re_test_" + "a" * 32)
    monkeypatch.setenv("CONTACT_EMAIL_FROM", "Ajmir Aribam <contact@example.com>")
    monkeypatch.setenv("CONTACT_EMAIL_TO", "owner@example.com")
    monkeypatch.setattr(
        "app.services.email_outbox.send_notification",
        lambda _inquiry, _delivery_id, _settings: (_ for _ in ()).throw(
            DeliveryFailure("resend_server_error", retryable=True)
        ),
    )
    response = client.post(
        "/inquiries",
        headers={
            "X-Internal-Token": os.environ["CONTACT_INTERNAL_TOKEN"],
            "X-Client-IP": f"{key}-ip",
            "X-Request-ID": key,
            "Idempotency-Key": key,
        },
        json={
            "name": "Resend Failure Integration",
            "email": "visitor@example.com",
            "topic": "question",
            "message": "A Resend failure must leave this inquiry recoverable.",
            "website": "",
        },
    )
    assert response.status_code == 200
    with SessionLocal() as db:
        inquiry = db.scalar(select(Inquiry).where(Inquiry.idempotency_key == key))
        assert inquiry is not None
        delivery = db.scalar(select(EmailDelivery).where(EmailDelivery.inquiry_id == inquiry.id))
        assert delivery is not None
        assert delivery.status == "pending"
        assert delivery.attempt_count == 1
        assert delivery.last_error == "resend_server_error"
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


def test_runtime_database_role_cannot_change_schema():
    with SessionLocal() as db:
        with pytest.raises(DBAPIError):
            db.execute(
                text("CREATE TABLE runtime_role_must_not_create_schema (id integer PRIMARY KEY)")
            )
        db.rollback()


def test_database_rejects_invalid_delivery_state():
    inquiry_id = str(uuid4())
    with SessionLocal() as db:
        db.execute(
            text(
                """
                INSERT INTO inquiries
                    (id, name, email, topic, message, request_id,
                     notification_status, idempotency_key, created_at)
                VALUES
                    (:id, 'Constraint Check', 'constraint@example.com', 'question',
                     'A valid inquiry used to test delivery constraints.', :id,
                     'pending', :id, now())
                """
            ),
            {"id": inquiry_id},
        )
        with pytest.raises(DBAPIError):
            db.execute(
                text(
                    """
                    INSERT INTO email_deliveries
                        (id, inquiry_id, status, attempt_count, created_at)
                    VALUES (:id, :inquiry_id, 'unknown', 0, now())
                    """
                ),
                {"id": str(uuid4()), "inquiry_id": inquiry_id},
            )
        db.rollback()


def test_database_rejects_invalid_inquiry_notification_state():
    inquiry_id = str(uuid4())
    with SessionLocal() as db:
        with pytest.raises(DBAPIError):
            db.execute(
                text(
                    """
                    INSERT INTO inquiries
                        (id, name, email, topic, message, request_id,
                         notification_status, idempotency_key, created_at)
                    VALUES
                        (:id, 'Constraint Check', 'constraint@example.com', 'question',
                         'An invalid notification state must be rejected.', :id,
                         'unknown', :id, now())
                    """
                ),
                {"id": inquiry_id},
            )
        db.rollback()


def test_database_rejects_invalid_delivery_attempt_count():
    inquiry_id = str(uuid4())
    with SessionLocal() as db:
        db.execute(
            text(
                """
                INSERT INTO inquiries
                    (id, name, email, topic, message, request_id,
                     notification_status, idempotency_key, created_at)
                VALUES
                    (:id, 'Attempt Check', 'constraint@example.com', 'question',
                     'A valid inquiry used to test attempt constraints.', :id,
                     'pending', :id, now())
                """
            ),
            {"id": inquiry_id},
        )
        with pytest.raises(DBAPIError):
            db.execute(
                text(
                    """
                    INSERT INTO email_deliveries
                        (id, inquiry_id, status, attempt_count, created_at)
                    VALUES (:id, :inquiry_id, 'pending', 6, now())
                    """
                ),
                {"id": str(uuid4()), "inquiry_id": inquiry_id},
            )
        db.rollback()
