import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/content/projects";

export function CaseHero({ project }: { project: Project }) {
  return (
    <header className={`case-hero case-hero--${project.slug}`}>
      <div className="shell">
        <Link className="back-link" href="/work">
          ← Selected work
        </Link>
        <div className="case-hero-grid">
          <div className="case-hero-copy">
            <p className="eyebrow">
              {project.number} / {project.type}
            </p>
            <h1>
              {project.name}
              <span className="period">.</span>
            </h1>
            <p className="case-lede">{project.lede}</p>
            <div className="case-hero-meta">
              <span>{project.year}</span>
              <span>{project.stack.slice(0, 4).join(" · ")}</span>
            </div>
            <a
              className="text-link"
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit live product <span aria-hidden="true">↗</span>
            </a>
          </div>
          <figure className="case-hero-figure">
            <div className="case-hero-image">
              <Image
                src={project.visual.src}
                alt={project.visual.alt}
                fill
                priority
                sizes="(max-width: 760px) 100vw, 53vw"
              />
            </div>
            <figcaption>{project.visual.caption}</figcaption>
          </figure>
        </div>
      </div>
    </header>
  );
}

export function CaseEnd() {
  return (
    <nav className="case-end" aria-label="Case study next steps">
      <Link href="/work">← All work</Link>
      <Link href="/contact">Start a conversation ↗</Link>
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
      <summary>Implementation notes</summary>
      <div>{children}</div>
    </details>
  );
}
