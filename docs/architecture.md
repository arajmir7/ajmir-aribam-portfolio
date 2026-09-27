# Architecture

`frontend/` is the public Next.js application; `backend/` is a separate FastAPI service. They deploy as separate Vercel projects from this monorepo. The browser calls only same-origin Next.js route handlers. Those server routes call FastAPI at `api.ajmiraribam.me` with a server-only token. The backend connects to Neon and Resend.

```text
Browser → Vercel / Next.js → same-origin /api/contact
                                  │ server-only token
                                  ▼
                       Vercel / FastAPI (api subdomain)
                          ├── Neon PostgreSQL
                          └── Resend HTTPS API
```

The frontend checks exact Origin and request size, then forwards a request ID, idempotency key, and Vercel-derived client address. FastAPI validates again, enforces a PostgreSQL-backed rate window, and commits the inquiry and unique `email_deliveries` row in one transaction. It attempts Resend only after commit. Contact success means the inquiry was stored; it does not claim mailbox delivery.

Outbox rows track `pending`, `attempting`, `sent`, or `failed`, attempt count, retry time, a safe error code, timestamps, and Resend message ID when accepted. Row locks prevent simultaneous claims. Each email uses a stable Resend idempotency key. Provider retention is time-limited, so exactly-once delivery across arbitrary delays is not promised. There is no always-running worker: delivery is attempted during the request, with explicit operator retry/dispatch commands for recovery.

`DATABASE_URL` is the pooled Neon TLS URI used at runtime. `MIGRATION_DATABASE_URL` is an optional direct connection used only by trusted-shell Alembic commands; it is not a Vercel runtime secret. Use separate Neon migration and application roles. Migrations are explicit, not run at application startup.

In `frontend/src`, `app/` defines routes, `components/` contains shared UI, `content/` holds approved public copy/project data, `features/` groups interactive behavior, and `lib/` contains utilities. `backend/app` separates routes, configuration, database models, schemas, and services; `backend/migrations/` holds Alembic history. `compose.yaml` is local PostgreSQL; scripts verify the API, email, database, backup, restore, and public smoke behavior. CI is in `.github/workflows/ci.yml`.

Project records and case narratives remain in `frontend/src/content/`. This infrastructure migration does not add production claims to project content.
