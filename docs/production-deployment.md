# Production deployment

## Topology and trust boundaries

Deploy the standalone Next.js image as the only public service. Route one HTTPS origin to it and redirect every alternate hostname and HTTP request to that origin. Deploy FastAPI on a private service network and PostgreSQL on a private managed database. Neither FastAPI nor PostgreSQL may have a public route.

The TLS proxy must replace the selected client address header. Set `CONTACT_CLIENT_IP_HEADER` to `x-real-ip` or `x-forwarded-for` only after confirming that behavior. The Next.js service forwards a derived address and its internal token to FastAPI; the browser never receives that token.

## Release inputs

- Final HTTPS origin, including the canonical choice between apex and `www`
- TLS and DNS control
- Immutable frontend and backend images built from one commit
- Managed PostgreSQL runtime role and separate migration role where supported
- Random `CONTACT_INTERNAL_TOKEN` of at least 32 characters, shared only by the two application services
- SMTP credentials or a named operator and schedule for the persisted inquiry queue
- Backup retention and alert destinations

Set `NEXT_PUBLIC_SITE_URL` at frontend image build time and at runtime. Set `CONTACT_ALLOWED_ORIGIN` only when it must explicitly mirror the same origin. Set `BUILD_REVISION` to the full Git commit in both services. The backend runs with `APP_ENV=production` and refuses SQLite, a weak internal token, or an unknown revision.

## Release procedure

1. Require a successful `quality-gate` run for the release commit. Record its run URL.
2. Back up the current database with `pg_dump --format=custom`, record a SHA-256 checksum, and restore it into an isolated database. Run a read check before changing production.
3. Build both images at the release commit. Pass the canonical HTTPS origin to the frontend build.
4. Run `alembic upgrade head` once with `MIGRATION_DATABASE_URL`. Record `uv run alembic current`.
5. Start or update the private API, then the public frontend. Wait for `/health/ready` and `/api/health`.
6. Run `PRODUCTION_URL=https://example.com EXPECTED_REVISION=<commit> bash scripts/production-smoke.sh`, substituting the real origin.
7. Submit one clearly labeled contact test from the browser. Confirm its request ID in the persisted inquiry queue and either its notification status or the pending recovery path.
8. Inspect all public routes at 390, 768, 1440 and 1728 px in both themes. Record any physical-device or screen-reader review separately.
9. Set the GitHub repository variables `PRODUCTION_URL` and `PRODUCTION_REVISION`. Confirm the `production-monitor` workflow succeeds and route its failed-run notification to the operator.

## Backup and restore

Use encrypted managed snapshots and an independent PostgreSQL custom-format export. Keep backup credentials separate from the runtime role. To prove recovery, create an isolated target database, run `pg_restore --exit-on-error --no-owner --dbname "$RESTORE_DATABASE_URL" backup.dump`, verify the Alembic revision and a known marker record, then destroy the target. `scripts/verify-postgres.sh` exercises the same dump-and-restore mechanism against a disposable database in local and hosted CI.

Record backup time, checksum, restore target, restored revision, read-check result, duration and operator. A completed backup without a successful isolated restore is not recovery evidence.

## Rollback

Keep the previous frontend and backend image digests until the release is accepted. If the application fails after deployment:

1. Stop new contact writes if data integrity is uncertain.
2. Roll both services back to their previous image digests and keep the current database when the previous code is compatible with the migrated schema.
3. If the migration is incompatible, put the public contact path into an unavailable state with direct email visible, restore the pre-release backup into a new database, point the previous API image at that database, and verify readiness before resuming writes.
4. Run the production smoke script against the recovered origin and submit one labeled contact test.
5. Preserve request IDs and sanitized logs. Record the failed and restored revisions, database decision and recovery time.

Alembic migrations in this repository are forward migrations. Do not improvise a destructive schema downgrade during an incident.
