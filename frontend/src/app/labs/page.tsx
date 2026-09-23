import type { Metadata } from "next";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta(
  "Labs & experiments",
  "Prototypes and explorations, clearly separated from delivered work.",
  "/labs",
);
export default function Labs() {
  // TODO_OWNER_VERIFY: Academy source repository and ownership details.
  return (
    <main id="main" className="shell page">
      <div className="page-heading">
        <p className="eyebrow">LABS / EXPERIMENTS</p>
        <h1>
          Work in exploration<span className="period">.</span>
        </h1>
        <p>
          Experiments are useful for testing a direction. They are labeled
          separately from shipped client or institutional work.
        </p>
      </div>
      <article className="lab-entry">
        <span className="index">EXP / 01</span>
        <div>
          <p className="eyebrow">PROTOTYPE / TEMPLATE ONLY</p>
          <h2>Zam Zam Academy</h2>
          <p>
            A prototype/template exploration. This is not presented as completed
            client work. Source and ownership details have not yet been
            verified.
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
