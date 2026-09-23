import type { Metadata } from "next";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta(
  "Labs & experiments",
  "SCMIRN and other prototypes, with their development status made clear.",
  "/labs",
);
export default function Labs() {
  // TODO_OWNER_VERIFY: Academy source repository and ownership details.
  return (
    <main id="main" className="shell page">
      <div className="page-heading">
        <p className="eyebrow">LABS / EXPERIMENTS</p>
        <h1>
          Labs<span className="period">.</span>
        </h1>
        <p>
          Early ideas with useful pieces of work, shown at their current stage.
        </p>
      </div>
      <article className="lab-entry">
        <span className="index">01 / PROTOTYPE</span>
        <div>
          <p className="eyebrow">CIVIC SERVICES / LOCAL SOURCE</p>
          <h2>SCMIRN</h2>
          <p>
            SCMIRN explores how people could file civic complaints, find
            services, and follow a request in one place. The local source
            includes complaint screens, tracking routes, and experimental
            specialist-agent code. Its deployment and end-to-end behavior have
            not been verified.
          </p>
        </div>
      </article>
      <article className="lab-entry">
        <span className="index">02 / EXPERIMENT</span>
        <div>
          <p className="eyebrow">PROTOTYPE / TEMPLATE EXPLORATION</p>
          <h2>Zam Zam Academy</h2>
          <p>
            A template study for an academy website, exploring structure,
            navigation, and presentation.
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
    </main>
  );
}
