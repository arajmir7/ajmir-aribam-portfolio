// Visitor-facing case narratives. Evidence details and owner checks remain in projects.ts.
export type CaseStory = {
  product: string;
  contribution: string;
  system: string;
  validation: string;
  current: string;
};

export const caseStories: Record<string, CaseStory> = {
  azaeron: {
    product:
      "Azaeron is a merchant workspace for invoices, quotations, payments, inventory and customer records. Those tasks share financial state, so one screen cannot decide alone when an invoice is paid.",
    contribution:
      "I worked across the React interface, Express API, business rules and release checks. The invoice lifecycle service checks allowed transitions and payment summaries before recording a change.",
    system:
      "The browser presents merchant workflows. The API validates identity, tenant scope and permissions before changing records in MongoDB. Invoice transitions also write audit and financial journal events.",
    validation:
      "The code includes lifecycle rules, authorization middleware, database index checks at startup and a GitHub Actions release gate. The sign-in and documentation pages are available online.",
    current:
      "The site and documentation are live. Payment flows inside an account, enabled integrations and usage have not been confirmed.",
  },
  "shapes-india": {
    product:
      "SHAPES India brings six centres, resources and updates into one public structure. Staff need a separate path to prepare, review and publish the information visitors see.",
    contribution:
      "The work spans the public information architecture and the publishing application. A service owns content state changes and revisions; administrative routes enforce role and object permissions.",
    system:
      "Flask serves public and administrative paths. SQLAlchemy and PostgreSQL hold content and revision records. Migrations, health checks and deployment validation support changes to the site.",
    validation:
      "The six-centre site is captured in the case images. The application code includes publishing checks, role permissions, readiness, request IDs and operational scripts.",
    current:
      "The current public address and production backup schedule need confirmation. My exact contribution under the contract is also unconfirmed.",
  },
  "friends-aluminium-works": {
    product:
      "A fabrication business needs to show what it makes, demonstrate completed work and give a visitor a simple way to ask for a quote.",
    contribution:
      "I built responsive product, service and project pages with route-specific search metadata. Photographs carry the product story, with a direct inquiry handoff.",
    system:
      "React and TypeScript render routes from product data. A quote prepares a WhatsApp message; contact opens the visitor's email client. The browser-local project editor is not a shared CMS.",
    validation:
      "The live site has product, service, project and contact pages. The code includes responsive images and search metadata for each route.",
    current:
      "The site is live. I do not have verified figures for inquiries, search traffic or business results.",
  },
  "azaeron-verity": {
    product:
      "Verity is a document review workspace. It keeps findings beside the exact document version, source text and uncertainty a reviewer needs to judge them.",
    contribution:
      "The current build brings together versioned documents, provenance, citations, evidence graphs and a browser review screen.",
    system:
      "A Next.js review interface calls FastAPI services. PostgreSQL records document versions and scoped evidence relationships. An evidence link cannot cross a document version or organization.",
    validation:
      "Unit, database and browser tests cover the evidence flow. The current build has not passed a complete release check.",
    current:
      "In development. No approved production generative model or calibrated authorship detector is running; insufficient evidence is shown as a limit, not a verdict.",
  },
  "the-scent-bar-retail-os": {
    product:
      "The Scent Bar Retail OS is being built for teams working across branches. Its current foundation covers people, branch access, product identity, barcodes, tax and effective-dated pricing.",
    contribution:
      "The current milestone covers identity, tenant and branch access, a catalogue and pricing records.",
    system:
      "Organization and branch permissions are resolved by the API. Database rules keep product identities and time-bound prices consistent within tenant boundaries.",
    validation:
      "Tests cover the workspace and catalogue rules. Fresh PostgreSQL migration, API and worker checks still need to run for this milestone.",
    current:
      "In development. Inventory ledger, purchasing and point of sale are later milestones and are not presented as implemented.",
  },
  "azaeron-construction-procurement": {
    product:
      "Construction purchasing needs project context, reliable totals and a record of supplier responses. A browser cart alone cannot be the source of truth for an approval.",
    contribution:
      "The build models catalogue pricing, project scope, checkout, RFQs, supplier quotes and approvals.",
    system:
      "The server resolves price, tax and delivery terms. Structured records carry the request from product selection through quote and approval instead of trusting browser totals.",
    validation:
      "PostgreSQL migration, API and runtime tests cover the current build.",
    current:
      "In development. Live payment, supplier and warehouse integrations, deployment and production operations remain unverified.",
  },
  accessforge: {
    product:
      "AccessForge treats accessibility remediation as a verification loop: detect, remediate, check security, rescan and record proof.",
    contribution:
      "The local build separates findings, applied changes and verified fixes. Its pipeline includes deterministic scanning, remediation steps, security checks and regression evidence.",
    system:
      "Each stage records a distinct result. A proposed change is not marked resolved until a new scan and the required checks support it.",
    validation:
      "The code has tests for scanning, changes and regression checks. The interface currently reports an offline state, so the complete service journey still needs a running environment.",
    current:
      "In development as a local build. There is no confirmed public service or running production environment.",
  },
  scmirn: {
    product:
      "SCMIRN explores how someone might move from a civic complaint to guidance, office discovery, documents and progress tracking in one place.",
    contribution:
      "The prototype has React screens and FastAPI modules for complaints, documents and progress. Some screens still use mock data.",
    system:
      "The interface organizes a report into next steps, while API modules model accounts, complaints and tracking. Informational guidance stays separate from official authority.",
    validation:
      "Product screens, API modules and an agent test show parts of the flow. An end-to-end deployment has not been checked.",
    current:
      "Prototype. It is not an official government service, and its guidance is not legal advice. Data provenance and integrations need further work.",
  },
  "zam-zam-academy": {
    product:
      "Zam Zam Academy is a multi-page education website prototype. It explores how families could find academics, admissions, staff, student life, notices and contact information.",
    contribution:
      "The visible work covers frontend structure, navigation and presentation.",
    system:
      "A Vite frontend gives each information area its own route. The hosted preview demonstrates the interface and route structure.",
    validation:
      "The Vite application builds, and the hosted preview is available to explore.",
    current:
      "Prototype. The hosted preview does not establish an operating school site, a client contract or production support.",
  },
};
