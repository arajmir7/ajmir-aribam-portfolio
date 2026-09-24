# Operations

## Required configuration

`NEXT_PUBLIC_SITE_URL` is the canonical HTTPS origin and must match the browser origin. `POSTGRES_PASSWORD` and `CONTACT_INTERNAL_TOKEN` are mandatory; token must be at least 32 random characters. Set `BUILD_REVISION` to the deployed commit. SMTP uses `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASSWORD`, `EMAIL_FROM`, `EMAIL_TO`. If SMTP is omitted, the operator must review pending inquiries through the private CLI.

The web contact route checks the browser `Origin` against `NEXT_PUBLIC_SITE_URL`. A server-only `CONTACT_ALLOWED_ORIGIN` may override that value when running a build under a different trusted origin, as the isolated browser tests do. Set it only to the exact intended origin; it does not enable a list or wildcard.

## Release sequence

1. Run CI gates and build images at one pinned revision.
2. Back up the current PostgreSQL database and test restore periodically.
3. Deploy database, run Alembic migration, then start API and web. The API container runs `alembic upgrade head` at startup; keep one migration executor during rollout.
4. Confirm API `/health/live`, `/health/ready`, web `/api/health`, representative public routes, contact submission, SMTP delivery or pending record review, headers, canonical domain, sitemap and social preview.
5. Inspect structured logs and web-vitals distribution after traffic arrives. Keep the previous image digest ready for rollback.

Compose binds the web port to `127.0.0.1:3000`; provide TLS and public routing with a trusted reverse proxy. The proxy must replace `X-Real-IP`/`X-Forwarded-For`, limit request body size, and reject direct public access to API/database. No specific cloud platform is assumed.

## Routine care

- Daily: check readiness, inquiry notification backlog, error count, SMTP failures, storage and backup completion.
- Daily scheduled private command: `cd backend && uv run python -m app.maintenance purge --days 90`. Document this 90-day retention in the deployed privacy notice. Confirm that backups have a defined expiry.
- Review pending inquiries: `cd backend && uv run python -m app.maintenance pending`. Treat output as private because it contains email addresses.
- Weekly: dependency and secret scans; review web-vitals distributions and high error-rate alerts.
- Restore drill: recover a recent backup into an isolated database, run readiness and a read check, record results and time taken.

## Incidents

If inquiry storage is unavailable, the web form returns a clear unavailable message and direct email remains visible. Stop accepting writes if data integrity is uncertain. Preserve request IDs and sanitized logs; do not copy contact messages into tickets. Roll back the web/API images if code caused the issue, then verify schema compatibility before resuming writes.

## Deployment inputs still needed

Real domain, TLS/proxy, database credentials, SMTP account, backup location, alert destination, and retention scheduler are `TODO_OWNER_VERIFY` deployment inputs. No production deployment is claimed by this repository alone.
