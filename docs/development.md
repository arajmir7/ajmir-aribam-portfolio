# Development

## Requirements

Node.js 24, npm, Python 3.12, [uv](https://docs.astral.sh/uv/), Docker, and Make.

## Setup

```sh
cp .env.example .env
make install
make dev
```

The checked-in environment example uses local placeholders. `make dev` starts the PostgreSQL service with `infra/compose.dev.yaml`, applies migrations, then starts the frontend and backend with reload. The frontend is available at `http://localhost:3000`; the backend is available only on loopback at port 8000. Stop the database container with `make compose-down`; its data volume remains.

For a standalone frontend, use `cd frontend && npm run dev`. For the API, use `cd backend && uv run uvicorn app.main:app --reload --host 127.0.0.1 --port 8000` after configuring the API environment.

## Repository conventions

Keep the frontend and backend as separate applications connected over HTTP. Preserve the public `/api/contact` endpoint and private `/inquiries`, `/health/live`, and `/health/ready` contracts unless compatibility changes and tests accompany an update. Keep project maturity and evidence limits accurate; do not infer ownership, outcomes, employment seniority, or production status. Generated output, local databases, credentials, and QA captures do not belong in Git.
