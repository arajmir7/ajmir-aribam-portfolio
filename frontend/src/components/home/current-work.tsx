import { ProjectCollection } from "@/components/projects/project-collection";
import { currentWork } from "@/content/project-groups";
import styles from "./home.module.css";

export function CurrentWork() {
  return (
    <section
      className={`shell ${styles.currentWork}`}
      aria-labelledby="current-work-title"
      data-section="current-work"
    >
      <header className={styles.workHeading}>
        <div>
          <p className="section-label">02 / Current work</p>
          <h2 id="current-work-title">Currently building</h2>
          <p>
            Systems that are functional enough to inspect, but still have
            important release work ahead.
          </p>
        </div>
      </header>
      <ProjectCollection projects={currentWork} compact />
    </section>
  );
}
