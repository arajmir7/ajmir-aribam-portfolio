# Testing and verification

Run the complete local gate from the repository root with `make verify`.

It checks formatting, ESLint, Ruff, strict TypeScript, Vitest, pytest, PostgreSQL integration and runtime grants, Alembic upgrade/drift, production Next.js build, Playwright routes/contact/accessibility/responsive checks, npm/Python dependency audits, repository-history secret scanning, Compose contact behavior, fake Resend success/failure/replay, local backup and isolated restore, and `git diff --check`. It never uses production credentials or sends real mail.

Focused commands include `make format-check`, `make lint`, `make typecheck`, `make test`, `make e2e`, `make security`, `make compose-smoke`, and `make email-qa`. Database and browser artifacts use disposable local resources.

For a deployed site, run `PRODUCTION_URL=https://ajmiraribam.me EXPECTED_REVISION=<full SHA> bash scripts/production-smoke.sh`. It checks public HTTPS routes/redirects, security headers, canonical metadata, sitemap, public health/revision, invalid contact behavior, foreign-origin rejection, and unknown routes. It does not submit a valid production contact. An owner-approved live inquiry must separately verify the Neon rows, Resend acceptance, inbox receipt, visitor `Reply-To`, and logs.

Automated accessibility checks are regression aids, not a certification. Review target devices and assistive technology before public launch. See [deployment](deployment.md) and [operations](operations.md).
