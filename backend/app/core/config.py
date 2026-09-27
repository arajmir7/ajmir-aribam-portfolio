"""Typed environment inputs shared by the API and maintenance commands."""

import os
from dataclasses import dataclass
from email.utils import getaddresses, parseaddr
from re import fullmatch

from email_validator import EmailNotValidError, validate_email
from sqlalchemy.engine import make_url

RESEND_API_ORIGIN = "https://api.resend.com"


@dataclass(frozen=True, slots=True)
class Settings:
    environment: str
    database_url: str
    migration_database_url: str
    contact_internal_token: str
    contact_allowed_origin: str
    build_revision: str
    resend_api_key: str
    resend_api_url: str
    contact_email_from: str
    contact_email_to: str
    email_status: str


def get_settings() -> Settings:
    # Read on use so CLI commands and isolated tests can supply their own environment.
    vercel_environment = os.environ.get("VERCEL_ENV", "").strip().lower()
    default_environment = "production" if vercel_environment == "production" else "development"
    environment = os.environ.get("APP_ENV", default_environment).strip().lower()
    if vercel_environment == "production" and environment != "production":
        raise RuntimeError("Vercel production requires APP_ENV=production")
    if environment not in {"development", "test", "production"}:
        raise RuntimeError("APP_ENV must be development, test, or production")

    configured_database_url = os.environ.get("DATABASE_URL", "").strip()
    if environment == "production" and not configured_database_url:
        raise RuntimeError("Production requires DATABASE_URL")
    database_url = configured_database_url or "sqlite:///./portfolio.db"
    database_url = _normalize_database_url(database_url)
    migration_database_url = _normalize_database_url(
        os.environ.get("MIGRATION_DATABASE_URL", "").strip() or database_url
    )

    contact_internal_token = os.environ.get("CONTACT_INTERNAL_TOKEN", "")
    contact_allowed_origin = os.environ.get("CONTACT_ALLOWED_ORIGIN", "").strip()
    build_revision = os.environ.get("VERCEL_GIT_COMMIT_SHA", "unknown").strip()
    resend_api_key = os.environ.get("RESEND_API_KEY", "").strip()
    resend_api_url = os.environ.get("RESEND_API_URL", RESEND_API_ORIGIN).strip().rstrip("/")
    contact_email_from = os.environ.get("CONTACT_EMAIL_FROM", "").strip()
    contact_email_to = os.environ.get("CONTACT_EMAIL_TO", "").strip()

    if environment == "production":
        _validate_production_database(database_url)
        configured_migration_url = os.environ.get("MIGRATION_DATABASE_URL", "").strip()
        if configured_migration_url:
            raise RuntimeError(
                "MIGRATION_DATABASE_URL must not be configured in the production runtime"
            )
        if (
            len(contact_internal_token) < 32
            or contact_internal_token != contact_internal_token.strip()
            or contact_internal_token.lower().startswith(("replace-with", "changeme", "example"))
            or len(set(contact_internal_token)) < 8
        ):
            raise RuntimeError("Production requires a 32-character CONTACT_INTERNAL_TOKEN")
        if not fullmatch(r"[0-9a-fA-F]{7,64}", build_revision):
            raise RuntimeError("Production requires VERCEL_GIT_COMMIT_SHA to be a Git commit SHA")
        if contact_allowed_origin != "https://ajmiraribam.me":
            raise RuntimeError("Production CONTACT_ALLOWED_ORIGIN must be https://ajmiraribam.me")
        if contact_email_from:
            sender_domain = parseaddr(contact_email_from)[1].rsplit("@", 1)[-1].lower()
            if sender_domain != "ajmiraribam.me" and not sender_domain.endswith(".ajmiraribam.me"):
                raise RuntimeError("Production CONTACT_EMAIL_FROM must use the portfolio domain")
        if contact_email_to and contact_email_to.lower() != "arajmir7@gmail.com":
            raise RuntimeError("Production CONTACT_EMAIL_TO must be the owner's inbox")
        if resend_api_url != RESEND_API_ORIGIN:
            raise RuntimeError("Production RESEND_API_URL must use the official Resend API")

    email_status = _resend_status(
        environment,
        api_key=resend_api_key,
        sender=contact_email_from,
        recipient=contact_email_to,
    )
    if environment == "production" and email_status != "configured":
        raise RuntimeError("Production requires a valid Resend key, sender, and recipient")

    return Settings(
        environment=environment,
        database_url=database_url,
        migration_database_url=migration_database_url,
        contact_internal_token=contact_internal_token,
        contact_allowed_origin=contact_allowed_origin,
        build_revision=build_revision,
        resend_api_key=resend_api_key,
        resend_api_url=resend_api_url,
        contact_email_from=contact_email_from,
        contact_email_to=contact_email_to,
        email_status=email_status,
    )


def _normalize_database_url(value: str) -> str:
    if value.startswith("postgres://"):
        value = "postgresql+psycopg://" + value.removeprefix("postgres://")
    elif value.startswith("postgresql://"):
        value = "postgresql+psycopg://" + value.removeprefix("postgresql://")
    return value


def _validate_production_database(value: str) -> None:
    try:
        parsed = make_url(value)
    except Exception as error:
        raise RuntimeError("Production requires a valid PostgreSQL DATABASE_URL") from error
    if parsed.drivername != "postgresql+psycopg":
        raise RuntimeError("Production requires a PostgreSQL DATABASE_URL")
    if not all((parsed.host, parsed.username, parsed.password, parsed.database)):
        raise RuntimeError("Production DATABASE_URL must include host, credentials, and database")
    if not parsed.host.endswith(".neon.tech") or "-pooler." not in parsed.host:
        raise RuntimeError("Production DATABASE_URL must use the Neon pooled endpoint")
    if parsed.query.get("sslmode") not in {"require", "verify-full"}:
        raise RuntimeError("Production DATABASE_URL must require TLS with sslmode=require")


def _resend_status(environment: str, *, api_key: str, sender: str, recipient: str) -> str:
    configured_values = (api_key, sender, recipient)
    if not any(configured_values):
        return "not_configured"
    if not all(configured_values) or not api_key.startswith("re_"):
        return "misconfigured"
    if any(char in sender + recipient for char in "\r\n"):
        return "misconfigured"
    try:
        sender_addresses = getaddresses([sender])
        recipient_addresses = getaddresses([recipient])
        if len(sender_addresses) != 1 or len(recipient_addresses) != 1:
            return "misconfigured"
        sender_address = sender_addresses[0][1] or parseaddr(sender)[1]
        recipient_address = recipient_addresses[0][1] or parseaddr(recipient)[1]
        if not sender_address or not recipient_address:
            return "misconfigured"
        validate_email(sender_address, check_deliverability=False)
        validate_email(recipient_address, check_deliverability=False)
        if "," in recipient or ";" in recipient:
            return "misconfigured"
    except (ValueError, EmailNotValidError):
        return "misconfigured"
    if environment == "production" and len(api_key) < 20:
        return "misconfigured"
    return "configured"
