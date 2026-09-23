import type { Metadata } from "next";
import { ProjectCard } from "@/components/projects/project-card";
import { projects } from "@/content/projects";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta(
  "Selected work",
  "Azaeron, SHAPES India, and Friends Aluminium Works: product stories and engineering decisions.",
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
          Financial workflows, editorial publishing, and commercial discovery.
          Explore the product first, then the decisions that make it work.
        </p>
      </div>
      <div className="work-list">
        {projects.map((p, index) => (
          <ProjectCard key={p.slug} project={p} featured={index === 0} />
        ))}
      </div>
      <div className="inline-note">
        <strong>Also exploring</strong>
        <p>
          Zam Zam Academy is a prototype/template and appears under{" "}
          <a href="/labs">Labs &amp; Experiments</a>.
        </p>
      </div>
    </main>
  );
}
