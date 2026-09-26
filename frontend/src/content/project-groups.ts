import { projects } from "./projects";

// These are the four public destinations a visitor can open today. A hosted
// prototype remains labelled as such in its card and case study.
const publicSlugs = [
  "azaeron",
  "shapes-india",
  "friends-aluminium-works",
  "zam-zam-academy",
] as const;

export const publicWork = publicSlugs.map((slug) => {
  const project = projects.find((item) => item.slug === slug);
  if (!project) throw new Error(`Missing public project: ${slug}`);
  return project;
});
export const currentWork = projects.filter(
  (project) => project.maturity === "development",
);
export const prototypes = projects.filter(
  (project) =>
    project.maturity === "prototype" &&
    !publicSlugs.includes(project.slug as (typeof publicSlugs)[number]),
);
