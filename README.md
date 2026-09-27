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
render.yaml         Render web/API/email worker/backup service blueprint
Makefile            Local development and release verification commands
```

## Local development

Requirements: Node.js 24, npm, Python 3.12, uv, Docker and Make.

```sh
cp .env.example .env
make install
make dev
```

The example values are for local use only. `make dev` starts PostgreSQL and Mailpit, applies migrations, and starts the frontend, API, and durable outbox worker. Open `http://localhost:3000`; inspect captured test mail at `http://localhost:8025`. Mailpit is loopback-only and never relays mail. Stop the services with `make compose-down`.

## Release verification

Run `make verify` from the repository root. It checks formatting, lint, strict TypeScript, unit/API/PostgreSQL tests, migrations and drift, browser and accessibility flows, dependency and secret scans, Docker builds, production-like Compose behavior, contact persistence/origin/rate limits, local PostgreSQL→outbox→Mailpit delivery and replay idempotency, and a backup restored into an isolated database. This is local evidence; it does not establish a live deployment or delivery to a real mailbox.

## Production

Render is the prepared target and `https://ajmiraribam.me` is the intended canonical origin. Production configuration is fail-closed. The API and separate email worker share a PostgreSQL runtime role and a durable, idempotent outbox. An inquiry succeeds only after the inquiry and pending notification are committed together; it never claims the owner notification was sent. Configure TLS SMTP on both services with `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASSWORD`, `EMAIL_FROM`, `EMAIL_TO` and `EMAIL_USE_TLS=true`. If mail is absent, database readiness remains distinct and reports `email_delivery: not_configured`; outbox rows remain inspectable and recoverable. The scheduled backup needs a private S3 bucket, KMS key and narrowly scoped AWS credentials.

See [deployment](docs/deployment.md), [contact delivery](docs/contact-delivery.md) and [operations](docs/operations.md) for Render setup, DNS, secrets, migrations, backup recovery, email operations, monitoring and rollback. Do not treat repository configuration or passing local checks as proof that DNS, TLS, backups, alerts, real email or production are active.

## Project documentation

[Architecture](docs/architecture.md) · [Development](docs/development.md) · [Testing](docs/testing.md) · [Deployment](docs/deployment.md) · [Contact delivery](docs/contact-delivery.md) · [Operations](docs/operations.md) · [Security](docs/security.md) · [Release certification](RELEASE_CERTIFICATION.md)
