import type { Metadata } from "next";
import Link from "next/link";
import {
  ProjectCard,
  ProjectMedia,
  statusLabel,
} from "@/components/projects/project-card";
import { projects } from "@/content/projects";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta(
  "Work",
  "Business systems, institutional publishing, accessibility engineering and prototypes by Ajmir Aribam.",
  "/work",
);

const featuredSlugs = [
  "azaeron",
  "shapes-india",
  "azaeron-verity",
  "accessforge",
];
const featured = featuredSlugs.map((slug) =>
  projects.find((project) => project.slug === slug)!,
);
const archive = projects.filter(
  (project) => !featuredSlugs.includes(project.slug),
);

export default function Work() {
  return (
    <main id="main" className="rebuild-work">
      <header className="shell work-intro">
        <p className="section-label">Project archive / 2026</p>
        <div>
          <h1>Work</h1>
          <p>
            Software products, public websites and working prototypes. Open a
            case to see the build, the decisions and its current status.
          </p>
        </div>
      </header>
      <section
        className="shell work-featured"
        aria-labelledby="work-featured-title"
      >
        <div className="section-intro">
          <p className="section-label">01 / Featured</p>
          <div>
            <h2 id="work-featured-title">Featured projects.</h2>
            <p>Billing, publishing, document review and accessibility work.</p>
          </div>
        </div>
        <div className="work-featured-grid">
          {featured.map((project, index) => (
            <ProjectCard
              key={project.slug}
              project={project}
              index={index + 1}
              large={index === 0}
            />
          ))}
        </div>
      </section>
      <section className="work-archive" aria-labelledby="work-archive-title">
        <div className="shell">
          <div className="section-intro">
            <p className="section-label">02 / Archive</p>
            <div>
              <h2 id="work-archive-title">More work</h2>
              <p>
                Five more projects, from commercial delivery to early
                prototypes.
              </p>
            </div>
          </div>
          <div className="archive-list">
            {archive.map((project, index) => (
              <article className="archive-row" key={project.slug}>
                <Link
                  href={`/work/${project.slug}`}
                  className="archive-media"
                  aria-label={`View ${project.name} case study`}
                >
                  <ProjectMedia project={project} />
                </Link>
                <div className="archive-main">
                  <span>
                    {String(index + 5).padStart(2, "0")} /{" "}
                    {project.type.split(" · ")[0]}
                  </span>
                  <h3>
                    <Link href={`/work/${project.slug}`}>{project.name}</Link>
                  </h3>
                  <p>{project.summary}</p>
                </div>
                <div className="archive-detail">
                  <span>
                    {statusLabel(project)} · {project.year}
                  </span>
                  <p>{project.role ?? project.technicalFocus}</p>
                  <Link
                    href={`/work/${project.slug}`}
                    aria-label={`Read ${project.name} case study`}
                  >
                    Case study ↗
                  </Link>
                </div>
              </article>
            ))}
          </div>
          <p className="archive-note">
            SCMIRN and Zam Zam Academy are also collected in{" "}
            <Link href="/labs">Labs and experiments ↗</Link>.
          </p>
        </div>
      </section>
    </main>
  );
}
