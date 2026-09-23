# Architecture

## Runtime boundaries

```text
Browser
  ├─ GET pages → Next.js App Router (server-rendered content)
  ├─ POST /api/contact → Next route handler → private FastAPI /inquiries
  └─ POST /api/telemetry → Next route handler → structured operational log

FastAPI /inquiries → SQLAlchemy → PostgreSQL inquiries + rate_windows
                    → optional SMTP notification after commit
```

Next owns the public origin, content rendering, metadata, security headers, and the browser form. FastAPI is private on the Compose network and requires a shared internal token for writes. PostgreSQL is authoritative for submissions. Optional SMTP is a notification channel; a stored inquiry is the success condition. If SMTP fails, the record remains pending for operator review.

The browser does not talk directly to FastAPI, so no cross-origin browser API is necessary. The Next route handler limits body size, checks origin when present, forwards a request ID, and normalizes service errors. Deployment must make the reverse proxy overwrite client IP headers before they reach Next; otherwise an attacker could rotate the throttle identity. The database is never published from Compose.

## Rendering and content

Case study data lives in `src/content/projects.ts`. It includes sources and `TODO_OWNER_VERIFY` markers. Most UI is server-rendered. Client code is limited to theme preference, form behavior, and first-party web-vitals reporting. The portrait is a faithful JPEG conversion of the supplied photo. Diagrams map inspected code boundaries and explicitly avoid claiming live deployment topology.

## Data and lifecycle

Alembic owns schema changes. The API validates and trims input with Pydantic, discards a filled honeypot, applies a database-backed 15-minute window, commits the inquiry, then attempts SMTP. A failure during persistence returns an error; a notification failure leaves an inspectable pending record. Maintenance commands list pending records and purge old inquiries and throttle windows. A production scheduler must run retention purge daily.

## Observability

The API emits structured events keyed by request ID without logging message bodies or email addresses. `/health/live` identifies the process and revision; `/health/ready` checks schema/data access. Web `/api/health` checks API readiness. Browser exceptions are reduced to error type; LCP, INP and CLS samples are sent first-party to `/api/telemetry` and written as structured logs. Production needs a log sink, alert thresholds and field analysis; logging code alone is not a monitoring service.
