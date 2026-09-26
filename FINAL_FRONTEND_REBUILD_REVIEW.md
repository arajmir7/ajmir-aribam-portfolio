# Final frontend rebuild review

**Review date:** 2026-09-26

**Scope:** The public Next.js interface. Backend contracts, persistence, migrations, and private routes were preserved.

## Implemented direction

The frontend now presents Ajmir Aribam before project imagery. Home opens with the name, role, engineering position, selected-work action, About route, résumé route, and a compact four-part proof strip. No application screenshot appears in the hero. The next section remains visible on common desktop viewports.

The visual system uses the approved monogram, a warm neutral canvas, ink-like text, a restrained blue accent, controlled surfaces, and a 1240 px content limit. Light and dark themes use semantic tokens for canvas, surfaces, type, borders, interaction, focus, and state. The header retains the requested Work, Engineering, About, Notes, Résumé, theme, and Contact routes.

## Project presentation

Home shows four selected projects: Azaeron, Azaeron Verity, AccessForge, and SHAPES India. They use an even two-column editorial grid on desktop and compact single-column cards on mobile. Screenshot height is capped at 210 px, including the 390 px layout. Project metadata, maturity, product summary, role, and case link remain visible without hover.

Work uses the same four featured projects in a balanced grid. The other five records remain compact archive rows with small thumbnails. Live, in-development, and prototype labels continue to come from the project content model.

Every project case now follows eight explicit sections: Product, Problem, Contribution, Decisions, System, Quality and evidence, Current state, and Limits. The opening is text first. The lead visual is centered and capped at 960 px wide and 360 px high on desktop. Internal verification markers stay in the content source and are converted to natural visitor-facing limitation text.

## Supporting pages

Engineering remains a connected concerns model rather than a skills grid. About keeps the portrait and personal operations-to-software narrative. Home now previews the one published engineering note without generating filler. The Notes index remains editorial. Contact retains the established public API contract and compact form. The résumé remains selectable, ATS-readable text with a one-page A4 print layout.

## Executed review

`make verify` passed on the frontend candidate. It covered formatting, frontend and backend lint, strict TypeScript, four frontend tests, eight backend tests, PostgreSQL migration and drift checks, two PostgreSQL integration tests, concurrency and isolated restore checks, nine Playwright suites, dependency audits, full-history and staged secret scans, both production container builds, an isolated Compose persistence and origin check, and `git diff --check`.

The browser suites visited 19 public routes. They checked canonical metadata, Open Graph and Twitter images, sitemap, robots, icons, manifest, security headers, internal links, project maturity copy, case structure, contact success and failure behavior, keyboard navigation, menu behavior, image decoding, browser errors, and horizontal overflow across 15 widths from 320 to 2560 px. Axe reported no WCAG A/AA violations for any route in either theme.

Full-page screenshots were generated for all 19 routes at 390, 768, 1440, and 1728 px in light and dark themes: 152 route captures. Eighteen additional captures covered the open mobile menu and contact validation, success, service error, and offline states. All captures were inspected for first-viewport identity, type hierarchy, line wrapping, image scale and crop, project hierarchy, whitespace, footer consistency, and state clarity.

The résumé export was independently rendered and inspected. It is one 595.92 × 842.88 point A4 page with extractable text and no visible clipping or overlap. The PDF is not tagged.

All three public project destinations and all four social destinations returned HTTP 200 during a fresh 2026-09-26 link sweep. SHAPES still has no public CTA because its destination is not confirmed.

A three-run loopback Chromium observation against the production build recorded median LCP of 352 ms at 390 px and 356 ms at 1440 px, CLS 0 at both widths, and approximately 282–296 KB transferred for the first Home load. These are local lab observations, not field Core Web Vitals or production guarantees.

## Release boundary

No production deployment was performed. No production domain, TLS configuration, database, migration, inquiry, notification, monitoring result, backup, restore, rollback, uptime, user metric, or availability result is claimed. A final authenticated hosting target and canonical HTTPS origin are still required before production smoke checks can run.
