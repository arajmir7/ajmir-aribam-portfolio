"""Typed environment inputs shared by the API and maintenance commands."""

import os
from dataclasses import dataclass


@dataclass(frozen=True, slots=True)
class Settings:
    database_url: str
    contact_internal_token: str
    build_revision: str
    email_host: str
    email_port: str
    email_user: str
    email_password: str
    email_from: str
    email_to: str


def get_settings() -> Settings:
    # Read on use so CLI commands and isolated tests can supply their own environment.
    return Settings(
        database_url=os.environ.get("DATABASE_URL", "sqlite:///./portfolio.db"),
        contact_internal_token=os.environ.get("CONTACT_INTERNAL_TOKEN", ""),
        build_revision=os.environ.get("BUILD_REVISION", "unknown"),
        email_host=os.environ.get("EMAIL_HOST", ""),
        email_port=os.environ.get("EMAIL_PORT", "587"),
        email_user=os.environ.get("EMAIL_USER", ""),
        email_password=os.environ.get("EMAIL_PASSWORD", ""),
        email_from=os.environ.get("EMAIL_FROM", ""),
        email_to=os.environ.get("EMAIL_TO", ""),
    )
