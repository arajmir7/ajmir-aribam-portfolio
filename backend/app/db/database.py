from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from app.core.config import get_settings


class Base(DeclarativeBase):
    pass


def database_url() -> str:
    return get_settings().database_url


def make_engine(url: str | None = None):
    settings = get_settings()
    value = url or settings.database_url
    pool_options = (
        {}
        if value.startswith("sqlite")
        else {
            "pool_size": settings.database_pool_size,
            "max_overflow": settings.database_max_overflow,
            "pool_timeout": settings.database_pool_timeout,
            "pool_recycle": settings.database_pool_recycle,
        }
    )
    return create_engine(
        value,
        pool_pre_ping=True,
        connect_args={"check_same_thread": False} if value.startswith("sqlite") else {},
        **pool_options,
    )


engine = make_engine()
SessionLocal = sessionmaker(bind=engine, expire_on_commit=False)
