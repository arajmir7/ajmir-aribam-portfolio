# Release certification

## Candidate

This is a locally verified migration candidate for Vercel, Neon, and Resend. The approved public design, content, and page routes were not changed. There is no Vercel/Neon/Resend account configuration or production deployment in this certification.

## Local release gate

`make verify` passed on 2026-09-27. Results: formatting, lint, strict TypeScript, production configuration fail-closed checks, 9 frontend unit tests, 37 backend tests with 1 conditional skip, 5 PostgreSQL integration tests, all 12 Playwright tests, the production Next.js build, npm and Python dependency audits, full Git-history secret scanning, Compose PostgreSQL migration/drift checks, mocked contact delivery, backup checksum verification and isolated restore, and Git whitespace checks all passed. The applied schema is `003_resend_message_id`.

The contact checks covered persisted submissions, validation, idempotent replay, successful and failed Resend responses, delivery ID persistence, protected readiness, foreign-origin rejection, and retained retryable failures. The PostgreSQL gate exercised the limited runtime role and restored a local backup into a separate database.

### Local performance and browser evidence

Three sequential headless Chromium runs against the local optimized Next.js server at 1440×900, without network or CPU throttling, returned HTTP 200. Median observed LCP was 348 ms, CLS 0.0000, navigation response start 8 ms, and JavaScript transfer size 150,684 bytes (147.2 KiB). The local font loaded and all 9 homepage images decoded. This is a local loopback lab measurement, not Lighthouse field data or real-user Core Web Vitals; it does not establish public network or production performance.

Playwright checked responsive behavior through 320–1920 px, including the requested 390, 768, 1440, and 1728 px widths, light/dark themes, route navigation, keyboard and mobile-menu behavior, reduced motion, axe accessibility, contact interaction, and representative screenshots. These checks ran against the local production-mode application.

## Production state and owner actions

- **Frontend:** Vercel project configuration is documented for the `frontend/` root.
- **API:** A second Vercel project is documented for `backend/`, using Vercel's Python runtime. That runtime is currently documented by Vercel as Beta on all plans; confirm availability and plan terms before relying on it.
- **CI:** Workflow definitions and pins were reviewed locally, but GitHub Actions has not run for this unpushed candidate.
- **Database:** Neon is not provisioned. Production migrations have not run. No existing inquiry data was transferred.
- **Email:** Resend is not configured. No real email was sent or received. Outbox delivery, failure retention, idempotent replay, and retry behavior were tested locally with a mock provider.
- **Domain:** `ajmiraribam.me`, `www.ajmiraribam.me`, and `api.ajmiraribam.me` are intended hostnames only. DNS, TLS, redirects, deployment, and production smoke tests were not exercised.
- **Operations:** No cloud backup/restore, scheduled backup, monitoring dashboard, alert destination, uptime check, or rollback has been configured or tested.

Before public traffic, follow [the deployment runbook](docs/deployment.md): provision Neon roles and secrets, run Alembic upgrade and drift check, configure both Vercel projects and Resend, attach the three domains using the exact records Vercel presents, verify managed TLS and canonical redirects, push the reviewed commit so GitHub Actions can pass, deploy that same revision, run the production smoke test, then obtain owner approval for one real contact inquiry and verify its database and inbox results. Configure provider alerts and verify a cloud backup restore separately. Confirm current service plan terms and quotas; a zero-cost deployment has not been established. Do not treat a successful local test as evidence that any of those owner actions has occurred.

## Decision

**READY FOR MANUAL DEPLOYMENT** — repository-side implementation and release gates are complete. The platform has not been deployed, and production account setup, DNS, live contact, cloud recovery, and operational alert verification remain owner actions.
