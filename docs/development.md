# Development

Use Node.js 24, npm, Python 3.12, [uv](https://docs.astral.sh/uv/), Docker Compose, and Make.

```sh
cp .env.example .env
# Replace local password/token placeholders with random local values.
make install
make dev
```

`make dev` starts local PostgreSQL, applies Alembic migrations, and launches Next.js and FastAPI on loopback. `make compose-down` stops the database; its local volume remains. Local `.env` is never used in production.

Run an app independently with `cd frontend && npm run dev` or `cd backend && uv run uvicorn app.main:app --reload --host 127.0.0.1 --port 8000` after configuring its local variables.

## Verification

Run `make verify` for formatting, ESLint, Ruff, strict TypeScript, Vitest, pytest, PostgreSQL integration, Alembic upgrade/drift, production build, Playwright routes/contact/accessibility/responsive checks, dependency audits, full Git-history secret scan, mocked Resend flow, Compose smoke, and backup/restore checks. It never uses production credentials or sends real mail. Focused targets include `make format-check`, `make lint`, `make typecheck`, `make test`, `make e2e`, `make security`, `make compose-smoke`, and `make email-qa`.

Browser captures and databases are disposable generated output and ignored by Git. To check a deployed site, use the smoke command in the root [README](../README.md); it does not send a valid contact inquiry. Automated accessibility checks are regression aids, not a certification.

Keep the frontend and backend separate and connected over HTTP. Preserve the public `/api/contact` and backend `/inquiries`, `/health/live`, and `/health/ready` contracts unless a tested compatibility change is necessary. Do not change approved portfolio design, routes, copy, or project content during infrastructure work. Generated output, databases, credentials, and QA captures do not belong in Git.
