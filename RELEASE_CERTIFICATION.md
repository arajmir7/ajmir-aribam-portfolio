# Release certification — local V4 candidate

- **Candidate:** Current working tree; the final commit hash identifies the certified local state after creation.
- **Review date:** 2026-09-23.
- **Status:** Local release gate passed. No push, hosted CI run, or production deployment is claimed.

## Product scope

The portfolio presents Ajmir Aribam as a Software Engineer across Backend, Cloud, DevOps, AI Systems, and Quality Engineering. Azaeron is the flagship. SHAPES India and Friends Aluminium Works are live public work. Azaeron Verity and The Scent Bar Retail OS are explicitly in development. SCMIRN and Zam Zam Academy remain labeled prototypes in Labs. AccessForge is omitted pending inspectable source.

The frontend and backend remain separate applications connected over HTTP. The public same-origin `/api/contact` route and private `/inquiries`, `/health/live`, and `/health/ready` contracts are unchanged. Visitor pages do not expose private project repository URLs, local source paths, or `TODO_OWNER_VERIFY` markers.

## Local verification

`make verify` passed on the V4 candidate. It covers:

- Prettier, ESLint, strict TypeScript, Ruff format and lint, and a production Next.js build.
- Two frontend unit tests, four backend API/unit tests, a fresh isolated PostgreSQL migration and persisted-inquiry integration test. The SQLite-only backend suite skips one PostgreSQL-specific test, which runs in the separate database gate.
- Six Playwright tests across 15 public routes, including metadata, internal links, image decoding, 404, navigation, keyboard menu behavior, contact success and fallback, and truthful in-development project labels.
- Axe scans on all 15 routes in light and dark themes with zero automated WCAG 2/2.1/2.2 A/AA violations. A responsive sweep covers 14 widths from 320 to 1920 px with no document overflow.
- Full-page local screenshots of all 15 routes at 390 and 1440 px in both themes. These generated artifacts stay out of Git.
- `npm audit` and `pip-audit` with no known vulnerabilities at the configured high-severity gate; Gitleaks scans of committed and staged source.
- Frontend and backend Docker builds and isolated Compose startup from an empty PostgreSQL volume, with healthy services, a persisted contact response, and foreign-origin rejection.
- `git diff --check`.

The print résumé was rendered as a two-page selectable-text A4 PDF and visually checked after fixing page breaks. The screenshots and copy review are documented in [Final design review](docs/quality/FINAL_DESIGN_REVIEW.md). Current local mobile Lighthouse runs returned Home 97 and Work 99 for performance, with 100 for accessibility, best practices, and SEO on both. Work CLS was 0 after a loading-layout fix; Home LCP was 2.6 s, 0.1 s above the 2.5 s target. About 155 KB of script transferred on each route. These are lab results, not field metrics.

## Evidence limits

Azaeron's authenticated production behavior, active integrations, and real usage were not independently inspected. Verity's own local execution ledger says **not production ready**; it lacks an approved production generative model and calibrated detector, and its backend image gate has failed. The Scent Bar's inventory ledger, purchasing, and POS are not implemented in the inspected milestone, and its database/API runtime verification remains open. SCMIRN has local prototype code without demonstrated production behavior. Exact contribution boundaries for the new project sources remain `TODO_OWNER_VERIFY`.

The local axe result is not an accessibility certification. Human screen-reader and physical-device review remain open, as do field performance measurements and INP. No production telemetry or uptime claim is made.

## Deployment boundary

The candidate is not a certified public deployment. Launch still needs the final HTTPS origin and TLS/proxy setup, production database credentials and restore-tested backups, secret storage, SMTP delivery or staffed pending-inquiry review, a retention scheduler, alerts, live-origin metadata/social preview review, human accessibility review, and field monitoring. The production reverse proxy must overwrite client IP headers for throttling to be reliable. Hosted CI has not run on the final commit until it is published.

The optional email task runs in-process after storage; a crash can leave an inquiry pending for operator review. A simultaneous first-submission rate-window uniqueness race can return a transient 503. These backend limits remain documented in the operations and security material; the contact page offers a direct email fallback.

## `TODO_OWNER_VERIFY` register

- Final public domain, hosting, credentials, TLS/proxy, alerts, backup/restore, retention, and contact delivery ownership.
- Whether project repositories may be public; the original three unauthenticated remote URLs returned 404 during the evidence pass.
- Azaeron authenticated/active deployment behavior, SHAPES production operations, and Friends commercial outcomes.
- Verity and The Scent Bar contribution boundaries, final deployment state, and public repository status.
- AccessForge source and implemented scope; SCMIRN deployment and product maturity.
- Human screen-reader and physical-device review, field performance measurements, and production alert delivery.
