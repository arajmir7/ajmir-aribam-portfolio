"""Record the message identifier returned by Resend."""

import sqlalchemy as sa
from alembic import op

revision = "003_resend_message_id"
down_revision = "002_email_outbox"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column("email_deliveries", sa.Column("provider_message_id", sa.String(128)))


def downgrade():
    op.drop_column("email_deliveries", "provider_message_id")
