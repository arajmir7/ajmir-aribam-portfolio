import Image from "next/image";
import type { Project } from "@/content/projects";
import { CaseContents } from "./case-contents";
import { CaseEnd, ImplementationNotes } from "./case-chrome";

const veritySections = [
  { id: "product", label: "Product" },
  { id: "problem", label: "Problem" },
  { id: "decisions", label: "Decisions" },
  { id: "implementation", label: "Implementation" },
  { id: "limits", label: "Status & limits" },
] as const;

const scentSections = [
  { id: "product", label: "Product" },
  { id: "problem", label: "Problem" },
  { id: "decisions", label: "Decisions" },
  { id: "implementation", label: "Implementation" },
  { id: "limits", label: "Status & limits" },
] as const;

export function DevelopingCase({ project }: { project: Project }) {
  const verity = project.slug === "azaeron-verity";
  if (!verity && project.slug !== "the-scent-bar-retail-os") {
    return <GenericProjectCase project={project} />;
  }
  return (
    <div className="shell case-body">
      <CaseContents sections={verity ? veritySections : scentSections} />
      <div className="case-main">
        <section id="product" className="case-section">
          <p className="eyebrow">01 / THE PRODUCT</p>
          <h2>
            {verity
              ? "Keep analysis with its document and evidence."
              : "Build retail around records a store can trust."}
          </h2>
          <p className="section-lede">
            {verity
              ? "Verity is a document review workspace. Reviewers can see what the system found, which document version it belongs to, what evidence supports it, and where human judgment is still needed."
              : "The Scent Bar Retail OS is a multi-branch retail system for identity, branch access, products, barcodes, tax, and pricing. Inventory and sales workflows remain later milestones."}
          </p>
          {verity ? (
            <figure className="editorial-figure development-figure">
              <div className="editorial-image">
                <Image
                  src="/images/projects/verity-evidence-graph.png"
                  alt="Verity local evidence graph view listing version-scoped findings, citations, and source records"
                  fill
                  sizes="(max-width: 760px) 100vw, 65vw"
                />
              </div>
              <figcaption>
                Local development capture · evidence graph view
              </figcaption>
            </figure>
          ) : (
            <div
              className="product-capabilities"
              aria-label="Retail OS milestone scope"
            >
              {[
                [
                  "01",
                  "People & branches",
                  "Access depends on the signed-in person's organization and assigned branches.",
                ],
                [
                  "02",
                  "Products & prices",
                  "The current catalogue handles SKUs, barcodes, and time-bound price records.",
                ],
                [
                  "03",
                  "Still to build",
                  "Stock, purchasing, and sales remain later milestones.",
                ],
              ].map(([number, title, description]) => (
                <div key={title}>
                  <span className="index">{number}</span>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
              ))}
            </div>
          )}
        </section>
        <section id="problem" className="case-section">
          <p className="eyebrow">02 / THE PROBLEM</p>
          <h2>
            {verity
              ? "Useful analysis needs its source and limits."
              : "A branch needs a clear view of people, products, and price."}
          </h2>
          <p className="section-lede">
            {verity
              ? "A finding is difficult to review when its source text, version, and uncertainty are separated. Keeping them together gives a person something concrete to check."
              : "Store teams need to know who is operating, which branch they belong to, what a product is, and which price applies. Those records need to be reliable before stock and sales workflows can build on them."}
          </p>
        </section>
        <section id="decisions" className="case-section">
          <p className="eyebrow">03 / ENGINEERING DECISIONS</p>
          <h2>
            {verity
              ? "Keep evidence tied to the version."
              : "Keep branch access on the server."}
          </h2>
          <p className="section-lede">
            {verity
              ? "Local unit, PostgreSQL, and browser checks cover document review and versioned evidence. The current release ledger still records a failed backend-image gate."
              : "Database checks cover tenant scope, cross-tenant relations, duplicate barcodes, and overlapping prices. The current milestone still needs fresh checks against its PostgreSQL and API runtime."}
          </p>
          <div className="decision-list">
            {project.decisions.map((decision, index) => (
              <article key={decision.title}>
                <span className="index">0{index + 1}</span>
                <div>
                  <h3>{decision.title}</h3>
                  <p>{decision.body}</p>
                </div>
              </article>
            ))}
          </div>
          <p className="case-closing">{project.lessons}</p>
        </section>
        <section id="implementation" className="case-section">
          <p className="eyebrow">04 / TECHNICAL IMPLEMENTATION</p>
          <h2>
            {verity
              ? "Trace a finding to the exact version."
              : "Give every branch a clear scope."}
          </h2>
          <p className="section-lede">
            {verity
              ? "The evidence service requires a document version for a finding. It rejects graph links across versions or organizations. The report connects findings, claims, citations, and sources for human review."
              : "The API resolves organization and branch permissions from the signed-in person. The catalogue adds SKU and barcode identity, effective-dated prices, and database rules that keep tenant records apart."}
          </p>
          <p className="architecture-caption">
            Built with {project.stack.join(" · ")}.
          </p>
          <div
            className="institution-flow"
            role="group"
            aria-label="Current architecture"
          >
            {project.boundaries.map((part, index) => (
              <div key={part.label}>
                <span>0{index + 1}</span>
                <strong>{part.label}</strong>
                <p>{part.detail}</p>
              </div>
            ))}
          </div>
        </section>
        <section id="limits" className="case-section case-section--last">
          <p className="eyebrow">05 / CURRENT STATUS &amp; LIMITS</p>
          <h2>
            {verity
              ? "Show a limit instead of a guess."
              : "Catalogue is not the whole store."}
          </h2>
          <p className="section-lede">
            {verity
              ? "The current writing aid uses deterministic rules. No approved production generative model or calibrated authorship detector is running. Verity is not production ready; when analysis lacks support, the interface says so."
              : "The inventory ledger, purchasing, and point of sale are not implemented in this milestone. PostgreSQL, API, and worker runtime checks remain open."}
          </p>
          <ImplementationNotes>
            <p>{project.delivery}</p>
          </ImplementationNotes>
        </section>
        <CaseEnd />
      </div>
    </div>
  );
}

