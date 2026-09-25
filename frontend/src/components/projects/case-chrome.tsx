import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/content/projects";

export function CaseHero({ project }: { project: Project }) {
  const statusLabel =
    project.status ??
    (project.maturity === "live"
      ? "Live"
      : project.maturity === "prototype"
        ? "Prototype"
        : "In development");
  return (
    <header className={`case-hero case-hero--${project.slug}`}>
      <div className="shell">
        <Link className="back-link" href="/work">
          ← All work
        </Link>
        <div className="case-hero-top">
          <div>
            <p className="kicker">
              {statusLabel} <span aria-hidden="true">/</span> {project.year}
            </p>
            <h1>{project.name}</h1>
            <p className="case-lede">{project.lede}</p>
          </div>
          <div className="case-hero-aside">
            <span>{project.type.split(" · ")[0]}</span>
            <p>{project.technicalFocus}</p>
            {project.live ? (
              <a href={project.live} target="_blank" rel="noopener noreferrer">
                {project.maturity === "prototype"
                  ? "Visit hosted preview ↗"
                  : "Visit live site ↗"}
              </a>
            ) : (
              <strong>{statusLabel}</strong>
            )}
          </div>
        </div>
        <figure className="case-hero-figure">
          <div className="case-hero-image">
            <Image
              src={project.visual.src}
              alt={project.visual.alt}
              fill
              loading="eager"
              fetchPriority="high"
              sizes="(max-width: 800px) 100vw, 85vw"
            />
          </div>
          <figcaption>{project.visual.caption}</figcaption>
        </figure>
        <dl className="case-hero-facts">
          <div>
            <dt>Who it serves</dt>
            <dd>{project.audience}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>{statusLabel}</dd>
          </div>
          <div>
            <dt>{project.role ? "My work" : "Current build"}</dt>
            <dd>{project.role ?? project.technicalFocus}</dd>
          </div>
        </dl>
      </div>
    </header>
  );
}

export function CaseEnd() {
  return (
    <nav className="case-end" aria-label="Case study next steps">
      <Link href="/work">← All work</Link>
      <Link href="/contact">Discuss a project ↗</Link>
    </nav>
  );
}

export function ImplementationNotes({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <details className="implementation-notes">
      <summary>More on the implementation</summary>
      <div>{children}</div>
    </details>
  );
}
