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


@pytest.mark.parametrize(
    ("status", "code", "retryable"),
    [
        (400, "resend_request_rejected", False),
        (409, "resend_idempotency_conflict", False),
        (429, "resend_rate_limited", True),
        (503, "resend_server_error", True),
    ],
)
def test_resend_http_failures_are_reduced_to_safe_codes(
    monkeypatch, status: int, code: str, retryable: bool
):
    def fail(*_args, **_kwargs):
        raise HTTPError("https://api.resend.com/emails", status, "private-body-secret", {}, None)

    monkeypatch.setattr(notifications, "urlopen", fail)
    with pytest.raises(DeliveryFailure) as raised:
        notifications.send_notification(inquiry(), "delivery-uuid-2", get_settings())
    assert raised.value.code == code
    assert raised.value.retryable is retryable
    assert "private-body-secret" not in str(raised.value)
    assert "api.resend.com" not in str(raised.value)


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
