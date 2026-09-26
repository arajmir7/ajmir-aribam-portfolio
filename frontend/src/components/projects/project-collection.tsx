import type { Project } from "@/content/projects";
import { ProjectCard } from "./project-card";

export function ProjectCollection({
  projects,
  compact = false,
}: {
  projects: Project[];
  compact?: boolean;
}) {
  return (
    <div
      className={`project-grid ${compact ? "project-grid--compact" : "project-grid--public"}`}
    >
      {projects.map((project, index) => (
        <ProjectCard
          key={project.slug}
          project={project}
          index={index + 1}
          compact={compact}
        />
      ))}
    </div>
  );
}
