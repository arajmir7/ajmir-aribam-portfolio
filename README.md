# MD Ajmir Aribam — engineering portfolio

An evidence-led portfolio with three source-grounded case studies, an engineering capability map, writing, and a persisted contact inquiry flow. The web app is Next.js 16 / React 19 / strict TypeScript. A private FastAPI service owns inquiry validation, throttling, and PostgreSQL persistence.

## Local start

Requirements: Node 24+, npm 11+, Python 3.12+, [uv](https://docs.astral.sh/uv/), and optionally Docker.

```sh
npm ci
cd api && uv sync --group dev && DATABASE_URL=sqlite:///./portfolio.db uv run alembic upgrade head
```

In one terminal:

```sh
cd api
DATABASE_URL=sqlite:///./portfolio.db CONTACT_INTERNAL_TOKEN=local-development-token-at-least-32-characters uv run uvicorn app.main:app --reload --port 8000
```

In another terminal:

```sh
NEXT_PUBLIC_SITE_URL=http://localhost:3000 CONTACT_API_URL=http://localhost:8000 CONTACT_INTERNAL_TOKEN=local-development-token-at-least-32-characters npm run dev
```

Open `http://localhost:3000`. The contact form commits to local SQLite. Without configured SMTP, records remain `pending` and can be reviewed with `cd api && uv run python -m app.maintenance pending`. Never use that command in a public shell/session.

## Verify

```sh
npm run format:check
npm run lint
npm run typecheck
npm run test
npm run build
npm run e2e
cd api && uv run ruff check . && uv run ruff format --check . && uv run pytest -q
cd api && DATABASE_URL=sqlite:///./migration-check.db uv run alembic upgrade head
```

The browser suite starts its own API and web servers. `npx playwright install chromium` is needed once. A PostgreSQL integration test runs when `TEST_DATABASE_URL` is set. The CI workflow supplies a PostgreSQL service.

## Deploy

`compose.yaml` builds a local topology with PostgreSQL, private API and web service. Put a trusted TLS reverse proxy in front of the bound `127.0.0.1:3000` web port. Set `NEXT_PUBLIC_SITE_URL` to the real HTTPS domain, a strong `CONTACT_INTERNAL_TOKEN`, `POSTGRES_PASSWORD`, and SMTP variables through a secret manager. Never commit actual values. The API is intentionally not published. See [OPERATIONS.md](OPERATIONS.md) for readiness, backup, retention and rollback requirements.

## Evidence and constraints

[PORTFOLIO_SPEC.md](PORTFOLIO_SPEC.md) records inspected sources and claim confidence. [ARCHITECTURE.md](ARCHITECTURE.md) and [SECURITY.md](SECURITY.md) describe the implemented boundaries. Production deployment, field performance, SMTP delivery and external recovery operations are not claimed until verified.

[RELEASE_CERTIFICATION.md](RELEASE_CERTIFICATION.md) records the local verification results and the remaining production gates.
