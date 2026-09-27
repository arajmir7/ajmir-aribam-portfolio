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
    maker = sessionmaker(bind=engine)

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


def test_health_and_readiness():
    client, _ = client_with_db()
    assert client.get("/health/live").status_code == 200
    health = client.get("/health/ready").json()
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


def test_smtp_failure_keeps_inquiry_and_schedules_bounded_retry(monkeypatch):
    from app.core.config import get_settings
    from app.services.email_outbox import process_one
    from app.services.notifications import DeliveryFailure

    client, maker = client_with_db()
    key = str(uuid4())
    response = client.post("/inquiries", json=payload(), headers=headers("203.0.113.8", key))
    assert response.status_code == 200

    monkeypatch.setenv("EMAIL_HOST", "mailpit.invalid")
    monkeypatch.setenv("EMAIL_PORT", "1025")
    monkeypatch.setenv("EMAIL_USER", "")
    monkeypatch.setenv("EMAIL_PASSWORD", "")
    monkeypatch.setenv("EMAIL_FROM", "Portfolio <no-reply@example.com>")
    monkeypatch.setenv("EMAIL_TO", "owner@example.com")
    monkeypatch.setenv("EMAIL_USE_TLS", "true")

    def failed_notification(_inquiry, _settings):
        raise DeliveryFailure("smtp_connection_failed", retryable=True)

    monkeypatch.setattr("app.services.email_outbox.send_notification", failed_notification)
    assert process_one(maker, get_settings())
    with maker() as db:
        rows = db.scalars(select(Inquiry).where(Inquiry.idempotency_key == key)).all()
        assert len(rows) == 1
        delivery = db.scalar(select(EmailDelivery).where(EmailDelivery.inquiry_id == rows[0].id))
        assert delivery is not None
        assert delivery.status == "pending"
        assert delivery.attempt_count == 1
        assert delivery.last_error == "smtp_connection_failed"
        assert rows[0].notification_status == "pending"
        retry_at = delivery.next_attempt_at
        if retry_at.tzinfo is None:
            retry_at = retry_at.replace(tzinfo=UTC)
        assert retry_at > datetime.now(UTC)
    app.dependency_overrides.clear()


def test_email_message_uses_configured_sender_and_visitor_reply_to(monkeypatch):
    from app.core.config import get_settings
    from app.db.models import Inquiry
    from app.services.notifications import build_message

    monkeypatch.setenv("EMAIL_HOST", "smtp.example.test")
    monkeypatch.setenv("EMAIL_FROM", "Portfolio <no-reply@example.com>")
    monkeypatch.setenv("EMAIL_TO", "owner@example.com")
    monkeypatch.setenv("EMAIL_USER", "")
    monkeypatch.setenv("EMAIL_PASSWORD", "")
    monkeypatch.setenv("EMAIL_USE_TLS", "true")
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
    message = build_message(inquiry, get_settings())
    assert message["Subject"] == "Portfolio enquiry — project — Ada Lovelace"
    assert message["From"] == "Portfolio <no-reply@example.com>"
    assert message["To"] == "owner@example.com"
    assert message["Reply-To"] == "ada@example.com"
    assert message.get_content_type() == "text/plain"
    content = message.get_content()
    assert "Ada Lovelace" in content
    assert f"Inquiry ID: {inquiry.id}" in content
    assert "Submitted at (UTC): " in content
    assert "Source: Portfolio contact form" in content
    assert "Origin: https://ajmiraribam.me" in content
    assert "Please get in touch about the project." in content


def test_subject_name_cannot_inject_mail_headers(monkeypatch):
    from app.core.config import get_settings
    from app.db.models import Inquiry
    from app.services.notifications import build_message

    monkeypatch.setenv("EMAIL_HOST", "smtp.example.test")
    monkeypatch.setenv("EMAIL_FROM", "Portfolio <no-reply@example.com>")
    monkeypatch.setenv("EMAIL_TO", "owner@example.com")
    monkeypatch.setenv("EMAIL_USER", "")
    monkeypatch.setenv("EMAIL_PASSWORD", "")
    monkeypatch.setenv("EMAIL_USE_TLS", "true")
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
    message = build_message(inquiry, get_settings())
    assert "Bcc" not in message
    assert "attacker@example.com" not in message
    assert "\r" not in message["Subject"]
    assert "\n" not in message["Subject"]


