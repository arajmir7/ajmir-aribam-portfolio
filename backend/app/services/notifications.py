"""Resend HTTPS transport for durable inquiry email deliveries."""

import json
import re
import unicodedata
from datetime import UTC
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from app.core.config import Settings, get_settings
from app.db.models import Inquiry


class DeliveryFailure(Exception):
    """A Resend failure reduced to a safe operator-facing code."""

    def __init__(self, code: str, *, retryable: bool):
        super().__init__(code)
        self.code = code
        self.retryable = retryable


def build_payload(inquiry: Inquiry, settings: Settings) -> dict[str, object]:
    if settings.email_status != "configured":
        raise DeliveryFailure("resend_not_configured", retryable=False)
    safe_name = " ".join(
        "".join(
            " " if unicodedata.category(char) == "Cc" else char
            for char in inquiry.name.splitlines()[0]
        ).split()
    )
    submitted_at = inquiry.created_at
    if submitted_at.tzinfo is None:
        submitted_at = submitted_at.replace(tzinfo=UTC)
    submitted_utc = (
        submitted_at.astimezone(UTC).isoformat(timespec="seconds").replace("+00:00", "Z")
    )
    text = (
        f"Name: {inquiry.name}\n"
        f"Email: {inquiry.email}\n"
        f"Topic: {inquiry.topic}\n"
        f"Inquiry ID: {inquiry.id}\n"
        f"Submitted at (UTC): {submitted_utc}\n"
        "Source: Portfolio contact form\n"
        f"Origin: {inquiry.source_origin or 'not provided'}\n\n"
        f"{inquiry.message}"
    )
    return {
        "from": settings.contact_email_from,
        "to": [settings.contact_email_to],
        "reply_to": inquiry.email,
        "subject": f"Portfolio inquiry — {inquiry.topic} — {safe_name}",
        "text": text,
    }


def send_notification(
    inquiry: Inquiry,
    delivery_id: str,
    settings: Settings | None = None,
) -> str:
    configuration = settings or get_settings()
    payload = build_payload(inquiry, configuration)
    request = Request(
        f"{configuration.resend_api_url}/emails",
        data=json.dumps(payload, ensure_ascii=False).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {configuration.resend_api_key}",
            "Content-Type": "application/json",
            "Idempotency-Key": f"portfolio-inquiry/{delivery_id}",
        },
        method="POST",
    )
    try:
        with urlopen(request, timeout=8) as response:
            if not 200 <= response.status < 300:
                raise DeliveryFailure("resend_unexpected_response", retryable=True)
            result = json.loads(response.read(64 * 1024))
    except HTTPError as error:
        if error.code == 409:
            try:
                provider_error = json.loads(error.read(16 * 1024))
                provider_code = provider_error.get("name") or provider_error.get("code")
            except Exception:
                provider_code = None
            if provider_code == "concurrent_idempotent_requests":
                code = "resend_request_in_progress"
                retryable = True
            else:
                code = "resend_idempotency_conflict"
                retryable = False
        elif error.code == 429:
            code = "resend_rate_limited"
            retryable = True
        elif error.code >= 500:
            code = "resend_server_error"
            retryable = True
        else:
            code = "resend_request_rejected"
            retryable = False
        raise DeliveryFailure(code, retryable=retryable) from None
    except DeliveryFailure:
        raise
    except (TimeoutError, URLError, OSError):
        raise DeliveryFailure("resend_connection_failed", retryable=True) from None
    except Exception:
        # Transport exception text may contain the request URL or provider details.
        raise DeliveryFailure("resend_delivery_failed", retryable=True) from None

    message_id = result.get("id") if isinstance(result, dict) else None
    if not isinstance(message_id, str) or not re.fullmatch(r"[A-Za-z0-9_-]{1,128}", message_id):
        raise DeliveryFailure("resend_invalid_response", retryable=True)
    return message_id
