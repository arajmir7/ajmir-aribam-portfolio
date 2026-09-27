import logging
import os
from datetime import UTC, datetime
from uuid import uuid4

os.environ["CONTACT_INTERNAL_TOKEN"] = "test-internal-token-32-chars-minimum-safe"
os.environ["APP_ENV"] = "test"
os.environ["DATABASE_URL"] = "sqlite://"

from fastapi.testclient import TestClient  # noqa: E402
from sqlalchemy import create_engine, select  # noqa: E402
from sqlalchemy.orm import sessionmaker  # noqa: E402
from sqlalchemy.pool import StaticPool  # noqa: E402

from app.api.dependencies import session  # noqa: E402
from app.db.database import Base  # noqa: E402
from app.db.models import EmailDelivery, Inquiry  # noqa: E402
from app.main import app  # noqa: E402


def client_with_db():
    engine = create_engine(
        "sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool
    )
    Base.metadata.create_all(engine)
    maker = sessionmaker(bind=engine, expire_on_commit=False)

    def override():
        with maker() as db:
            yield db

    app.dependency_overrides[session] = override
    return TestClient(app, raise_server_exceptions=False), maker


def payload(**changes):
    return {
        "name": "Ada Lovelace",
        "email": "ada@example.com",
        "topic": "project",
        "message": "A meaningful project inquiry.",
        "website": "",
        **changes,
    }


def headers(ip="203.0.113.1", idempotency_key=None):
    result = {
        "X-Internal-Token": os.environ["CONTACT_INTERNAL_TOKEN"],
        "X-Client-IP": ip,
        "X-Request-ID": "test-request",
        "X-Source-Origin": "https://ajmiraribam.me",
    }
    if idempotency_key:
        result["Idempotency-Key"] = idempotency_key
    return result


def configure_resend(monkeypatch):
    monkeypatch.setenv("RESEND_API_KEY", "re_test_" + "a" * 32)
    monkeypatch.setenv("CONTACT_EMAIL_FROM", "Ajmir Aribam <contact@example.com>")
    monkeypatch.setenv("CONTACT_EMAIL_TO", "owner@example.com")
    monkeypatch.setenv("CONTACT_ALLOWED_ORIGIN", "https://ajmiraribam.me")


def test_private_boundary_and_persistence():
    client, maker = client_with_db()
    key = str(uuid4())
    assert client.post("/inquiries", json=payload()).status_code == 403
    response = client.post("/inquiries", json=payload(), headers=headers(idempotency_key=key))
    assert response.status_code == 200
    duplicate = client.post("/inquiries", json=payload(), headers=headers(idempotency_key=key))
    assert duplicate.status_code == 200
    conflict = client.post(
        "/inquiries",
        json=payload(message="A different submission with the same key."),
        headers=headers(idempotency_key=key),
    )
    assert conflict.status_code == 409
    with maker() as db:
        rows = db.scalars(select(Inquiry)).all()
        assert len(rows) == 1
        assert rows[0].message == "A meaningful project inquiry."
        assert rows[0].source_origin == "https://ajmiraribam.me"
        deliveries = db.scalars(select(EmailDelivery)).all()
        assert len(deliveries) == 1
        assert deliveries[0].status == "pending"
        assert deliveries[0].attempt_count == 0
    app.dependency_overrides.clear()


def test_validation_spam_and_throttle():
    client, maker = client_with_db()
    assert (
        client.post("/inquiries", json=payload(message="short"), headers=headers()).status_code
        == 422
    )
    assert (
        client.post(
            "/inquiries", json=payload(website="bot.example"), headers=headers()
        ).status_code
        == 200
    )
    for _ in range(5):
        assert (
            client.post(
                "/inquiries",
                json=payload(),
                headers=headers(idempotency_key=str(uuid4())),
            ).status_code
            == 200
        )
    assert client.post("/inquiries", json=payload(), headers=headers()).status_code == 429
    with maker() as db:
        assert len(db.scalars(select(Inquiry)).all()) == 5
    app.dependency_overrides.clear()


