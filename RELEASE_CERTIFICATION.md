# Release certification — local monorepo candidate

**Revision:** The architecture-refactor commit containing this document, based on `29b68d7`. Use `git rev-parse HEAD` to identify its exact SHA after commit creation.

**Verified:** 23 September 2026 on Darwin arm64, Node 24.17.0, npm 11.13.0, local uv 0.10.6, Docker 29.8.0. Containers use Node 24, Python 3.12, and uv 0.12.16.

**Status:** Local verification passed. No GitHub push, hosted CI run, or public deployment is claimed.

## Architecture and behavior boundary

`frontend/` owns Next.js rendering, routes, assets, content, and browser tests. `backend/` owns the private FastAPI inquiry API, Pydantic input, SQLAlchemy storage, migrations, and operational CLI. The only cross-application integration is HTTP through the same-origin Next contact route. Root Compose runs frontend, backend, and PostgreSQL; `infra/compose.dev.yaml` exposes PostgreSQL to localhost for host development. There is no empty contracts or repository layer.

The route and contact contracts remain the same as baseline: all 13 public pages, `/api/contact`, `/api/health`, `/inquiries`, `/health/live`, and `/health/ready`. The Azaeron, SHAPES India, Friends Aluminium Works, Labs, writing, About, and resume evidence copy was not rewritten. Source content files, the Labs page, About page, and portrait match the baseline byte-for-byte. The resume page changed only its PrintButton import path. The responsive 320px Engineering regression test remains active and passes.

Generated output and `next-env.d.ts` are excluded from Git. `npm run typecheck` regenerates the Next.js types before strict TypeScript checking; this was verified after deleting the local generated file.

## Verification results

`make verify` passed after the move. It ran:

- Prettier over frontend and root/docs configuration; ESLint, strict TypeScript, Ruff lint and format.
- Two frontend unit tests, four backend API/unit tests, a fresh PostgreSQL 17 migration and Alembic schema check, and one PostgreSQL persistence integration test.
- A production Next build and three Playwright journeys covering all 13 routes, internal links, metadata, sitemap, robots, 404, contact, keyboard navigation, and the evidence links.
- Axe checks on all 13 routes in light and dark themes, plus horizontal-overflow checks at 320, 375, and 768 pixels. No automated WCAG 2/2.1/2.2 A/AA violations were reported.
- `npm audit --audit-level=high` and `pip-audit` with no reported vulnerabilities; Gitleaks scans of committed history and staged refactor changes with no leaks.
- Frontend and backend Docker builds; isolated Compose startup from an empty volume, healthy PostgreSQL/backend/frontend, a 200 contact response with one persisted row, and a 403 response for a foreign origin.

`make dev` was also exercised with disposable local values: it started PostgreSQL, applied migration, served backend readiness and the homepage (both HTTP 200), and shut down without retaining the test volume. Next.js dev-generated agent files are disabled and did not reappear on a fresh dev start. The four supplied project URLs returned HTTP 200 to direct HEAD requests during this refactor; the three project GitHub source remotes remained inaccessible to unauthenticated visitors and are not visitor links.

## Security, accessibility, and performance

The refactor preserved the nonce CSP, security headers, same-origin contact boundary, private API token, input limits, Pydantic validation, honeypot, database-backed throttling, safe errors, request IDs, and PII-safe logs. The base Compose file does not publish the backend or database. A trusted production reverse proxy must overwrite client-IP headers for throttling to be reliable. OWASP ASVS 5.0 is a reference, not a compliance claim.

Automated accessibility and keyboard checks passed. A human screen-reader session and physical-device checks remain open. The design respects reduced motion. Current Lighthouse 13.5 mobile lab runs against the local production build scored the homepage 98 performance, 100 accessibility, 100 best practices, and 100 SEO (LCP 2.29 s, CLS 0, TBT 12 ms); About scored 98/100/100/100 (LCP 2.31 s, CLS 0, TBT 2 ms). These are lab measurements, not field Core Web Vitals. INP and field LCP/CLS require production traffic.

## Deployment status and remaining limits

The local candidate is not a certified production deployment. Before public launch, verify the final domain, DNS/TLS and trusted proxy, database credentials and restore-tested backups, secret storage, SMTP delivery or a staffed pending-inquiry process, log sink and alerts, retention scheduler and backup expiry, real-origin metadata/social preview, human accessibility review, and field performance. GitHub Actions has not run on the refactor commit until it is published.

The optional email task runs in-process after storage, not in a durable queue. A crash can leave an inquiry `pending` for operator review. Simultaneous first submissions for one rate-window key can cause one transient 503 due to a uniqueness race; an atomic upsert should replace this if observed. The deployed privacy notice must match the actual retention schedule.

## `TODO_OWNER_VERIFY` register

- Final public domain, hosting, credentials, TLS/proxy, alerts, backup/restore and retention ownership.
- Whether the three project source repositories may be public; their current unauthenticated URLs return 404.
- Azaeron active deployment/integrations, SHAPES production operations, and Friends Aluminium Works commercial arrangement and measured outcomes.
- Zam Zam Academy source and ownership details beyond the supplied prototype classification.
- Human screen-reader and physical-device review, production field Core Web Vitals, and SMTP/alert delivery.

The fact classifications are in `PORTFOLIO_SPEC.md`. Unverified facts remain `TODO_OWNER_VERIFY` in content source rather than appearing as public claims.
