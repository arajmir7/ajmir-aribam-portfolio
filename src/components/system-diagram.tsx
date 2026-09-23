import type { Project } from "@/content/projects";

export function SystemDiagram({ project }: { project: Project }) {
  return (
    <figure className="system-diagram" aria-labelledby="diagram-title">
      <div className="diagram-head">
        <span className="eyebrow">SYSTEM BOUNDARIES / SOURCE-BASED</span>
        <span>FIG. {project.number}</span>
      </div>
      <h3 id="diagram-title">How the inspected implementation is divided</h3>
      <ol className="diagram-flow">
        {project.boundaries.map((item, index) => (
          <li key={item.label}>
            <span className="diagram-count">0{index + 1}</span>
            <strong>{item.label}</strong>
            <p>{item.detail}</p>
          </li>
        ))}
      </ol>
      <figcaption>
        Conceptual boundary map from inspected repository files. It does not
        assert unverified production topology.
      </figcaption>
    </figure>
  );
}