def test_permanent_smtp_failure_is_failed_and_operator_recoverable(monkeypatch):
    from app.core.config import get_settings
    from app.services.email_outbox import process_one
    from app.services.notifications import DeliveryFailure

    client, maker = client_with_db()
    key = str(uuid4())
    assert (
        client.post("/inquiries", json=payload(), headers=headers(idempotency_key=key)).status_code
        == 200
    )
    monkeypatch.setenv("EMAIL_HOST", "smtp.example.com")
    monkeypatch.setenv("EMAIL_PORT", "587")
    monkeypatch.setenv("EMAIL_USER", "")
    monkeypatch.setenv("EMAIL_PASSWORD", "")
    monkeypatch.setenv("EMAIL_FROM", "Portfolio <no-reply@example.com>")
    monkeypatch.setenv("EMAIL_TO", "owner@example.com")
    monkeypatch.setenv("EMAIL_USE_TLS", "true")
    monkeypatch.setattr(
        "app.services.email_outbox.send_notification",
        lambda _inquiry, _settings: (_ for _ in ()).throw(
            DeliveryFailure("smtp_authentication_failed", retryable=False)
        ),
    )

    assert process_one(maker, get_settings())
    with maker() as db:
        inquiry = db.scalar(select(Inquiry).where(Inquiry.idempotency_key == key))
        assert inquiry is not None
        delivery = db.scalar(select(EmailDelivery).where(EmailDelivery.inquiry_id == inquiry.id))
        assert delivery is not None
        assert delivery.status == "failed"
        assert delivery.attempt_count == 1
        assert delivery.next_attempt_at is None
        assert delivery.sent_at is None
        assert delivery.last_error == "smtp_authentication_failed"
        assert inquiry.notification_status == "failed"
    app.dependency_overrides.clear()


def test_transient_smtp_failures_stop_after_five_attempts(monkeypatch):
    from app.core.config import get_settings
    from app.services.email_outbox import MAX_ATTEMPTS, process_one
    from app.services.notifications import DeliveryFailure

    client, maker = client_with_db()
    key = str(uuid4())
    assert (
        client.post("/inquiries", json=payload(), headers=headers(idempotency_key=key)).status_code
        == 200
    )
    monkeypatch.setenv("EMAIL_HOST", "smtp.example.com")
    monkeypatch.setenv("EMAIL_PORT", "587")
    monkeypatch.setenv("EMAIL_USER", "")
    monkeypatch.setenv("EMAIL_PASSWORD", "")
    monkeypatch.setenv("EMAIL_FROM", "Portfolio <no-reply@example.com>")
    monkeypatch.setenv("EMAIL_TO", "owner@example.com")
    monkeypatch.setenv("EMAIL_USE_TLS", "true")
    monkeypatch.setattr(
        "app.services.email_outbox.send_notification",
        lambda _inquiry, _settings: (_ for _ in ()).throw(
            DeliveryFailure("smtp_connection_failed", retryable=True)
        ),
    )

    for _ in range(MAX_ATTEMPTS):
        with maker() as db:
            delivery = db.scalar(select(EmailDelivery))
            delivery.next_attempt_at = datetime(2000, 1, 1, tzinfo=UTC)
            db.commit()
        assert process_one(maker, get_settings())

    with maker() as db:
        delivery = db.scalar(select(EmailDelivery))
        assert delivery.status == "failed"
        assert delivery.attempt_count == MAX_ATTEMPTS
        assert delivery.next_attempt_at is None
        assert delivery.last_error == "smtp_connection_failed"
    app.dependency_overrides.clear()
