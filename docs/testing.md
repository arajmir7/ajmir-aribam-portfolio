# Testing and verification

Run the complete local release gate from the repository root:

```sh
make verify
```

The gate checks frontend/Markdown formatting, ESLint, Ruff, strict TypeScript, the Render Blueprint against Render's published JSON Schema, unit and API tests, PostgreSQL migration and drift, role separation, inquiry/outbox idempotency, persisted SMTP-failure recovery, a portable PostgreSQL backup restored into a new isolated database, the canonical HTTPS production frontend build, Playwright and accessibility flows, dependency and Git secret scans, Docker production image builds, and production-like Compose contact behavior. Browser flows run on a local development origin; production origin/TLS behavior is checked separately by the production smoke command. The Compose flow checks persisted success, durable queue rows when SMTP is intentionally absent, malformed input, foreign-origin rejection, and database-backed rate limiting. `make email-qa` submits through the local Next.js form endpoint twice with one idempotency key and proves one PostgreSQL inquiry/outbox row plus one visible Mailpit message. `git diff --check` runs at the end.

Useful focused commands are `make format-check`, `make lint`, `make typecheck`, `make test`, `make e2e`, `make security`, `make containers`, `make compose-smoke`, and `make email-qa`. PostgreSQL/Compose checks use disposable resources. Browser captures, databases, test outputs and caches are generated locally and ignored by Git.

For a live deployment, run `PRODUCTION_URL=https://ajmiraribam.me EXPECTED_REVISION=<full SHA> bash scripts/production-smoke.sh`. It checks HTTPS routes and redirects, security headers, canonical metadata, sitemap, readiness and revision, static assets, invalid same-origin contact input, foreign-origin rejection, and unknown-route behavior. It does not submit a valid contact, so it does not create production personal data. An owner-approved live test must separately verify inquiry persistence, outbox state, worker processing and receipt through the configured email provider.

Automated accessibility and security checks are regression aids, not certifications. A production release also needs review on target devices and assistive technology and must follow [deployment](deployment.md) and [operations](operations.md).
