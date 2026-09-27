"""SMTP transport for durable inquiry email deliveries."""

import smtplib
import ssl
import unicodedata
from datetime import UTC
from email.message import EmailMessage

from app.core.config import Settings, get_settings
from app.db.models import Inquiry


class DeliveryFailure(Exception):
    """An SMTP failure reduced to a safe operator-facing code."""

    def __init__(self, code: str, *, retryable: bool):
        super().__init__(code)
        self.code = code
        self.retryable = retryable


def build_message(inquiry: Inquiry, settings: Settings) -> EmailMessage:
    if settings.email_status != "configured":
        raise DeliveryFailure("smtp_not_configured", retryable=False)
    safe_name = " ".join(
        "".join(
            " " if unicodedata.category(char) == "Cc" else char for char in inquiry.name
        ).split()
    )
    message = EmailMessage()
    message["Subject"] = f"Portfolio enquiry — {inquiry.topic} — {safe_name}"
    message["From"] = settings.email_from
    message["To"] = settings.email_to
    message["Reply-To"] = inquiry.email
    submitted_at = inquiry.created_at
    if submitted_at.tzinfo is None:
        submitted_at = submitted_at.replace(tzinfo=UTC)
    submitted_utc = (
        submitted_at.astimezone(UTC).isoformat(timespec="seconds").replace("+00:00", "Z")
    )
    message.set_content(
        f"Name: {inquiry.name}\n"
        f"Email: {inquiry.email}\n"
        f"Topic: {inquiry.topic}\n"
        f"Inquiry ID: {inquiry.id}\n"
        f"Submitted at (UTC): {submitted_utc}\n"
        "Source: Portfolio contact form\n"
        f"Origin: {inquiry.source_origin or 'not provided'}\n\n"
        f"{inquiry.message}"
    )
    return message


def send_notification(inquiry: Inquiry, settings: Settings | None = None) -> None:
    configuration = settings or get_settings()
    message = build_message(inquiry, configuration)
    try:
        implicit_tls = configuration.email_use_tls and configuration.email_port == 465
        smtp_transport = smtplib.SMTP_SSL if implicit_tls else smtplib.SMTP
        options = {"context": ssl.create_default_context()} if implicit_tls else {}
        with smtp_transport(
            configuration.email_host,
            configuration.email_port,
            timeout=10,
            **options,
        ) as smtp:
            smtp.ehlo()
            if configuration.email_use_tls and not implicit_tls:
                smtp.starttls(context=ssl.create_default_context())
                smtp.ehlo()
            if configuration.email_user:
                smtp.login(configuration.email_user, configuration.email_password)
            refused = smtp.send_message(message)
            if refused:
                raise DeliveryFailure("smtp_recipient_rejected", retryable=False)
    except DeliveryFailure:
        raise
    except smtplib.SMTPAuthenticationError:
        raise DeliveryFailure("smtp_authentication_failed", retryable=False) from None
    except smtplib.SMTPRecipientsRefused:
        raise DeliveryFailure("smtp_recipient_rejected", retryable=False) from None
    except smtplib.SMTPSenderRefused:
        raise DeliveryFailure("smtp_sender_rejected", retryable=False) from None
    except smtplib.SMTPNotSupportedError:
        raise DeliveryFailure("smtp_tls_unavailable", retryable=False) from None
    except smtplib.SMTPResponseException as error:
        retryable = error.smtp_code < 500
        code = "smtp_temporary_rejection" if retryable else "smtp_permanent_rejection"
        raise DeliveryFailure(code, retryable=retryable) from None
    except ssl.SSLCertVerificationError:
        raise DeliveryFailure("smtp_tls_certificate_invalid", retryable=False) from None
    except (smtplib.SMTPServerDisconnected, TimeoutError, OSError):
        raise DeliveryFailure("smtp_connection_failed", retryable=True) from None
    except Exception:
        # Do not persist or log the transport exception; it can contain server details.
        raise DeliveryFailure("smtp_delivery_failed", retryable=True) from None