def test_health_readiness_is_private_and_hides_outbox_counts():
    client, _ = client_with_db()
    assert client.get("/health/live").status_code == 200
    assert client.get("/health/ready").status_code == 403
    health = client.get("/health/ready", headers=headers()).json()
    assert health["status"] == "ready"
    assert health["database"] == "ready"
    assert health["outbox"] == {"pending": 0, "attempting": 0, "sent": 0, "failed": 0}
    app.dependency_overrides.clear()


def test_source_origin_accepts_only_an_origin():
    from app.api.routes.contact import _validated_source_origin

    assert _validated_source_origin("https://ajmiraribam.me") == "https://ajmiraribam.me"
    assert _validated_source_origin("https://ajmiraribam.me/contact") is None
    assert _validated_source_origin("https://ajmiraribam.me\r\nBcc: attacker") is None


def test_database_failure_returns_safe_error_without_logging_contact_or_credentials(
    monkeypatch, caplog
):
    from sqlalchemy.orm import Session as OrmSession

    client, maker = client_with_db()

    def fail_commit(_session):
        raise RuntimeError("database credential do-not-log; contact-secret-message")

    monkeypatch.setattr(OrmSession, "commit", fail_commit)
    with caplog.at_level(logging.INFO, logger="portfolio.inquiry"):
        response = client.post(
            "/inquiries",
            json=payload(message="contact-secret-message"),
            headers=headers(idempotency_key=str(uuid4())),
        )
    assert response.status_code == 503
    assert response.json() == {"detail": "Inquiry could not be stored"}
    assert "do-not-log" not in response.text + caplog.text
    assert "contact-secret-message" not in response.text + caplog.text
    with maker() as db:
        assert db.scalars(select(Inquiry)).all() == []
        assert db.scalars(select(EmailDelivery)).all() == []
    app.dependency_overrides.clear()


def test_provider_failure_keeps_persisted_inquiry_and_replay_returns_recorded(monkeypatch):
    from app.services.notifications import DeliveryFailure

    client, maker = client_with_db()
    monkeypatch.setattr(
        "app.api.routes.contact.process_inquiry",
        lambda _inquiry_id: (_ for _ in ()).throw(
            DeliveryFailure("resend_connection_failed", retryable=True)
        ),
    )
    key = str(uuid4())
    first = client.post("/inquiries", json=payload(), headers=headers(idempotency_key=key))
    replay = client.post("/inquiries", json=payload(), headers=headers(idempotency_key=key))
    assert first.status_code == replay.status_code == 200
    with maker() as db:
        assert len(db.scalars(select(Inquiry)).all()) == 1
        delivery = db.scalar(select(EmailDelivery))
        assert delivery is not None
        assert delivery.status == "pending"
    app.dependency_overrides.clear()


def test_resend_failure_keeps_outbox_pending_and_schedules_bounded_retry(monkeypatch):
    from app.core.config import get_settings
    from app.schemas.inquiries import InquiryInput
    from app.services.email_outbox import process_inquiry
    from app.services.inquiries import store_inquiry
    from app.services.notifications import DeliveryFailure

    _client, maker = client_with_db()
    configure_resend(monkeypatch)
    monkeypatch.setattr(
        "app.services.email_outbox.send_notification",
        lambda _inquiry, _delivery_id, _settings: (_ for _ in ()).throw(
            DeliveryFailure("resend_server_error", retryable=True)
        ),
    )
    with maker() as db:
        inquiry = store_inquiry(
            db,
            InquiryInput(**payload()),
            "retry-request",
            "203.0.113.9",
            str(uuid4()),
            source_origin="https://ajmiraribam.me",
        )
        inquiry_id = inquiry.id
    assert process_inquiry(inquiry_id, maker, get_settings())
    with maker() as db:
        inquiry = db.get(Inquiry, inquiry_id)
        delivery = db.scalar(select(EmailDelivery).where(EmailDelivery.inquiry_id == inquiry_id))
        assert delivery is not None
        assert delivery.status == "pending"
        assert delivery.attempt_count == 1
        assert delivery.last_error == "resend_server_error"
        assert inquiry is not None and inquiry.notification_status == "pending"
        retry_at = delivery.next_attempt_at
        if retry_at.tzinfo is None:
            retry_at = retry_at.replace(tzinfo=UTC)
        assert retry_at > datetime.now(UTC)
    app.dependency_overrides.clear()


