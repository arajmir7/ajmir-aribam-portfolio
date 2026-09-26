"""Typed environment inputs shared by the API and maintenance commands."""

import os
from dataclasses import dataclass
from re import fullmatch

from sqlalchemy.engine import make_url


@dataclass(frozen=True, slots=True)
class Settings:
    database_url: str
    migration_database_url: str
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
    environment = os.environ.get("APP_ENV", "development").strip().lower()
    database_url = os.environ.get("DATABASE_URL", "sqlite:///./portfolio.db")
    migration_database_url = os.environ.get("MIGRATION_DATABASE_URL") or database_url
    contact_internal_token = os.environ.get("CONTACT_INTERNAL_TOKEN", "")
    build_revision = os.environ.get("BUILD_REVISION", "unknown")
    if environment not in {"development", "test", "production"}:
        raise RuntimeError("APP_ENV must be development, test, or production")
    if environment == "production":
        try:
            if migration_database_url.startswith("postgres://"):
                migration_database_url = (
                    "postgresql+psycopg://" + migration_database_url.removeprefix("postgres://")
                )
            parsed_migration_url = make_url(migration_database_url)
        except Exception as error:
            raise RuntimeError(
                "Production requires a valid PostgreSQL MIGRATION_DATABASE_URL"
            ) from error
        if parsed_migration_url.drivername not in {"postgresql", "postgresql+psycopg"}:
            raise RuntimeError("Production requires a PostgreSQL MIGRATION_DATABASE_URL")
        if not all(
            (
                parsed_migration_url.host,
                parsed_migration_url.username,
                parsed_migration_url.password,
                parsed_migration_url.database,
            )
        ):
            raise RuntimeError(
                "Production MIGRATION_DATABASE_URL must include host, credentials, and database"
            )
        migration_password = parsed_migration_url.password or ""
        if len(migration_password) < 32 or migration_password.lower().startswith(
            ("replace-with", "changeme", "example")
        ):
            raise RuntimeError("Production migration database password is missing or unsafe")
        migration_database_url = parsed_migration_url.set(
            drivername="postgresql+psycopg"
        ).render_as_string(hide_password=False)

        runtime_user = os.environ.get("DATABASE_RUNTIME_USER", "").strip()
        runtime_password = os.environ.get("DATABASE_RUNTIME_PASSWORD", "")
        if database_url == "sqlite:///./portfolio.db":
            if (
                len(runtime_password) < 32
                or not fullmatch(r"[a-zA-Z][a-zA-Z0-9_]{0,62}", runtime_user)
                or runtime_password.lower().startswith(("replace-with", "changeme", "example"))
            ):
                raise RuntimeError(
                    "Production requires a separate runtime database user and "
                    "a non-placeholder 32-character runtime password"
                )
            if runtime_user == parsed_migration_url.username:
                raise RuntimeError("Runtime and migration database users must be different")
            database_url = parsed_migration_url.set(
                drivername="postgresql+psycopg",
                username=runtime_user,
                password=runtime_password,
            ).render_as_string(hide_password=False)
        else:
            try:
                parsed_runtime_url = make_url(database_url)
            except Exception as error:
                raise RuntimeError("Production requires a valid PostgreSQL DATABASE_URL") from error
            if parsed_runtime_url.drivername not in {"postgresql", "postgresql+psycopg"}:
                raise RuntimeError("Production requires a PostgreSQL DATABASE_URL")
            if not all(
                (
                    parsed_runtime_url.host,
                    parsed_runtime_url.username,
                    parsed_runtime_url.password,
                    parsed_runtime_url.database,
                )
            ):
                raise RuntimeError(
                    "Production DATABASE_URL must include host, credentials, and database"
                )
            if parsed_runtime_url.username == parsed_migration_url.username:
                raise RuntimeError("Runtime and migration database users must be different")
            if not parsed_runtime_url.password or len(parsed_runtime_url.password) < 32:
                raise RuntimeError(
                    "Production runtime database password must contain at least 32 characters"
                )
            if parsed_runtime_url.password.lower().startswith(
                ("replace-with", "changeme", "example")
            ):
                raise RuntimeError("Production runtime database password is missing or unsafe")
            database_url = parsed_runtime_url.set(drivername="postgresql+psycopg").render_as_string(
                hide_password=False
            )
        if (
            len(contact_internal_token) < 32
            or contact_internal_token != contact_internal_token.strip()
            or contact_internal_token.lower().startswith(("replace-with", "changeme", "example"))
            or len(set(contact_internal_token)) < 8
        ):
            raise RuntimeError("Production requires a 32-character CONTACT_INTERNAL_TOKEN")
        if not fullmatch(r"[0-9a-fA-F]{7,64}", build_revision):
            raise RuntimeError("Production requires BUILD_REVISION to be a Git commit SHA")
    pool_size = int(os.environ.get("DATABASE_POOL_SIZE", "5"))
    max_overflow = int(os.environ.get("DATABASE_MAX_OVERFLOW", "5"))
    pool_timeout = int(os.environ.get("DATABASE_POOL_TIMEOUT", "10"))
    pool_recycle = int(os.environ.get("DATABASE_POOL_RECYCLE", "300"))
    if pool_size < 1 or max_overflow < 0 or pool_timeout < 1 or pool_recycle < 1:
        raise RuntimeError("Database pool settings must be positive (overflow may be zero)")
    return Settings(
        database_url=database_url,
        migration_database_url=migration_database_url,
        contact_internal_token=contact_internal_token,
        build_revision=build_revision,
        database_pool_size=pool_size,
        database_max_overflow=max_overflow,
        database_pool_timeout=pool_timeout,
        database_pool_recycle=pool_recycle,
        email_host=os.environ.get("EMAIL_HOST", ""),
        email_port=os.environ.get("EMAIL_PORT", "587"),
        email_user=os.environ.get("EMAIL_USER", ""),
        email_password=os.environ.get("EMAIL_PASSWORD", ""),
        email_from=os.environ.get("EMAIL_FROM", ""),
        email_to=os.environ.get("EMAIL_TO", ""),
    )
