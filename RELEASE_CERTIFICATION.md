# Release certification — public work refinement

**Review date:** 2026-09-26

**Scope:** Local frontend candidate only.

**Decision:** `make verify` passed with exit code 0. The candidate is ready for deployment preparation, but no production deployment has been performed.

## Product boundary

The first Home viewport presents Ajmir Aribam, Software Engineer, a personal statement, supporting engineering copy and direct actions. It contains no project media or project card.

The Home sequence is personal introduction, engineering judgment, public work, current work, engineering note, personal bridge and contact. Work uses the same order: public work, current work, then Labs.

The `/about` route is a refined editorial engineering profile. It introduces Ajmir as a Software Engineer, then moves through concrete engineering capability, relevant banking and public-service context, current work, a personal closing, and a direct contact action. It uses only the optimized local portrait and contains no project media, dashboards, cards, or decorative visual effects.

The public collection contains four verified public destinations. The card status distinguishes the three live products from the hosted prototype:

| Project                 | Verified destination                            | Status           |
| :---------------------- | :---------------------------------------------- | :--------------- |
| Azaeron                 | `https://invoice.web-com.live/`                 | Live             |
| SHAPES India            | `https://shapesindia.org/`                      | Live             |
| Friends Aluminium Works | `https://friendsaluminiumworks.com/`            | Live             |
| Zam Zam Academy         | `https://storied-bombolone-5d4a8f.netlify.app/` | Hosted prototype |

Zam Zam Academy’s Netlify preview appears beside the live products because visitors can open it and inspect its deployed experience. It remains labelled **Hosted prototype** because hosting does not verify client ownership or production use. No public destination remains unverified.

## Fresh public-work captures

`frontend/scripts/capture-public-work.mjs` opened each configured destination in Chromium at 1440×900 and 390×844, waited for fonts, visible images and stable layout, then stored optimized local WebP assets. The tracked internal manifest is [public-captures.json](frontend/src/content/public-captures.json).

The current desktop captures are used by the corresponding portfolio cards:

- `frontend/public/images/projects/azaeron-public-desktop.webp`
- `frontend/public/images/projects/shapes-india-public-desktop.webp`
- `frontend/public/images/projects/friends-aluminium-works-public-desktop.webp`
- `frontend/public/images/projects/zam-zam-academy-public-desktop.webp` for the clearly labelled hosted-prototype card

Mobile companions were captured for all four destinations. The manifest records source URL, final URL, capture date, viewport, asset path and capture authority; none of that metadata is displayed to visitors.

## Local verification

The final `make verify` run passed:

- Prettier, ESLint, public-name checks, Ruff and strict TypeScript.
- Four frontend unit tests, eight backend tests and two PostgreSQL integration tests, with migration, drift, concurrency and restore checks.
- All 12 Playwright tests against a production Next.js build.
- Automated Axe WCAG A/AA checks across all 19 public routes in light and dark themes.
- Responsive no-overflow checks across 15 widths from 320 to 2560 px.
- Dependency audits, Git history and staged secret scans.
- Frontend and backend production image builds.
- An isolated Compose stack, including persisted contact inquiry and rejected foreign origin.
- `git diff --check`.

The final visual audit captured Home in both themes at 390×844, 430×932, 768×1024, 1024×768, 1280×800, 1440×900, 1728×1117 and 1920×1080. It found no page errors, horizontal overflow or first-viewport project images. At 1440×900, the introduction ends at y=921; engineering proof begins at y=921 and public work begins at y=1466. The artifacts and measurements are ignored local files under `.qa-refinement/`.

The refined About profile was captured in light and dark themes at 320, 390, 768, 1440, and 2560 px. It had no horizontal overflow, one optimized local portrait, and no project images; its portrait measured 144×180 px at phone widths and 224×280 px from tablet upward. The reduced-motion view reported no animation on the hero.

At 1440 px, the public collection uses three cards per row at 30% of the 1354 px content measure; the fourth public card begins the next row. At 390 px, cards stack in one column at 350 px wide, with 160 px screenshots. Current-work cards use a two-column desktop text-led grid and stack on mobile.

## Deployment boundary and remaining blockers

No production service, DNS, TLS, secret, database, migration, inquiry, notification, monitoring, backup, rollback or deployment was changed. The public `/api/contact` route and private `/inquiries`, `/health/live` and `/health/ready` contracts remain unchanged.

Before a production deployment, confirm the canonical HTTPS origin, deployment environment variables and contact-inquiry ownership. Production backup/recovery evidence, field performance, physical-device and human screen-reader review, and tagged-PDF review are still outstanding. SHAPES’ active backup schedule and exact contribution boundaries remain owner-verification items. Unknown software employment seniority and team boundaries remain marked in source and are not represented as fact in visitor copy.
