import pytest

from app.core.config import get_settings


def configure_production(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("APP_ENV", "production")
    monkeypatch.setenv("DATABASE_URL", "postgresql+psycopg://app:secret@db/portfolio")
    monkeypatch.setenv("CONTACT_INTERNAL_TOKEN", "a-production-token-with-32-characters")
    monkeypatch.setenv("BUILD_REVISION", "0123456789abcdef")


def test_production_settings_accept_explicit_secure_inputs(monkeypatch: pytest.MonkeyPatch):
    configure_production(monkeypatch)
    settings = get_settings()
    assert settings.database_url.startswith("postgresql+psycopg://")
    assert settings.build_revision == "0123456789abcdef"


@pytest.mark.parametrize(
    ("name", "value", "message"),
    [
        ("DATABASE_URL", "sqlite:///./portfolio.db", "PostgreSQL DATABASE_URL"),
        ("CONTACT_INTERNAL_TOKEN", "short", "32-character CONTACT_INTERNAL_TOKEN"),
        ("BUILD_REVISION", "unknown", "BUILD_REVISION"),
    ],
)
def test_production_settings_fail_closed(
    monkeypatch: pytest.MonkeyPatch, name: str, value: str, message: str
):
    configure_production(monkeypatch)
    monkeypatch.setenv(name, value)
    with pytest.raises(RuntimeError, match=message):
        get_settings()
