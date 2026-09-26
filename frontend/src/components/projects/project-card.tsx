import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/content/projects";
import captures from "@/content/public-captures.json";

export function verifiedDestination(project: Project) {
  return project.live &&
    captures.some(
      (capture) =>
        capture.project === project.slug &&
        capture.sourceUrl === project.live &&
        capture.status === 200,
    )
    ? project.live
    : undefined;
}

export function statusLabel(project: Project) {
  return project.maturity === "live"
    ? "Live"
    : project.maturity === "prototype"
      ? verifiedDestination(project)
        ? "Hosted prototype"
        : "Prototype"
      : "In development";
}

export function ProjectMedia({
  project,
  src,
  priority = false,
  sizes = "(max-width: 600px) calc(100vw - 2.5rem), (max-width: 1000px) 44vw, 390px",
}: {
  project: Project;
  src?: string;
  priority?: boolean;
  sizes?: string;
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
        preload={priority}
        sizes={sizes}
      />
    </div>
  );
}

export function ProjectCard({
  project,
  index,
  src,
  compact = false,
}: {
  project: Project;
  index: number;
  src?: string;
  compact?: boolean;
}) {
  return (
    <article
      className={`project-card${compact ? " project-card--compact" : ""}`}
      data-project={project.slug}
      aria-labelledby={`project-${project.slug}`}
    >
      <div className="project-card-meta">
        <span>
          {String(index).padStart(2, "0")} / {project.type.split(" · ")[0]}
        </span>
        <span className={`project-status project-status--${project.maturity}`}>
          {statusLabel(project)}
        </span>
      </div>
      {!compact && (
        <div className="project-card-image">
          <ProjectMedia project={project} src={src} />
        </div>
      )}
      <div className="project-card-copy">
        <h3 id={`project-${project.slug}`}>{project.name}</h3>
        <p>{project.summary}</p>
        <dl className="project-card-facts">
          <div>
            <dt>{project.role ? "Role" : "Focus"}</dt>
            <dd>{project.role ?? project.technicalFocus}</dd>
          </div>
        </dl>
        <div className="project-card-actions">
          {verifiedDestination(project) && (
            <a
              className="project-live-action"
              href={verifiedDestination(project)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.maturity === "prototype" ? "Open hosted preview of" : "View live"} ${project.name}`}
            >
              {project.maturity === "prototype"
                ? "Open hosted preview"
                : "View live"}{" "}
              <span aria-hidden="true">↗</span>
            </a>
          )}
          <Link
            className="project-card-action"
            href={`/work/${project.slug}`}
            aria-label={`Read ${project.name} case study`}
          >
            Read case study <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
