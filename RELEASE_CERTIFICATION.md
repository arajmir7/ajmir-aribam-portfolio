# Release certification — V8 local portfolio candidate

- **Candidate:** Current working tree; the final commit hash identifies the certified local state after creation.
- **Review date:** 2026-09-25.
- **Status:** Local release gate passed for this candidate. Production deployment is blocked: the Render CLI is not authenticated and no hosting target is configured in this repository. No push, hosted CI run, or production deployment is claimed.

## Product scope

The portfolio presents **Ajmir Aribam** as a Software Engineer who works across product interfaces, backend systems, data, delivery, AI-enabled workflows and quality engineering. The Work archive contains nine evidence-ranked records:

- **Live:** Azaeron Business Operations, SHAPES India, Friends Aluminium Works.
- **In development:** Azaeron Verity, The Scent Bar Retail OS, Azaeron Construction Procurement, AccessForge.
- **Prototypes:** SCMIRN and Zam Zam Academy.

The billing Azaeron system and construction procurement system are separate records. AccessForge and SCMIRN have direct case pages. Zam Zam is presented as a hosted web prototype. CivicPulse Resilience Network was removed from public data, Labs, the sitemap, and the generated case routes; its former path returns the application 404. Detailed evidence and limits are recorded in [Final portfolio release review](docs/quality/FINAL_PORTFOLIO_RELEASE_REVIEW.md).

The homepage leads with software products and the systems behind them, gives Azaeron the strongest evidence position, and follows with concise selected work. The phrase “Three products, three different jobs.” and its oversized introductory composition are gone. Case copy leads with each product and its users before implementation details, and keeps maturity, ownership, authority, and release limits visible.

The supplied Ajmir Aribam identity is integrated as a graphite and steel-blue mark with light- and dark-surface SVG lockups, compact and monogram navigation variants, a simplified favicon, app icons, and the social preview. The Work and Labs pages use the nine-record archive and three maturity groups.

The frontend and backend remain separate applications connected over HTTP. The public same-origin `/api/contact` route and private `/inquiries`, `/health/live`, and `/health/ready` contracts are unchanged. Visitor pages do not expose private project repository URLs, local source paths, credentials, or `TODO_OWNER_VERIFY` markers.

## Local verification

`make verify` passed on this candidate. It covers:

- Prettier, ESLint/name checks, strict TypeScript, Ruff format/lint, frontend and backend tests, PostgreSQL migration/inquiry integration, and a production Next.js build.
- Eight Playwright tests cover 19 content routes (nine project cases and ten shared pages), metadata, internal links, image decoding, the retired-slug HTTP 404, navigation, keyboard menu behavior, contact success/fallback, truthful maturity labels and browser errors.
- Axe scans cover all 19 routes in light and dark themes. The responsive sweep checks 14 widths; full-page captures cover 390, 768, 1440 and 1728 px in both themes. The logo variant check covers 320, 390 and 1440 px in both themes. The print résumé is rendered to PDF.
- `npm audit`, `pip-audit`, Gitleaks, Docker builds, isolated Compose startup, health/readiness, persisted contact response, foreign-origin rejection and `git diff --check`.

The executed result was 8 Playwright tests passed; frontend unit tests 2 passed; backend tests 4 passed with 1 PostgreSQL-specific test covered by the separate database gate; PostgreSQL migration/inquiry integration passed; both dependency audits reported no known vulnerabilities at the configured high-severity gate; Gitleaks reported no leaks in committed or staged source; both images built; and Compose reported healthy services with persisted contact and foreign-origin rejection.

The V8 candidate adds native evidence diagrams for project pages. User-supplied local captures of Verity, SCMIRN, AccessForge and Zam Zam informed the review. The generated page captures and print PDF were reviewed locally and remain outside Git. Lighthouse was not run on V8 because no local Lighthouse CLI is available; the earlier candidate’s lab scores are not carried forward as V8 results.

## Evidence limits

- Azaeron authenticated production behavior, active integrations, usage and business outcomes were not independently inspected.
- Verity remains not production ready according to its own execution ledger; approved model and calibrated detector gates remain open.
- The Scent Bar Milestone 2 catalogue foundation is implemented, but inventory, purchasing and POS are not implemented in the inspected milestone; production runtime verification remains open.
- Azaeron Construction Procurement has substantial local code and status documentation, but live payment, supplier, warehouse and deployment behavior remain unverified.
- AccessForge has source and tests but its local UI reported an offline state; no deployed service is claimed.
- SCMIRN has real React/FastAPI modules and direct product screens, while some UI paths are mock-backed. It is not an official government service and its guidance is not legal advice.
- Zam Zam’s Netlify preview proves hosting only. No client ownership, school operation, enrollment, staffing or outcome claim is made.

The automated axe result is not an accessibility certification. Human screen-reader review, physical-device review, field performance and INP remain open.

## Deployment boundary

This candidate is not a certified public deployment. Launch still needs:

- final HTTPS domain, DNS, TLS and a reverse proxy that overwrites client IP headers;
- production database credentials, restore-tested backups and secret storage;
- SMTP delivery or a staffed pending-inquiry review, retention scheduling and alerts;
- live-origin metadata/social preview review, human accessibility review and field monitoring;
- hosted CI on the final published commit.

The installed Render CLI returned `unauthorized` for `whoami`; no Render blueprint or other deployment target is configured in the repository. There is no verified public URL.

The optional email task runs in-process after storage; a crash can leave an inquiry pending for operator review. A simultaneous first-submission rate-window uniqueness race can return a transient 503. The contact page provides a direct email fallback.

## Owner verification register

- Final public domain, hosting credentials, TLS/proxy, alerts, backup/restore, retention and contact-delivery ownership.
- Public repository permission and exact contribution boundaries for the project sources.
- Azaeron active integrations and production behavior; SHAPES operations; Friends commercial outcomes.
- Verity, Scent Bar and construction procurement release state and contribution boundaries.
- AccessForge deployment/ownership; SCMIRN deployment, data provenance and authority relationships.
- Zam Zam client/production ownership.
- Human accessibility review, field performance measurements and production alert delivery.
