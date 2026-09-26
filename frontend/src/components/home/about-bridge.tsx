import Link from "next/link";
import styles from "./home.module.css";

export function AboutBridge() {
  return (
    <section
      className={`shell ${styles.aboutBridge}`}
      aria-labelledby="about-bridge-title"
      data-section="about"
    >
      <p className="section-label">About me</p>
      <div>
        <h2 id="about-bridge-title">
          Reliability was part of the job before software.
        </h2>
        <p>
          Banking transactions and public digital-service requests taught me to
          pay attention to the person behind a record. That still shapes the
          questions I ask when I write software.
        </p>
        <Link className="text-link" href="/about">
          More about my background <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </section>
  );
}
