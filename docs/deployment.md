# Deployment

## Current status

The repository has a verified local deployment topology. No production service, domain, DNS, TLS endpoint, database, mail account, or monitoring target is configured or certified here.

## Topology

Expose only the standalone Next.js frontend through a TLS reverse proxy. Keep FastAPI and PostgreSQL on a private network with no public routes. Compose binds the frontend to loopback for a separate proxy. The proxy must overwrite the client address header selected for rate limiting, cap request sizes, and prevent direct access to private services.

The frontend forwards same-origin contact submissions to FastAPI using a server-only token. PostgreSQL stores inquiries. SMTP is optional; if it is not configured, assign an operator to review pending submissions.

## Configuration

Set production values in the deployment platform's secret/configuration store:

- `NEXT_PUBLIC_SITE_URL`: the canonical HTTPS origin; provide it at frontend build and runtime.
- `DATABASE_URL`: PostgreSQL connection for the API. Use a restricted runtime role.
- `MIGRATION_DATABASE_URL`: optional separate migration connection when the platform supports it.
- `CONTACT_INTERNAL_TOKEN`: random value of at least 32 characters, shared only by the frontend and API.
- `BUILD_REVISION`: full Git commit for both services.
- `APP_ENV=production`: enables API checks that reject SQLite, weak tokens, and unknown revisions.
- `POSTGRES_PASSWORD`: database bootstrap value when using the included Compose database.
- `CONTACT_CLIENT_IP_HEADER`: set only when the trusted proxy overwrites the selected header.
- `CONTACT_ALLOWED_ORIGIN`: optional exact origin override; do not use wildcard or multiple origins.
- `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASSWORD`, `EMAIL_FROM`, `EMAIL_TO`: optional notification delivery.

Frontend image builds reject a missing or non-HTTPS canonical URL unless the explicit insecure build option is enabled for local checks. The API fails startup in production when its database, token, or revision requirements are not met. Keep secrets out of build arguments, source control, and public browser variables.

## Release procedure

1. Require the quality workflow to pass for the exact release commit.
2. Create a database backup, record its checksum, and restore it into an isolated database before migration.
3. Build immutable frontend and backend images from the same commit; configure the canonical URL at frontend build time.
4. Start exactly one migration executor with the migration role. The backend image runs `alembic upgrade head` before Uvicorn; use `MIGRATION_DATABASE_URL` for a separate migration credential. Then start the private API and public frontend.
5. Confirm `/health/ready` and `/api/health`, public routes, response security headers, canonical metadata, sitemap, and social preview.
6. Submit one clearly labeled contact test. Confirm persistence and either notification delivery or the pending-review path.
7. Run `PRODUCTION_URL=https://example.com EXPECTED_REVISION=<commit> bash scripts/production-smoke.sh` with the real origin and revision.
8. Verify the restored database and the production monitor before closing the release.

## Recovery and operations

Keep the previous image digests and a tested pre-release backup available. The PostgreSQL verification script exercises a dump-and-restore path locally; production recovery still requires a successful restore of the deployed database. Record backup time, checksum, restored revision, read check, and operator.

Review readiness, inquiry backlog, mail failures, error rates, storage, and backups regularly. Run `cd backend && uv run python -m app.maintenance pending` in a private shell because output contains email addresses. Schedule `cd backend && uv run python -m app.maintenance purge --days 90` and align the privacy notice and backup expiry with the chosen retention period.

No hosting provider or production change is implied by the repository's local checks. Confirm the origin, proxy policy, database credentials, secret store, contact operations, backup schedule, alerts, and rollback owner before deployment.
