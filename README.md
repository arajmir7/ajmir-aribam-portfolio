# Ajmir Aribam Portfolio

An approved Next.js portfolio repository with a FastAPI contact service configured for PostgreSQL persistence and Resend transactional email. The migration changes deployment and operations only; it preserves the public presentation, routes, and project content.

## Architecture and technology

- **Frontend:** Next.js 16, React 19, TypeScript; deployment target is a Vercel frontend project.
- **Backend:** FastAPI; deployment target is Vercel's Python runtime at `api.ajmiraribam.me`.
- **Database:** Neon PostgreSQL with TLS, pooled runtime connections, and Alembic migrations.
- **Email:** Resend HTTPS API with a persisted, idempotent delivery outbox.
- **Verification:** GitHub Actions, Vitest, pytest, PostgreSQL, Playwright, accessibility checks, dependency audits, and secret scanning.

## Repository structure

- `frontend/` — pages, public content, assets, and browser/unit tests
- `backend/` — API, persistence, Alembic migrations, and API tests
- `docs/` — architecture, deployment, security, development, and operations
- `infra/` — local PostgreSQL Compose and backup utility image
- `.github/workflows/` — CI release gate and optional public smoke workflow
- `scripts/` — local development, verification, smoke, backup, and restore tools
- `compose.yaml`, `.env.example`, and `Makefile` — local operations

## Local development

Requirements: Node.js 24, npm, Python 3.12, uv, Docker, and Make.

```sh
cp .env.example .env
# Replace the local PostgreSQL password and internal-token placeholders.
make install
make dev
```

`make dev` starts local PostgreSQL, applies migrations, and launches Next.js and FastAPI. The local email check uses a loopback fake Resend server and never sends real mail. Visit `http://127.0.0.1:3000`; `make compose-down` stops PostgreSQL.

## Environment and database migrations

`.env.example` documents local-only values. Configure production secrets in Vercel's encrypted environment settings; keep `NEXT_PUBLIC_*` values public. Migrations run explicitly, never at API startup: `cd backend && uv run alembic upgrade head`. Use a trusted local environment for the direct Neon migration URI; keep it out of Vercel runtime settings and logs.

## Contact delivery

FastAPI commits the inquiry and its outbox record before attempting Resend. A successful form response confirms durable storage, not email receipt. Provider failures remain stored and retryable; an accepted provider message ID is recorded. Real-provider smoke is opt-in and requires `resend-smoke --confirm-send`. See [contact delivery](docs/contact-delivery.md).

## Verification

`make verify` runs formatting, lint, strict TypeScript, unit/API/PostgreSQL tests, migration/drift checks, production frontend build, browser/accessibility/responsive tests, dependency and secret scans, Compose contact checks, mocked Resend success/failure/replay, PostgreSQL backup and isolated restore, and `git diff --check`. These are local results; they do not prove account setup, live email, production uptime, or field performance.

## Deployment, security, and operations

The intended host is Vercel, with `ajmiraribam.me` as the HTTPS canonical origin, Neon PostgreSQL, and Resend. The frontend and FastAPI are prepared as separate Vercel projects in this monorepo; account configuration and deployment remain outstanding. Copy DNS records from Vercel's project domain settings. Production configuration fails closed when required settings are absent. Read [deployment](docs/deployment.md), [security](docs/security.md), [operations](docs/operations.md), [testing](docs/testing.md), and [release certification](RELEASE_CERTIFICATION.md). No deployment, DNS change, live backup, external alert, or real email delivery is claimed here.
