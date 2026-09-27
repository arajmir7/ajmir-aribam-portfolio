# Production operations

## Backups and restore

Neon recovery windows, point-in-time restore, exports, retention, and availability depend on plan and account. No Neon account is connected here, so no backup schedule or recovery retention is enabled. Before launch, confirm plan recovery objectives, take an owner-approved export/snapshot, restore it to a **new isolated database/branch**, and verify the Alembic revision and known records. Record the tested steps, elapsed recovery time, and owner.

The repository includes local PostgreSQL custom-format backup and restore tools. `make verify` exercises checksum verification and isolated restoration using disposable PostgreSQL; that is not evidence of Neon recovery. Keep backup material encrypted and private, restrict access, and define owner-approved retention. Never restore over the live database.

## Monitoring and alerts

The optional scheduled GitHub workflow checks public TLS, redirects, routes, headers, metadata, readiness/revision, and contact rejection. Set repository variables `PRODUCTION_URL` and `PRODUCTION_REVISION` to enable it. Configure a human alert destination for failed workflow runs. Configure Vercel, Neon, and Resend account alerts for deploy/function errors, database capacity/availability/connections, and delivery failures. This repository does not provision external alerts or claim them active.

Public `/api/health` returns only status and revision. Token-protected FastAPI `/health/ready` checks PostgreSQL and reports outbox state counts. In a restricted operator shell, `python -m app.maintenance email-status`, `deliveries --status pending`, `deliveries --status failed`, and `recent-inquiries` expose operational state and must be access-controlled. Resolve the cause before `retry-delivery`; use `dispatch-pending --limit 50` to process due rows.

## Rollback

1. Pause later deployments and identify the last known-good full commit SHA.
2. Roll the Vercel frontend and API projects back to compatible deployments. Check `/api/health`, `/health/live`, public routes, and contact persistence before resuming deploy automation.
3. Keep migrations additive and backward-compatible. Prefer a corrective forward migration; application rollback does not reverse schema/data changes. Restore into an isolated Neon database/branch, validate, and only then switch the API connection in a controlled window.
4. Record the incident, revisions, database migration state, recovery evidence, owner, and final smoke results.

This runbook has not been exercised against live Vercel or Neon accounts.
