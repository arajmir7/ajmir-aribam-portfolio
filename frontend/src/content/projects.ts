export type Project = {
  slug: string;
  name: string;
  type: string;
  lede: string;
  summary: string;
  live?: string;
  status?: string;
  maturity: "live" | "development" | "prototype";
  role?: string;
  audience: string;
  technicalFocus: string;
  featured: boolean;
  visual: { src: string; alt: string; caption: string }; // Hero media.
  gallery: { src: string; alt: string; caption: string }[];
  repositoryPublic?: string; // Only set after the repository is publicly inspectable.
  contribution?: string; // State when individual boundaries are unverified.
  limitations: string[];
  caseStudy: boolean;
  year: string;
  stack: string[];
  context: string;
  problem: string;
  ownership: string;
  constraints: string[];
  boundaries: { label: string; detail: string }[];
  decisions: { title: string; body: string; evidence: string }[];
  delivery: string;
  operations: string;
  outcome: string;
  lessons: string;
  verify: string[];
};

export const projects: Project[] = [
  {
    slug: "azaeron",
    name: "Azaeron",
    type: "Billing systems · full stack",
    year: "2026",
    maturity: "live",
    role: "Full-stack engineering",
    audience: "Merchants managing sales and customer records",
    technicalFocus: "Invoice state, authorization, API and release checks",
    featured: true,
    caseStudy: true,
    gallery: [
      {
        src: "/images/projects/azaeron-login.webp",
        alt: "Azaeron public sign-in workspace",
        caption: "Public sign-in",
      },
      {
        src: "/images/projects/azaeron-documentation.webp",
        alt: "Azaeron public documentation page",
        caption: "Public product documentation",
      },
    ],
    limitations: [
      "Authenticated production flows and active integrations have not been independently inspected.",
    ],
    lede: "Azaeron brings invoicing, quotations, payments, inventory, and customer records into one business workspace.",
    summary:
      "A workspace for invoices, quotations, payments, inventory and customer records, with business rules enforced behind the interface.",
    live: "https://invoice.web-com.live/",
    visual: {
      src: "/images/projects/azaeron-public-desktop.webp",
      alt: "Current Azaeron sign-in page captured from the public deployment",
      caption: "Current public deployment capture · Azaeron",
    },
    stack: ["React", "TypeScript", "Express", "MongoDB", "GitHub Actions"],
    context:
      "Azaeron brings invoices, quotations, POS, inventory, payments, and customer records into one merchant workflow. The supplied public URL responded during inspection; authenticated behavior and active integrations still require owner verification.",
    problem:
      "Billing software must stop invalid transitions and preserve a clear record when business state changes. A paid invoice cannot be inferred from a button click or a browser return value.",
    ownership:
      "The local repository shows Ajmir Aribam as a principal code author. His resume describes architecture, implementation, delivery, and maintenance; precise team boundaries need owner verification.",
    constraints: [
      "Tenant and role boundaries for merchant operations",
      "Payment-aware invoice state",
      "Deployment configuration across frontend, API, and storage",
    ],
    boundaries: [
      {
        label: "Browser",
        detail:
          "React + TypeScript/Vite interface for invoicing, POS, and merchant operations.",
      },
      {
        label: "API",
        detail:
          "Express routes, validation, role permissions, lifecycle rules, and rate limits.",
      },
      {
        label: "Data",
        detail:
          "MongoDB/Mongoose models; invoices carry payment and lifecycle state.",
      },
      {
        label: "Delivery",
        detail:
          "GitHub Actions release checks; separate Vercel frontend and Render API configuration.",
      },
    ],
    decisions: [
      {
        title: "Make transitions explicit",
        body: "The invoice lifecycle service checks allowed transitions and payment summaries before mutating status, then records audit and financial journal events.",
        evidence: "backend/src/services/invoiceLifecycleService.js",
      },
      {
        title: "Enforce access on the server",
        body: "Permission mapping lives in API middleware; frontend visibility is not the security boundary.",
        evidence: "backend/src/middleware/auth.js",
      },
      {
        title: "Guard operational startup",
        body: "The API verifies database indexes before listening and exposes a readiness route for deployment checks.",
        evidence: "backend/src/server.js",
      },
    ],
    delivery:
      "The repository includes a GitHub Actions release gate and separate Vercel/Render configuration. Source describes queue and object-storage options; which are active in production is unverified.",
    operations:
      "Structured request context, readiness, and optional OpenTelemetry instrumentation are present in source. Production alerting, recovery results, and field reliability are unverified.",
    outcome:
      "A substantial locally inspected billing codebase and a responsive public deployment URL. No transaction, uptime, or customer claim is made here.",
    lessons:
      "Financial state belongs to a guarded domain transition, with a server-side audit trail and a separate operational readiness signal.",
    verify: [
      "Current production health and enabled integrations — unverified",
      "Actual usage and operational results — unverified",
    ],
  },
  {
    slug: "shapes-india",
    name: "SHAPES India",
    type: "Institutional platform · public",
    year: "2026",
    maturity: "live",
    role: "Application and publishing engineering",
    audience: "Visitors across six centres and the staff publishing updates",
    technicalFocus: "Publishing states, permissions and operational checks",
    featured: true,
    caseStudy: true,
    gallery: [
      {
        src: "/images/projects/shapes-centres.webp",
        alt: "SHAPES India six-centre index",
        caption: "Six-centre public index",
      },
      {
        src: "/images/projects/shapes-home.webp",
        alt: "SHAPES India public homepage",
        caption: "Public homepage",
      },
    ],
    limitations: [
      "Production backup schedule and exact contribution boundaries require owner verification.",
    ],
    lede: "A public site for six centres, with a controlled publishing workflow behind it.",
    summary:
      "A public platform that brings six centres, their programmes and shared resources into one coherent publishing system.",
    live: "https://shapesindia.org/",
    visual: {
      src: "/images/projects/shapes-india-public-desktop.webp",
      alt: "Current SHAPES India homepage captured from the public deployment",
      caption: "Current public deployment capture · SHAPES India",
    },
    stack: ["Flask", "SQLAlchemy", "PostgreSQL", "Vite", "GitHub Actions"],
    context:
      "SHAPES brings six centres, programmes and shared resources into one public publishing system. The configured public destination responded during the capture pass.",
    problem:
      "Institutional information needs clear public navigation while editors need guarded paths to revise and publish content without blurring permissions or losing history.",
    ownership:
      "Ajmir Aribam appears in the local Git history. The public footer credits Azaeron for design and development; exact contractual ownership is unverified.",
    constraints: [
      "Distinct public and administrative surfaces",
      "Content revision and publishing states",
      "Recoverable database and media operations",
    ],
    boundaries: [
      {
        label: "Public web",
        detail:
          "Flask routes and Vite-built assets deliver centre, event, publication, and contact pages.",
      },
      {
        label: "Editorial",
        detail:
          "Authenticated administrative routes use server-side permissions and object-level policy.",
      },
      {
        label: "Data",
        detail:
          "SQLAlchemy models and Alembic migrations persist content, revisions, and related records.",
      },
      {
        label: "Operations",
        detail:
          "Health/readiness endpoints, deployment validation scripts, and a runbook exist in source.",
      },
    ],
    decisions: [
      {
        title: "Publishing is a state machine",
        body: "A service owns content transitions and creates revisions; routes do not independently invent lifecycle rules.",
        evidence: "backend/app/services/publishing.py",
      },
      {
        title: "Permissions stay server-side",
        body: "Administrative actions check explicit roles, permissions, and object scope.",
        evidence: "backend/app/utils/web.py",
      },
      {
        title: "Keep readiness separate",
        body: "Liveness checks process availability while readiness checks datastore access.",
        evidence: "backend/app/__init__.py",
      },
    ],
    delivery:
      "The repository includes a GitHub Actions workflow, container configuration, deployment input validation, and a migration path. External production hooks described in the runbook are not independently verified.",
    operations:
      "Source includes structured request IDs, health/readiness, backup and production verification scripts. Actual schedules and recovery evidence are unverified.",
    outcome:
      "A public institutional site with six visible centres and locally inspected implementation. No audience or performance metrics are asserted.",
    lessons:
      "An editorial workflow is a backend system: state, authorization, revision history, and release safety matter as much as presentation.",
    verify: [
      "Production topology and active backup schedule — unverified",
      "Editorial ownership boundaries — unverified",
    ],
  },
  {
    slug: "friends-aluminium-works",
    name: "Friends Aluminium Works",
    type: "Commercial web · frontend delivery",
    year: "2026",
    maturity: "live",
    role: "Frontend delivery",
    audience: "Customers exploring fabrication work in Imphal",
    technicalFocus: "Product discovery, responsive pages and inquiry handoff",
    featured: true,
    caseStudy: true,
    gallery: [
      {
        src: "/images/projects/friends-banner.webp",
        alt: "Completed aluminium and glass building work",
        caption: "Project photography",
      },
      {
        src: "/images/projects/friends-products.webp",
        alt: "Friends Aluminium Works product catalogue",
        caption: "Public catalogue",
      },
      {
        src: "/images/projects/friends-window.webp",
        alt: "Aluminium window installation",
        caption: "Window installation",
      },
      {
        src: "/images/projects/friends-glass-railing.webp",
        alt: "Glass railing installation",
        caption: "Railing work",
      },
      {
        src: "/images/projects/friends-partitions.webp",
        alt: "Interior partition installation",
        caption: "Partition work",
      },
    ],
    limitations: [
      "Commercial outcomes and search results have not been measured.",
    ],
    lede: "A local fabrication business made clear through products, projects, and a direct path to inquiry.",
    summary:
      "A product and project website for an aluminium fabrication business, designed to help visitors understand the work and move naturally into an enquiry.",
    live: "https://friendsaluminiumworks.com/",
    visual: {
      src: "/images/projects/friends-aluminium-works-public-desktop.webp",
      alt: "Current Friends Aluminium Works homepage captured from the public deployment",
      caption: "Current public deployment capture · Friends Aluminium Works",
    },
    stack: ["React", "TypeScript", "Vite", "SEO", "Responsive UI"],
    context:
      "The public site presents aluminium, steel, and glass work in Imphal, with product, service, project, blog, and contact routes.",
    problem:
      "Visitors need to understand the business's range quickly, see relevant work, and start a quote through a familiar channel.",
    ownership:
      "Ajmir Aribam appears in the local Git history and resumes describe end-to-end delivery. Commercial agreement and measured outcomes are unverified.",
    constraints: [
      "Local search clarity",
      "Image-heavy catalogue",
      "Inquiry handoff through email and WhatsApp",
    ],
    boundaries: [
      {
        label: "Browser",
        detail:
          "React Router pages and reusable UI components rendered from TypeScript data.",
      },
      {
        label: "Discovery",
        detail:
          "Route-specific titles, descriptions, canonical and social metadata are set by the SEO component.",
      },
      {
        label: "Inquiry",
        detail:
          "Contact opens the user's email client; quote requests prepare a WhatsApp message. No backend submission is claimed.",
      },
      {
        label: "Local editor",
        detail:
          "A browser-local project editor stores entries in localStorage; it is not a shared CMS.",
      },
    ],
    decisions: [
      {
        title: "Map each service to a route",
        body: "Products and services have dedicated pages, supporting focused navigation and metadata.",
        evidence: "src/components/Seo.tsx",
      },
      {
        title: "Use direct handoff",
        body: "The quote flow creates a WhatsApp message; the contact form opens mailto rather than claiming server-side delivery.",
        evidence: "src/components/QuoteForm.tsx, src/pages/ContactPage.tsx",
      },
      {
        title: "Keep editing scope honest",
        body: "The local project editor writes to browser storage, which limits its use to that device.",
        evidence: "src/utils/projectStorage.ts",
      },
    ],
    delivery:
      "The repository builds a Vite frontend and generates route pages for public discovery. Hosting details and release process need owner verification.",
    operations:
      "No server-side inquiry service or shared editorial backend was found in this source. The external communication apps complete the handoff.",
    outcome:
      "A live commercial website with navigable products, services, projects, and inquiry paths. No lead or search-ranking numbers are asserted.",
    lessons:
      "A good delivery story includes honest system boundaries: the browser can prepare an inquiry, while a communication channel handles sending.",
    verify: ["Commercial arrangement and business outcomes — unverified"],
  },
  {
    slug: "azaeron-verity",
    name: "Azaeron Verity",
    type: "Document intelligence · in development",
    year: "2026",
    maturity: "development",
    technicalFocus: "Document versions, evidence links and human review",
    audience: "Reviewers assessing document findings and their sources",
    featured: false,
    caseStudy: true,
    gallery: [
      {
        src: "/images/projects/verity-review.png",
        alt: "Verity local review workspace",
        caption: "Local review workspace",
      },
      {
        src: "/images/projects/verity-evidence-graph.png",
        alt: "Verity local evidence graph",
        caption: "Local evidence graph",
      },
    ],
    contribution: "unverified: individual and team contribution boundaries.",
    limitations: [
      "Not production ready; no approved production generative model or calibrated detector.",
    ],
    status: "In development",
    lede: "Verity lets reviewers examine document analysis alongside the exact version, recorded text, and sources behind it.",
    summary:
      "A document review workspace that keeps findings tied to a version, source and uncertainty.",
    visual: {
      src: "/images/projects/verity-review.png",
      alt: "Verity local review workspace showing a version-scoped result and an explicit insufficient-evidence state",
      caption: "Local development capture · Verity review workspace",
    },
    stack: ["Next.js", "FastAPI", "PostgreSQL", "Redis"],
    context:
      "The current build includes versioned documents, an evidence graph, citations, provenance, report services, and a browser review surface. The project remains in development.",
    problem:
      "A document-analysis result is hard to assess when the source text, document version, and uncertainty are separated from it.",
    ownership: "unverified: exact individual and team contribution boundaries.",
    constraints: [
      "Every finding must belong to an immutable document version",
      "Uncalibrated analysis must abstain rather than imply certainty",
      "Private documents and tenant scopes must remain separate",
    ],
    boundaries: [
      {
        label: "Review UI",
        detail: "Next.js document and evidence review surfaces.",
      },
      {
        label: "API",
        detail: "FastAPI document, provenance, citation, and report services.",
      },
      {
        label: "Data",
        detail:
          "PostgreSQL version and evidence records with scoped relationships.",
      },
      {
        label: "Analysis",
        detail:
          "Deterministic writing suggestions; no approved production generative model.",
      },
    ],
    decisions: [
      {
        title: "Tie analysis to a version",
        body: "Evidence writes require a document version; graph edges cannot cross document versions or organizations.",
        evidence: "backend/app/modules/evidence/service.py",
      },
      {
        title: "Show uncertainty",
        body: "The review surface can report insufficient evidence and an unavailable calibrated model instead of asserting authorship.",
        evidence: "backend/app/modules/evidence/report_service.py",
      },
      {
        title: "Keep model claims narrow",
        body: "Writing suggestions currently use deterministic rules. Production model adoption remains gated on approval and evaluation.",
        evidence: "docs/verity/AI_SYSTEM.md",
      },
    ],
    delivery:
      "Local gates cover unit, PostgreSQL, and browser tests, but the current certification fails on a backend image scan and missing product capabilities.",
    operations:
      "Readiness and isolated dependency outage tests exist locally; production resilience is unverified.",
    outcome:
      "A substantive local review prototype with explicit uncertainty and traceable analysis. No public deployment or model accuracy claim.",
    lessons:
      "Analysis is more useful when it can point back to a version and admit what it cannot conclude.",
    verify: ["Production model, deployment, and ownership — unverified"],
  },
  {
    slug: "the-scent-bar-retail-os",
    name: "The Scent Bar Retail OS",
    type: "Retail operations · in development",
    year: "2026",
    maturity: "development",
    technicalFocus: "Tenant identity, branches, SKU and pricing foundations",
    audience: "Retail teams working across branches",
    featured: false,
    caseStudy: true,
    gallery: [
      {
        src: "/images/projects/scent-bar-architecture.svg",
        alt: "Scent Bar implementation map distinguishing current and planned scope",
        caption: "Implementation map",
      },
    ],
    contribution: "unverified: individual and team contribution boundaries.",
    limitations: [
      "Inventory ledger, purchasing and POS are not built in this milestone.",
    ],
    status: "In development",
    lede: "A multi-branch retail workspace taking shape around identity, catalogue, SKU, pricing, and branch access.",
    summary:
      "A multi-branch retail system taking shape around identity, catalogue, SKU, pricing and store-level operations.",
    visual: {
      src: "/images/projects/scent-bar-architecture.svg",
      alt: "Diagram of the implemented Scent Bar identity and catalogue modules, with later retail modules marked as planned",
      caption: "Implementation map · current milestone scope",
    },
    stack: ["Next.js", "NestJS", "PostgreSQL", "Redis"],
    context:
      "The current build covers identity, organization and branch access, product catalogue, SKU and barcode records, tax, and effective-dated pricing. Database and API runtime checks remain open.",
    problem:
      "A branch-specific catalogue needs dependable product identity, price rules, and access control before transactional retail flows can be built on it.",
    ownership: "unverified: exact individual and team contribution boundaries.",
    constraints: [
      "Tenant and branch scope derived on the server",
      "SKU, barcode, and effective-dated price rules",
      "Runtime PostgreSQL verification still required",
    ],
    boundaries: [
      {
        label: "Web",
        detail: "Next.js catalogue administration and product detail surfaces.",
      },
      {
        label: "API",
        detail:
          "NestJS modules for identity, branches, catalogue, and pricing.",
      },
      {
        label: "Data",
        detail:
          "PostgreSQL tenant scope, row-level security, and catalogue migrations.",
      },
      {
        label: "Worker",
        detail: "Outbox processing foundation with Redis/BullMQ integration.",
      },
    ],
    decisions: [
      {
        title: "Keep branch scope server-owned",
        body: "The API resolves organization and allowed branches from the authenticated principal; a browser-selected branch does not grant access.",
        evidence: "docs/ARCHITECTURE.md",
      },
      {
        title: "Separate product identity from stock",
        body: "Catalogue and pricing models exist; product/SKU records carry no authoritative inventory quantity yet.",
        evidence: "docs/IMPLEMENTATION_STATUS.md",
      },
      {
        title: "Verify database rules directly",
        body: "Test harnesses cover row-level security, cross-tenant relations, duplicate codes, and price overlap; current runtime results remain open.",
        evidence: "scripts/test-milestone2-db.mjs",
      },
    ],
    delivery:
      "Workspace build and source gates have been reported locally. The current milestone requires fresh migrations, database and HTTP checks before it can be called verified complete.",
    operations:
      "A runbook and worker foundation exist. Retail transaction and recovery behavior is not yet demonstrated.",
    outcome:
      "Identity and catalogue foundations are implemented; stock ledger, purchasing, and POS have not been built in this milestone.",
    lessons:
      "Retail operations need reliable product identity and branch permissions before stock or sales can be trusted.",
    verify: ["Runtime integration and final feature scope — unverified"],
  },
  {
    slug: "azaeron-construction-procurement",
    name: "Azaeron Construction Procurement",
    type: "Procurement systems · in development",
    year: "2026",
    maturity: "development",
    role: "Product and backend engineering",
    audience: "Contractors and teams sourcing material for projects",
    technicalFocus: "Server pricing, project scope, RFQs and approval paths",
    featured: false,
    caseStudy: true,
    gallery: [],
    status: "In development",
    limitations: [
      "External payment, supplier, warehouse and deployment integrations are not verified.",
    ],
    lede: "Construction purchasing brings catalogue, pricing, delivery, approvals, and supplier responses into one workflow.",
    summary:
      "A procurement workflow for project scope, pricing, approvals, supplier requests and purchasing records.",
    visual: {
      src: "/images/projects/azaeron-construction.svg",
      alt: "Azaeron construction procurement flow from project catalogue to RFQ and approval",
      caption: "Procurement flow · local implementation map",
    },
    stack: ["Next.js", "Prisma", "PostgreSQL", "Auth.js"],
    context:
      "This is separate from the merchant billing product. The current build models construction materials, project scope, server-resolved totals, checkout, RFQs, supplier quotes, approvals, and procurement records.",
    problem:
      "Project buying needs material context, reliable totals and a request path that can survive review instead of treating a browser cart as the source of truth.",
    ownership: "unverified: exact individual and team contribution boundaries.",
    constraints: [
      "Prices, tax and delivery are resolved on the server",
      "Project and organization scope must survive each procurement write",
      "External payment and supplier operations remain release gates",
    ],
    boundaries: [
      {
        label: "Catalogue",
        detail: "Project-aware construction materials and search surfaces.",
      },
      {
        label: "Commerce",
        detail:
          "Server-resolved totals, checkout idempotency and conditional reservation rules.",
      },
      {
        label: "Procurement",
        detail:
          "RFQ, supplier quote, approval and purchase-order records with policy checks.",
      },
      {
        label: "Data",
        detail:
          "Prisma and PostgreSQL migrations with organization-scoped relationships.",
      },
    ],
    decisions: [
      {
        title: "Make totals server-owned",
        body: "Checkout re-resolves product identity, price, tax and delivery before writing an order.",
        evidence: "src/app/api/checkout/route.ts",
      },
      {
        title: "Keep procurement distinct",
        body: "RFQs and approvals are separate domain records from merchant invoices and payment lifecycle state.",
        evidence: "prisma/schema.prisma",
      },
      {
        title: "Name the missing integrations",
        body: "Live Razorpay calls, supplier credentials, warehouse operations and production deployment remain unverified.",
        evidence: "docs/IMPLEMENTATION_STATUS.md",
      },
    ],
    delivery:
      "The local project includes PostgreSQL migration, API, and runtime checks for this stage. External integrations and deployment remain open.",
    operations:
      "The build keeps project scope, pricing, checkout, RFQs, and approval policy in separate records. Production recovery, alerts, and supplier or warehouse operations remain unverified.",
    outcome:
      "The current build models catalogue pricing, checkout, RFQs, quotes, approvals, and procurement records. Live integrations and deployment have not been verified.",
    lessons:
      "Construction commerce becomes safer when project scope, pricing and approval policy are part of the domain model.",
    verify: ["Production deployment, integrations and ownership — unverified"],
  },
  {
    slug: "accessforge",
    name: "AccessForge",
    type: "Accessibility engineering · in development",
    year: "2026",
    maturity: "development",
    role: "Product and quality engineering",
    audience: "Teams turning accessibility findings into verified changes",
    technicalFocus: "Deterministic scanning, remediation, security and proof",
    featured: false,
    caseStudy: true,
    gallery: [],
    status: "In development",
    limitations: [
      "The local interface reports an offline state; no production service is available.",
      "Benchmark metrics are kept in internal project evidence rather than presented as portfolio outcomes.",
    ],
    lede: "Accessibility findings become useful when a fix can be re-tested, security-checked and proved.",
    summary:
      "An accessibility remediation system that separates finding, changing and verifying so a proposed fix does not become proof by assumption.",
    visual: {
      src: "/images/projects/accessforge-pipeline.svg",
      alt: "AccessForge pipeline from accessibility scan through proof",
      caption: "Nine-step proof pipeline · local build",
    },
    stack: ["FastAPI", "Playwright", "Python", "React", "Semgrep"],
    context:
      "The current build pairs a React interface with a FastAPI service. Playwright runs deterministic scans; bounded remediations pass security checks before a re-scan. Unit, integration, security, and end-to-end tests cover the workflow.",
    problem:
      "A detected defect is not the same as a fixed or verified defect. Accessibility work needs an evidence chain that can survive a re-scan and regression check.",
    ownership:
      "The local source is attributed to Ajmir Aribam; exact project ownership and any future public repository status remain unverified.",
    constraints: [
      "Deterministic checks run before optional model assistance",
      "Patches are bounded and security-checked",
      "Verification requires evidence, re-scan and no regression",
    ],
    boundaries: [
      {
        label: "Scan",
        detail: "Playwright crawl and WCAG-oriented deterministic analysis.",
      },
      {
        label: "Remediate",
        detail:
          "Targeted ARIA, keyboard, contrast and content changes produce change records.",
      },
      {
        label: "Secure",
        detail: "Semgrep and safety checks gate accepted remediations.",
      },
      {
        label: "Prove",
        detail:
          "Reports, evidence and proof endpoints preserve the result and its scope.",
      },
    ],
    decisions: [
      {
        title: "Keep AI out of the critical path",
        body: "The deterministic crawl and core accessibility checks use zero model tokens; model assistance is optional for semantic image description.",
        evidence: "src/scanning/deterministic_scan.py",
      },
      {
        title: "Treat proof as a state",
        body: "Detected, applied and verified are separate states, with re-scan and regression checks between them.",
        evidence: "src/workflows/accessibility_workflow.py",
      },
      {
        title: "Test the boundaries",
        body: "The source includes API, MCP, security and full-workflow tests, while production deployment remains unverified.",
        evidence: "tests/integration, tests/security, tests/e2e",
      },
    ],
    delivery:
      "Local tests and Docker workflows are available. No deployed service or active operational environment has been verified.",
    operations:
      "The build includes health checks, correlation IDs, and evidence storage. Production storage, alerting, and model-provider operation are unverified.",
    outcome:
      "The build separates a finding, an applied change, and a verified fix. It is a local build; no deployed service has been verified.",
    lessons:
      "Accessibility automation earns trust when the result can show what changed, what was checked and what remains uncertain.",
    verify: ["Production deployment and ownership — unverified"],
  },
  {
    slug: "scmirn",
    name: "SCMIRN",
    type: "Civic technology · prototype",
    year: "2026",
    maturity: "prototype",
    role: "Product and full-stack prototyping",
    audience: "Citizens navigating complaints, offices and service guidance",
    technicalFocus: "Civic workflows, structured guidance and API boundaries",
    featured: false,
    caseStudy: true,
    gallery: [],
    status: "Prototype",
    limitations: [
      "Deployment and end-to-end production behavior are not verified.",
      "AI and rights guidance is informational and is not legal advice or an official government service.",
    ],
    lede: "SCMIRN explores a clearer path from complaint to guidance, office discovery, documents, and progress tracking.",
    summary:
      "A React and FastAPI civic-service prototype with complaint, tracker, office, document and guidance surfaces.",
    visual: {
      src: "/images/projects/scmirn-flow.svg",
      alt: "SCMIRN civic request flow from issue to guidance, office and tracking",
      caption: "Civic request flow · prototype",
    },
    stack: ["React", "TypeScript", "FastAPI", "PostgreSQL", "Vite"],
    context:
      "The prototype pairs React/Vite screens with FastAPI modules for complaints, progress, office discovery, documents, rights information, analytics, and AI Help. Some interface paths still use mock data.",
    problem:
      "Civic requests are difficult to start when the user must know the department, right process and tracking path in advance.",
    ownership: "unverified: exact individual and team contribution boundaries.",
    constraints: [
      "Guidance must not impersonate an authority or legal counsel",
      "A complaint needs a visible status path",
      "Mock-backed surfaces must remain labeled as prototype behavior",
    ],
    boundaries: [
      {
        label: "Citizen UX",
        detail:
          "Complaint, rights, office, map, documents and progress routes.",
      },
      {
        label: "API",
        detail:
          "FastAPI issue, tracker, office, document and guidance endpoints.",
      },
      {
        label: "Data",
        detail: "Local models and seed data support the prototype workflow.",
      },
      {
        label: "Guidance",
        detail:
          "Structured and AI-assisted guidance is presented as informational.",
      },
    ],
    decisions: [
      {
        title: "Make the next action clear",
        body: "The prototype brings file, understand, find and track actions into the primary navigation.",
        evidence: "frontend/src/pages, frontend/src/routes",
      },
      {
        title: "Keep guidance bounded",
        body: "AI Help and rights surfaces are framed as plain-language guidance, with urgent cases directed to official channels.",
        evidence: "frontend/src/pages/AIAssistant.tsx",
      },
      {
        title: "Label the prototype boundary",
        body: "Local source and mock-backed UI paths are evidence of a working exploration, not production civic infrastructure.",
        evidence: "frontend/src/data/mockData.ts",
      },
    ],
    delivery:
      "The prototype was reviewed against its API modules and an agent test. Hosted deployment and complete end-to-end execution remain unverified.",
    operations:
      "Authentication, complaint, document, progress, and analytics paths are present. Production data, authority integrations, uptime, and privacy review remain open.",
    outcome:
      "A working prototype connects citizen-facing service paths with backend modules. Some screens use mock data, and deployment is unverified.",
    lessons:
      "Civic software should reduce the first step while keeping guidance honest about authority and uncertainty.",
    verify: ["Deployment, data provenance and ownership — unverified"],
  },
  {
    slug: "zam-zam-academy",
    name: "Zam Zam Academy",
    type: "Education web · prototype",
    year: "2026",
    maturity: "prototype",
    role: "Web delivery",
    audience: "Families exploring an academy website",
    technicalFocus:
      "Responsive information architecture and public presentation",
    featured: false,
    caseStudy: true,
    gallery: [],
    status: "Prototype",
    limitations: [
      "The public Netlify URL proves hosting, not client ownership, adoption or production operations.",
      "Template content and school figures are not repeated as portfolio claims.",
    ],
    lede: "A hosted prototype for academics, admissions, faculty, student life, notices, and contact.",
    summary:
      "A multi-page education website study covering academics, admissions, faculty, student life, notices and contact journeys.",
    live: "https://storied-bombolone-5d4a8f.netlify.app/",
    visual: {
      src: "/images/projects/zam-zam-academy-public-desktop.webp",
      alt: "Current Zam Zam Academy hosted prototype captured from its preview",
      caption: "Current hosted prototype capture · Zam Zam Academy",
    },
    stack: ["React", "TypeScript", "Vite", "React Router", "Tailwind CSS"],
    context:
      "The hosted prototype has routes for home, about, academics, admissions, faculty, student life, gallery, notices, and contact. The public preview is available, but ownership and production use are unverified.",
    problem:
      "An academy website needs a readable path from first impression to practical information without relying on a single landing page.",
    ownership:
      "unverified: exact client and individual contribution boundaries.",
    constraints: [
      "Keep the portfolio claim about web delivery, not school operations",
      "Treat template copy and supplied figures as source content, not independently verified facts",
      "Provide a responsive route structure",
    ],
    boundaries: [
      {
        label: "Routes",
        detail: "React Router pages for the main public information areas.",
      },
      {
        label: "Presentation",
        detail: "Responsive layout, navigation, notices and contact surfaces.",
      },
      {
        label: "Hosting",
        detail:
          "A public Netlify preview was reachable during the evidence pass.",
      },
      {
        label: "Status",
        detail: "Prototype/template study; no client production claim is made.",
      },
    ],
    decisions: [
      {
        title: "Use direct routes",
        body: "Families can reach academics, admissions, faculty and contact without searching a single long page.",
        evidence: "src/App.tsx",
      },
      {
        title: "Keep the claim narrow",
        body: "The portfolio describes a hosted web prototype and does not repeat enrollment, staffing or business results.",
        evidence: "Local source and hosted preview",
      },
      {
        title: "Preserve the original surface",
        body: "The case study documents the delivery example without redesigning the academy website itself.",
        evidence: "public preview",
      },
    ],
    delivery:
      "The Vite application builds a multi-route site, and a hosted Netlify preview is available. Client ownership and production support have not been verified.",
    operations:
      "Hosting is visible; ownership, deployment pipeline, content governance and production support are unverified.",
    outcome:
      "A hosted, multi-page website prototype. The portfolio makes no claim about school ownership or day-to-day operations.",
    lessons:
      "A route map can do more for a public site than a crowded first page when people arrive with different questions.",
    verify: [
      "Client relationship, ownership and production status — unverified",
    ],
  },
];

export const projectBySlug = (slug: string) =>
  projects.find((project) => project.slug === slug);
