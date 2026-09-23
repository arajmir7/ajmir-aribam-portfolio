# Final design review

- **Candidate:** Portfolio V4, built on the prior local product pass at `7215fab8ea1e0fd2f4372a92c03d69693cd52ced`.
- **Review date:** 2026-09-23.
- **Scope:** Public frontend, project content, browser behavior, and print résumé. The private inquiry API contract remains unchanged.

## What changed

| Earlier issue                                                                     | V4 change                                                                                                                                                            | Review result                                                                                      |
| --------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| The opening described a technical approach before explaining the person and work. | The hero now says Software Engineer, names five capability areas, and states in plain English what Ajmir builds. Azaeron remains the flagship.                       | Recruiter scan: name, role, work, and first proof appear in the first viewport at 390 and 1440 px. |
| Engineering read as a nine-row résumé.                                            | Ten capability families now have concise explanations and links to specific project sections. AI Systems and Quality Engineering have their own grounded entries.    | Each family links to an inspectable case or a concrete local delivery practice.                    |
| All projects appeared similarly mature.                                           | Live Azaeron, SHAPES, and Friends remain primary. Verity and The Scent Bar have distinct in-development cards and case pages. SCMIRN appears in Labs as a prototype. | Browser checks confirm development labels and current limitations are visible.                     |
| Case introductions used abstract phrasing.                                        | Cards and case heroes first explain the product and its user. Technical depth follows in architecture, state, and release sections.                                  | Copy scan found no visitor-facing owner markers, source paths, credentials, or generic AI phrases. |
| Social links relied on text and arrows.                                           | About, Contact, and footer use SVG platform marks with visible labels or accessible names.                                                                           | Browser accessibility scans include the new links in both themes.                                  |
| Warm rust dominated the visual language.                                          | Neutral paper and graphite now carry the page; cobalt leads links and focus, emerald appears in technical states, and copper remains a small accent.                 | Full-page light and dark captures were reviewed for hierarchy and contrast.                        |
| The expanded résumé initially printed with poor page breaks.                      | Print CSS now breaks before Operations Experience and keeps individual work entries together.                                                                        | A4 PDF rendered as two pages with selectable text; both pages were visually inspected.             |
| The Work page shifted while streamed content replaced the loading view.           | The loading view now reserves the first viewport height, keeping the footer below the fold.                                                                          | Mobile Lighthouse Work CLS improved from 0.311 to 0 on a production build.                         |

## Source and status decisions

- **Azaeron:** Flagship billing and merchant workspace. Public sign-in and documentation captures are genuine public surfaces. No customer, uptime, or transaction metric is asserted.
- **SHAPES India and Friends Aluminium Works:** Live public sites, each with a distinct case narrative and genuine imagery.
- **Azaeron Verity:** Local document review and evidence graph implementation. Its own execution ledger says it is **not production ready** and has no approved production generative model or calibrated detector. The case uses local development captures and describes abstention explicitly.
- **The Scent Bar Retail OS:** Identity, branch, catalogue, and pricing foundations are implemented. The case states that inventory, purchasing, and POS remain future work and that current database/API runtime gates are open.
- **SCMIRN:** Local civic complaint and tracking code with experimental specialist-agent modules; shown as a prototype in Labs. Its README claims exceed what was independently demonstrated.
- **AccessForge:** No inspectable source was found in the available local projects. It is omitted pending `TODO_OWNER_VERIFY`, rather than given an unsupported case study.

## Browser and copy review

The browser gate covers 15 public routes, internal links, canonical metadata, sitemap, robots, image decoding, contact success and failure, mobile menu focus/Escape behavior, case anchors, and visitor-copy exclusions. All 15 routes were captured full-page at 390 and 1440 px in light and dark themes (60 local screenshots in ignored `frontend/test-results/`). The full-page captures and first-viewport contact sheets were checked for hierarchy, clipping, repeated imagery, and project status. The new Verity and Scent cases were revised after that review to avoid repeating their hero visuals.

The responsive sweep covered every public route at 320, 360, 375, 390, 412, 430, 768, 820, 1024, 1280, 1440, 1600, 1728, and 1920 px. It found no document overflow. Axe reported zero automated WCAG 2/2.1/2.2 A/AA violations across all 15 routes in both themes. A dark-theme color transition found during the first pass was removed before the passing rerun. These results are automated checks, not an accessibility certification.

The dedicated copy pass read routes in navigation order and shortened abstract headings, removed a portfolio cliché from the Friends case, and made the sole engineering note's title specific. Status and limitations remain visible without turning visitor pages into internal verification logs.

### Local mobile Lighthouse lab

Lighthouse 13.5.0 ran against the production build on localhost. These are lab measurements, not field Core Web Vitals.

| Route | Performance | Accessibility | Best practices | SEO |   LCP | CLS |   TBT |
| ----- | ----------: | ------------: | -------------: | --: | ----: | --: | ----: |
| Home  |          97 |           100 |            100 | 100 | 2.6 s |   0 | 30 ms |
| Work  |          99 |           100 |            100 | 100 | 2.3 s |   0 | 10 ms |

Home LCP was 0.1 s above the 2.5 s target in this run. Both pages transferred about 155 KB of script, within the 160 KB initial-page budget. Field LCP and INP still need production traffic.

## Release boundary

`make verify` must pass on the final candidate before the local release gate is claimed in `RELEASE_CERTIFICATION.md`. The command includes PostgreSQL migration/inquiry integration, frontend and backend tests, browser/axe coverage, dependency and secret scans, container builds, and isolated Compose contact and origin checks. Screenshots, the rendered print PDF, local databases, and test output remain outside Git.

Human screen-reader review, physical-device review, field performance measurements, and production monitoring remain deployment follow-ups. This review does not claim a public deployment.