def test_resend_payload_uses_configured_from_and_visitor_reply_to(monkeypatch):
    from app.core.config import get_settings
    from app.db.models import Inquiry
    from app.services.notifications import build_payload

    configure_resend(monkeypatch)
    inquiry = Inquiry(
        id=str(uuid4()),
        name="Ada Lovelace",
        email="ada@example.com",
        topic="project",
        message="Please get in touch about the project.",
        request_id="request-id",
        idempotency_key=str(uuid4()),
        source_origin="https://ajmiraribam.me",
        created_at=datetime.now(UTC),
    )
    message = build_payload(inquiry, get_settings())
    assert message["subject"] == "Portfolio inquiry — project — Ada Lovelace"
    assert message["from"] == "Ajmir Aribam <contact@example.com>"
    assert message["to"] == ["owner@example.com"]
    assert message["reply_to"] == "ada@example.com"
    content = str(message["text"])
    assert "Name: Ada Lovelace" in content
    assert f"Inquiry ID: {inquiry.id}" in content
    assert "Submitted at (UTC): " in content
    assert "Source: Portfolio contact form" in content
    assert "Origin: https://ajmiraribam.me" in content
    assert "Please get in touch about the project." in content


def test_subject_name_cannot_inject_mail_headers(monkeypatch):
    from app.core.config import get_settings
    from app.db.models import Inquiry
    from app.services.notifications import build_payload

    configure_resend(monkeypatch)
    inquiry = Inquiry(
        id=str(uuid4()),
        name="Ada\r\nBcc: attacker@example.com",
        email="ada@example.com",
        topic="project",
        message="A message with enough context to be valid.",
        request_id="request-id",
        idempotency_key=str(uuid4()),
        created_at=datetime.now(UTC),
    )
    message = build_payload(inquiry, get_settings())
    assert "Bcc" not in str(message["subject"])
    assert "attacker@example.com" not in str(message["subject"])
    assert "\r" not in str(message["subject"])
    assert "\n" not in str(message["subject"])


def test_permanent_resend_failure_is_failed_and_operator_recoverable(monkeypatch):
    from app.core.config import get_settings
    from app.schemas.inquiries import InquiryInput
    from app.services.email_outbox import process_inquiry
    from app.services.inquiries import store_inquiry
    from app.services.notifications import DeliveryFailure

    _client, maker = client_with_db()
    configure_resend(monkeypatch)
    events = []

    def fail_delivery(_inquiry, _delivery_id, _settings):
        raise DeliveryFailure(
            "resend_request_rejected",
            retryable=False,
            diagnostics={
                "provider": "resend",
                "provider_http_status": 401,
                "provider_error_type": "invalid_api_key",
                "provider_error_message": "The API key is invalid.",
                "provider_request_id": "request_123",
            },
        )

    monkeypatch.setattr("app.services.email_outbox.send_notification", fail_delivery)
    monkeypatch.setattr(
        "app.services.email_outbox.log",
        lambda event, request_id, **fields: events.append((event, request_id, fields)),
    )
    with maker() as db:
        inquiry = store_inquiry(db, InquiryInput(**payload()), "permanent", "203.0.113.4")
        inquiry_id = inquiry.id
    assert process_inquiry(inquiry_id, maker, get_settings())
    with maker() as db:
        inquiry = db.get(Inquiry, inquiry_id)
        delivery = db.scalar(select(EmailDelivery).where(EmailDelivery.inquiry_id == inquiry_id))
        assert delivery is not None
        assert delivery.status == "failed"
        assert delivery.attempt_count == 1
        assert delivery.next_attempt_at is None
        assert delivery.sent_at is None
        assert delivery.last_error == "resend_request_rejected"
        assert inquiry is not None and inquiry.notification_status == "failed"
    assert events[-1][0] == "email_delivery_failed"
    assert events[-1][2]["provider_http_status"] == 401
    assert events[-1][2]["provider_error_type"] == "invalid_api_key"
    assert events[-1][2]["provider_request_id"] == "request_123"
    app.dependency_overrides.clear()


