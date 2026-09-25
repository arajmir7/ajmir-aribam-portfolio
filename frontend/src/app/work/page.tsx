import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { projects } from "@/content/projects";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta(
  "Work",
  "Live products, institutional websites, active software builds and prototypes by Ajmir Aribam.",
  "/work",
);

const live = projects.filter((project) => project.maturity === "live");
const building = projects.filter(
  (project) => project.maturity === "development",
);
const prototypes = projects.filter(
  (project) => project.maturity === "prototype",
);
const lead = live.find((project) => project.featured) ?? live[0];

export default function Work() {
  return (
    <main id="main" className="work-page">
      <header className="shell work-heading">
        <p className="kicker">Projects</p>
        <div>
          <h1>Work</h1>
          <p>
            Live products, active builds and prototypes. Each case shows what I
            worked on and what remains unverified.
          </p>
        </div>
      </header>
      <section className="shell work-lead" aria-labelledby="work-lead-title">
        <Link className="work-lead-image" href={`/work/${lead.slug}`}>
          <Image
            src={lead.visual.src}
            alt={lead.visual.alt}
            fill
            priority
            sizes="(max-width: 800px) 100vw, 62vw"
          />
          <span>{lead.visual.caption}</span>
        </Link>
        <div className="work-lead-copy">
          <span className="project-sequence">
            Live <span>/</span> {lead.type.split(" · ")[0]}
          </span>
          <h2 id="work-lead-title">{lead.name}</h2>
          <p className="work-lead-intro">{lead.lede}</p>
          <dl className="work-facts">
            <div>
              <dt>For</dt>
              <dd>{lead.audience}</dd>
            </div>
            <div>
              <dt>Work</dt>
              <dd>{lead.role}</dd>
            </div>
            <div>
              <dt>Engineering</dt>
              <dd>{lead.technicalFocus}</dd>
            </div>
          </dl>
          <div className="work-actions">
            <Link className="text-link" href={`/work/${lead.slug}`}>
              Read the case study <span aria-hidden="true">↗</span>
            </Link>
            {lead.live && (
              <a href={lead.live} target="_blank" rel="noopener noreferrer">
                Visit live product ↗
              </a>
            )}
          </div>
        </div>
      </section>
      <section className="shell work-live" aria-labelledby="work-live-title">
        <div className="work-section-intro">
          <h2 id="work-live-title">Other live work</h2>
          <p>One institutional platform and one commercial website.</p>
        </div>
        {live
          .filter((project) => project.slug !== lead.slug)
          .map((project) => (
            <article
              className={`work-live-row work-live-row--${project.slug}`}
              key={project.slug}
            >
              <Link className="work-live-media" href={`/work/${project.slug}`}>
                <Image
                  src={project.visual.src}
                  alt={project.visual.alt}
                  fill
                  sizes="(max-width: 800px) 100vw, 53vw"
                />
              </Link>
              <div className="work-live-copy">
                <span className="project-sequence">
                  Live · {project.type.split(" · ")[0]}
                </span>
                <h3>{project.name}</h3>
                <p>{project.lede}</p>
                <dl className="work-facts">
                  <div>
                    <dt>For</dt>
                    <dd>{project.audience}</dd>
                  </div>
                  <div>
                    <dt>Work</dt>
                    <dd>{project.role}</dd>
                  </div>
                  <div>
                    <dt>Engineering</dt>
                    <dd>{project.technicalFocus}</dd>
                  </div>
                </dl>
                <div className="work-actions">
                  <Link href={`/work/${project.slug}`}>
                    Read the case study ↗
                  </Link>
                  {project.live && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visit live site ↗
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
      </section>
      <section className="work-building" aria-labelledby="work-building-title">
        <div className="shell">
          <div className="work-section-intro">
            <h2 id="work-building-title">In development</h2>
            <p>Implemented scope and open release gates are shown per case.</p>
          </div>
          <div className="work-building-list">
            {building.map((project) => (
              <article key={project.slug} className="work-building-row">
                <Link
                  className="work-building-media"
                  href={`/work/${project.slug}`}
                >
                  <Image
                    src={project.visual.src}
                    alt={project.visual.alt}
                    fill
                    sizes="(max-width: 720px) 100vw, 30vw"
                  />
                </Link>
                <div>
                  <span className="project-sequence">
                    {project.status ?? "In development"} <span>/</span>{" "}
                    {project.year}
                  </span>
                  <h3>{project.name}</h3>
                  <p>{project.lede}</p>
                  <dl className="work-project-details">
                    <div>
                      <dt>My part</dt>
                      <dd>{project.role}</dd>
                    </div>
                    <div>
                      <dt>Engineering</dt>
                      <dd>{project.technicalFocus}</dd>
                    </div>
                  </dl>
                  <Link
                    className="work-project-action"
                    href={`/work/${project.slug}`}
                  >
                    Read the case study ↗
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section
        className="work-prototypes"
        aria-labelledby="work-prototypes-title"
      >
        <div className="shell">
          <div className="work-section-intro">
            <h2 id="work-prototypes-title">Prototypes</h2>
            <p>Exploratory work is labeled as such, with its limits in view.</p>
          </div>
          <div className="work-prototype-list">
            {prototypes.map((project) => (
              <article key={project.slug} className="work-prototype-row">
                <Link
                  className="work-prototype-media"
                  href={`/work/${project.slug}`}
                >
                  <Image
                    src={project.visual.src}
                    alt={project.visual.alt}
                    fill
                    sizes="(max-width: 720px) 100vw, 25vw"
                  />
                </Link>
                <div>
                  <span className="project-sequence">
                    Prototype <span>/</span> {project.year}
                  </span>
                  <h3>{project.name}</h3>
                  <p>{project.lede}</p>
                  <dl className="work-project-details">
                    <div>
                      <dt>My part</dt>
                      <dd>{project.role}</dd>
                    </div>
                    <div>
                      <dt>Engineering</dt>
                      <dd>{project.technicalFocus}</dd>
                    </div>
                  </dl>
                  <Link
                    className="work-project-action"
                    href={`/work/${project.slug}`}
                  >
                    Read the case study ↗
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <aside className="shell work-labs">
        <div>
          <span className="kicker">Labs &amp; experiments</span>
          <p>
            The two case studies include additional context on these educational
            and civic-service prototypes.
          </p>
        </div>
        <Link href="/labs">
          Visit Labs <span aria-hidden="true">↗</span>
        </Link>
      </aside>
    </main>
  );
}
