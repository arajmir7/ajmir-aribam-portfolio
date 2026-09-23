import os

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker


class Base(DeclarativeBase):
    pass


def database_url() -> str:
    return os.environ.get("DATABASE_URL", "sqlite:///./portfolio.db")


def make_engine(url: str | None = None):
    value = url or database_url()
    return create_engine(
        value,
        pool_pre_ping=True,
        connect_args={"check_same_thread": False} if value.startswith("sqlite") else {},
    )


engine = make_engine()
SessionLocal = sessionmaker(bind=engine, expire_on_commit=False)
