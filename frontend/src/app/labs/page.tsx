import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta(
  "Labs & experiments",
  "Early civic-service and education website prototypes by Ajmir Aribam.",
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
          These early builds show the ideas and their current limits. Neither is
          presented as a finished service.
        </p>
      </header>
      <div className="lab-list">
        <article className="lab-project">
          <div className="lab-project-sign">
            <span>Prototype</span>
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
              tracking. Its AI and rights surfaces are informational guidance,
              not legal counsel or an official service.
            </p>
            <Link href="/work/scmirn">Read the SCMIRN case ↗</Link>
          </div>
        </article>
        <article className="lab-project lab-project--academy">
          <div className="lab-project-sign">
            <span>Hosted prototype</span>
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
            <div className="lab-links">
              <Link href="/work/zam-zam-academy">Read the case ↗</Link>
              <a
                href="https://storied-bombolone-5d4a8f.netlify.app/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Open hosted preview ↗
              </a>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}
