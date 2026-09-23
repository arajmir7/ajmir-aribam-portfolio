from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from app.core.config import get_settings


class Base(DeclarativeBase):
    pass


def database_url() -> str:
    return get_settings().database_url


def make_engine(url: str | None = None):
    value = url or database_url()
    return create_engine(
        value,
        pool_pre_ping=True,
        connect_args={"check_same_thread": False} if value.startswith("sqlite") else {},
    )


engine = make_engine()
SessionLocal = sessionmaker(bind=engine, expire_on_commit=False)
