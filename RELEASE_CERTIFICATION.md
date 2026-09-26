# Release certification — local portfolio candidate

**Review date:** 2026-09-26

**Scope:** The source tree in this commit.

**Decision:** The local release gate and screenshot review passed. This document does not certify a production deployment. No push or deployment was performed.

## Candidate reviewed

The approved navigation, project order, nine case studies, Ajmir Aribam identity and light/dark system remain in place. Home now gives the introduction and selected projects more balanced space at desktop widths. The header uses a readable name beside the existing mark. Light surfaces have clearer separation; case studies use a tighter desktop reading column. Project screenshots were kept at or below their previous display sizes. No new project cards or decorative effects were added.

Visitor copy was reviewed across the public routes. Project maturity and evidence limits remain visible: three projects labeled live, four systems in development and two prototypes. The unconfirmed SHAPES destination has no public CTA. Notes stays in primary navigation because its one published technical article is substantive and connects directly to the case studies; no additional note was invented. The résumé keeps selectable text and a one-page A4 print layout.

## Automated local checks

`make verify` passed on this source tree. It ran formatting, lint, strict TypeScript, frontend unit tests, backend tests, PostgreSQL migration and inquiry integration, the production Next.js build, Playwright browser tests, dependency audits, Gitleaks, frontend and backend Docker builds, isolated Compose health and persisted-contact checks, foreign-origin rejection, and `git diff --check`.

Nine Playwright tests passed. They covered all 19 public routes, unique page titles, exact canonical paths, Open Graph and Twitter image metadata, sitemap and robots, image decoding, unknown-route 404, keyboard and mobile navigation, real contact persistence plus validation, service failure and offline fallback, browser errors, responsive overflow, axe scans in both themes, and full-page screenshots. The overflow sweep covered 15 widths from 320 to 2560 px. Two frontend unit tests and four backend tests passed; the PostgreSQL integration check passed separately. Both dependency audits reported no known vulnerabilities at their configured thresholds. Gitleaks reported no leaks in committed or staged source. Both images built; Compose reported healthy services, one persisted inquiry and a rejected foreign origin.

These are local automated results, not production availability or human accessibility certification.

## Human visual review

Full-page captures of all 19 routes were reviewed at **390, 768, 1440 and 1728 px**, in **light and dark** themes. Review included the first viewport, logo legibility, wrapping, project hierarchy, screenshot cropping, case-study rhythm, whitespace and footer consistency. The 390 px mobile menu was reviewed in both themes. Contact validation, success, service-error and offline states were reviewed at 390 and 1440 px in both themes. No clipping or horizontal overflow was found in these captures.

The résumé PDF rendered on one A4 page with selectable text and no visible clipping. Local screenshots and PDF inspection files are excluded from Git. Automated axe scans and screenshot review do not establish full accessibility compliance or physical-device behavior.

## Links, metadata and deployment assumptions

The exposed project destinations for Azaeron (`https://invoice.web-com.live/`), Friends Aluminium Works (`https://friendsaluminiumworks.com/`) and the Zam Zam Academy hosted preview (`https://storied-bombolone-5d4a8f.netlify.app/`) each returned HTTP 200 during this review. That verifies the public destination responded; it does not verify authenticated functions, ownership, uptime or business results. SHAPES keeps its case study without an outbound site link until its current address is confirmed.

The local production build returned route-specific canonical URLs, Open Graph and Twitter images, a 19-entry sitemap, robots rules that exclude `/api/`, the SVG favicon, 180 px Apple-touch icon, 192/512 px icons and the web manifest with successful asset responses. Response headers included CSP, HSTS, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, referrer and permissions policies. A Docker image built with `NEXT_PUBLIC_SITE_URL=https://example.com` was checked for HTTPS canonical, sitemap, robots and Open Graph URLs. Its public contact route rejected a foreign `Origin`; the same-origin request returned a service-unavailable response when no private API was configured. The `example.com` origin is only a local build check.

`NEXT_PUBLIC_SITE_URL` is baked into the frontend build and must match the deployed HTTPS browser origin. The private backend needs a database URL, a strong internal contact token and production secrets. The local Compose check establishes that an accepted inquiry reaches PostgreSQL; it does not establish production email delivery, backups or monitoring. The public `/api/contact` and private `/inquiries`, `/health/live` and `/health/ready` contracts remain unchanged.

## Remaining production gates

A real HTTPS domain and reverse proxy, final environment values and secrets, SMTP or an owned pending-inquiry review process, restore-tested backups, retention scheduling, alerts, live canonical/social-preview checks, human accessibility review and field Core Web Vitals remain unverified. No production traffic, user metrics, uptime or operational outcome is claimed here.
