# Ajmir Aribam — Software Engineering Portfolio

This repository contains Ajmir Aribam’s portfolio: a Next.js frontend for public pages and a small FastAPI service for contact persistence and operational health checks.

## Architecture

```text
frontend/
├── src/
│   ├── app/          # Routes, metadata, and route handlers
│   ├── components/   # Shared layout and page components
│   ├── content/      # Project records and editorial content
│   ├── features/     # Contact, résumé, and telemetry behavior
│   └── lib/          # Shared frontend utilities
├── public/           # Brand, portrait, and project assets
├── tests/
│   ├── e2e/
│   └── unit/
├── package.json
├── playwright.config.ts
├── tsconfig.json
├── next.config.ts
└── Dockerfile

backend/
├── app/
│   ├── api/          # Private inquiry and health routes
│   ├── core/         # Configuration and logging
│   ├── db/           # SQLAlchemy database and models
│   ├── schemas/      # Request validation
│   └── services/     # Inquiry and notification logic
├── migrations/
├── tests/
├── pyproject.toml
├── uv.lock
├── alembic.ini
└── Dockerfile
```

The applications communicate over HTTP. Root Compose, Make, CI, and scripts coordinate local development and verification.

## Technology

- **Frontend:** Next.js 16, React 19, TypeScript, CSS Modules and global CSS.
- **Frontend quality:** Vitest, Playwright, axe-core, ESLint and Prettier.
- **Backend:** FastAPI, Pydantic, SQLAlchemy, Alembic, PostgreSQL and psycopg.
- **Backend quality:** pytest and Ruff.
- **Infrastructure:** Docker, Compose, GitHub Actions and uv.

## Local development

Requirements: Node.js 24, npm, Python 3.12, uv, Docker and Make.

```sh
cp .env.example .env
make install
make dev
```

The example file contains local-only placeholders. `make dev` starts PostgreSQL, applies migrations and runs both applications. Open `http://localhost:3000`. Stop the database with `make compose-down` when finished.

## Verification

Run `make verify` for formatting, lint, TypeScript, frontend and backend tests, PostgreSQL migration and restore checks, Playwright and accessibility checks, dependency and secret scans, production image builds, and the Compose contact/origin smoke test.

## Production configuration

Production requires a canonical HTTPS `NEXT_PUBLIC_SITE_URL`, PostgreSQL `DATABASE_URL`, a random `CONTACT_INTERNAL_TOKEN` of at least 32 characters, `BUILD_REVISION`, and `APP_ENV=production` for the API. Optional notification delivery uses the `EMAIL_*` variables. Configure secrets in the deployment environment; do not put production credentials in `.env.example` or Git.

## Deployment

See [deployment](docs/deployment.md). Local verification does not establish a production deployment.

## Security & privacy

The browser submits inquiries to the same-origin frontend route; the API and database remain private in Compose. The backend validates and persists messages before reporting success. Logs omit message bodies and email addresses. See [security](docs/security.md).

## Documentation

[Architecture](docs/architecture.md) · [Development](docs/development.md) · [Testing](docs/testing.md) · [Deployment](docs/deployment.md) · [Security](docs/security.md) · [Release certification](docs/release-certification.md)
