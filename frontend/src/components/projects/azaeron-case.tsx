import Image from "next/image";
import { SystemDiagram } from "@/components/diagrams/system-diagram";
import type { Project } from "@/content/projects";
import { CaseContents } from "./case-contents";
import { CaseEnd, ImplementationNotes } from "./case-chrome";

const sections = [
  { id: "product", label: "Product" },
  { id: "financial-state", label: "Financial state" },
  { id: "decisions", label: "Decisions" },
  { id: "architecture", label: "Architecture" },
  { id: "access", label: "Access & delivery" },
  { id: "status", label: "Status & limits" },
] as const;

export function AzaeronCase({ project }: { project: Project }) {
  return (
    <div className="shell case-body case-body--azaeron">
      <CaseContents sections={sections} />
      <div className="case-main">
        <section id="product" className="case-section">
          <p className="eyebrow">THE PRODUCT</p>
          <h2>Keeping financial state consistent.</h2>
          <p className="section-lede">
            Azaeron brings invoicing, quotations, point of sale, inventory,
            payments, and customer records into a merchant workspace. These
            surfaces are connected: a payment changes an invoice, and an invoice
            must still make sense to the customer and the business ledger. The
            difficult part is keeping payment state, inventory, permissions, and
            invoice status consistent as work moves through the system.
          </p>
          <div
            className="product-capabilities"
            aria-label="Azaeron product areas"
          >
            {[
              {
                title: "Sell",
                body: "Quotations, invoices, and point of sale",
              },
              {
                title: "Collect",
                body: "Payments, balances, and customer records",
              },
              {
                title: "Operate",
                body: "Inventory, team access, and audit history",
              },
            ].map((area) => (
              <div key={area.title}>
                <h3>{area.title}</h3>
                <p>{area.body}</p>
              </div>
            ))}
          </div>
          <figure className="azaeron-public-surface">
            <div>
              <Image
                src="/images/projects/azaeron-documentation.webp"
                alt="Azaeron public documentation page with product guides and developer resources"
                width={1440}
                height={900}
                sizes="(max-width: 760px) 100vw, 850px"
              />
            </div>
            <figcaption>
              The public docs and sign-in pages are reachable. Authenticated
              production behavior and active integrations have not been
              independently inspected; no usage or uptime claim is made here.{" "}
              <a
                href="https://invoice.web-com.live/documentation"
                target="_blank"
                rel="noopener noreferrer"
              >
                View live documentation ↗
              </a>
            </figcaption>
          </figure>
        </section>

        <section
          id="financial-state"
          className="case-section case-section--state"
        >
          <p className="eyebrow">USER &amp; BUSINESS PROBLEM</p>
          <h2>A paid invoice needs a settled balance.</h2>
          <p className="section-lede">
            The invoice lifecycle checks allowed moves against payment
            summaries. A partially paid invoice needs both a completed payment
            and an outstanding balance; a paid invoice cannot retain a balance.
          </p>
          <figure className="state-flow">
            <figcaption>
              One supported path through the invoice lifecycle
            </figcaption>
            <ol>
              <li>
                <span>01</span>
                <strong>Draft</strong>
                <small>Record prepared</small>
              </li>
              <li>
                <span>02</span>
                <strong>Sent</strong>
                <small>Customer-facing</small>
              </li>
              <li>
                <span>03</span>
                <strong>Partially paid</strong>
                <small>Balance remains</small>
              </li>
              <li>
                <span>04</span>
                <strong>Paid</strong>
                <small>Balance settled</small>
              </li>
            </ol>
          </figure>
          <p>
            The service records the transition with timestamps, a financial
            journal event, and an audit entry. That work belongs on the server,
            where every caller meets the same rules.
          </p>
          <ImplementationNotes>
            <p>
              Invalid moves are rejected before status mutation. The service
              checks due dates for overdue status, requires reasons for disputed
              or written-off states, and restricts archiving to eligible
              outcomes. The diagram is an example path, not the full state
              machine.
            </p>
          </ImplementationNotes>
        </section>

        <section id="decisions" className="case-section">
          <p className="eyebrow">ENGINEERING DECISIONS</p>
          <h2>What had to stay true.</h2>
          <div className="decision-list">
            {project.decisions.map((decision) => (
              <article key={decision.title}>
                <div>
                  <h3>{decision.title}</h3>
                  <p>{decision.body}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="architecture" className="case-section">
          <p className="eyebrow">TECHNICAL IMPLEMENTATION</p>
          <h2>The API owns the business rules.</h2>
          <SystemDiagram boundaries={project.boundaries} />
          <p className="architecture-caption">
            React and TypeScript handle the merchant interface. Express owns
            validation, authorization, and lifecycle rules. MongoDB stores the
            business records and payment state.
          </p>
        </section>

        <section id="access" className="case-section">
          <p className="eyebrow">ACCESS &amp; DELIVERY</p>
          <h2>Check the request before changing a record.</h2>
          <div className="boundary-steps">
            <div>
              <span>01</span>
              <strong>Identity</strong>
              <p>Sessions use refresh-token rotation.</p>
            </div>
            <div>
              <span>02</span>
              <strong>Tenant</strong>
              <p>Business context scopes merchant operations.</p>
            </div>
            <div>
              <span>03</span>
              <strong>Permission</strong>
              <p>API middleware checks roles and actions.</p>
            </div>
            <div>
              <span>04</span>
              <strong>Domain</strong>
              <p>Lifecycle rules guard the record change.</p>
            </div>
          </div>
          <div className="two-col-copy">
            <div>
              <h3>How the release is checked</h3>
              <p>
                GitHub Actions runs release checks. The application has separate
                frontend and API deployment configuration, with Vercel and
                Render targets in the project.
              </p>
            </div>
            <div>
              <h3>When the API is ready</h3>
              <p>
                The API checks database indexes before listening and exposes a
                readiness route. Request context and audit records make failures
                easier to trace without turning the browser into the authority.
              </p>
            </div>
          </div>
        </section>

        <section id="status" className="case-section case-section--last">
          <p className="eyebrow">CURRENT STATUS &amp; LIMITS</p>
          <h2>
            The public surfaces are live; production behavior is unverified.
          </h2>
          <p className="section-lede">
            The public sign-in and documentation pages are reachable.
            Authenticated behavior, active integrations, and business outcomes
            have not been independently inspected. No usage, revenue, or uptime
            claim is made here.
          </p>
          <p className="case-closing">
            Financial state needs an explicit backend transition and a durable
            record of what changed.
          </p>
        </section>
        <CaseEnd />
      </div>
    </div>
  );
}
