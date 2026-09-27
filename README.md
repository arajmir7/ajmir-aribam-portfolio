# Ajmir Aribam — portfolio

Personal portfolio built with Next.js and a private FastAPI contact service. Production is designed for one Vercel Services project, Neon PostgreSQL, and Resend at `https://ajmiraribam.me`.

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

The repository is prepared for one Vercel project configured with Framework Preset **Services** and `vercel.json` at the repository root. Vercel Services and private bindings require account access to that feature. Add Neon and Resend resources separately, configure only the environment variables in [deployment](docs/deployment.md), apply migrations from a trusted operator shell, then add `ajmiraribam.me` and `www.ajmiraribam.me` using the exact DNS records shown by Vercel. This repository does not provision cloud resources, set DNS, or deploy.

Production environment variables, deployment order, migration commands, domain setup, and rollback steps are in [deployment](docs/deployment.md). Email delivery and retry procedures are in [contact delivery](docs/contact-delivery.md) and [operations](docs/operations.md). Security boundaries are documented in [security](docs/security.md); failure diagnosis is in [troubleshooting](docs/troubleshooting.md).

After deployment, run:

```sh
PRODUCTION_URL=https://ajmiraribam.me EXPECTED_REVISION=<full-commit-sha> bash scripts/production-smoke.sh
```

This checks public routes, canonical redirects, security headers, health/revision, assets, and invalid contact requests. A real email test is an explicit owner action.
