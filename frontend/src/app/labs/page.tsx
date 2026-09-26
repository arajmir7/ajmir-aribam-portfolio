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
        <h1>Prototypes with their boundaries intact.</h1>
        <p>
          This early build shows the idea and its current limits. It is not
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
              A civic-service prototype that connects complaint intake,
              guidance, office discovery, documents and progress tracking. Its
              AI and rights surfaces are informational guidance, not legal
              advice or an official government service.
            </p>
            <Link href="/work/scmirn">Read the SCMIRN case</Link>
          </div>
        </article>
      </div>
    </main>
  );
}
