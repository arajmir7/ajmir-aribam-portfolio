# Ajmir Aribam — Software Engineering Portfolio

Next.js portfolio frontend and private FastAPI inquiry service, backed by PostgreSQL. The two applications communicate over HTTP; the API and database are never exposed as public web services.

## Repository layout

```text
frontend/          Next.js routes, content, assets, unit and browser tests
backend/           FastAPI API, persistence, Alembic migrations and API tests
docs/              Architecture, security, deployment and release runbooks
infra/              Development Compose and backup container
.github/workflows/  CI quality gate and optional scheduled production smoke
scripts/            Development, production smoke, PostgreSQL and Compose checks
compose.yaml        Local production-like service topology
render.yaml         Render web/API/backup service blueprint
Makefile            Local development and release verification commands
```

## Local development

Requirements: Node.js 24, npm, Python 3.12, uv, Docker and Make.

```sh
cp .env.example .env
make install
make dev
```

The example values are for local use only. `make dev` starts the local PostgreSQL service, applies migrations, and starts the frontend and API. Open `http://localhost:3000`. Stop the services with `make compose-down`.

## Release verification

Run `make verify` from the repository root. It checks formatting, lint, strict TypeScript, unit/API/PostgreSQL tests, migrations and drift, browser and accessibility flows, dependency and secret scans, Docker builds, production-like Compose behavior, contact persistence/origin/rate limits, and a backup restored into an isolated database. This is local evidence; it does not establish a live deployment.

## Production

Render is the prepared target and `https://ajmiraribam.me` is the intended canonical origin. Production configuration is fail-closed. The API needs `APP_ENV=production`, PostgreSQL `MIGRATION_DATABASE_URL` and a separate runtime database account, `CONTACT_INTERNAL_TOKEN`, and a Git commit `BUILD_REVISION`. The web service needs `NEXT_PUBLIC_SITE_URL=https://ajmiraribam.me`, the exact `CONTACT_ALLOWED_ORIGIN`, private API host/port, trusted proxy header, token and commit revision. The scheduled backup needs a private S3 bucket, KMS key and narrowly scoped AWS credentials. SMTP variables are optional; inquiry success means database persistence, not email delivery.

See [deployment](docs/deployment.md) and [operations](docs/operations.md) for Render setup, DNS, secrets, migrations, backup recovery, monitoring and rollback. Do not treat repository configuration or passing local checks as proof that DNS, TLS, backups, alerts or production are active.

## Project documentation

[Architecture](docs/architecture.md) · [Development](docs/development.md) · [Testing](docs/testing.md) · [Deployment](docs/deployment.md) · [Operations](docs/operations.md) · [Security](docs/security.md) · [Release certification](RELEASE_CERTIFICATION.md)
