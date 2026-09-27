# Search visibility QA

This is an internal intent map for the existing pages, not a keyword landing
page. Search snippets and rankings are controlled by search engines; this
document records the portfolio's intended page roles and evidence.

## Query-to-page map

| Search intent                                               | Primary page             | Supporting evidence                                                             |
| ----------------------------------------------------------- | ------------------------ | ------------------------------------------------------------------------------- |
| Ajmir Aribam; Ajmir Aribam portfolio                        | `/`                      | `/about`, `/work`                                                               |
| Ajmir Aribam Software Engineer; Ajmir Aribam Developer      | `/about`                 | `/`, `/resume`, `/work`                                                         |
| Ajmir Aribam full-stack developer                           | `/work`                  | Azaeron and SCMIRN case studies                                                 |
| Ajmir Aribam backend developer                              | `/engineering`           | Azaeron, SHAPES India and contact-delivery architecture                         |
| Ajmir Aribam frontend developer; UI engineering             | `/engineering`           | Friends Aluminium Works and SHAPES India case studies                           |
| Ajmir Aribam quality engineering; accessibility engineering | `/engineering`           | AccessForge case study                                                          |
| Ajmir Aribam AI systems                                     | `/work/azaeron-verity`   | Describes evidence-linked review and its current project state                  |
| Python, FastAPI, PostgreSQL developer                       | Relevant case study only | SCMIRN, SHAPES India and AccessForge; each page states its own stack and limits |
| Ajmir Aribam résumé                                         | `/resume`                | `/about`                                                                        |
| Ajmir Aribam engineering notes                              | `/notes`                 | `/notes/state-is-a-boundary`                                                    |

Do not create separate pages for role keywords. The current portfolio pages
already expose project evidence and distinguish deployed work, development,
and prototypes.

## Crawl and indexability checks

- Canonical origin: `https://ajmiraribam.me`.
- Public HTML pages use server-rendered metadata and one primary heading.
- `robots.txt` allows public content, disallows `/api/`, and names the sitemap.
- `sitemap.xml` is built from the public route and content lists; it excludes
  API routes, redirects, and unknown project/note slugs. No synthetic update
  dates are added.
- Query parameters do not change canonical paths.
- JSON-LD uses one stable Person ID at `https://ajmiraribam.me/#person`.
- Branded query coverage is checked as page intent, not a ranking guarantee.

## Google Search Console owner steps

1. Open the `ajmiraribam.me` Domain property.
2. In **Sitemaps**, submit `https://ajmiraribam.me/sitemap.xml` once and check
   its processing status.
3. In **URL inspection**, inspect and request indexing once for each of these
   deployed URLs: `/`, `/about`, `/work`, `/engineering`, and `/resume`.
4. Use URL Inspection's live test if a page's indexed version predates this
   release. Allow Google time to crawl and process the changes; do not repeat
   requests in a loop.

## Legitimate authority connections

- Add `https://ajmiraribam.me` to the GitHub profile website field and link it
  from the portfolio repository README.
- Add the portfolio URL to LinkedIn's website/contact section and use the same
  professional identity there.
- Add a portfolio link to public project repositories Ajmir controls, where
  the connection is relevant to readers.
- Ask project owners to link to the case study only where they approve and the
  portfolio accurately represents the work.

Do not use paid links, link exchanges, mass outreach, invented testimonials,
or artificial repositories.
