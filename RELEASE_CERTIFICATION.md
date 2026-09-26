# Release certification — deployment blocked at external boundary

**Review date:** 2026-09-26

**Scope:** The final Git commit containing this document.
**Decision:** Local and hosted release gates pass. No production deployment or production smoke evidence exists because the final domain and an authenticated hosting target are unavailable.

## LOCAL VERIFIED EVIDENCE

`make verify` passed on the final source tree. It executed formatting, ESLint, public-name checks, Ruff, strict TypeScript, four frontend unit tests, eight backend unit/API tests, a clean PostgreSQL migration and Alembic drift check, two PostgreSQL integration tests, the Next.js production build, nine Playwright suites, dependency audits, full-history and staged secret scans, both Docker builds, an isolated Compose topology test, and `git diff --check`.

The PostgreSQL gate issued ten concurrent submissions for one rate key and observed exactly five accepted and five rate-limited results. It then created a custom-format dump, restored it to an isolated database, and recovered a known marker inquiry. The Compose gate reached healthy database, private API and public frontend services; persisted one same-origin contact submission; and rejected a foreign origin. Separate negative checks confirmed that the frontend image rejects a non-HTTPS canonical origin and that the production backend image rejects SQLite.

Production configuration now requires PostgreSQL, a contact token of at least 32 characters, and a known build revision. The public contact route requires an exact origin, accepts JSON within its size limit, and ignores client-supplied forwarding headers unless one supported header is explicitly trusted. The PostgreSQL rate window uses an atomic upsert. Database pool size, overflow, timeout and recycle settings are explicit. The runtime and migration database URLs can use separate roles.

The three exposed project destinations and the four social profile URLs each returned HTTP 200 on 2026-09-26. SHAPES has no public project CTA because its current destination remains unconfirmed. This response check does not establish ownership, authenticated behavior, availability, or business results.

## HOSTED CI EVIDENCE

GitHub Actions `quality-gate` run [36206572286](https://github.com/arajmir7/ajmir-aribam-portfolio/actions/runs/36206572286) passed for commit `aef6a2e`. Its web, API, full-history secret scan and dependent Compose integration jobs all completed successfully on GitHub-hosted runners. Actions are pinned to full commit SHAs; the Gitleaks container is pinned by digest; permissions are read-only; jobs have timeouts; and the integration job cannot start until the other release jobs pass.

The hosted gate associated with the final documentation commit repeats those same checks. GitHub's check suite is the source of its exact run identifier and result.

## PRODUCTION DEPLOYMENT EVIDENCE

None. No service, database, DNS record, TLS setting, secret, environment variable, migration or release image was changed in a production environment.

The repository contains no production URL, hosting token, database credential or configured GitHub deployment secret. The installed Render CLI reports an expired or unauthorized session. The prompt leaves `<FINAL_DOMAIN>` unresolved. The GitHub profile currently points to `ajmir.me`; on 2026-09-26 that hostname resolved to GitHub Pages, served an older Jekyll page over HTTP, and did not provide a working HTTPS origin during the check. It was not assumed to be the selected production origin.

## PRODUCTION SMOKE EVIDENCE

None. Production TLS, redirects, canonical metadata, social previews, health, persistence, notification, monitoring and performance cannot be tested before a deployment exists.

`scripts/production-smoke.sh` is ready to check the selected HTTPS origin, representative routes, security headers, canonical URL, robots, sitemap, icons, Open Graph image, 404 behavior, public dependency readiness and deployed revision. The scheduled `production-monitor` workflow uses the same check after the `PRODUCTION_URL` and `PRODUCTION_REVISION` repository variables are configured.

## HUMAN REVIEW

The approved interface remained design-frozen. The final candidate regenerated full-page captures for all 19 public routes at 390, 768, 1440 and 1728 px in light and dark themes. The captures were reviewed for first-viewport composition, logo and name legibility, wrapping, project hierarchy, image cropping, case-study rhythm, whitespace and footer consistency. Mobile navigation and contact validation, success, service-error and offline states were also reviewed in both themes. No visible clipping, broken image, horizontal overflow, hierarchy regression or footer inconsistency was found.

The résumé was regenerated and inspected as a 595.92 × 842.88 point A4 PDF. It contains one page and extractable text, and its rendered page showed no clipping or overlap. The PDF is not tagged, so this inspection does not establish PDF screen-reader accessibility.

Automated axe checks covered all 19 routes in both themes. Keyboard navigation, focus, menu behavior, form errors, landmarks, headings, labels, image alternatives and responsive overflow are covered by the browser suite. This evidence does not constitute human accessibility certification, a physical-device review or a real screen-reader review.

## OPEN LIMITATIONS

- There is no public URL, deployed platform, production database, production migration record or production contact record.
- Production email delivery or a staffed pending-inquiry schedule is not configured.
- Provider backups, an independent production export and an isolated production-data restore have not been executed. The restore evidence is against a disposable PostgreSQL instance.
- Monitoring is defined but inactive until a production URL and alert recipient exist.
- No production Lighthouse run, field Core Web Vitals, uptime history, traffic, user metric or availability claim exists.
- No production reverse-proxy IP-header behavior, TLS certificate, apex/`www` redirect or DNS ownership has been verified.
- The repository documents an executable image and database rollback procedure; no production rollback has been performed.

## OWNER ACTIONS

Provide one authenticated production target with DNS control and confirm the final canonical HTTPS origin. That single handoff must include authority to create the web, private API and PostgreSQL services and to configure required secrets; deployment and external verification can then continue without another design pass.

## Release report

- **FINAL COMMIT:** Reported by Git after this certification is committed.
- **PUBLIC URL:** Unavailable.
- **DEPLOYMENT PLATFORM:** Unselected; Render CLI access is unauthorized.
- **PRODUCTION SERVICES:** None deployed.
- **DATABASE STATE:** Clean migrations, concurrency behavior and isolated restore pass locally and in hosted CI; no production database exists.
- **CI RESULT:** GitHub Actions release gate passes for the published code candidate; final commit status is attached to the commit.
- **SECURITY RESULT:** Local and hosted configured checks pass; production proxy, DNS, TLS and secret-manager controls remain untested.
- **ACCESSIBILITY RESULT:** Axe and keyboard/browser checks pass; no certification, physical-device or screen-reader claim.
- **PERFORMANCE RESULT:** Local build behavior only; no production measurements.
- **CONTACT PIPELINE RESULT:** Full isolated browser-to-PostgreSQL flow passes; no production submission or delivery evidence.
- **MONITORING RESULT:** Workflow implemented; inactive without production variables and an alert recipient.
- **BACKUP/RESTORE RESULT:** Disposable PostgreSQL dump and isolated restore pass locally and in hosted CI; no production backup evidence.
- **ROLLBACK METHOD:** Previous immutable images plus schema-compatible rollback, or pre-release backup restoration into a new database, as documented in `docs/production-deployment.md`.
- **KNOWN LIMITATIONS:** Listed above without production claims.
- **REMAINING OWNER ACTIONS:** One authenticated deployment target with DNS control and the final canonical HTTPS origin.
