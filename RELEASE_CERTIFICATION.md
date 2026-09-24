# Release certification — local V5 frontend candidate

- **Candidate:** Current working tree; the final commit hash identifies the certified local state after creation.
- **Review date:** 2026-09-24.
- **Status:** Local release gate passed. No push, hosted CI run, or production deployment is claimed.

## Product scope

The rebuilt frontend presents Ajmir Aribam as a Software Engineer through real product surfaces, case-study decisions and quality practice. It uses a new vector AA identity, locally hosted Instrument Sans, a warm paper/green/oxide design system and a designed dark theme. Azaeron is the flagship. SHAPES India and Friends Aluminium Works are live public work. Azaeron Verity and The Scent Bar Retail OS are explicitly in development. SCMIRN and Zam Zam Academy remain labeled prototypes in Labs. AccessForge is omitted pending inspectable source.

The frontend and backend remain separate applications connected over HTTP. The public same-origin `/api/contact` route and private `/inquiries`, `/health/live`, and `/health/ready` contracts are unchanged. Visitor pages do not expose private project repository URLs, local source paths, or `TODO_OWNER_VERIFY` markers.

## Local verification

`make verify` passed on the rebuilt candidate. It covers:

- Prettier, ESLint, strict TypeScript, Ruff format and lint, and a production Next.js build.
- Two frontend unit tests, four backend API/unit tests, a fresh isolated PostgreSQL migration and persisted-inquiry integration test. The SQLite-only backend suite skips one PostgreSQL-specific test, which runs in the separate database gate.
- Seven Playwright tests across 15 public routes, including metadata, internal links, image decoding, 404, navigation, keyboard menu behavior, contact success and fallback, truthful in-development labels, and browser error/hydration checks.
- Axe scans on all 15 routes in light and dark themes with zero automated WCAG 2/2.1/2.2 A/AA violations. A responsive sweep covers 14 widths from 320 to 1920 px with no document overflow.
- Full-page local screenshots of all 15 routes at 390, 768, 1440 and 1728 px in both themes. These generated artifacts stay out of Git.
- `npm audit` and `pip-audit` with no known vulnerabilities at the configured high-severity gate; Gitleaks scans of committed and staged source.
- Frontend and backend Docker builds and isolated Compose startup from an empty PostgreSQL volume, with healthy services, a persisted contact response, and foreign-origin rejection.
- `git diff --check`.

The print résumé rendered as a one-page selectable-text A4 PDF with no clipping. The redesign and visual checks are recorded in [Frontend reinvention review](docs/quality/FRONTEND_REINVENTION_REVIEW.md); the previous V4 review remains in [Final design review](docs/quality/FINAL_DESIGN_REVIEW.md). Final local mobile Lighthouse performance scores were Home 98, Work 98, Azaeron 97 and About 100, with 100 for accessibility, best practices and SEO on all four. CLS was 0 on all four. Azaeron LCP was 2.6 s, 0.1 s above the 2.5 s target; Home and Work were 2.4 s, and About was 1.8 s. These are lab results, not field metrics.

The deployable Compose topology was rebuilt and is healthy locally at `http://localhost:3000`. This is a local running site, not a public deployment. The contact route still accepts same-origin submissions and has a server-only `CONTACT_ALLOWED_ORIGIN` override for isolated browser testing when a build embeds a different public site URL.

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
