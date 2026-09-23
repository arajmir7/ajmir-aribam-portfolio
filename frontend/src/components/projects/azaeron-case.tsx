import { SystemDiagram } from "@/components/diagrams/system-diagram";
import type { Project } from "@/content/projects";
import { CaseContents } from "./case-contents";
import { CaseEnd, ImplementationNotes } from "./case-chrome";

const sections = [
  { id: "product", label: "Product" },
  { id: "financial-state", label: "Financial state" },
  { id: "architecture", label: "Architecture" },
  { id: "access", label: "Access & delivery" },
  { id: "decisions", label: "Decisions" },
] as const;

export function AzaeronCase({ project }: { project: Project }) {
  return (
    <div className="shell case-body case-body--azaeron">
      <CaseContents sections={sections} />
      <div className="case-main">
        <section id="product" className="case-section">
          <p className="eyebrow">01 / THE PRODUCT</p>
          <h2>One business workflow. Several kinds of state.</h2>
          <p className="section-lede">
            Azaeron brings invoicing, quotations, point of sale, inventory,
            payments, and customer records into a merchant workspace. These
            surfaces are connected: a payment changes an invoice, and an invoice
            must still make sense to the customer and the business ledger.
          </p>
          <div
            className="product-capabilities"
            aria-label="Azaeron product areas"
          >
            {[
              ["01", "Sell", "Quotations, invoices, and point of sale"],
              ["02", "Collect", "Payments, balances, and customer records"],
              ["03", "Operate", "Inventory, team access, and audit history"],
            ].map(([number, title, body]) => (
              <div key={title}>
                <span className="index">{number}</span>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            ))}
          </div>
        </section>

        <section
          id="financial-state"
          className="case-section case-section--state"
        >
          <p className="eyebrow">02 / FINANCIAL STATE</p>
          <h2>A status change is a business operation.</h2>
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

        <section id="architecture" className="case-section">
          <p className="eyebrow">03 / ARCHITECTURE</p>
          <h2>Clear boundaries around money and access.</h2>
          <SystemDiagram project={project} />
          <p className="architecture-caption">
            React and TypeScript handle the merchant interface. Express owns
            validation, authorization, and lifecycle rules. MongoDB stores the
            business records and payment state.
          </p>
        </section>

        <section id="access" className="case-section">
          <p className="eyebrow">04 / ACCESS &amp; DELIVERY</p>
          <h2>Controls travel with the request.</h2>
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
              <h3>Release path</h3>
              <p>
                GitHub Actions runs release checks. The application has separate
                frontend and API deployment configuration, with Vercel and
                Render targets in the project.
              </p>
            </div>
            <div>
              <h3>Operational signal</h3>
              <p>
                The API checks database indexes before listening and exposes a
                readiness route. Request context and audit records make failures
                easier to trace without turning the browser into the authority.
              </p>
            </div>
          </div>
        </section>

        <section id="decisions" className="case-section case-section--last">
          <p className="eyebrow">05 / ENGINEERING DECISIONS</p>
          <h2>Built for the next state change.</h2>
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
          <p className="case-closing">
            The central lesson is simple: financial state needs an explicit
            backend transition, a durable record of what changed, and a release
            path that can detect a broken dependency before traffic reaches it.
          </p>
        </section>
        <CaseEnd />
      </div>
    </div>
  );
}
