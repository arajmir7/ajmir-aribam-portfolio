from datetime import UTC, datetime
from uuid import uuid4

from sqlalchemy import DateTime, ForeignKey, Index, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.db.database import Base


def now() -> datetime:
    return datetime.now(UTC)


class Inquiry(Base):
    __tablename__ = "inquiries"
    __table_args__ = (UniqueConstraint("idempotency_key", name="uq_inquiries_idempotency_key"),)

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(String(254), nullable=False)
    topic: Mapped[str] = mapped_column(String(40), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    request_id: Mapped[str] = mapped_column(String(80), nullable=False, index=True)
    notification_status: Mapped[str] = mapped_column(
        String(12), default="pending", server_default="pending", nullable=False
    )
    idempotency_key: Mapped[str | None] = mapped_column(String(80))
    source_origin: Mapped[str | None] = mapped_column(String(253))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=now, nullable=False
    )


class EmailDelivery(Base):
    __tablename__ = "email_deliveries"
    __table_args__ = (
        UniqueConstraint("inquiry_id", name="uq_email_deliveries_inquiry_id"),
        Index("ix_email_deliveries_ready", "status", "next_attempt_at", "created_at"),
    )

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    inquiry_id: Mapped[str] = mapped_column(
        ForeignKey("inquiries.id", ondelete="CASCADE"), nullable=False
    )
    status: Mapped[str] = mapped_column(String(12), default="pending", nullable=False)
    attempt_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=now, nullable=False
    )
    last_attempt_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    claimed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    claim_token: Mapped[str | None] = mapped_column(String(36))
    next_attempt_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), default=now)
    sent_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    provider_message_id: Mapped[str | None] = mapped_column(String(128))
    last_error: Mapped[str | None] = mapped_column(String(64))


class RateWindow(Base):
    __tablename__ = "rate_windows"

    key: Mapped[str] = mapped_column(String(64), primary_key=True)
    starts_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
