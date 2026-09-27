import pytest
from sqlalchemy.pool import NullPool

from app.core.config import get_settings


def configure_production(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("APP_ENV", "production")
    monkeypatch.delenv("MIGRATION_DATABASE_URL", raising=False)
    monkeypatch.setenv(
        "DATABASE_URL",
        "postgresql://portfolio_app:long-enough-password@ep-calm-sunset-pooler.us-east-2.aws.neon.tech/portfolio?sslmode=require",
    )
    monkeypatch.setenv("CONTACT_INTERNAL_TOKEN", "a-production-token-with-32-characters")
    monkeypatch.setenv("CONTACT_ALLOWED_ORIGIN", "https://ajmiraribam.me")
    monkeypatch.setenv("BUILD_REVISION", "0123456789abcdef0123456789abcdef01234567")
    monkeypatch.setenv("RESEND_API_KEY", "re_" + "a" * 32)
    monkeypatch.setenv("CONTACT_EMAIL_FROM", "Ajmir Aribam <contact@ajmiraribam.me>")
    monkeypatch.setenv("CONTACT_EMAIL_TO", "arajmir7@gmail.com")


def test_production_settings_accept_explicit_secure_inputs(monkeypatch: pytest.MonkeyPatch):
    configure_production(monkeypatch)
    settings = get_settings()
    assert settings.database_url.startswith("postgresql+psycopg://portfolio_app:")
    assert settings.migration_database_url == settings.database_url
    assert settings.build_revision == "0123456789abcdef0123456789abcdef01234567"
    assert settings.email_status == "configured"
    assert settings.resend_api_url == "https://api.resend.com"


@pytest.mark.parametrize(
    ("name", "value", "message"),
    [
        ("DATABASE_URL", "sqlite:///./portfolio.db", "PostgreSQL DATABASE_URL"),
        (
            "MIGRATION_DATABASE_URL",
            "postgresql://migration:password@ep-calm-sunset.us-east-2.aws.neon.tech/portfolio?sslmode=require",
            "must not be configured in the production runtime",
        ),
        (
            "DATABASE_URL",
            "postgresql://user:password@db.example.test/portfolio?sslmode=require",
            "Neon pooled endpoint",
        ),
        (
            "DATABASE_URL",
            "postgresql://user:password@ep-calm-sunset-pooler.us-east-2.aws.neon.tech/portfolio",
            "TLS",
        ),
        ("CONTACT_INTERNAL_TOKEN", "short", "32-character CONTACT_INTERNAL_TOKEN"),
        ("BUILD_REVISION", "unknown", "BUILD_REVISION"),
        ("CONTACT_ALLOWED_ORIGIN", "http://ajmiraribam.me", "CONTACT_ALLOWED_ORIGIN"),
        ("RESEND_API_KEY", "", "valid Resend key"),
        ("CONTACT_EMAIL_FROM", "", "valid Resend key"),
        ("CONTACT_EMAIL_TO", "", "valid Resend key"),
        ("RESEND_API_URL", "https://example.test", "official Resend API"),
    ],
)
def test_production_settings_fail_closed(
    monkeypatch: pytest.MonkeyPatch, name: str, value: str, message: str
):
    configure_production(monkeypatch)
    monkeypatch.setenv(name, value)
    with pytest.raises(RuntimeError, match=message):
        get_settings()


def test_production_requires_database_url(monkeypatch: pytest.MonkeyPatch):
    configure_production(monkeypatch)
    monkeypatch.delenv("DATABASE_URL")
    with pytest.raises(RuntimeError, match="DATABASE_URL"):
        get_settings()


def test_production_requires_resend_variables_to_be_consistent(monkeypatch: pytest.MonkeyPatch):
    configure_production(monkeypatch)
    monkeypatch.setenv("CONTACT_EMAIL_TO", "owner@example.com,second@example.com")
    with pytest.raises(RuntimeError, match="valid Resend key"):
        get_settings()

    configure_production(monkeypatch)
    monkeypatch.setenv("CONTACT_EMAIL_FROM", "owner@example.com\r\nBcc: attacker@example.com")
    with pytest.raises(RuntimeError, match="valid Resend key"):
        get_settings()


def test_development_can_run_without_database_or_email_secrets(monkeypatch: pytest.MonkeyPatch):
    monkeypatch.setenv("APP_ENV", "development")
    monkeypatch.delenv("VERCEL_ENV", raising=False)
    monkeypatch.delenv("DATABASE_URL", raising=False)
    monkeypatch.delenv("RESEND_API_KEY", raising=False)
    monkeypatch.delenv("CONTACT_EMAIL_FROM", raising=False)
    monkeypatch.delenv("CONTACT_EMAIL_TO", raising=False)
    settings = get_settings()
    assert settings.database_url == "sqlite:///./portfolio.db"
    assert settings.email_status == "not_configured"


def test_vercel_production_cannot_fall_back_to_development(monkeypatch: pytest.MonkeyPatch):
    monkeypatch.setenv("VERCEL_ENV", "production")
    monkeypatch.delenv("APP_ENV", raising=False)
    monkeypatch.delenv("DATABASE_URL", raising=False)
    with pytest.raises(RuntimeError, match="DATABASE_URL"):
        get_settings()

    monkeypatch.setenv("APP_ENV", "development")
    with pytest.raises(RuntimeError, match="APP_ENV=production"):
        get_settings()


def test_production_database_uses_no_process_local_connection_pool(monkeypatch: pytest.MonkeyPatch):
    from app.db.database import make_engine

    configure_production(monkeypatch)
    engine = make_engine()
    try:
        assert isinstance(engine.pool, NullPool)
    finally:
        engine.dispose()
