import pytest

from app.core.config import get_settings


def configure_production(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("APP_ENV", "production")
    monkeypatch.setenv(
        "DATABASE_URL",
        "postgresql+psycopg://app:random-runtime-database-password-at-least-32-chars@db/portfolio",
    )
    monkeypatch.setenv(
        "MIGRATION_DATABASE_URL",
        "postgresql+psycopg://migrator:random-migration-database-password-at-least-32-chars@db/portfolio",
    )
    monkeypatch.setenv("CONTACT_INTERNAL_TOKEN", "a-production-token-with-32-characters")
    monkeypatch.setenv("BUILD_REVISION", "0123456789abcdef01234567")


def test_production_settings_accept_explicit_secure_inputs(monkeypatch: pytest.MonkeyPatch):
    configure_production(monkeypatch)
    settings = get_settings()
    assert settings.database_url.startswith("postgresql+psycopg://app:")
    assert settings.migration_database_url.startswith("postgresql+psycopg://migrator:")
    assert settings.build_revision == "0123456789abcdef01234567"


@pytest.mark.parametrize(
    ("name", "value", "message"),
    [
        ("MIGRATION_DATABASE_URL", "sqlite:///./portfolio.db", "PostgreSQL MIGRATION_DATABASE_URL"),
        (
            "DATABASE_URL",
            "postgresql+psycopg://migrator:random-runtime-database-password-at-least-32-chars@db/portfolio",
            "different",
        ),
        ("CONTACT_INTERNAL_TOKEN", "short", "32-character CONTACT_INTERNAL_TOKEN"),
        ("BUILD_REVISION", "unknown", "BUILD_REVISION"),
        (
            "CONTACT_INTERNAL_TOKEN",
            "replace-with-at-least-32-random-characters",
            "CONTACT_INTERNAL_TOKEN",
        ),
        ("DATABASE_URL", "postgresql://user@db/portfolio", "credentials"),
    ],
)
def test_production_settings_fail_closed(
    monkeypatch: pytest.MonkeyPatch, name: str, value: str, message: str
):
    configure_production(monkeypatch)
    monkeypatch.setenv(name, value)
    with pytest.raises(RuntimeError, match=message):
        get_settings()


def test_derived_runtime_settings_reject_unsafe_password(monkeypatch: pytest.MonkeyPatch):
    configure_production(monkeypatch)
    monkeypatch.delenv("DATABASE_URL")
    monkeypatch.setenv("DATABASE_RUNTIME_USER", "portfolio_app")
    monkeypatch.setenv(
        "DATABASE_RUNTIME_PASSWORD", "replace-with-another-at-least-32-random-characters"
    )
    with pytest.raises(RuntimeError, match="non-placeholder"):
        get_settings()


def test_production_normalizes_render_postgres_url(monkeypatch: pytest.MonkeyPatch):
    configure_production(monkeypatch)
    monkeypatch.delenv("DATABASE_URL")
    monkeypatch.setenv(
        "MIGRATION_DATABASE_URL",
        "postgresql://migrator:random-migration-database-password-at-least-32-chars@db.internal:5432/portfolio",
    )
    monkeypatch.setenv("DATABASE_RUNTIME_USER", "portfolio_app")
    monkeypatch.setenv(
        "DATABASE_RUNTIME_PASSWORD", "random-runtime-database-password-at-least-32-chars"
    )
    settings = get_settings()
    assert settings.database_url.startswith("postgresql+psycopg://portfolio_app:")
    assert settings.migration_database_url.startswith("postgresql+psycopg://migrator:")


@pytest.mark.parametrize(
    ("name", "value"),
    [
        ("DATABASE_POOL_SIZE", "0"),
        ("DATABASE_MAX_OVERFLOW", "-1"),
        ("DATABASE_POOL_TIMEOUT", "0"),
        ("DATABASE_POOL_RECYCLE", "0"),
    ],
)
def test_database_pool_settings_reject_unsafe_values(
    monkeypatch: pytest.MonkeyPatch, name: str, value: str
):
    configure_production(monkeypatch)
    monkeypatch.setenv(name, value)
    with pytest.raises(RuntimeError, match="pool settings"):
        get_settings()
