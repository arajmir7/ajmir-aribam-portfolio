# Production operations

## Backups and restore

Render Postgres provides provider-managed recovery options subject to the selected plan. The repository also defines a daily Render Cron job that creates a PostgreSQL custom-format dump, verifies it with `pg_restore --list`, calculates SHA-256, and uploads the dump, checksum, and completion marker using SSE-KMS. The job's `0 3 * * *` schedule is UTC. These controls are configuration only until the Render service succeeds and its objects are inspected.

Create a dedicated S3 bucket in `ap-south-1`; block public access, enable versioning, and set an owner-approved lifecycle/retention policy. Create a customer-managed KMS key. Give the backup/restore identity `s3:PutObject` and `s3:GetObject` only within the configured bucket prefix, plus `kms:GenerateDataKey`, `kms:Decrypt` and `kms:DescribeKey` only for that key. The Render Cron currently uses stored AWS access-key secrets because no workload identity connection has been configured. Rotate them and record the IAM principal owner.

After a successful backup, restore to a **new empty isolated PostgreSQL database**, never over the live database:

```sh
DATABASE_URL='<isolated restore-role PostgreSQL URL>' \
RESTORE_CONFIRM=restore-into-empty-database \
BACKUP_S3_BUCKET='<private bucket>' \
AWS_REGION=ap-south-1 \
python3 scripts/restore_postgres.py portfolio/prod/<dump filename>
```

The restore command verifies the dump/checksum/completion marker, rejects a non-empty database, restores without source ownership or grants, and confirms an Alembic version exists. Verify application reads and record the recovered revision before any controlled cutover. For local verification, `make verify` performs backup and restore against disposable PostgreSQL 17 containers. Restoring a database does not roll back an application deploy; rehearse the compatible code/database sequence separately.

## Monitoring and alerts

The scheduled GitHub workflow probes public TLS, redirects, routes, security headers, canonical metadata, sitemap, readiness/revision and contact rejection flows every 15 minutes after `PRODUCTION_URL` is configured. Set `PRODUCTION_REVISION` to the currently deployed full commit. Enable GitHub Actions failure notifications for the release owner, or connect an approved alert destination. A failed Actions run is not itself evidence an alert was delivered.

Render exposes service and Postgres health/logs/metrics in its dashboard. Set owner alerts there for repeated deploy failures, API/web health failures, database availability/storage/connection pressure, worker restarts, and backup job failure. `/api/health` and private `/health/ready` distinguish database readiness from SMTP configuration and expose aggregate outbox states. Use `python -m app.maintenance email-status`, `deliveries --status pending`, `deliveries --status failed`, and `recent-inquiries` from an authorized shell. These commands avoid printing message bodies or visitor addresses. Retry a failed row only after fixing SMTP with `python -m app.maintenance retry-delivery --delivery-id '<UUID>'`. No external metrics collector or alert destination has been configured, and no real provider delivery has yet been verified.

## Rollback

1. Stop or hold further automatic deploys and identify the last smoke-tested full commit SHA.
2. Use Render's dashboard to redeploy the prior successful web and API revisions. Check the same-origin contact contract, readiness, and current revision before reopening traffic.
3. If a migration is incompatible, do not assume reverting application code restores the schema. Prefer a forward corrective migration. Restore a verified backup into a separate database, validate it, then change the API connection in a controlled maintenance window. Keep the original database intact until reads and contact persistence are confirmed.
4. Record the trigger, affected commit, database revision, backup object/checksum, recovery actions, and final smoke evidence.

Application rollback via Render is a proposed runbook only; it has not been exercised against a live service.
