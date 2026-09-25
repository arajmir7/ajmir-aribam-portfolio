# Release certification — V7 local portfolio candidate

- **Candidate:** Current working tree; the final commit hash identifies the certified local state after creation.
- **Review date:** 2026-09-25.
- **Status:** Local release gate passed for this candidate. No push, hosted CI run, or production deployment is claimed.

## Product scope

The portfolio presents **Ajmir Aribam** as a Software Engineer who works across product interfaces, backend systems, data, delivery, AI-enabled workflows and quality engineering. The Work archive contains 10 evidence-ranked records:

- **Live:** Azaeron Business Operations, SHAPES India, Friends Aluminium Works.
- **In development:** Azaeron Verity, The Scent Bar Retail OS, Azaeron Construction Procurement, AccessForge.
- **Prototype / research:** SCMIRN, Zam Zam Academy, CivicPulse Resilience Network.

The billing Azaeron system and construction procurement system are separate records. AccessForge and SCMIRN have direct case pages. Zam Zam is presented as a hosted web prototype. CivicPulse is kept in Research & Labs. Detailed evidence and limits are recorded in [Final portfolio release review](docs/quality/FINAL_PORTFOLIO_RELEASE_REVIEW.md).

The frontend and backend remain separate applications connected over HTTP. The public same-origin `/api/contact` route and private `/inquiries`, `/health/live`, and `/health/ready` contracts are unchanged. Visitor pages do not expose private project repository URLs, local source paths, credentials, or `TODO_OWNER_VERIFY` markers.

## Local verification

`make verify` passed on this candidate. It covers:

- Prettier, ESLint/name checks, strict TypeScript, Ruff format/lint, frontend and backend tests, PostgreSQL migration/inquiry integration, and a production Next.js build.
- Playwright coverage for 20 public routes (10 project routes plus shared pages), metadata, internal links, image decoding, 404, navigation, keyboard menu behavior, contact success/fallback, truthful maturity labels and browser errors.
- Axe scans on every route in light and dark themes, responsive overflow checks at 14 widths, full-page screenshots at 390/768/1440/1728 px in both themes, and print résumé rendering.
- `npm audit`, `pip-audit`, Gitleaks, Docker builds, isolated Compose startup, health/readiness, persisted contact response, foreign-origin rejection and `git diff --check`.

The executed result was 7 Playwright tests passed; frontend unit tests 2 passed; backend tests 4 passed with 1 PostgreSQL-specific test covered by the separate database gate; PostgreSQL migration/inquiry integration passed; dependency audits reported no known vulnerabilities at the configured high-severity gate; Gitleaks reported no leaks; both images built; and Compose reported healthy services with persisted contact and foreign-origin rejection.

The V7 candidate adds native evidence diagrams for the new case pages. User-supplied local captures of Verity, SCMIRN, AccessForge and Zam Zam informed the review; generated screenshots and PDFs remain outside Git.

## Evidence limits

- Azaeron authenticated production behavior, active integrations, usage and business outcomes were not independently inspected.
- Verity remains not production ready according to its own execution ledger; approved model and calibrated detector gates remain open.
- The Scent Bar Milestone 2 catalogue foundation is implemented, but inventory, purchasing and POS are not implemented in the inspected milestone; production runtime verification remains open.
- Azaeron Construction Procurement has substantial local code and status documentation, but live payment, supplier, warehouse and deployment behavior remain unverified.
- AccessForge has source and tests but its local UI reported an offline state; no deployed service is claimed.
- SCMIRN has real React/FastAPI modules and direct product screens, while some UI paths are mock-backed. It is not an official government service and its guidance is not legal advice.
- Zam Zam’s Netlify preview proves hosting only. No client ownership, school operation, enrollment, staffing or outcome claim is made.
- CivicPulse is a local research MVP with rule-based scoring and SQLite default; no field operation is claimed.

The automated axe result is not an accessibility certification. Human screen-reader review, physical-device review, field performance and INP remain open.

## Deployment boundary

This candidate is not a certified public deployment. Launch still needs:

- final HTTPS domain, DNS, TLS and a reverse proxy that overwrites client IP headers;
- production database credentials, restore-tested backups and secret storage;
- SMTP delivery or a staffed pending-inquiry review, retention scheduling and alerts;
- live-origin metadata/social preview review, human accessibility review and field monitoring;
- hosted CI on the final published commit.

The optional email task runs in-process after storage; a crash can leave an inquiry pending for operator review. A simultaneous first-submission rate-window uniqueness race can return a transient 503. The contact page provides a direct email fallback.

## Owner verification register

- Final public domain, hosting credentials, TLS/proxy, alerts, backup/restore, retention and contact-delivery ownership.
- Public repository permission and exact contribution boundaries for the project sources.
- Azaeron active integrations and production behavior; SHAPES operations; Friends commercial outcomes.
- Verity, Scent Bar and construction procurement release state and contribution boundaries.
- AccessForge deployment/ownership; SCMIRN deployment, data provenance and authority relationships.
- Zam Zam client/production ownership; CivicPulse deployment and research ownership.
- Human accessibility review, field performance measurements and production alert delivery.
