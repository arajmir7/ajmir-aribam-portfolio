# Final frontend rebuild review — V9 local candidate

**Review date:** 2026-09-25

**Scope:** the public Next.js experience. The private inquiry API, database schema and HTTP contracts were preserved.

**Release boundary:** local candidate only. No push or public deployment is claimed.

## Audit and design decision

The baseline had reliable project evidence and a working contact path, but the first viewport made the role a small label, gave sign-in captures too much area, repeated live projects on Home, and made Work and the case studies taller than the information required. Current pages were captured before editing at 320, 360, 390, 430, 768, 1024, 1280, 1440, 1728, 1920 and 2560 px. The audit included routes, content data, brand assets, imagery, local font, themes, responsive CSS, contact integration, tests, Docker/Compose and release documentation. Captures are local QA output and are excluded from Git.

Three directions were compared before implementation:

| Direction           | Structure                                               | Decision                                                                          |
| ------------------- | ------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Technical editorial | Large reading column, ruled margins, quiet media        | Clear, but too close to the existing hierarchy.                                   |
| Product engineering | Media-led project gallery and dense product cards       | Useful product evidence, but too many repeated surfaces.                          |
| Systems identity    | Compact evidence rail, layered archive, narrative cases | Selected for fast orientation, technical identity and scalable project hierarchy. |

The selected system uses a cool neutral canvas, restrained blue interaction color, thin boundaries, a 12-column desktop rhythm and single-column mobile reading order. Semantic light and dark tokens cover canvas, surfaces, text, borders, actions, focus and state. The brand uses the supplied AA geometry and wordmark variants; no new mark was drawn. The Open Graph image, favicon colors, manifest and footer now follow the same visual language.

## Public information architecture

- **Home:** Ajmir Aribam and Software Engineer are primary text. The value proposition, work and About routes are visible immediately. One compact Azaeron product surface supplies evidence. Four selected cases—Azaeron, Verity, AccessForge and SHAPES—show range without turning Home into the archive. A four-layer engineering snapshot and small portrait introduction follow.
- **Work:** four featured records have deliberate hierarchy; the five remaining records use compact rows. Every record exposes product, engineering focus, maturity, year and case route. The archive remains nine projects: three in the Live maturity group, four in development and two prototypes. The current SHAPES destination needs confirmation.
- **Cases:** all nine use five narrative sections—product, contribution, decisions, system, evidence and current state—with a bounded hero visual, compact facts and an optional second visual. Project-specific text keeps financial state, publishing, document provenance, accessibility verification, procurement and prototype limits distinct.
- **Engineering:** one seven-layer system story links each concern to a case, followed by three concrete questions and a concise quality approach.
- **About, Notes, Résumé, Labs and Contact:** retained the truthful source material and received the shared type, surface and navigation system. Notes has one real article. The résumé remains text-first with A4 print styles. Labs keeps both projects labeled as prototypes.

Visitor copy avoids invented usage, revenue, performance, deployment and ownership claims. Cases with unresolved personal contribution boundaries say so plainly. Source-only `TODO_OWNER_VERIFY` markers remain in the content registry and are never rendered.

## Responsive, accessibility and performance review

At 390 px, the name, role, proposition, work action and first evidence surface appear before the long-form sections. The case facts become two columns, local case navigation wraps, and diagrams become a single reading column. At larger sizes, media remain bounded; the case hero visual is at most 410 px tall. The tall Verity development captures are top-cropped for context rather than shrunk into unreadable full-page posters. Motion is limited to small image and control responses and stops under reduced-motion preference.

The existing skip link, semantic landmarks, single H1 per page, keyboard menu, visible focus, official-style social marks, contact labels and status messages remain in use. The rebuild corrected a light-theme archive metadata contrast failure found by axe. Automated results and responsive/browser execution are recorded below; they are not a human screen-reader certification.

All primary content is server-rendered. The interactive client scope is limited to menu/theme, contact, print and first-party telemetry. Project images use Next image sizing and reserve layout space. A single loopback Chromium run against the production build observed LCP of 180 ms at 390 px and 368 ms at 1440 px, with CLS 0 in both runs; first-page script transfer was about 148 KB. These are local lab observations, not field Core Web Vitals or a production performance guarantee. All 181 image elements across the 19 routes decoded successfully when requested.

## Executed verification

`make verify` passed on the V9 implementation: formatting, lint and public-name check, strict TypeScript, frontend unit tests (2 passed), backend tests (4 passed, with one database-specific test exercised separately), PostgreSQL migration/inquiry integration (1 passed), production build, and all 8 Playwright tests. The browser suite visited 19 content routes, checked internal links and metadata, exercised success/service-failure/offline contact states, scanned light and dark themes with axe, checked 15 widths from 320 to 2560 px for overflow, captured full pages in both themes, and generated an A4 résumé PDF. `npm audit` and `pip-audit` reported no known vulnerabilities at the configured gate; Gitleaks found no leaks in committed or staged source. Both Docker images built, and isolated Compose startup passed readiness, persistence and foreign-origin rejection.

Full-page route captures and six first-viewport contact sheets were visually inspected. The print résumé rendered to one A4 page with selectable text and no visible clipping. The external link sweep resolved the social destinations, Azaeron, Friends Aluminium Works and the Zam Zam preview. The SHAPES destination timed out from this environment, so its current public URL needs confirmation before launch.

## Five-second and project-scan review

At 1440 and 390 px, Home visibly answers: Ajmir Aribam; Software Engineer; products and supporting systems; View work; Azaeron as the first evidence; Contact in the header and final action. Featured records expose a product description, engineering focus, maturity and case link without hover.

## Known limits and deployment readiness

The final domain, HTTPS proxy, production secrets, database restore, inquiry notification ownership, retention scheduler, alerts, live-origin metadata review, physical-device testing, human screen-reader review and field performance remain deployment work. The SHAPES public destination is unresolved in the final link sweep. A local build or automated scan cannot certify any represented project as production-ready. The private API and persistence have not been redesigned in this frontend release.
