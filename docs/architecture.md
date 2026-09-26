# Architecture

## Application boundaries

`frontend/` owns the Next.js App Router, public content, visual components, assets, contact form, résumé behavior, and browser tests. `backend/` owns the private FastAPI inquiry API, configuration, persistence, migrations, maintenance commands, and API tests. The applications integrate over HTTP; neither imports the other's implementation.

```text
Browser → Next.js pages and same-origin route handlers
                   ├─ /api/contact → private FastAPI /inquiries
                   └─ /api/health  → private FastAPI /health/ready
                                            ↓
                                       PostgreSQL
```

The frontend handles page rendering, metadata, security headers, and the browser form. FastAPI validates and stores inquiries. PostgreSQL is the source of truth; optional SMTP sends a notification after commit. A failed notification leaves a pending record for operator review.

## Source layout

In `frontend/src`, `app/` defines routes, `components/` contains reusable presentation, `content/` holds project and writing records, `features/` groups interactive functions, and `lib/` contains shared utilities. In `backend/app`, `api/` handles HTTP, `core/` owns configuration and logging, `db/` contains SQLAlchemy setup and models, `schemas/` validates input, and `services/` handles inquiries and notifications. Alembic migrations live under `backend/migrations/`.

Root `compose.yaml` describes the deployable service topology. `infra/compose.dev.yaml` exposes PostgreSQL to host processes for development. `scripts/` contains repeatable PostgreSQL and Compose checks and the production smoke command.

## Request and data lifecycle

The browser posts JSON to `/api/contact`. The Next.js handler checks the request origin, bounds the body, adds a request ID, and forwards the submission with a server-only token. FastAPI validates fields, discards honeypot submissions, applies a database-backed rate limit, and commits the inquiry. The response indicates success only after persistence. SMTP is best effort; a scheduled operator process must review pending notifications and enforce retention.

Health endpoints distinguish process liveness, database readiness, and public web readiness. Structured logs use request IDs and omit message bodies and email addresses. Telemetry is first party and does not include contact content.

## Content evidence

Project records are maintained in `frontend/src/content/projects.ts`; case narratives are in `frontend/src/content/case-stories.ts`. Public claims are limited to inspectable evidence. Ownership, deployment, and outcome details that are not confirmed remain qualified in the source and are not presented as verified facts. Project diagrams describe application boundaries, not production topology.
