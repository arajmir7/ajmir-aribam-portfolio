# Ajmir Aribam — engineering portfolio

An evidence-led portfolio with nine source-grounded project records, a capability map across backend, cloud, AI systems, and quality engineering, one engineering note, and a persisted inquiry flow. Live work, in-development systems, and prototypes are grouped by evidence maturity. The repository has two application boundaries:

| Path        | Responsibility                                                                                                       |
| ----------- | -------------------------------------------------------------------------------------------------------------------- |
| `frontend/` | Next.js 16, React 19, strict TypeScript, public routes, content, assets, browser behavior, frontend tests.           |
| `backend/`  | Private FastAPI inquiry API, Pydantic input, SQLAlchemy persistence, Alembic migrations, API tests, maintenance CLI. |
| `docs/`     | Architecture, security, operations, and decisions.                                                                   |
| `infra/`    | Local-only Compose override for exposing PostgreSQL to a host development process.                                   |
| `scripts/`  | Repeatable local development, isolated PostgreSQL/Compose verification, and production smoke testing.                |

Frontend and backend communicate over HTTP. The browser uses the same-origin `/api/contact` route; the private backend keeps its `/inquiries`, `/health/live`, and `/health/ready` contracts. No cross-application source imports or generated API client are needed for this single private request shape.

## Local development

Requirements: Node 24+, npm 11+, Python 3.12+, [uv](https://docs.astral.sh/uv/), Docker, and GNU Make. On macOS, the system `make` is sufficient.

```sh
cp .env.example .env
# Set a local POSTGRES_PASSWORD and the matching password in DATABASE_URL.
# Replace CONTACT_INTERNAL_TOKEN with at least 32 random characters.
make install
make dev
```

`make dev` starts the local PostgreSQL service using `infra/compose.dev.yaml`, applies migrations, and runs both applications with reload. Open `http://localhost:3000`. `Ctrl-C` stops the host application processes; `make compose-down` stops the database container without deleting its data. The production Compose stack binds only the frontend on localhost and does not expose the database or private API.

Without SMTP configuration, contact inquiries commit to the database and remain `pending`. Review them from a private shell with `cd backend && uv run python -m app.maintenance pending`; that command prints email addresses and must not run in public logs.

## Verification

Run the complete local gate with `make verify`. It covers format, lint, types, frontend and backend tests, a fresh isolated PostgreSQL migration/integration test, production build, browser journeys, accessibility, dependency/secret scans, both Docker builds, and an isolated Compose readiness/contact smoke test. The scripts use disposable Docker resources and remove them afterward. Install the Playwright browser once with `cd frontend && npx playwright install chromium`.

Individual commands: `make test`, `make lint`, `make typecheck`, `make e2e`, `make build`, `make security`, `make compose-up`, and `make compose-down`. `make compose-up` uses `.env` and starts the deployable topology; it is not a public deployment.

## Deployment boundary

Set `NEXT_PUBLIC_SITE_URL` to the real HTTPS origin and provide a trusted TLS reverse proxy that overwrites forwarded IP headers. Supply production PostgreSQL credentials, secret storage, SMTP or a staffed pending-inquiry process, backup/restore, retention scheduling, and alerts. See [production deployment](docs/production-deployment.md), [operations](docs/operations.md) and [security](docs/security.md). No production deployment is claimed here.

The [portfolio specification](PORTFOLIO_SPEC.md) records evidence confidence. The [frontend reinvention review](docs/quality/FRONTEND_REINVENTION_REVIEW.md) documents the new identity, responsive review and local performance results. The [architecture](docs/architecture.md), [decisions](docs/decisions.md), [implementation plan](IMPLEMENTATION_PLAN.md), and [release certification](RELEASE_CERTIFICATION.md) explain the system and its verified limits.
