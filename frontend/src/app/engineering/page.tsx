import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta(
  "Engineering Approach",
  "How Ajmir Aribam approaches product surfaces, application rules, data, quality and delivery.",
  "/engineering",
);

const layers = [
  {
    name: "Product surface",
    detail:
      "Make the next task and its feedback clear before asking for input.",
    proof: "Friends enquiry path",
    href: "/work/friends-aluminium-works",
  },
  {
    name: "Application rules",
    detail: "Put state changes where every caller meets the same rule.",
    proof: "Azaeron invoice lifecycle",
    href: "/work/azaeron#decisions",
  },
  {
    name: "Data",
    detail: "Give records a clear owner, version and scope.",
    proof: "Verity evidence model",
    href: "/work/azaeron-verity#system",
  },
  {
    name: "Authorization",
    detail: "Check identity and permission at the server boundary.",
    proof: "SHAPES editorial permissions",
    href: "/work/shapes-india#decisions",
  },
  {
    name: "AI-assisted workflows",
    detail:
      "Keep source, uncertainty and human review beside an assisted finding.",
    proof: "Verity review boundary",
    href: "/work/azaeron-verity#system",
  },
  {
    name: "Quality",
    detail: "Retest the behavior after changing it.",
    proof: "AccessForge proof loop",
    href: "/work/accessforge#system",
  },
  {
    name: "Delivery",
    detail: "Make build, migration and readiness checks part of a release.",
    proof: "Azaeron release path",
    href: "/work/azaeron#evidence",
  },
  {
    name: "Operations",
    detail:
      "Leave a way to see whether the service and its dependencies are ready.",
    proof: "SHAPES continuity",
    href: "/work/shapes-india#evidence",
  },
];

export default function Engineering() {
  return (
    <main id="main" className="rebuild-engineering">
      <header className="shell engineering-opening">
        <p className="section-label">Engineering / approach</p>
        <div>
          <h1>The interface is only one part of the system.</h1>
          <p>
            I like working across the boundaries where products usually become
            difficult: state changes, permissions, data ownership, failure
            handling, deployment and verification.
          </p>
        </div>
      </header>
      <section
        className="shell engineering-system"
        aria-labelledby="system-title"
      >
        <div className="section-intro">
          <p className="section-label">01 / System model</p>
          <div>
            <h2 id="system-title">Eight connected concerns.</h2>
            <p>Each one points to a decision in a real case study.</p>
          </div>
        </div>
        <ol className="engineering-layer-list">
          {layers.map((layer, index) => (
            <li key={layer.name}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{layer.name}</h3>
              <p>{layer.detail}</p>
              <Link href={layer.href}>{layer.proof}</Link>
            </li>
          ))}
        </ol>
      </section>
      <section
        className="engineering-questions"
        aria-labelledby="questions-title"
      >
        <div className="shell">
          <div className="section-intro">
            <p className="section-label">02 / In practice</p>
            <div>
              <h2 id="questions-title">Questions that change the build.</h2>
              <p>These are more useful than a list of tools.</p>
            </div>
          </div>
          <div className="engineering-question-list">
            <article>
              <span>Financial state</span>
              <h3>Can this invoice become paid?</h3>
              <p>
                Azaeron checks payment summaries and allowed transitions before
                the API changes invoice status. The change has an audit trail.
              </p>
              <Link href="/work/azaeron#decisions">Read the decision</Link>
            </article>
            <article>
              <span>Reviewable analysis</span>
              <h3>What supports this finding?</h3>
              <p>
                Verity keeps the document version, recorded source and
                uncertainty beside the result. An unavailable calibrated model
                is shown as unavailable.
              </p>
              <Link href="/work/azaeron-verity">See the evidence flow</Link>
            </article>
            <article>
              <span>Verified remediation</span>
              <h3>Is the defect actually fixed?</h3>
              <p>
                AccessForge separates detection, change, security checks, rescan
                and recorded proof. A proposed fix is not a verified fix.
              </p>
              <Link href="/work/accessforge">Follow the proof loop</Link>
            </article>
          </div>
        </div>
      </section>
      <section className="shell engineering-quality-summary">
        <div>
          <p className="section-label">03 / Quality</p>
          <h2>Check the boundary where failure matters.</h2>
        </div>
        <p>
          Unit and API tests check rules. Database tests check records and
          scope. Browser checks cover navigation, accessibility and responsive
          behaviour. Release checks cover dependencies, containers and
          readiness.
        </p>
      </section>
      <div className="shell engineering-final">
        <p>Want to work through a product problem together?</p>
        <Link href="/contact">Get in touch</Link>
      </div>
    </main>
  );
}
