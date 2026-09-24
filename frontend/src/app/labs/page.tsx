import type { Metadata } from "next";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta(
  "Labs & experiments",
  "SCMIRN and Zam Zam Academy are prototypes, separate from shipped work.",
  "/labs",
);

export default function Labs() {
  // TODO_OWNER_VERIFY: Academy source repository and ownership details.
  return (
    <main id="main" className="labs-page shell">
      <header className="labs-heading">
        <p className="kicker">Labs &amp; experiments</p>
        <h1>Ideas with working parts.</h1>
        <p>
          Early explorations live here, with their prototype status visible.
          They are separate from the live work.
        </p>
      </header>
      <div className="lab-list">
        <article className="lab-project">
          <div className="lab-project-sign">
            <span>01 / Prototype</span>
            <strong>SCMIRN</strong>
            <div className="lab-flow" aria-label="Explored civic request flow">
              <span>Report</span>
              <span>Route</span>
              <span>Follow up</span>
            </div>
          </div>
          <div className="lab-project-copy">
            <span>Civic services</span>
            <h2>A place to start and follow a civic request.</h2>
            <p>
              SCMIRN explores complaint screens, service discovery and request
              tracking. Local source also includes experimental specialist-agent
              code. Its deployment and end-to-end behavior have not been
              verified.
            </p>
          </div>
        </article>
        <article className="lab-project lab-project--academy">
          <div className="lab-project-sign">
            <span>02 / Prototype</span>
            <strong>
              Zam Zam
              <br />
              Academy
            </strong>
            <span className="lab-sign-foot">Template exploration</span>
          </div>
          <div className="lab-project-copy">
            <span>Education site study</span>
            <h2>Exploring how an academy could present itself.</h2>
            <p>
              A template study of website structure, navigation and
              presentation. It remains a prototype.
            </p>
            <a
              href="https://storied-bombolone-5d4a8f.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open prototype ↗
            </a>
          </div>
        </article>
      </div>
    </main>
  );
}
