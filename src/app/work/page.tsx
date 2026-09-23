import type { Metadata } from "next";
import { ProjectCard } from "@/components/project-card";
import { projects } from "@/content/projects";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta(
  "Selected work",
  "Production project case studies with implementation evidence and verified live product links.",
  "/work",
);

export default function WorkPage() {
  return (
    <main id="main" className="shell page">
      <div className="page-heading">
        <p className="eyebrow">INDEX / 01—03</p>
        <h1>
          Selected work<span className="period">.</span>
        </h1>
        <p>
          Three different delivery problems. Each case is grounded in an
          inspected codebase and keeps open verification questions visible.
        </p>
      </div>
      <div className="work-list">
        {projects.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </div>
      <div className="inline-note">
        <strong>Experiments have a separate place.</strong>
        <p>
          Zam Zam Academy is a prototype/template and appears under{" "}
          <a href="/labs">Labs &amp; Experiments</a>.
        </p>
      </div>
    </main>
  );
}
