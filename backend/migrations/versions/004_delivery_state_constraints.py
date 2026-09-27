"""Constrain inquiry and email delivery state transitions."""

from alembic import op

revision = "004_delivery_state_constraints"
down_revision = "003_resend_message_id"
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table("inquiries") as batch_op:
        batch_op.create_check_constraint(
            "ck_inquiries_notification_status",
            "notification_status IN ('pending', 'sent', 'failed')",
        )
    with op.batch_alter_table("email_deliveries") as batch_op:
        batch_op.create_check_constraint(
            "ck_email_deliveries_status",
            "status IN ('pending', 'attempting', 'sent', 'failed')",
        )
        batch_op.create_check_constraint(
            "ck_email_deliveries_attempt_count",
            "attempt_count >= 0 AND attempt_count <= 5",
        )


def downgrade():
    with op.batch_alter_table("email_deliveries") as batch_op:
        batch_op.drop_constraint("ck_email_deliveries_attempt_count", type_="check")
        batch_op.drop_constraint("ck_email_deliveries_status", type_="check")
    with op.batch_alter_table("inquiries") as batch_op:
        batch_op.drop_constraint("ck_inquiries_notification_status", type_="check")
