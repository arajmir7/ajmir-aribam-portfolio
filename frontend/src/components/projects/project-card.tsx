import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/content/projects";

export function statusLabel(project: Project) {
  return project.maturity === "live"
    ? "Live"
    : project.maturity === "prototype"
      ? "Prototype"
      : "In development";
}

export function ProjectMedia({
  project,
  src,
  priority = false,
}: {
  project: Project;
  src?: string;
  priority?: boolean;
}) {
  const visual = [project.visual, ...project.gallery].find(
    (item) => item.src === (src ?? project.visual.src),
  );
  return (
    <div className={`project-media project-media--${project.slug}`}>
      <Image
        src={src ?? project.visual.src}
        alt={visual?.alt ?? project.visual.alt}
        fill
        priority={priority}
        sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 40vw"
      />
    </div>
  );
}

export function ProjectCard({
  project,
  index,
  large = false,
  src,
}: {
  project: Project;
  index: number;
  large?: boolean;
  src?: string;
}) {
  return (
    <article className={`project-card${large ? " project-card--large" : ""}`}>
      <Link
        href={`/work/${project.slug}`}
        className="project-card-image"
        aria-label={`View ${project.name} case study`}
      >
        <ProjectMedia project={project} src={src} />
      </Link>
      <div className="project-card-copy">
        <div className="project-card-meta">
          <span>{String(index).padStart(2, "0")}</span>
          <span>
            {project.type.split(" · ")[0]} · {project.year}
          </span>
          <span>{statusLabel(project)}</span>
        </div>
        <h3>
          <Link href={`/work/${project.slug}`}>{project.name}</Link>
        </h3>
        <p>{project.summary}</p>
        <div className="project-card-end">
          <span>{project.role ?? project.technicalFocus}</span>
          <Link
            href={`/work/${project.slug}`}
            aria-label={`Read ${project.name} case study`}
          >
            Case study <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
