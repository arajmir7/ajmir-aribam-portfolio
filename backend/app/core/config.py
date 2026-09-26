"""Typed environment inputs shared by the API and maintenance commands."""

import os
from dataclasses import dataclass


@dataclass(frozen=True, slots=True)
class Settings:
    database_url: str
    contact_internal_token: str
    build_revision: str
    database_pool_size: int
    database_max_overflow: int
    database_pool_timeout: int
    database_pool_recycle: int
    email_host: str
    email_port: str
    email_user: str
    email_password: str
    email_from: str
    email_to: str


def get_settings() -> Settings:
    # Read on use so CLI commands and isolated tests can supply their own environment.
    environment = os.environ.get("APP_ENV", "development")
    database_url = os.environ.get("DATABASE_URL", "sqlite:///./portfolio.db")
    contact_internal_token = os.environ.get("CONTACT_INTERNAL_TOKEN", "")
    build_revision = os.environ.get("BUILD_REVISION", "unknown")
    if environment == "production":
        if not database_url.startswith(("postgresql://", "postgresql+psycopg://")):
            raise RuntimeError("Production requires a PostgreSQL DATABASE_URL")
        if len(contact_internal_token) < 32:
            raise RuntimeError("Production requires a 32-character CONTACT_INTERNAL_TOKEN")
        if build_revision == "unknown":
            raise RuntimeError("Production requires BUILD_REVISION")
    return Settings(
        database_url=database_url,
        contact_internal_token=contact_internal_token,
        build_revision=build_revision,
        database_pool_size=int(os.environ.get("DATABASE_POOL_SIZE", "5")),
        database_max_overflow=int(os.environ.get("DATABASE_MAX_OVERFLOW", "5")),
        database_pool_timeout=int(os.environ.get("DATABASE_POOL_TIMEOUT", "10")),
        database_pool_recycle=int(os.environ.get("DATABASE_POOL_RECYCLE", "300")),
        email_host=os.environ.get("EMAIL_HOST", ""),
        email_port=os.environ.get("EMAIL_PORT", "587"),
        email_user=os.environ.get("EMAIL_USER", ""),
        email_password=os.environ.get("EMAIL_PASSWORD", ""),
        email_from=os.environ.get("EMAIL_FROM", ""),
        email_to=os.environ.get("EMAIL_TO", ""),
    )
