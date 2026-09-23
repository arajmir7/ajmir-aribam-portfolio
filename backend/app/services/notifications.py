"""Best-effort SMTP notification after an inquiry has been committed."""

import smtplib
from email.message import EmailMessage

from app.core.config import get_settings
from app.core.logging import log
from app.db.database import SessionLocal
from app.db.models import Inquiry


def notify(inquiry: Inquiry) -> bool:
    settings = get_settings()
    if not all((settings.email_host, settings.email_from, settings.email_to)):
        return False
    mail = EmailMessage()
    mail["Subject"] = f"Portfolio inquiry: {inquiry.topic}"
    mail["From"] = settings.email_from
    mail["To"] = settings.email_to
    mail["Reply-To"] = inquiry.email
    mail.set_content(
        f"Name: {inquiry.name}\nEmail: {inquiry.email}\nTopic: {inquiry.topic}\n\n{inquiry.message}"
    )
    with smtplib.SMTP(settings.email_host, int(settings.email_port), timeout=8) as smtp:
        smtp.starttls()
        if settings.email_user:
            smtp.login(settings.email_user, settings.email_password)
        smtp.send_message(mail)
    return True


def deliver_notification(inquiry_id: str, request_id: str) -> None:
    """The committed row remains pending if this in-process task fails."""
    with SessionLocal() as db:
        inquiry = db.get(Inquiry, inquiry_id)
        if inquiry is None:
            return
        try:
            if notify(inquiry):
                inquiry.notification_status = "sent"
                db.commit()
                log("notification_sent", request_id, inquiry_id=inquiry_id)
        except Exception as exc:
            db.rollback()
            log(
                "notification_failed",
                request_id,
                inquiry_id=inquiry_id,
                error_type=type(exc).__name__,
            )
