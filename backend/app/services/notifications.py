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

    def __init__(
        self,
        code: str,
        *,
        retryable: bool,
        diagnostics: dict[str, str | int] | None = None,
    ):
        super().__init__(code)
        self.code = code
        self.retryable = retryable
        self.diagnostics = diagnostics or {}


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
        diagnostics = _resend_error_diagnostics(error, inquiry, payload, configuration)
        provider_code = diagnostics.get("provider_error_type")
        if error.code == 409:
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
        raise DeliveryFailure(code, retryable=retryable, diagnostics=diagnostics) from None
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


def _resend_error_diagnostics(
    error: HTTPError,
    inquiry: Inquiry,
    payload: dict[str, object],
    settings: Settings,
) -> dict[str, str | int]:
    """Keep useful provider detail while excluding request data and credentials."""
    result: dict[str, str | int] = {
        "provider": "resend",
        "provider_http_status": error.code,
    }
    try:
        body = json.loads(error.read(16 * 1024))
    except (OSError, UnicodeDecodeError, json.JSONDecodeError):
        body = None

    if isinstance(body, dict):
        provider_type = body.get("name") or body.get("code") or body.get("type")
        if isinstance(provider_type, str):
            safe_type = re.sub(r"[^A-Za-z0-9_.-]", "", provider_type)[:80]
            if safe_type:
                result["provider_error_type"] = safe_type
        message = body.get("message")
        if isinstance(message, str):
            safe_message = _sanitize_provider_message(
                message,
                sensitive_values=(
                    settings.resend_api_key,
                    inquiry.name,
                    inquiry.email,
                    inquiry.message,
                    str(payload.get("from", "")),
                    str(payload.get("subject", "")),
                    str(payload.get("text", "")),
                    str(payload.get("reply_to", "")),
                    *(str(item) for item in payload.get("to", []) if isinstance(item, str)),
                ),
            )
            if safe_message:
                result["provider_error_message"] = safe_message

    headers = error.headers
    if headers is not None:
        for header in ("x-resend-id", "resend-request-id", "x-request-id"):
            request_id = headers.get(header)
            if request_id and re.fullmatch(r"[A-Za-z0-9_-]{1,128}", request_id):
                result["provider_request_id"] = request_id
                break
    return result


def _sanitize_provider_message(message: str, *, sensitive_values: tuple[str, ...]) -> str:
    safe_message = " ".join(
        "".join(" " if unicodedata.category(char) == "Cc" else char for char in message).split()
    )
    for value in sorted((value for value in sensitive_values if value), key=len, reverse=True):
        safe_message = safe_message.replace(value, "[redacted]")
    safe_message = re.sub(r"(?i)\bBearer\s+\S+", "Bearer [redacted]", safe_message)
    safe_message = re.sub(r"\bre_[A-Za-z0-9_-]{8,}\b", "[redacted]", safe_message)
    safe_message = re.sub(
        r"\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b", "[email]", safe_message, flags=re.I
    )
    return safe_message[:240]