def test_transient_resend_failures_stop_after_five_attempts(monkeypatch):
    from app.core.config import get_settings
    from app.schemas.inquiries import InquiryInput
    from app.services.email_outbox import MAX_ATTEMPTS, process_one
    from app.services.inquiries import store_inquiry
    from app.services.notifications import DeliveryFailure

    _client, maker = client_with_db()
    configure_resend(monkeypatch)
    monkeypatch.setattr(
        "app.services.email_outbox.send_notification",
        lambda _inquiry, _delivery_id, _settings: (_ for _ in ()).throw(
            DeliveryFailure("resend_connection_failed", retryable=True)
        ),
    )
    with maker() as db:
        store_inquiry(db, InquiryInput(**payload()), "bounded-retries", "203.0.113.5")

    for _ in range(MAX_ATTEMPTS):
        with maker() as db:
            delivery = db.scalar(select(EmailDelivery))
            assert delivery is not None
            delivery.next_attempt_at = datetime(2000, 1, 1, tzinfo=UTC)
            db.commit()
        assert process_one(maker, get_settings())

    with maker() as db:
        delivery = db.scalar(select(EmailDelivery))
        assert delivery is not None
        assert delivery.status == "failed"
        assert delivery.attempt_count == MAX_ATTEMPTS
        assert delivery.next_attempt_at is None
        assert delivery.last_error == "resend_connection_failed"
    app.dependency_overrides.clear()


def test_successful_provider_response_persists_message_id(monkeypatch):
    from app.core.config import get_settings
    from app.schemas.inquiries import InquiryInput
    from app.services.email_outbox import process_inquiry
    from app.services.inquiries import store_inquiry

    _client, maker = client_with_db()
    configure_resend(monkeypatch)
    monkeypatch.setattr(
        "app.services.email_outbox.send_notification",
        lambda _inquiry, _delivery_id, _settings: "resend-message-123",
    )
    with maker() as db:
        inquiry = store_inquiry(db, InquiryInput(**payload()), "sent-request", "203.0.113.6")
        inquiry_id = inquiry.id
    assert process_inquiry(inquiry_id, maker, get_settings())
    with maker() as db:
        inquiry = db.get(Inquiry, inquiry_id)
        delivery = db.scalar(select(EmailDelivery).where(EmailDelivery.inquiry_id == inquiry_id))
        assert delivery is not None
        assert delivery.status == "sent"
        assert delivery.provider_message_id == "resend-message-123"
        assert delivery.sent_at is not None
        assert inquiry is not None and inquiry.notification_status == "sent"
    app.dependency_overrides.clear()


def test_operator_retry_keeps_the_existing_attempt_count(monkeypatch):
    import sys

    from app import maintenance
    from app.core.config import get_settings
    from app.schemas.inquiries import InquiryInput
    from app.services.email_outbox import process_inquiry
    from app.services.inquiries import store_inquiry

    _client, maker = client_with_db()
    configure_resend(monkeypatch)
    monkeypatch.setattr(
        "app.services.email_outbox.send_notification",
        lambda _inquiry, _delivery_id, _settings: "resend-retry-message",
    )
    with maker() as db:
        inquiry = store_inquiry(db, InquiryInput(**payload()), "retry-existing", "203.0.113.7")
        inquiry_id = inquiry.id
        delivery = db.scalar(select(EmailDelivery).where(EmailDelivery.inquiry_id == inquiry_id))
        assert delivery is not None
        delivery.status = "failed"
        delivery.attempt_count = 1
        delivery.last_error = "resend_request_rejected"
        inquiry.notification_status = "failed"
        db.commit()
        delivery_id = delivery.id

    monkeypatch.setattr(maintenance, "SessionLocal", maker)
    monkeypatch.setattr(
        maintenance,
        "process_inquiry",
        lambda identifier: process_inquiry(identifier, maker, get_settings()),
    )
    monkeypatch.setattr(
        sys,
        "argv",
        ["maintenance", "retry-delivery", "--delivery-id", delivery_id],
    )
    maintenance.main()

    with maker() as db:
        delivery = db.get(EmailDelivery, delivery_id)
        assert delivery is not None
        assert delivery.status == "sent"
        assert delivery.attempt_count == 2
        assert delivery.provider_message_id == "resend-retry-message"
    app.dependency_overrides.clear()
