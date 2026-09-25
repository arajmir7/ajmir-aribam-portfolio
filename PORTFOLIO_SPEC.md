# Portfolio product specification

## Purpose and positioning

AJMIR ARIBAM — Software Engineer. The first screen names Backend, Cloud, DevOps, AI Systems, and Quality Engineering, then gives direct paths to selected work, resume, and contact. Azaeron is the flagship; live work and in-development projects have separate visual tiers. MCA appears in About and Resume only.

The visual language uses neutral paper, graphite, cobalt interaction accents, ruled grids, product imagery, and readable architecture drawings. Emerald is reserved for system states; copper appears only as a small editorial accent. No decorative terminal, rating bars, or ungrounded claims.

## Evidence inventory (inspected 2026-09-23)

The initial evidence pass inspected resume versions, the supplied portrait, and source implementations in `/Users/ajmiraribam/Projects/Invoice`, `/Users/ajmiraribam/Projects/ShapesIndia`, and `/Users/ajmiraribam/Projects/First`. A later pass inspected the separate `azaeron_humanize` Verity source and release ledger, `the-scent-bar-retail-os` source and milestone status, and SCMIRN source. Those repositories do not establish facts about the current Azaeron invoice deployment.

The three project GitHub remote URLs returned public HTTP 404 during verification. They may be private or unpublished. Source paths and revisions remain in internal content/provenance records; visitor pages do not expose local paths, revision hashes, or broken repository links. Public source access is `TODO_OWNER_VERIFY`.

### VERIFIED from implementation or live pages

- Azaeron invoice repository contains React/TypeScript/Vite frontend, Express/Mongoose API, invoice lifecycle validation, permission mapping, rate limiting, readiness endpoint, GitHub Actions release gate, and Render/Vercel configuration. Source: `Projects/Invoice` paths and commit `66b0f7c`.
- SHAPES live site presents the institution and six centres. Its source contains a Flask app, SQLAlchemy models, migrations, controlled content publishing, permission checks, health/readiness, deployment scripts and GitHub Actions. Source: `Projects/ShapesIndia`, commit `0dbdf15`, and https://shapesindia.org/.
- Friends Aluminium Works live site presents products, services, projects and contact information. Its source is a React/TypeScript/Vite site with SEO metadata and a quote flow that opens WhatsApp; contact opens the user's mail client. Source: `Projects/First`, commit `13aa4bf`, and https://friendsaluminiumworks.com/.
- Azaeron Verity local source contains a document review UI, immutable document versions, evidence graph and report services, explicit abstention states, and local unit/database/browser checks. Its 2026-09-20 execution ledger says **not production ready**; there is no approved production generative model or calibrated detector. The public case study is labeled in development and uses a local development screenshot.
- The Scent Bar Retail OS local source implements identity/branch access and catalogue/pricing modules. The project status explicitly leaves production runtime verification open. Inventory ledger, purchasing, and POS are not yet implemented; the case study labels them as later milestones.
- SCMIRN local source contains a React/Vite civic workflow UI, FastAPI modules, issue/tracker/document/rights paths, and experimental agent code. Some UI paths are mock-backed, so it appears as a direct prototype case without a deployment, authority or legal guidance claim.
- The supplied portrait is available and is the sole identity photograph used.
- Project visuals are genuine: Azaeron public sign-in, SHAPES homepage and centre index, and Friends Aluminium Works product index were captured from their public URLs on 2026-09-23. Friends project photographs were optimized from `/Users/ajmiraribam/Projects/First/public/faw/`. The captures are public surfaces; no authenticated application view or private customer data is represented.

### SUPPORTED BUT NEED WORDING CARE

- Azaeron is described in the owner resume and repository as production billing software. The public URL returned HTTP 200 to a direct HEAD request on 2026-09-23, though authenticated behavior and production integrations were not independently inspected. Public copy says “billing platform” without asserting measured use or uptime.
- SHAPES operational runbook describes a deployment sequence, backups, and rollback hooks. Source existence does not prove each external production service is configured. Public copy describes implemented workflow and code, not an unverified operations outcome.
- Ajmir's ownership is supported by local Git authorship and resumes. Specific business arrangements or sole developer status were not independently proven.
- MCA at Sharda University is repeated in resume files, but no school verification was obtained.

### TODO_OWNER_VERIFY before stronger claims

- `TODO_OWNER_VERIFY`: Azaeron current deployment health, real users, production topology, and which optional integrations are enabled.
- `TODO_OWNER_VERIFY`: SHAPES production deployment topology and operational processes actually running.
- `TODO_OWNER_VERIFY`: Friends Aluminium Works commercial arrangement and measured outcomes.
- `TODO_OWNER_VERIFY`: Zam Zam Academy source repository, ownership detail, and client production status; the supplied Netlify preview is represented as a hosted prototype.
- `TODO_OWNER_VERIFY`: final portfolio domain and contact delivery credentials.
- `TODO_OWNER_VERIFY`: whether project repositories may be made public for direct source inspection.
- `TODO_OWNER_VERIFY`: Verity and The Scent Bar contribution boundaries, final deployment state, and repository publication.
- `TODO_OWNER_VERIFY`: AccessForge deployment and ownership. Local source and tests now support a local-build case, while no production service is claimed.

No traffic, revenue, uptime, release-count, performance, customer-count, or coverage claims appear in public copy.

## Information architecture

`/` orientation, flagship and engineering surface; `/work` separates live, in-development and prototype/research work; `/work/[slug]` has ten project narratives with current status; `/engineering` links product, data, delivery, evidence and civic workflow decisions; `/labs` labels civic and research prototypes; `/about` biography and portrait; `/resume` factual interactive and printable resume; `/notes` and `/notes/[slug]` one authored engineering note; `/contact` functional inquiry; `/privacy`; 404, loading, and error surfaces. Legacy `/writing` paths redirect to `/notes`. Implementation notes are optional disclosures in case studies.

## Architecture

Next.js App Router and strict TypeScript render mostly on the server. Browser-side components handle navigation, active case-study contents, theme preference, the contact form, and lightweight Web Vitals reporting. A FastAPI service validates and persists inquiries using SQLAlchemy; Alembic owns schema changes. PostgreSQL is production storage, SQLite is for local/unit tests. Browser requests go to same-origin Next route handler, which forwards to the private API and does not expose service credentials. Email dispatch is an optional adapter; persistence is the delivery source of truth. No public success without committed storage. Docker Compose describes the deployable topology.

## Quality budgets and checks

- LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1 are targets requiring field confirmation.
- Initial page JavaScript budget: ≤ 160 KB transferred including framework; no third-party browser scripts by default. V4 local Lighthouse lab measured about 155 KB on Home and Work. Home LCP was 2.6 s and Work LCP 2.3 s; both had CLS 0. These are lab results, not field metrics.
- Portrait ≤ 300 KB delivered; no remote font. Self-host/system typography.
- Semantic HTML, visible keyboard focus, skip link, error announcements, touch targets, reduced-motion rules; target WCAG 2.2 AA.
- CSP, secure headers, server-side validation, spam trap, per-IP throttling, bounded body, safe error responses, correlation IDs, no full message logging. ASVS 5.0 is a reference, not a compliance claim.
- CI: format, lint, types, unit/API tests, migration check, build, browser journey, axe, dependency and secret scans, link and metadata checks, container build where runner permits.

## Release boundary

Local verification is distinct from a production deployment. Public domain, DNS, TLS, database, and email credentials remain owner/environment inputs. `RELEASE_CERTIFICATION.md` must report performed checks and unresolved gates honestly.
