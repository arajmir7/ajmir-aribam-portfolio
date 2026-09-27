import json
from datetime import UTC, datetime
from io import BytesIO
from urllib.error import HTTPError, URLError
from uuid import uuid4

import pytest

from app.core.config import get_settings
from app.db.models import Inquiry
from app.services import notifications
from app.services.notifications import DeliveryFailure


@pytest.fixture(autouse=True)
def resend_settings(monkeypatch):
    monkeypatch.setenv("APP_ENV", "test")
    monkeypatch.setenv("RESEND_API_KEY", "re_test_" + "a" * 32)
    monkeypatch.setenv("CONTACT_EMAIL_FROM", "Ajmir Aribam <contact@example.com>")
    monkeypatch.setenv("CONTACT_EMAIL_TO", "owner@example.com")
    monkeypatch.setenv("RESEND_API_URL", "https://api.resend.com")


def inquiry() -> Inquiry:
    return Inquiry(
        id=str(uuid4()),
        name="Ada Lovelace",
        email="ada@example.com",
        topic="project",
        message="A provider test message with enough context.",
        request_id="resend-test",
        created_at=datetime.now(UTC),
        source_origin="https://ajmiraribam.me",
    )


def test_resend_request_uses_stable_key_secure_sender_and_plain_text(monkeypatch):
    captured = {}

    class Response:
        status = 200

        def __enter__(self):
            return self

        def __exit__(self, *_args):
            return None

        def read(self, _size):
            return b'{"id":"resend-message-id"}'

    def fake_urlopen(request, *, timeout):
        captured["url"] = request.full_url
        captured["headers"] = {key.lower(): value for key, value in request.header_items()}
        captured["payload"] = json.loads(request.data)
        captured["timeout"] = timeout
        return Response()

    monkeypatch.setattr(notifications, "urlopen", fake_urlopen)
    assert notifications.send_notification(inquiry(), "delivery-uuid-1", get_settings()) == (
        "resend-message-id"
    )
    assert captured["url"] == "https://api.resend.com/emails"
    assert captured["headers"]["authorization"] == f"Bearer {get_settings().resend_api_key}"
    assert captured["headers"]["idempotency-key"] == "portfolio-inquiry/delivery-uuid-1"
    assert captured["timeout"] == 8
    assert captured["payload"]["from"] == "Ajmir Aribam <contact@example.com>"
    assert captured["payload"]["to"] == ["owner@example.com"]
    assert captured["payload"]["reply_to"] == "ada@example.com"
    assert "<html" not in captured["payload"]["text"].lower()


def test_production_payload_uses_owner_recipient_verified_sender_and_visitor_reply_to(
    monkeypatch,
):
    monkeypatch.setenv("APP_ENV", "production")
    monkeypatch.delenv("VERCEL_ENV", raising=False)
    monkeypatch.setenv(
        "DATABASE_URL",
        "postgresql://portfolio_app:long-enough-password@ep-calm-sunset-pooler.us-east-2.aws.neon.tech/portfolio?sslmode=require",
    )
    monkeypatch.setenv("CONTACT_INTERNAL_TOKEN", "a-production-token-with-32-characters")
    monkeypatch.setenv("CONTACT_ALLOWED_ORIGIN", "https://ajmiraribam.me")
    monkeypatch.setenv("VERCEL_GIT_COMMIT_SHA", "0123456789abcdef0123456789abcdef01234567")
    monkeypatch.setenv("RESEND_API_KEY", "re_" + "a" * 32)
    monkeypatch.setenv("CONTACT_EMAIL_FROM", "Ajmir Aribam <contact@ajmiraribam.me>")
    monkeypatch.setenv("CONTACT_EMAIL_TO", "arajmir7@gmail.com")
    payload = notifications.build_payload(inquiry(), get_settings())
    assert payload["from"] == "Ajmir Aribam <contact@ajmiraribam.me>"
    assert payload["to"] == ["arajmir7@gmail.com"]
    assert payload["reply_to"] == "ada@example.com"


