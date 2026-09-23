import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/content/projects";

export function ProjectCard({
  project,
  featured = false,
}: {
  project: Project;
  featured?: boolean;
}) {
  return (
    <article
      className={`project-card project-card--${project.slug}${featured ? " project-card--featured" : ""}`}
    >
      <Link
        className="project-card-media"
        href={`/work/${project.slug}`}
        aria-label={`Explore ${project.name} case study`}
      >
        <Image
          src={project.visual.src}
          alt={project.visual.alt}
          fill
          sizes={
            featured
              ? "(max-width: 760px) 100vw, 60vw"
              : "(max-width: 760px) 100vw, 45vw"
          }
        />
      </Link>
      <div className="project-card-content">
        <div className="project-card-top">
          <span className="index">{project.number} / 03</span>
          <span className="eyebrow">{project.type}</span>
        </div>
        <div>
          <h3>
            <Link href={`/work/${project.slug}`}>{project.name}</Link>
          </h3>
          <p>{project.lede}</p>
        </div>
        <div className="project-card-foot">
          <span>{project.stack.slice(0, 3).join(" · ")}</span>
          <Link href={`/work/${project.slug}`}>
            Explore case study <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
