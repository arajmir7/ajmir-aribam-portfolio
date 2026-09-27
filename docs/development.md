# Development

Use Node.js 24, npm, Python 3.12, [uv](https://docs.astral.sh/uv/), Docker, and Make.

```sh
cp .env.example .env
# Replace local password/token placeholders with random local values.
make install
make dev
```

`make dev` starts local PostgreSQL, applies Alembic migrations, and launches Next.js and FastAPI on loopback. `make compose-down` stops the database; its local volume remains. Local `.env` is never used in production.

Run an app independently with `cd frontend && npm run dev` or `cd backend && uv run uvicorn app.main:app --reload --host 127.0.0.1 --port 8000` after configuring its local variables.

Keep the frontend and backend separate and connected over HTTP. Preserve the public `/api/contact` and backend `/inquiries`, `/health/live`, and `/health/ready` contracts unless a tested compatibility change is necessary. Do not change approved portfolio design, routes, copy, or project content during infrastructure work. Generated output, databases, credentials, and QA captures do not belong in Git.
