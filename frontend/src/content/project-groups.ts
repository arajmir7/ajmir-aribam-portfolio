import { projects } from "./projects";

// Hosting alone does not promote a prototype to public production work.
export const publicWork = projects.filter(
  (project) => project.maturity === "live",
);
export const currentWork = projects.filter(
  (project) => project.maturity === "development",
);
export const prototypes = projects.filter(
  (project) => project.maturity === "prototype",
);
