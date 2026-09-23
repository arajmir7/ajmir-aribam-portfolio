# Release certification — local product candidate

- **Revision:** This document is part of the final frontend product pass on top of `7215fab8ea1e0fd2f4372a92c03d69693cd52ced`; `git rev-parse HEAD` identifies the exact candidate commit after creation.
- **Verified:** 2026-09-23 on Darwin arm64 with Node 24, Next.js 16.3.6, React 19.3.0, Python 3.12 containers, PostgreSQL 17, and Docker 29.
- **Status:** Local release gate passed. No push, hosted CI run, or public deployment is claimed.

## Architecture

The repository keeps separate `frontend/` and `backend/` applications. Next.js renders the public portfolio and owns the same-origin contact route. The private FastAPI service validates and persists inquiries through SQLAlchemy and Alembic into PostgreSQL. Compose runs the frontend, backend, and database without exposing the private API or database to the public origin. Project case studies are server-rendered; small client components serve the mobile menu, active case contents, theme preference, form, footer, and first-party telemetry.

This pass changed public presentation, project images, case-study structure, navigation, and browser coverage. It did not rewrite the backend or add infrastructure. Genuine project captures are from public pages; Friends photographs come from its project source. The supplied About portrait remains faithful to the original.

## Verification results

`make verify` passed on the final candidate. Its gates included:

- Prettier, ESLint, strict TypeScript, Ruff format and lint, and a production Next.js build.
- Two frontend unit tests; four backend API/unit tests; a fresh isolated PostgreSQL migration, Alembic schema check, and persisted-inquiry integration test. One backend test is skipped in the SQLite-only run because its PostgreSQL path is exercised separately.
- Six Playwright tests covering 13 public routes, metadata, sitemap, robots, internal links, 404, real case imagery, visitor-copy exclusions, mobile navigation and Escape/focus behavior, case anchors, contact success and failure fallback, and responsive overflow.
- Axe scans on all 13 routes in both themes with zero automated WCAG 2/2.1/2.2 A/AA violations. A dark-theme intermediate contrast defect was found and corrected before the passing run.
- `npm audit --audit-level=high` and `pip-audit` with zero reported vulnerabilities; Gitleaks scans of committed history and staged changes with no findings.
- Frontend and backend Docker builds; isolated Compose startup from an empty PostgreSQL volume, healthy services, a persisted contact response, and rejection of a foreign origin.
- `git diff --check`. The before/after screenshot review and 14-path, ten-width viewport sweep are documented in [Final design review](docs/quality/FINAL_DESIGN_REVIEW.md).

The résumé was rendered to two selectable-text A4 pages and visually checked for page breaks. The error and loading components were reviewed; an unexpected production exception was not introduced solely to force an error-boundary screenshot.

## Accessibility and performance

Manual keyboard checks covered the skip link, menu open/close, Escape focus restoration, active links, case contents, and contact form. Automated axe results passed; a human screen-reader session and physical-device checks remain open. Reduced-motion rules remain active.

Lighthouse 13.5.0 **local mobile lab** runs against the production build returned:

| Route   | Performance | Accessibility | Best practices | SEO |    LCP | CLS |  TBT |
| ------- | ----------: | ------------: | -------------: | --: | -----: | --: | ---: |
| Home    |         100 |           100 |            100 | 100 | 1.66 s |   0 | 6 ms |
| Azaeron |          99 |           100 |            100 | 100 | 2.24 s |   0 | 3 ms |
| About   |          99 |           100 |            100 | 100 | 2.23 s |   0 | 2 ms |

Script transfer was about 152 KB on these routes, with no font transfer or third-party browser scripts. These are lab measurements, not field Core Web Vitals. INP and field LCP/CLS need production traffic.

## Security and deployment boundary

The existing nonce CSP, security headers, same-origin contact boundary, private API token, bounded and validated input, honeypot, database-backed throttling, safe errors, request IDs, and PII-safe logs remain in place. OWASP ASVS 5.0 is a design reference, not a compliance claim. The production reverse proxy must overwrite client-IP headers for throttling to be reliable.

The candidate is **not a certified public deployment**. External launch inputs remain: final domain and TLS/proxy configuration, database credentials and restore-tested backups, secret storage, SMTP delivery or staffed pending-inquiry review, log sink and alerts, retention scheduler, privacy schedule, live-origin metadata/social preview, human accessibility review, and field performance monitoring. GitHub Actions has not run on this commit until it is published.

The optional email task runs in-process after storage; a crash can leave an inquiry pending for operator review. A simultaneous first-submission rate-window uniqueness race can return a transient 503 and should be changed to an atomic upsert if observed. These are known backend limitations retained from the baseline; the contact page now offers a direct email fallback when submission fails.

## `TODO_OWNER_VERIFY` register

- Final public domain, hosting, credentials, TLS/proxy, alerts, backup/restore, retention, and contact delivery ownership.
- Whether the three project source repositories may be public; their unauthenticated URLs returned 404 during evidence review.
- Azaeron authenticated/active deployment behavior and enabled integrations; SHAPES production operations; Friends commercial arrangement and measured outcomes.
- Zam Zam Academy source and ownership detail beyond the supplied prototype classification.
- Human screen-reader and physical-device review, production field Web Vitals, and SMTP/alert delivery.

Unverified facts remain in internal content and documentation rather than becoming public portfolio claims.
