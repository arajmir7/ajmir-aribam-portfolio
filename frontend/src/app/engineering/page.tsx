import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta(
  "Engineering",
  "How Ajmir Aribam builds, checks and delivers application systems, AI-enabled workflows and product interfaces.",
  "/engineering",
);

const layers = [
  {
    number: "01",
    name: "Product surface",
    detail: "Navigation, forms and feedback that make the next step clear.",
    proof: "Friends Aluminium Works",
    href: "/work/friends-aluminium-works",
  },
  {
    number: "02",
    name: "Application rules",
    detail:
      "Permission checks and state changes that every client must pass through.",
    proof: "Azaeron",
    href: "/work/azaeron",
  },
  {
    number: "03",
    name: "Records & evidence",
    detail:
      "Versioned content, payment state and traceable source relationships.",
    proof: "SHAPES India",
    href: "/work/shapes-india",
  },
  {
    number: "04",
    name: "Delivery & recovery",
    detail:
      "Tests, migrations, health checks and an explicit route back from failure.",
    proof: "Quality practice",
    href: "#quality",
  },
] as const;

export default function Engineering() {
  return (
    <main id="main" className="engineering-page">
      <header className="shell engineering-heading">
        <p className="kicker">Engineering practice</p>
        <div>
          <h1>A useful product has more than one layer.</h1>
          <p>
            I work across the interface, the rules behind it, and the checks
            that let a change ship. These examples come from the projects in
            this portfolio.
          </p>
        </div>
      </header>
      <section
        className="shell engineering-map"
        aria-labelledby="engineering-map-title"
      >
        <div className="engineering-map-head">
          <h2 id="engineering-map-title">One change, four places to think.</h2>
          <p>
            A screen can initiate an action. The service decides whether it is
            allowed, the records preserve what happened, and the release path
            checks that it still works.
          </p>
        </div>
        <ol>
          {layers.map((layer) => (
            <li key={layer.number}>
              <span className="engineering-layer-index">{layer.number}</span>
              <div>
                <h3>{layer.name}</h3>
                <p>{layer.detail}</p>
                <Link href={layer.href}>{layer.proof} ↗</Link>
              </div>
            </li>
          ))}
        </ol>
      </section>
      <section
        className="engineering-evidence"
        aria-labelledby="engineering-evidence-title"
      >
        <div className="shell">
          <p className="kicker">Through the work</p>
          <h2 id="engineering-evidence-title">
            The decisions show the discipline.
          </h2>
          <div className="engineering-evidence-list">
            <article>
              <span>Rules &amp; data</span>
              <h3>Can this invoice become paid?</h3>
              <p>
                Azaeron’s lifecycle service checks payment summaries before
                changing invoice status. The API records the transition and
                audit context so another caller cannot bypass a browser guard.
              </p>
              <Link href="/work/azaeron#financial-state">
                Follow the invoice state ↗
              </Link>
            </article>
            <article>
              <span>Publishing &amp; access</span>
              <h3>Who can publish this revision?</h3>
              <p>
                SHAPES separates public reading from authenticated editing. A
                publishing service handles review states and revisions, while
                server permissions scope administrative actions.
              </p>
              <Link href="/work/shapes-india#editorial-workflow">
                Follow the publishing path ↗
              </Link>
            </article>
            <article>
              <span>AI systems</span>
              <h3>What evidence supports the finding?</h3>
              <p>
                Verity links review findings to document versions and sources.
                Its interface can show insufficient evidence; the project
                remains in development without a production-ready model claim.
              </p>
              <Link href="/work/azaeron-verity">
                See Verity’s current build ↗
              </Link>
            </article>
          </div>
        </div>
      </section>
      <section
        id="quality"
        className="shell engineering-quality"
        aria-labelledby="engineering-quality-title"
      >
        <div className="engineering-quality-lead">
          <p className="kicker">Quality engineering</p>
          <h2 id="engineering-quality-title">
            Check the behavior at the boundary where it can fail.
          </h2>
          <p>
            One green test does not cover a product. I use different checks for
            rules, data, interface behavior and deployment wiring.
          </p>
        </div>
        <div className="quality-lines">
          <div>
            <strong>Rules</strong>
            <p>Unit and API tests for state, validation and authorization.</p>
          </div>
          <div>
            <strong>Data</strong>
            <p>
              Fresh migrations, isolated PostgreSQL tests and tenant-boundary
              checks.
            </p>
          </div>
          <div>
            <strong>Interface</strong>
            <p>
              Playwright journeys, keyboard paths, axe scans and responsive
              reviews.
            </p>
          </div>
          <div>
            <strong>Release</strong>
            <p>
              Dependency and secret scans, container builds, readiness and
              contact smoke tests.
            </p>
          </div>
        </div>
        <p className="engineering-quality-note">
          The portfolio’s own local gate runs these checks; production
          monitoring and human accessibility review remain separate work.
        </p>
      </section>
      <section className="shell engineering-last">
        <p>Need someone who can work across product and system boundaries?</p>
        <Link href="/contact">
          Get in touch <span aria-hidden="true">↗</span>
        </Link>
      </section>
    </main>
  );
}
