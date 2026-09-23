# Final design review

- **Baseline:** `7215fab8ea1e0fd2f4372a92c03d69693cd52ced`
- **Review date:** 2026-09-23
- **Scope:** public frontend and content presentation; monorepo and private inquiry API boundaries retained.

## What changed

| Baseline weakness                                                                                | Change                                                                                                                                                                                      | Result checked                                                                      |
| ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Case studies opened with similar text-heavy audit sections.                                      | Azaeron now leads with its public product surface and invoice state; SHAPES follows public experience into publishing; Friends leads with project photography, catalogue, and inquiry path. | Full-page desktop/mobile review of all three cases.                                 |
| Work cards had no visual product proof.                                                          | Added responsive captures from the live public sites and existing Friends project photography; Azaeron is the featured full-width card.                                                     | Images decoded at every tested width; no broken images or horizontal clipping.      |
| Repository paths, revisions, owner-verification markers, and reviewer language reached visitors. | Kept provenance and unknowns in internal content; rewrote visitor copy and placed deeper technical detail in optional implementation notes.                                                 | Browser text scan across all 13 public routes found none of the prohibited strings. |
| Utility routes repeated a large conversion footer and minor pages had too much visual weight.    | Added compact footer on cases, Engineering, Resume, Notes, Labs, Privacy, and 404; reduced Labs and Notes to truthful small collections. Contact closes with a route to selected work.      | Full-page screenshots of every route at 390 and 1440 px.                            |
| Mobile navigation, active location, dark theme, and print layout needed a final pass.            | Added an accessible disclosure menu, current-route and current-section states, a mobile case contents rail, theme contrast corrections, and two-page A4 resume print rules.                 | Keyboard menu/anchor tests, axe scans, viewport sweep, and rendered A4 PDF review.  |

The visual system retains warm paper, graphite, rust, serif supporting copy, and architectural rules. Images are treated as content within the grid. The supplied About portrait is unchanged in identity and remains the primary personal photograph.

## Before and after captures

These first-viewport captures were taken from the baseline and final local builds at the same viewport sizes. Full-page captures for all routes were also compared locally.

| View                             | Baseline                                          | Final                                           |
| -------------------------------- | ------------------------------------------------- | ----------------------------------------------- |
| Home, 1440 px                    | [Before](screenshots/home-desktop-before.webp)    | [After](screenshots/home-desktop-after.webp)    |
| Home, 390 px                     | [Before](screenshots/home-mobile-before.webp)     | [After](screenshots/home-mobile-after.webp)     |
| Azaeron, 1440 px                 | [Before](screenshots/azaeron-desktop-before.webp) | [After](screenshots/azaeron-desktop-after.webp) |
| SHAPES India, 1440 px            | [Before](screenshots/shapes-desktop-before.webp)  | [After](screenshots/shapes-desktop-after.webp)  |
| Friends Aluminium Works, 1440 px | [Before](screenshots/friends-desktop-before.webp) | [After](screenshots/friends-desktop-after.webp) |

## Validation

- All 13 public routes and 404 were captured at 390 and 1440 px. Home, all cases, About, and Contact were also captured in dark mode. A viewport sweep covered 14 paths at 320, 360, 375, 390, 430, 768, 1024, 1280, 1440, and 1728 px: no document overflow, clipped main headings/images, or broken images was detected. Representative first-view screenshots at each breakpoint were visually inspected.
- Playwright checked navigation, active links, mobile menu Escape/focus behavior, case anchors, live image decoding, contact success and email fallback, route metadata, internal links, sitemap, robots, and 404. Axe reported zero WCAG 2/2.1/2.2 A/AA violations on all 13 routes in light and dark themes. A color-transition contrast failure found during testing was fixed before the final scan.
- The resume produced a two-page A4 PDF with selectable text and the Operations Experience heading kept with its content. The loading and error components received copy and action review; an actual unexpected production exception was not forced solely to take a screenshot.

### Local mobile Lighthouse lab, production build

| Route   | Performance | Accessibility | Best practices | SEO |    LCP | CLS |  TBT |
| ------- | ----------: | ------------: | -------------: | --: | -----: | --: | ---: |
| Home    |         100 |           100 |            100 | 100 | 1.66 s |   0 | 6 ms |
| Azaeron |          99 |           100 |            100 | 100 | 2.24 s |   0 | 3 ms |
| About   |          99 |           100 |            100 | 100 | 2.23 s |   0 | 2 ms |

Lighthouse 13.5.0 measured about 152 KB of transferred script and no font transfer on each route. These are local lab results, not field Core Web Vitals or an INP measurement. The largest authenticated Azaeron surfaces were not available for safe public capture, so its visual shows the genuine public sign-in page. Human screen-reader review, physical-device review, and production monitoring remain deployment follow-ups.
