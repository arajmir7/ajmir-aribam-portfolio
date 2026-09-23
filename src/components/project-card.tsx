import Link from "next/link";
import type { Project } from "@/content/projects";

export function ProjectCard({
  project,
  compact = false,
}: {
  project: Project;
  compact?: boolean;
}) {
  return (
    <article className={`project-card ${compact ? "compact" : ""}`}>
      <div className="project-card-top">
        <span className="index">{project.number} / 03</span>
        <span className="eyebrow">{project.type}</span>
      </div>
      <div>
        <h3>
          <Link href={`/work/${project.slug}`}>
            {project.name}
            <span aria-hidden="true" className="arrow">
              ↗
            </span>
          </Link>
        </h3>
        <p>{project.lede}</p>
      </div>
      <div className="project-card-foot">
        <span>{project.stack.slice(0, 3).join(" · ")}</span>
        <Link
          href={`/work/${project.slug}`}
          aria-label={`Read ${project.name} case study`}
        >
          Examine case <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </article>
  );
}
