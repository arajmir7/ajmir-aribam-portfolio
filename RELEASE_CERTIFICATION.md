# Release certification

## Local release gate

`make verify` passed locally on 2026-09-27. The gate covered formatting and the Render Blueprint schema; frontend/backend lint; strict TypeScript; 10 frontend unit tests; 17 backend tests (one skipped by its existing condition); three PostgreSQL integration tests; migration upgrade and drift checks; all 12 production-mode Playwright tests; the production Next.js build; dependency audits; repository-history secret scanning; both production Docker images; production-like Compose health checks; and `git diff --check`.

The PostgreSQL checks provisioned a separate limited runtime role, applied Alembic migrations without drift, created and verified a custom-format backup, and restored it into a new isolated database. The Compose smoke confirmed readiness, security headers, contact persistence, validation, foreign-origin rejection, and rate limiting. Browser coverage included responsive layouts, both themes, keyboard/mobile navigation, reduced motion and automated accessibility checks.

These results are local evidence for this repository candidate. They do not establish cloud account permissions, production availability, backups, email delivery, alert delivery, field performance or public-domain behavior.

## Production boundary

Render Blueprint data passed local JSON Schema validation. The Render account has not been authenticated for remote Blueprint validation, and no services, database, S3 bucket, KMS key, DNS records, TLS certificate, notification provider or alert destination have been configured or exercised. The production database migration credential's ability to create the restricted runtime role remains unverified; Render may require that role to be created through its managed credentials interface and the app connection set explicitly.

No production deployment or production-origin smoke test has been performed. `https://ajmiraribam.me` is the intended canonical URL, not a verified live URL. Complete the owner steps in [deployment](deployment.md) and [operations](operations.md), then run the production smoke command against the deployed full commit SHA before routing public traffic.
