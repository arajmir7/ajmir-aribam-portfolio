import Link from "next/link";
import { engineeringPrinciples } from "@/content/identity";
import styles from "./home.module.css";

export function EngineeringProof() {
  return (
    <section
      id="engineering-proof"
      className={`shell ${styles.proof}`}
      aria-labelledby="proof-title"
      data-section="engineering-proof"
    >
      <header className={styles.sectionHeading}>
        <p className="section-label">What I care about</p>
        <h2 id="proof-title">What happens after the click matters.</h2>
        <p>
          A record should be correct, a failure should make sense, and a change
          should be checked. Here’s how those concerns show up in the work.
        </p>
      </header>
      <ol className={styles.principles}>
        {engineeringPrinciples.map((principle, index) => (
          <li key={principle.title}>
            <span className={styles.principleNumber} aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3>{principle.title}</h3>
            <p>{principle.detail}</p>
          </li>
        ))}
      </ol>
      <div className={styles.proofLinks}>
        <Link className="text-link" href="/engineering">
          My engineering approach <span aria-hidden="true">↗</span>
        </Link>
        <Link className="text-link" href="/about">
          The background behind it <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </section>
  );
}
