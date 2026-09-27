"""Add idempotent inquiry storage and a durable email outbox."""

import sqlalchemy as sa
from alembic import op

revision = "002_email_outbox"
down_revision = "001_initial"
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table("inquiries") as batch_op:
        # Keep the prior status column so an application rollback can still use
        # the preceding release while the outbox schema remains in place.
        batch_op.alter_column(
            "notification_status",
            existing_type=sa.String(12),
            server_default="pending",
        )
        batch_op.add_column(sa.Column("idempotency_key", sa.String(80), nullable=True))
        batch_op.add_column(sa.Column("source_origin", sa.String(253), nullable=True))
        batch_op.create_unique_constraint("uq_inquiries_idempotency_key", ["idempotency_key"])

    op.create_table(
        "email_deliveries",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column(
            "inquiry_id",
            sa.String(36),
            sa.ForeignKey("inquiries.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("status", sa.String(12), nullable=False, server_default="pending"),
        sa.Column("attempt_count", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("last_attempt_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("claimed_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("claim_token", sa.String(36), nullable=True),
        sa.Column("next_attempt_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("sent_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("last_error", sa.String(64), nullable=True),
        sa.UniqueConstraint("inquiry_id", name="uq_email_deliveries_inquiry_id"),
    )
    op.create_index(
        "ix_email_deliveries_ready",
        "email_deliveries",
        ["status", "next_attempt_at", "created_at"],
    )
    connection = op.get_bind()
    # Old failed/incomplete notifications remain queued; successful legacy sends are not repeated.
    connection.execute(
        sa.text(
            """
            INSERT INTO email_deliveries
                (id, inquiry_id, status, attempt_count, created_at, next_attempt_at)
            SELECT lower(hex(randomblob(16))), id, 'pending', 0, created_at, CURRENT_TIMESTAMP
            FROM inquiries
            WHERE notification_status <> 'sent'
            """
        )
        if connection.dialect.name == "sqlite"
        else sa.text(
            """
            INSERT INTO email_deliveries
                (id, inquiry_id, status, attempt_count, created_at, next_attempt_at)
            SELECT gen_random_uuid()::text, id, 'pending', 0, created_at, now()
            FROM inquiries
            WHERE notification_status <> 'sent'
            """
        )
    )
    connection.execute(
        sa.text(
            "UPDATE inquiries SET notification_status = 'pending' "
            "WHERE notification_status <> 'sent'"
        )
    )


def downgrade():
    connection = op.get_bind()
    connection.execute(
        sa.text(
            """
            UPDATE inquiries SET notification_status = CASE
                WHEN id IN (
                    SELECT inquiry_id FROM email_deliveries WHERE status = 'sent'
                ) THEN 'sent'
                WHEN id IN (
                    SELECT inquiry_id FROM email_deliveries WHERE status = 'failed'
                ) THEN 'failed'
                ELSE 'pending'
            END
            """
        )
    )
    op.drop_index("ix_email_deliveries_ready", table_name="email_deliveries")
    op.drop_table("email_deliveries")
    with op.batch_alter_table("inquiries") as batch_op:
        batch_op.drop_constraint("uq_inquiries_idempotency_key", type_="unique")
        batch_op.drop_column("source_origin")
        batch_op.drop_column("idempotency_key")