function GenericProjectCase({ project }: { project: Project }) {
  const sections = [
    { id: "product", label: "Product" },
    { id: "problem", label: "Problem" },
    { id: "decisions", label: "Decisions" },
    { id: "implementation", label: "Implementation" },
    { id: "limits", label: "Status & limits" },
  ] as const;

  const copy = {
    "azaeron-construction-procurement": {
      product: "A procurement workflow for project-based construction buying.",
      problem:
        "Project purchases can change as quantities, delivery, and supplier quotes change. Teams need the server to recalculate totals and preserve decisions through review.",
      problemDetail:
        "The build resolves price, tax, and delivery on the server. RFQs, supplier quotes, approval rules, and procurement records give those decisions a durable path.",
      implementation: "Keep financial totals and purchase state on the server.",
      limits: "A modeled procurement workflow is not a live supply chain.",
      decisions: "Approval and idempotency are part of the product design.",
    },
    accessforge: {
      product:
        "Accessibility remediation should produce evidence, not just a report.",
      problem: "Finding a WCAG problem is not the same as fixing it.",
      problemDetail:
        "The build separates deterministic scans from bounded changes. A result is verified only after the application is scanned again and regression checks pass.",
      implementation:
        "Move from scan to proof through bounded engineering steps.",
      limits: "The local build still has a deployment boundary.",
      decisions: "A fix earns trust when a re-scan can prove it.",
    },
    scmirn: {
      product: "Make the next civic step easier to find.",
      problem:
        "People may need to identify the right office while keeping documents and complaint status in view.",
      problemDetail:
        "The prototype brings those steps together. Some screens still use mock data, so the interface does not imply a connected government service.",
      implementation: "Connect a report to guidance, documents, and progress.",
      limits:
        "Informational guidance, not legal advice or a government service.",
      decisions: "Keep guidance useful without hiding uncertainty.",
    },
    "zam-zam-academy": {
      product: "A school site should answer practical questions quickly.",
      problem:
        "Families arrive with different questions about academics, admissions, staff, student life, notices, and contact.",
      problemDetail:
        "Direct routes help visitors reach the relevant information without searching one long page.",
      implementation:
        "Use a clear route structure for the information families need.",
      limits: "A hosted preview proves hosting, not ownership.",
      decisions: "Content structure carries the experience.",
    },
    "civicpulse-resilience-network": {
      product: "One operational view for reports, assets, and response tasks.",
      problem:
        "A report or sensor alert needs context: which asset is affected and who owns the next action.",
      problemDetail:
        "The prototype links reports and sensor signals to rule-based scoring and maintenance tasks. It has not been used in field operations.",
      implementation:
        "Keep risk scoring explainable inside the operational workflow.",
      limits: "A research prototype has no verified field use.",
      decisions: "Make the score and the response path inspectable.",
    },
  }[project.slug] ?? {
    product: project.lede,
    problem: project.problem,
    problemDetail: project.problem,
    implementation: "Keep the system boundaries explicit.",
    limits: "The inspected build has an open release boundary.",
    decisions: "Make the important decisions visible.",
  };

  return (
    <div className="shell case-body">
      <CaseContents sections={sections} />
      <div className="case-main">
        <section id="product" className="case-section">
          <p className="eyebrow">01 / THE PRODUCT</p>
          <h2>{copy.product}</h2>
          <p className="section-lede">{project.context}</p>
          <figure className="editorial-figure development-figure">
            <div className="editorial-image">
              <Image
                src={project.visual.src}
                alt={project.visual.alt}
                fill
                sizes="(max-width: 760px) 100vw, 65vw"
              />
            </div>
            <figcaption>{project.visual.caption}</figcaption>
          </figure>
        </section>
        <section id="problem" className="case-section">
          <p className="eyebrow">02 / THE PROBLEM</p>
          <h2>{copy.problem}</h2>
          <p className="section-lede">{copy.problemDetail}</p>
        </section>
        <section id="decisions" className="case-section">
          <p className="eyebrow">03 / ENGINEERING DECISIONS</p>
          <h2>{copy.decisions}</h2>
          <p className="section-lede">{project.operations}</p>
          <div className="decision-list">
            {project.decisions.map((decision, index) => (
              <article key={decision.title}>
                <span className="index">0{index + 1}</span>
                <div>
                  <h3>{decision.title}</h3>
                  <p>{decision.body}</p>
                </div>
              </article>
            ))}
          </div>
          <p className="case-closing">{project.lessons}</p>
        </section>
        <section id="implementation" className="case-section">
          <p className="eyebrow">04 / TECHNICAL IMPLEMENTATION</p>
          <h2>{copy.implementation}</h2>
          <p className="section-lede">
            The current build focuses on {project.technicalFocus.toLowerCase()}.
          </p>
          <p className="architecture-caption">
            Built with {project.stack.slice(0, 5).join(" · ")}.
          </p>
          <div
            className="institution-flow"
            role="group"
            aria-label="Project implementation boundaries"
          >
            {project.boundaries.map((part, index) => (
              <div key={part.label}>
                <span>0{index + 1}</span>
                <strong>{part.label}</strong>
                <p>{part.detail}</p>
              </div>
            ))}
          </div>
        </section>
        <section id="limits" className="case-section case-section--last">
          <p className="eyebrow">05 / CURRENT STATUS &amp; LIMITS</p>
          <h2>{copy.limits}</h2>
          <p className="section-lede">{project.outcome}</p>
          <ul className="project-limitations">
            {project.limitations.map((limit) => (
              <li key={limit}>{limit}</li>
            ))}
          </ul>
          <p className="architecture-caption">{project.delivery}</p>
        </section>
        <CaseEnd />
      </div>
    </div>
  );
}
