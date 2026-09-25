import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { projects } from "@/content/projects";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta(
  "Work",
  "Billing, institutional publishing, commercial web, document review and retail systems by Ajmir Aribam.",
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
        <p className="kicker">
          Selected work <span aria-hidden="true">/</span> {projects.length}{" "}
          projects
        </p>
        <div>
          <h1>Products with real work behind them.</h1>
          <p>
            From merchant invoices to institutional publishing, each project
            solves a different problem. The status and scope are shown with the
            work.
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
            01 <span>/</span> Live · {lead.type.split(" · ")[0]}
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
        <div className="section-heading">
          <p className="kicker">Live work</p>
          <div>
            <h2 id="work-live-title">Different people. Different products.</h2>
            <p>
              The interface changes with the job; the underlying rules matter in
              each.
            </p>
          </div>
        </div>
        {live
          .filter((project) => project.slug !== lead.slug)
          .map((project, index) => (
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
                  0{index + 2} <span>/</span> Live ·{" "}
                  {project.type.split(" · ")[0]}
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
          <div className="section-heading">
            <p className="kicker">In development</p>
            <div>
              <h2 id="work-building-title">
                Working systems, open release gates.
              </h2>
              <p>
                These case studies show implemented scope and current limits.
                They are not presented as launched products.
              </p>
            </div>
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
                    In development <span>/</span> {project.year}
                  </span>
                  <h3>{project.name}</h3>
                  <p>{project.lede}</p>
                  <span className="work-building-focus">
                    Current focus: {project.technicalFocus}
                  </span>
                  <Link href={`/work/${project.slug}`}>
                    See the current build ↗
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
          <div className="section-heading">
            <p className="kicker">Prototypes &amp; research</p>
            <div>
              <h2 id="work-prototypes-title">
                Working ideas with a visible boundary.
              </h2>
              <p>
                These systems have real source and product surfaces, while
                deployment, ownership or end-to-end behavior still needs
                verification.
              </p>
            </div>
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
                  <Link href={`/work/${project.slug}`}>
                    Read the boundary ↗
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
            CivicPulse is a research prototype. SCMIRN and Zam Zam are direct
            product studies; all three remain separate from shipped work.
          </p>
        </div>
        <Link href="/labs">
          Visit Labs <span aria-hidden="true">↗</span>
        </Link>
      </aside>
    </main>
  );
}
