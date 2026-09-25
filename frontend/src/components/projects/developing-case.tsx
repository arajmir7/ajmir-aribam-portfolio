import Image from "next/image";
import type { Project } from "@/content/projects";
import { CaseContents } from "./case-contents";
import { CaseEnd, ImplementationNotes } from "./case-chrome";

const veritySections = [
  { id: "purpose", label: "Purpose" },
  { id: "review", label: "Review" },
  { id: "limits", label: "Current limits" },
  { id: "quality", label: "Quality" },
] as const;

const scentSections = [
  { id: "purpose", label: "Purpose" },
  { id: "review", label: "Current build" },
  { id: "limits", label: "Current limits" },
  { id: "quality", label: "Verification" },
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
        <section id="purpose" className="case-section">
          <p className="eyebrow">01 / THE PRODUCT</p>
          <h2>
            {verity
              ? "A result needs its document beside it."
              : "Start with the records a store can trust."}
          </h2>
          <p className="section-lede">
            {verity
              ? "Verity is a document review workspace. A reviewer can inspect analysis with the text, version, citation, and recorded source that produced it. The local product is still in development."
              : "The Scent Bar Retail OS is being built for multi-branch retail work. Its current foundation covers people, branches, products, barcodes, and pricing. Sales and stock workflows are later milestones."}
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
        <section id="review" className="case-section">
          <p className="eyebrow">02 / WHAT IS BUILT</p>
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
        <section id="limits" className="case-section">
          <p className="eyebrow">03 / CURRENT LIMITS</p>
          <h2>
            {verity
              ? "Show a limit instead of a guess."
              : "Catalogue is not the whole store."}
          </h2>
          <p className="section-lede">
            {verity
              ? "The current writing aid uses deterministic rules. No approved production generative model or calibrated authorship detector is running. When analysis lacks a supported conclusion, the interface says so."
              : "Inventory ledger, purchasing, and point of sale have not been implemented in this milestone. The local release record also keeps PostgreSQL, API, and worker runtime checks open."}
          </p>
          <ImplementationNotes>
            <p>{project.delivery}</p>
          </ImplementationNotes>
        </section>
        <section id="quality" className="case-section case-section--last">
          <p className="eyebrow">04 / HOW THE BUILD IS CHECKED</p>
          <h2>
            {verity
              ? "Tests cover the recorded trail."
              : "Database rules need a real database."}
          </h2>
          <p className="section-lede">
            {verity
              ? "Local unit, PostgreSQL, and browser checks exercise document review and versioned evidence. The latest project certification still fails its backend image scan and leaves model and product work unfinished."
              : "The repository contains checks for row-level security, cross-tenant links, duplicate barcodes, and overlapping prices, plus an HTTP test harness. Those checks must run against the intended PostgreSQL and API runtime before the milestone can be called verified."}
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
        <CaseEnd />
      </div>
    </div>
  );
}

function GenericProjectCase({ project }: { project: Project }) {
  const sections = [
    { id: "purpose", label: "Purpose" },
    { id: "system", label: "System" },
    { id: "limits", label: "Current limits" },
    { id: "quality", label: "Quality" },
  ] as const;

  return (
    <div className="shell case-body">
      <CaseContents sections={sections} />
      <div className="case-main">
        <section id="purpose" className="case-section">
          <p className="eyebrow">01 / THE PRODUCT</p>
          <h2>{project.lede}</h2>
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
        <section id="system" className="case-section">
          <p className="eyebrow">02 / HOW IT WORKS</p>
          <h2>{project.problem}</h2>
          <p className="section-lede">
            The source evidence supports these boundaries. The status shown in
            the case header is the maturity of the inspected build.
          </p>
          <div
            className="institution-flow"
            role="group"
            aria-label="Project system boundaries"
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
        <section id="limits" className="case-section">
          <p className="eyebrow">03 / CURRENT LIMITS</p>
          <h2>Show the boundary with the same care as the feature.</h2>
          <p className="section-lede">{project.outcome}</p>
          <ImplementationNotes>
            <ul>
              {project.limitations.map((limit) => (
                <li key={limit}>{limit}</li>
              ))}
            </ul>
            <p>{project.delivery}</p>
          </ImplementationNotes>
        </section>
        <section id="quality" className="case-section case-section--last">
          <p className="eyebrow">04 / ENGINEERING EVIDENCE</p>
          <h2>Decisions that keep the system honest.</h2>
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
        <CaseEnd />
      </div>
    </div>
  );
}
