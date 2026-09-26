# Release certification — final frontend candidate

**Review date:** 2026-09-26

**Scope:** The final Git commit containing this document.

**Decision:** The local source, browser, security, container, and integration gates pass. Production deployment remains unexecuted because no authenticated hosting target or confirmed canonical HTTPS origin is available.

## Local release gate

`make verify` passed on the final candidate and executed:

- Prettier and Ruff format checks.
- ESLint, the canonical public-name check, and Ruff lint.
- Next.js route generation and strict TypeScript.
- Four frontend unit tests and eight backend unit/API tests.
- A clean PostgreSQL migration, Alembic drift check, two PostgreSQL integration tests, concurrent rate-window behavior, and an isolated dump/restore drill.
- The production Next.js build and nine Playwright suites.
- `npm audit`, `pip-audit`, and Gitleaks scans of Git history and staged source.
- Production frontend and backend container builds.
- Isolated Compose startup, health, contact persistence, and foreign-origin rejection.
- `git diff --check`.

## Browser and accessibility evidence

The browser suite visited these 19 routes:

- `/`
- `/work`
- `/work/azaeron`
- `/work/shapes-india`
- `/work/friends-aluminium-works`
- `/work/azaeron-verity`
- `/work/the-scent-bar-retail-os`
- `/work/azaeron-construction-procurement`
- `/work/accessforge`
- `/work/scmirn`
- `/work/zam-zam-academy`
- `/engineering`
- `/labs`
- `/about`
- `/resume`
- `/notes`
- `/notes/state-is-a-boundary`
- `/contact`
- `/privacy`

All routes passed canonical URL, title, Open Graph, Twitter image, sitemap inclusion, internal-link, public-copy, browser-error, and image decoding checks. The suite also checked the manifest, favicon and Apple-touch assets, robots rules, 404 behavior, security headers, contact readiness, same-origin handling, persistence, service failure, offline handling, keyboard navigation, focus restoration, mobile navigation, and brand legibility.

Axe reported no WCAG A/AA violations on all 19 routes in light and dark themes. Responsive checks found no horizontal overflow across 15 widths from 320 to 2560 px. This is automated evidence, not human screen-reader or accessibility certification.

## Visual evidence

The final candidate generated and received manual review of 152 full-page route captures: all 19 routes at 390, 768, 1440, and 1728 px in light and dark themes. Eighteen additional captures covered the open mobile menu and contact validation, success, service error, and offline states.

The review covered first-viewport identity, logo and name legibility, type wrapping, project hierarchy, screenshot scale and crop, case-study rhythm, whitespace, footer consistency, mobile navigation, and form-state clarity. No visible clipping, missing image, uncontrolled project visual, broken hierarchy, or inconsistent footer was found.

The résumé export is one A4 page with extractable text and no visible clipping or overlap. It is not a tagged PDF.

## Outbound destination evidence

On 2026-09-26, fresh HTTP checks returned 200 for the three public project destinations and the GitHub, LinkedIn, Instagram, and X profile URLs. SHAPES exposes no public CTA because its destination is not confirmed. An HTTP response does not verify ownership, authenticated behavior, business results, or availability.

## Performance evidence

A three-run loopback Chromium observation against the production build recorded:

| Viewport   | Median LCP | CLS | Approximate first-load transfer |
| ---------- | ---------: | --: | ------------------------------: |
| 390 × 900  |     352 ms |   0 |                          282 KB |
| 1440 × 900 |     356 ms |   0 |                          296 KB |

These are local lab observations. No production Lighthouse result, field Core Web Vitals, traffic metric, user metric, uptime history, or availability claim exists.

## Production evidence

None. No production service, DNS record, TLS setting, environment variable, secret, database, migration, inquiry, notification, monitoring check, backup, restore, rollback, or deployment image was changed or tested for this candidate.

The repository requires a final canonical HTTPS origin, PostgreSQL, a contact token of at least 32 characters, and a known build revision. The public contact route enforces the configured origin and the private API retains `/inquiries`, `/health/live`, and `/health/ready`.

## Open limitations

- A production target, canonical HTTPS origin, DNS control, and valid hosting credentials are unavailable.
- Production contact delivery ownership and a staffed inquiry process are unconfirmed.
- Production backup, restore, monitoring, alerting, rollback, TLS, proxy, and redirect behavior have not been exercised.
- The SHAPES production destination and exact contribution boundary still require owner confirmation.
- Physical-device, human screen-reader, and tagged-PDF review have not been performed.
- The exact final commit hash is reported by Git after this certification is committed.
