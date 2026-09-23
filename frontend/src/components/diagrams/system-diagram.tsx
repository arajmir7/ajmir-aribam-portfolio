import type { Project } from "@/content/projects";

export function SystemDiagram({ project }: { project: Project }) {
  return (
    <figure className="system-diagram" aria-labelledby="diagram-title">
      <div className="diagram-head">
        <span className="eyebrow">SYSTEM BOUNDARIES</span>
        <span>FIG. {project.number}</span>
      </div>
      <h3 id="diagram-title">From interaction to recorded state</h3>
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
        Application responsibilities shown as a request flow; deployment
        configuration is described separately.
      </figcaption>
    </figure>
  );
}
