# Portfolio product specification

## Purpose and positioning

MD AJMIR ARIBAM — Software Engineer, Backend, Cloud & DevOps. The first screen names the engineer, the type of systems built, three inspectable projects, and direct paths to work, resume, GitHub, LinkedIn, and contact. MCA appears in About and Resume only.

The visual language is an editorial engineering record: warm paper, deep ink, restrained copper, large typographic hierarchy, ruled grids, precise labels, and readable architecture drawings. No decorative terminal, rating bars, or ungrounded claims.

## Evidence inventory (inspected 2026-09-23)

The target directory and linked GitHub portfolio repository were empty. No `reference/` or `project-facts.md` was present. Supplied photo: `/Users/ajmiraribam/Downloads/Image Sep 12, 2026.png`, 1122×1402. Several resume versions were inspected. Source implementations were inspected in `/Users/ajmiraribam/Projects/Invoice`, `/Users/ajmiraribam/Projects/ShapesIndia`, and `/Users/ajmiraribam/Projects/First`; their Git histories show Ajmir Aribam as an author. The older invoice checkout and unrelated Azaeron Verity repository were identified but do not establish claims about the current invoice deployment.

The three project GitHub remote URLs returned public HTTP 404 during verification. They may be private or unpublished. Source paths and revisions remain in internal content/provenance records; visitor pages do not expose local paths, revision hashes, or broken repository links. Public source access is `TODO_OWNER_VERIFY`.

### VERIFIED from implementation or live pages

- Azaeron invoice repository contains React/TypeScript/Vite frontend, Express/Mongoose API, invoice lifecycle validation, permission mapping, rate limiting, readiness endpoint, GitHub Actions release gate, and Render/Vercel configuration. Source: `Projects/Invoice` paths and commit `66b0f7c`.
- SHAPES live site presents the institution and six centres. Its source contains a Flask app, SQLAlchemy models, migrations, controlled content publishing, permission checks, health/readiness, deployment scripts and GitHub Actions. Source: `Projects/ShapesIndia`, commit `0dbdf15`, and https://shapesindia.org/.
- Friends Aluminium Works live site presents products, services, projects and contact information. Its source is a React/TypeScript/Vite site with SEO metadata and a quote flow that opens WhatsApp; contact opens the user's mail client. Source: `Projects/First`, commit `13aa4bf`, and https://friendsaluminiumworks.com/.
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
- `TODO_OWNER_VERIFY`: Zam Zam Academy source repository, ownership detail, and current prototype status beyond the user's explicit classification.
- `TODO_OWNER_VERIFY`: final portfolio domain and contact delivery credentials.
- `TODO_OWNER_VERIFY`: whether project repositories may be made public for direct source inspection.

No traffic, revenue, uptime, release-count, performance, customer-count, or coverage claims appear in public copy.

## Information architecture

`/` orientation and selected work; `/work` all production cases; `/work/[slug]` distinct Azaeron, SHAPES, and Friends product narratives; `/engineering` capability and project map; `/labs` clearly labeled prototype; `/about` biography and portrait; `/resume` factual interactive and printable resume; `/writing` and `/writing/[slug]` one authored engineering note; `/contact` functional inquiry; `/privacy`; 404, loading, and error surfaces. Implementation notes are optional disclosures in case studies. Each page has a reason to exist and a path to deeper detail.

## Architecture

Next.js App Router and strict TypeScript render mostly on the server. Browser-side components handle navigation, active case-study contents, theme preference, the contact form, and lightweight Web Vitals reporting. A FastAPI service validates and persists inquiries using SQLAlchemy; Alembic owns schema changes. PostgreSQL is production storage, SQLite is for local/unit tests. Browser requests go to same-origin Next route handler, which forwards to the private API and does not expose service credentials. Email dispatch is an optional adapter; persistence is the delivery source of truth. No public success without committed storage. Docker Compose describes the deployable topology.

## Quality budgets and checks

- LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1 are targets requiring field confirmation.
- Initial page JavaScript budget: ≤ 160 KB transferred including framework; no third-party browser scripts by default. Lighthouse 13.5.0 local mobile lab measured 152 KB of script transfer on the final homepage, which is not a field metric.
- Portrait ≤ 300 KB delivered; no remote font. Self-host/system typography.
- Semantic HTML, visible keyboard focus, skip link, error announcements, touch targets, reduced-motion rules; target WCAG 2.2 AA.
- CSP, secure headers, server-side validation, spam trap, per-IP throttling, bounded body, safe error responses, correlation IDs, no full message logging. ASVS 5.0 is a reference, not a compliance claim.
- CI: format, lint, types, unit/API tests, migration check, build, browser journey, axe, dependency and secret scans, link and metadata checks, container build where runner permits.

## Release boundary

Local verification is distinct from a production deployment. Public domain, DNS, TLS, database, and email credentials remain owner/environment inputs. `RELEASE_CERTIFICATION.md` must report performed checks and unresolved gates honestly.
