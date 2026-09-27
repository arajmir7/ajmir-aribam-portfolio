# Architecture

`frontend/` is the public Next.js application and `backend/` is a private FastAPI service. Both are services in one Vercel project and share a deployment revision. The frontend declares a service binding that injects `CONTACT_API_URL` for server-side calls. No public rewrite targets the backend. The browser calls only same-origin Next.js route handlers. FastAPI connects to Neon and Resend.

```text
Browser → ajmiraribam.me → Vercel Services
                               ├── frontend: Next.js, public
                               │       └── /api/contact
                               │             └── private service binding + token
                               └── backend: FastAPI, private
                                       ├── Neon PostgreSQL
                                       └── Resend HTTPS API
```

The frontend checks exact Origin and a streamed request-size limit, then forwards a request ID, idempotency key, and a single trusted Vercel client address. FastAPI validates again, enforces a PostgreSQL-backed rate window, and commits the inquiry and unique `email_deliveries` row in one transaction. It attempts Resend only after commit. Contact success means the inquiry was stored; it does not claim mailbox delivery.

Outbox rows track `pending`, `attempting`, `sent`, or `failed`, attempt count, retry time, a safe error code, timestamps, and Resend message ID when accepted. Row locks prevent simultaneous claims. Each email uses a stable Resend idempotency key. Provider retention is time-limited, so exactly-once delivery across arbitrary delays is not promised. There is no always-running worker: delivery is attempted during the request, with explicit operator retry/dispatch commands for recovery.

`DATABASE_URL` is the pooled Neon TLS URI used at runtime. `MIGRATION_DATABASE_URL` is an optional direct connection used only by trusted-shell Alembic commands; it is not a Vercel runtime secret. Use separate Neon migration and application roles. Migrations are explicit, not run at application startup.

In `frontend/src`, `app/` defines routes, `components/` contains shared UI, `content/` holds approved public copy/project data, `features/` groups interactive behavior, and `lib/` contains utilities. `backend/app` separates routes, configuration, database models, schemas, and services; `backend/migrations/` holds Alembic history. `compose.yaml` is local PostgreSQL; scripts verify the API, email, database, backup, restore, and public smoke behavior. CI is in `.github/workflows/ci.yml`.

Project records and case narratives remain in `frontend/src/content/`. This infrastructure migration does not add production claims to project content.
