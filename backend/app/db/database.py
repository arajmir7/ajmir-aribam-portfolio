from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker
from sqlalchemy.pool import NullPool

from app.core.config import get_settings


class Base(DeclarativeBase):
    pass


def database_url(*, migration: bool = False) -> str:
    settings = get_settings()
    return settings.migration_database_url if migration else settings.database_url


def make_engine(url: str | None = None):
    settings = get_settings()
    value = url or settings.database_url
    pool_options = {"poolclass": NullPool} if settings.environment == "production" else {}
    return create_engine(
        value,
        pool_pre_ping=True,
        connect_args={"check_same_thread": False} if value.startswith("sqlite") else {},
        **pool_options,
    )


engine = make_engine()
SessionLocal = sessionmaker(bind=engine, expire_on_commit=False)
