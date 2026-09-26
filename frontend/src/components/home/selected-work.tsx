import Link from "next/link";
import { ProjectCollection } from "@/components/projects/project-collection";
import { publicWork } from "@/content/project-groups";
import styles from "./home.module.css";

export function SelectedWork() {
  return (
    <section
      className={styles.work}
      aria-labelledby="public-work-title"
      data-section="public-work"
    >
      <div className="shell">
        <header className={styles.workHeading}>
          <div>
            <p className="section-label">01 / Public work</p>
            <h2 id="public-work-title">Open on the web</h2>
            <p>
              Four public experiences you can visit today. Zam Zam Academy is a
              hosted prototype; the other projects are live products.
            </p>
          </div>
          <Link className="text-link" href="/work">
            View all work
          </Link>
        </header>
        <ProjectCollection projects={publicWork} />
      </div>
    </section>
  );
}
