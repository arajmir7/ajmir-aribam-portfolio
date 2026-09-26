# Final portfolio refinement review

**Review date:** 2026-09-26
**Scope:** Local frontend candidate. No production deployment was performed.

## What changed

The Home remains personal-first and its first viewport contains no project imagery. Its final sequence is:

1. Ajmir Aribam — Software Engineer, portrait, personal statement and actions.
2. What I care about — concrete examples of state, failure handling and verification.
3. Live on the web — verified public work.
4. Currently building — functional systems with release work still ahead.
5. One engineering note.
6. A brief personal bridge.
7. Contact and shared footer.

The generic positioning was replaced with: “I build software that has to work beyond the screen.” The supporting copy is specific about product interfaces, backend services, APIs, data, delivery and pre-release checks without claiming seniority or outcomes that have not been verified.

The Engineering page now connects product surface, application rules, data, authorization, AI-assisted workflows, quality, delivery and operations to a real case. About, Labs, Contact, Notes, metadata and the social description received the same editorial pass.

## Work architecture

The Work index no longer treats all nine cases as equivalent. It now communicates maturity before the visitor reads the details.

| Collection        | Projects                                                                               | Treatment                                                                                          |
| :---------------- | :------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------- |
| 01 / Public work  | Azaeron, SHAPES India, Friends Aluminium Works                                         | Live external action and case study; fresh deployment capture.                                     |
| 02 / Current work | Azaeron Verity, The Scent Bar Retail OS, Azaeron Construction Procurement, AccessForge | In development; restrained text-led cards and case study only.                                     |
| 03 / Labs         | SCMIRN, Zam Zam Academy                                                                | Prototype boundaries remain explicit. Zam Zam has a hosted-preview action, not a production claim. |

Public cards use current local captures from the verified destinations, not remote hotlinks or previous project media. On a 1440 px viewport the three live cards are 320 px wide, roughly 23.7% of the 1354 px content measure, with 170 px screenshots. Current work is two columns on desktop and all cards stack on small screens with 160 px screenshots.

## Public destination evidence

| Project                 | Confirmed URL                                   | Capture result                                                 |
| :---------------------- | :---------------------------------------------- | :------------------------------------------------------------- |
| Azaeron                 | `https://invoice.web-com.live/`                 | HTTP 200; redirected to `/login`; desktop and mobile captures. |
| SHAPES India            | `https://shapesindia.org/`                      | HTTP 200; desktop and mobile captures.                         |
| Friends Aluminium Works | `https://friendsaluminiumworks.com/`            | HTTP 200; desktop and mobile captures.                         |
| Zam Zam Academy         | `https://storied-bombolone-5d4a8f.netlify.app/` | HTTP 200; desktop and mobile captures; hosted prototype only.  |

The capture script and [internal manifest](frontend/src/content/public-captures.json) preserve the source URL, date, viewport and resulting asset path. Its visitor-facing cards show only the product, status and actions.

## Visual and automated review

Home was captured and manually inspected in both themes at all requested dimensions: 390×844, 430×932, 768×1024, 1024×768, 1280×800, 1440×900, 1728×1117 and 1920×1080. The first viewport held no project image at every size, and no horizontal overflow or page error occurred. The current screenshots are stored locally under `.qa-refinement/final/`; [the 1440×900 light capture](.qa-refinement/final/home-1440x900-light.png) and [Work capture](.qa-refinement/final/work-1440x900.png) show the reviewed state.

`make verify` passed on this final source. It includes formatting, lint, strict TypeScript, frontend and backend tests, PostgreSQL migration/concurrency/restore checks, 12 browser tests, both-theme Axe checks across 19 routes, responsive checks, dependency audits, secret scans, Docker builds, isolated Compose contact/origin checks and `git diff --check`.

## Remaining deployment blockers

The candidate has not been deployed. Production still needs a confirmed canonical HTTPS origin, environment configuration, contact ownership and operational monitoring. SHAPES backup/recovery evidence and exact contribution boundaries require owner verification. Field performance, human accessibility review and tagged-PDF review have not been completed.
