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
          Labs<span className="period">.</span>
        </h1>
        <p>Small experiments and interface explorations.</p>
      </div>
      <article className="lab-entry">
        <span className="index">01 / EXPERIMENT</span>
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
