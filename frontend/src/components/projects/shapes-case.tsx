import Image from "next/image";
import { CaseContents } from "./case-contents";
import { CaseEnd, ImplementationNotes } from "./case-chrome";

const sections = [
  { id: "public-experience", label: "Public experience" },
  { id: "editorial-workflow", label: "Publishing" },
  { id: "platform", label: "Platform" },
  { id: "continuity", label: "Continuity" },
] as const;

export function ShapesCase() {
  return (
    <div className="shell case-body case-body--shapes">
      <CaseContents sections={sections} />
      <div className="case-main">
        <section id="public-experience" className="case-section">
          <p className="eyebrow">PUBLIC EXPERIENCE</p>
          <h2>Six centres, one place to start.</h2>
          <p className="section-lede">
            SHAPES connects learning, psychological services, research, and
            community work. The public site gives each centre a clear point of
            entry while keeping resources, events, and contact paths within one
            institutional structure.
          </p>
          <figure className="editorial-figure">
            <div className="editorial-image">
              <Image
                src="/images/projects/shapes-home.webp"
                alt="SHAPES India public homepage with institutional introduction and archive photograph"
                fill
                sizes="(max-width: 760px) 100vw, 65vw"
              />
            </div>
            <figcaption>
              Public homepage · institutional story and navigation
            </figcaption>
          </figure>
        </section>

        <section id="editorial-workflow" className="case-section">
          <p className="eyebrow">EDITORIAL SYSTEM</p>
          <h2>Editors can review before they publish.</h2>
          <p className="section-lede">
            Editors need room to revise content without making unfinished work
            public. A publishing service validates state changes, records
            revisions, and gives administrative routes one set of rules to call.
          </p>
          <figure className="publishing-flow">
            <figcaption>A supported publishing path</figcaption>
            <ol>
              <li>Draft</li>
              <li>Review</li>
              <li>Approved</li>
              <li>Published</li>
            </ol>
            <p>
              Scheduling and archival are additional branches of the workflow.
            </p>
          </figure>
          <ImplementationNotes>
            <p>
              The service handles content revisions, scheduled publication,
              cache invalidation, and public-reference checks. Administrative
              actions pass through server-side role, permission, and object
              scope checks.
            </p>
          </ImplementationNotes>
        </section>

        <section id="platform" className="case-section">
          <p className="eyebrow">PLATFORM DESIGN</p>
          <h2>Public pages and editor tools share the same records.</h2>
          <div
            className="institution-flow"
            role="group"
            aria-label="SHAPES platform boundaries"
          >
            {[
              ["Public", "Centre, resource, event, and contact pages"],
              ["Editorial", "Authenticated publishing and object permissions"],
              ["Data", "SQLAlchemy records, revisions, and migrations"],
              ["Delivery", "Build, validation, health, and recovery scripts"],
            ].map(([label, detail], index) => (
              <div key={label}>
                <span>0{index + 1}</span>
                <strong>{label}</strong>
                <p>{detail}</p>
              </div>
            ))}
          </div>
          <p className="architecture-caption">
            Flask serves the public and administrative surfaces. PostgreSQL
            holds content and revision data; migrations keep the schema under
            versioned change.
          </p>
        </section>

        <section id="continuity" className="case-section case-section--last">
          <p className="eyebrow">CONTINUITY</p>
          <h2>How the site is released and checked.</h2>
          <div className="two-col-copy">
            <div>
              <h3>Release</h3>
              <p>
                The project includes CI, deployment input validation, container
                configuration, and a migration path. Those steps make content
                changes and software releases explicit.
              </p>
            </div>
            <div>
              <h3>Recovery</h3>
              <p>
                Liveness and readiness are separate checks. Request IDs, backup
                scripts, and a runbook provide practical starting points when an
                editor or visitor encounters a failure.
              </p>
            </div>
          </div>
          <p className="case-closing">
            The public site is live. Its production backup schedule and exact
            contribution boundaries remain to be confirmed; no audience or
            operating outcome is claimed here.
          </p>
        </section>
        <CaseEnd />
      </div>
    </div>
  );
}
