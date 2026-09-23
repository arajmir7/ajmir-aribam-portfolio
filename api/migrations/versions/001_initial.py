"""Initial inquiry storage and throttling windows."""

import sqlalchemy as sa
from alembic import op

revision = "001_initial"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "inquiries",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("name", sa.String(120), nullable=False),
        sa.Column("email", sa.String(254), nullable=False),
        sa.Column("topic", sa.String(40), nullable=False),
        sa.Column("message", sa.Text(), nullable=False),
        sa.Column("request_id", sa.String(80), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("notification_status", sa.String(12), nullable=False),
    )
    op.create_index("ix_inquiries_request_id", "inquiries", ["request_id"])
    op.create_table(
        "rate_windows",
        sa.Column("key", sa.String(64), primary_key=True),
        sa.Column("starts_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("count", sa.Integer(), nullable=False),
    )


def downgrade():
    op.drop_table("rate_windows")
    op.drop_index("ix_inquiries_request_id", table_name="inquiries")
    op.drop_table("inquiries")