@pytest.mark.parametrize(
    ("status", "code", "retryable", "provider_type"),
    [
        (400, "resend_request_rejected", False, "validation_error"),
        (401, "resend_request_rejected", False, "invalid_api_key"),
        (403, "resend_request_rejected", False, "domain_not_verified"),
        (422, "resend_request_rejected", False, "invalid_from_address"),
        (429, "resend_rate_limited", True, "rate_limit_exceeded"),
        (500, "resend_server_error", True, "internal_server_error"),
        (409, "resend_idempotency_conflict", False, "idempotency_conflict"),
        (503, "resend_server_error", True, "internal_server_error"),
    ],
)
def test_resend_http_failures_are_reduced_to_safe_codes(
    monkeypatch, status: int, code: str, retryable: bool, provider_type: str
):
    current_inquiry = inquiry()
    internal_token = "internal-contact-secret-123"
    database_url = "postgresql://db_user:db_password@db.example.com/private?sslmode=require"
    monkeypatch.setenv("CONTACT_INTERNAL_TOKEN", internal_token)
    monkeypatch.setenv("DATABASE_URL", database_url)
    api_key = get_settings().resend_api_key
    provider_body = json.dumps(
        {
            "name": provider_type,
            "message": (
                f"Rejected {api_key}; visitor {current_inquiry.email}; "
                f"message {current_inquiry.message}; {internal_token}; {database_url}"
            ),
        }
    ).encode()

    def fail(*_args, **_kwargs):
        raise HTTPError(
            "https://api.resend.com/emails",
            status,
            "private-body-secret",
            {"x-resend-id": "request_123"},
            BytesIO(provider_body),
        )

    monkeypatch.setattr(notifications, "urlopen", fail)
    with pytest.raises(DeliveryFailure) as raised:
        notifications.send_notification(current_inquiry, "delivery-uuid-2", get_settings())
    assert raised.value.code == code
    assert raised.value.retryable is retryable
    assert raised.value.diagnostics["provider"] == "resend"
    assert raised.value.diagnostics["provider_http_status"] == status
    assert raised.value.diagnostics["provider_error_type"] == provider_type
    assert raised.value.diagnostics["provider_request_id"] == "request_123"
    safe_message = raised.value.diagnostics["provider_error_message"]
    assert "Rejected [redacted]" in safe_message
    assert "visitor [redacted]" in safe_message
    assert "@" not in safe_message
    assert "message [redacted]" in safe_message
    assert api_key not in safe_message
    assert current_inquiry.email not in safe_message
    assert current_inquiry.message not in safe_message
    assert internal_token not in safe_message
    assert database_url not in safe_message
    assert "private-body-secret" not in str(raised.value)
    assert "api.resend.com" not in str(raised.value)


def test_non_json_provider_rejection_retains_a_redacted_excerpt(monkeypatch):
    secret = "re_test_" + "b" * 32
    monkeypatch.setenv("RESEND_API_KEY", secret)
    body = f"gateway denied token={secret} for ada@example.com".encode()

    def fail(*_args, **_kwargs):
        raise HTTPError(
            "https://api.resend.com/emails",
            403,
            "private-body-secret",
            {"content-type": "text/plain; charset=utf-8", "x-resend-id": "request_456"},
            BytesIO(body),
        )

    monkeypatch.setattr(notifications, "urlopen", fail)
    with pytest.raises(DeliveryFailure) as raised:
        notifications.send_notification(inquiry(), "delivery-uuid-non-json", get_settings())

    diagnostics = raised.value.diagnostics
    assert diagnostics["provider_response_format"] == "non_json"
    assert (
        diagnostics["provider_response_excerpt"] == "gateway denied token=[redacted] for [redacted]"
    )
    assert diagnostics["provider_content_type"] == "text/plain"
    assert diagnostics["provider_request_id"] == "request_456"
    assert secret not in str(diagnostics)


def test_resend_network_error_does_not_expose_provider_details(monkeypatch):
    monkeypatch.setattr(
        notifications,
        "urlopen",
        lambda *_args, **_kwargs: (_ for _ in ()).throw(URLError("private-provider-secret")),
    )
    with pytest.raises(DeliveryFailure) as raised:
        notifications.send_notification(inquiry(), "delivery-uuid-3", get_settings())
    assert raised.value.code == "resend_connection_failed"
    assert "private-provider-secret" not in str(raised.value)


def test_concurrent_resend_idempotency_conflict_is_retryable(monkeypatch):
    def fail(*_args, **_kwargs):
        raise HTTPError(
            "https://api.resend.com/emails",
            409,
            "private-provider-secret",
            {},
            BytesIO(b'{"name":"concurrent_idempotent_requests"}'),
        )

    monkeypatch.setattr(notifications, "urlopen", fail)
    with pytest.raises(DeliveryFailure) as raised:
        notifications.send_notification(inquiry(), "delivery-uuid-concurrent", get_settings())
    assert raised.value.code == "resend_request_in_progress"
    assert raised.value.retryable is True
    assert "private-provider-secret" not in str(raised.value)


def test_resend_invalid_success_body_is_retryable(monkeypatch):
    class Response:
        status = 200

        def __enter__(self):
            return self

        def __exit__(self, *_args):
            return None

        def read(self, _size):
            return b'{"id":"<script>"}'

    monkeypatch.setattr(notifications, "urlopen", lambda *_args, **_kwargs: Response())
    with pytest.raises(DeliveryFailure) as raised:
        notifications.send_notification(inquiry(), "delivery-uuid-4", get_settings())
    assert raised.value.code == "resend_invalid_response"
    assert raised.value.retryable is True
