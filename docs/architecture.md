# Architecture

## Application boundaries

`frontend/` owns Next.js routes, public content, shared presentation, assets, contact forwarding, résumé behavior and browser tests. `backend/` owns the private FastAPI inquiry API, configuration, database models, persistence, maintenance commands, migrations and API tests. The applications integrate over HTTP; neither imports the other's implementation.

```text
Browser → Next.js pages and same-origin route handlers
                    ├─ /api/contact → private FastAPI /inquiries
                    └─ /api/health  → private FastAPI /health/ready
                                             ↓
                                        PostgreSQL
```

The public `/api/contact` route and private `/inquiries`, `/health/live`, and `/health/ready` contracts are stable. Next.js validates the exact origin and forwards a server-only token and a proxy-derived address. FastAPI performs authoritative validation and a PostgreSQL-backed rate check, then persists before returning success. SMTP notification is optional and happens after persistence; failure leaves a pending inquiry for operator review.

## Database roles and migrations

`MIGRATION_DATABASE_URL` is reserved for Alembic and pre-deploy maintenance. `DATABASE_URL` (or the derived runtime URL for local Compose) is used by API requests under a distinct runtime role. The maintenance task grants only database connection, schema usage, table DML and sequence access to that role, including defaults for future migration-created objects. Production checks reject identical usernames and incomplete/weak PostgreSQL credentials. Compose creates the local role from disposable development secrets; Render role creation depends on the managed database credential's actual permissions and must be proven before launch.

Migrations are run explicitly before application start: by Render's paid pre-deploy command or `make compose-up`. The API container starts only Uvicorn, so multiple app replicas cannot race on startup migrations. Production schema changes must support the current and previous application version during a rolling deploy.

## Runtime and repository layout

In `frontend/src`, `app/` defines routes, `components/` contains reusable UI, `content/` holds evidence-backed project/editorial data, `features/` groups interactive functions, and `lib/` contains shared utilities. `backend/app` separates HTTP routes, core settings, SQLAlchemy setup/models, schemas and services; `backend/migrations/` contains Alembic history.

`compose.yaml` describes the production-like local topology. `infra/compose.dev.yaml` supports host-based development. `infra/backup/` builds the backup job container. `render.yaml` describes the Render services. `scripts/` contains disposable PostgreSQL/Compose verification, production smoke checks, and backup/restore commands. `.github/workflows/ci.yml` is the release quality gate; `production-monitor.yml` is an optional scheduled public smoke workflow after owner configuration.

## Content evidence

Project records are maintained in `frontend/src/content/projects.ts`; case narratives are in `frontend/src/content/case-stories.ts`. Public claims are limited to inspectable evidence. Unknown ownership, deployment and outcome facts remain qualified in source and are not presented as verified. Project diagrams describe application boundaries, not an asserted production topology.
