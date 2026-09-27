# Ajmir Aribam — portfolio

Personal portfolio built with Next.js and a private FastAPI contact service. Production is designed for one Vercel Services project, Neon PostgreSQL, and Resend at `https://ajmiraribam.me`.

**Live portfolio:** <https://ajmiraribam.me>

## Architecture

The browser uses the public Next.js app and same-origin `/api/contact`. The frontend calls FastAPI through a Vercel service binding; the backend has no public route. FastAPI persists inquiries and email outbox records in Neon, then calls Resend. Runtime database access uses Neon’s pooled endpoint; schema migrations use a separate direct operator connection.

## Repository

```text
frontend/   Next.js pages, components, API routes, and browser tests
backend/    FastAPI app, SQLAlchemy models, Alembic migrations, and API tests
docs/       Architecture, development, deployment, security, and operations
scripts/    Local database, contact QA, backup/restore, and production smoke tools
infra/      Local-only Compose overrides
.github/    CI and optional public production monitoring
vercel.json Vercel Services definitions and private service binding
```

## Stack

- Next.js 16, React 19, TypeScript, Vitest, Playwright, axe-core
- FastAPI, Pydantic, SQLAlchemy, Alembic, PostgreSQL, pytest, Ruff
- Vercel Services, Neon PostgreSQL, Resend

## Local development

Install Node.js 24, Python 3.12+, `uv`, and Docker Compose. Copy `.env.example` to `.env`, replace local token/password placeholders, then run:

```sh
make install
make dev
```

The local PostgreSQL service binds only to loopback. Local email credentials are removed by the development launcher. See [development](docs/development.md) and [architecture](docs/architecture.md).

## Verification

Run the repository release gate with `make verify`. It includes format/lint/type checks, frontend and backend tests, local PostgreSQL migrations and integration, browser accessibility/responsive checks, production build, dependency and history-secret audits, mocked email, and backup/restore checks. It does not access production accounts or send real email. See [development](docs/development.md).

## Production setup

Production is deployed at <https://ajmiraribam.me> on Vercel Services, with a private FastAPI service, Neon PostgreSQL and Resend. The frontend reaches the backend through a private Vercel service binding. Deployment, configuration, migration and rollback procedures are documented in [deployment](docs/deployment.md); delivery and retry procedures are in [contact delivery](docs/contact-delivery.md) and [operations](docs/operations.md).

Security boundaries are documented in [security](docs/security.md); failure diagnosis is in [troubleshooting](docs/troubleshooting.md).

After deployment, run:

```sh
PRODUCTION_URL=https://ajmiraribam.me EXPECTED_REVISION=<full-commit-sha> bash scripts/production-smoke.sh
```

This checks public routes, canonical redirects, security headers, health/revision, assets, and invalid contact requests. A real email test is an explicit owner action.
