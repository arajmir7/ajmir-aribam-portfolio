export type Project = {
  slug: string;
  number: string;
  name: string;
  type: string;
  lede: string;
  summary: string;
  live?: string;
  status?: string;
  maturity: "live" | "development";
  role?: string;
  audience: string;
  technicalFocus: string;
  featured: boolean;
  visual: { src: string; alt: string; caption: string }; // Hero media.
  gallery: { src: string; alt: string; caption: string }[];
  repositoryPublic?: string; // Only set after the repository is publicly inspectable.
  contribution?: string; // TODO_OWNER_VERIFY when individual boundaries are unknown.
  limitations: string[];
  caseStudy: boolean;
  source: string; // TODO_OWNER_VERIFY: remotes are not publicly accessible; never render as visitor links.
  revision: string;
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
    number: "01",
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
      "Invoice and business operations software with a React interface, Express API, and MongoDB persistence.",
    live: "https://invoice.web-com.live/",
    visual: {
      src: "/images/projects/azaeron-login.webp",
      alt: "Azaeron's public workspace sign-in interface",
      caption: "Public sign-in surface · Azaeron",
    },
    source: "https://github.com/arajmir7/azaeron-invoice-system",
    revision: "66b0f7c4c023685303ff495f58a6a776b7d67809",
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
      "The repository includes a GitHub Actions release gate and separate Vercel/Render configuration. Source describes queue and object-storage options; which are active in production is TODO_OWNER_VERIFY.",
    operations:
      "Structured request context, readiness, and optional OpenTelemetry instrumentation are present in source. Production alerting, recovery results, and field reliability are TODO_OWNER_VERIFY.",
    outcome:
      "A substantial locally inspected billing codebase and a responsive public deployment URL. No transaction, uptime, or customer claim is made here.",
    lessons:
      "Financial state belongs to a guarded domain transition, with a server-side audit trail and a separate operational readiness signal.",
    verify: [
      "Current production health and enabled integrations — TODO_OWNER_VERIFY",
      "Actual usage and operational results — TODO_OWNER_VERIFY",
    ],
  },
  {
    slug: "shapes-india",
    number: "02",
    name: "SHAPES India",
    type: "Institutional platform · production",
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
      "An institutional web platform for six centres, public resources, and content operations.",
    live: "https://shapesindia.org/",
    visual: {
      src: "/images/projects/shapes-centres.webp",
      alt: "SHAPES India centre index showing its six-centre navigation",
      caption: "Public centre index · SHAPES India",
    },
    source: "https://github.com/arajmir7/Shapes-India",
    revision: "0dbdf15b3dabce0a7d3bb37582a50426f793d7db",
    stack: ["Flask", "SQLAlchemy", "PostgreSQL", "Vite", "GitHub Actions"],
    context:
      "SHAPES presents learning, psychological services, research, and community work across six centres. Its public site and local source checkout were inspected.",
    problem:
      "Institutional information needs clear public navigation while editors need guarded paths to revise and publish content without blurring permissions or losing history.",
    ownership:
      "Ajmir Aribam appears in the local Git history. The public footer credits Azaeron for design and development; exact contractual ownership is TODO_OWNER_VERIFY.",
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
      "Source includes structured request IDs, health/readiness, backup and production verification scripts. Actual schedules and recovery evidence are TODO_OWNER_VERIFY.",
    outcome:
      "A live institutional site with six visible centres and locally inspected implementation. No audience or performance metrics are asserted.",
    lessons:
      "An editorial workflow is a backend system: state, authorization, revision history, and release safety matter as much as presentation.",
    verify: [
      "Production topology and active backup schedule — TODO_OWNER_VERIFY",
      "Editorial ownership boundaries — TODO_OWNER_VERIFY",
    ],
  },
  {
    slug: "friends-aluminium-works",
    number: "03",
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
      "A responsive product, service, project, and inquiry site for an Imphal fabrication business.",
    live: "https://friendsaluminiumworks.com/",
    visual: {
      src: "/images/projects/friends-banner.webp",
      alt: "Aluminium and glass work featured on the Friends Aluminium Works website",
      caption: "Project photography · Friends Aluminium Works",
    },
    source: "https://github.com/arajmir7/friends-aluminium-works",
    revision: "13aa4bfbefb116b5839c18d02907caa5097ecee8",
    stack: ["React", "TypeScript", "Vite", "SEO", "Responsive UI"],
    context:
      "The public site presents aluminium, steel, and glass work in Imphal, with product, service, project, blog, and contact routes.",
    problem:
      "Visitors need to understand the business's range quickly, see relevant work, and start a quote through a familiar channel.",
    ownership:
      "Ajmir Aribam appears in the local Git history and resumes describe end-to-end delivery. Commercial agreement and measured outcomes are TODO_OWNER_VERIFY.",
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
    verify: [
      "Commercial arrangement and business outcomes — TODO_OWNER_VERIFY",
    ],
  },
  {
    slug: "azaeron-verity",
    number: "04",
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
    contribution:
      "TODO_OWNER_VERIFY: individual and team contribution boundaries.",
    limitations: [
      "Not production ready; no approved production generative model or calibrated detector.",
    ],
    status: "In development",
    lede: "Verity lets reviewers examine document analysis alongside the exact version, recorded text, and sources behind it.",
    summary:
      "A version-aware document review workspace with recorded findings, citations, provenance, and explicit unavailable analysis states.",
    visual: {
      src: "/images/projects/verity-review.png",
      alt: "Verity local review workspace showing a version-scoped result and an explicit insufficient-evidence state",
      caption: "Local development capture · Verity review workspace",
    },
    source: "TODO_OWNER_VERIFY: Verity repository publication status",
    revision: "TODO_OWNER_VERIFY: local source snapshot has no Git metadata",
    stack: ["Next.js", "FastAPI", "PostgreSQL", "Redis"],
    context:
      "Local source contains document versions, evidence graph and report services, and a browser review surface. Its execution ledger explicitly says not production ready.",
    problem:
      "A document-analysis result is hard to assess when the source text, document version, and uncertainty are separated from it.",
    ownership:
      "TODO_OWNER_VERIFY: exact individual and team contribution boundaries.",
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
    verify: ["Production model, deployment, and ownership — TODO_OWNER_VERIFY"],
  },
  {
    slug: "the-scent-bar-retail-os",
    number: "05",
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
    contribution:
      "TODO_OWNER_VERIFY: individual and team contribution boundaries.",
    limitations: [
      "Inventory ledger, purchasing and POS are not built in this milestone.",
    ],
    status: "In development",
    lede: "A multi-branch retail workspace taking shape around identity, catalogue, SKU, pricing, and branch access.",
    summary:
      "A retail operations platform with implemented identity and catalogue modules; inventory, purchasing, and POS remain future milestones.",
    visual: {
      src: "/images/projects/scent-bar-architecture.svg",
      alt: "Diagram of the implemented Scent Bar identity and catalogue modules, with later retail modules marked as planned",
      caption: "Implementation map · current milestone scope",
    },
    source: "TODO_OWNER_VERIFY: retail OS repository publication status",
    revision: "TODO_OWNER_VERIFY: local worktree revision",
    stack: ["Next.js", "NestJS", "PostgreSQL", "Redis"],
    context:
      "Local implementation status identifies identity/branch access and catalogue/pricing as implemented, with required runtime and database verification still open.",
    problem:
      "A branch-specific catalogue needs dependable product identity, price rules, and access control before transactional retail flows can be built on it.",
    ownership:
      "TODO_OWNER_VERIFY: exact individual and team contribution boundaries.",
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
    verify: ["Runtime integration and final feature scope — TODO_OWNER_VERIFY"],
  },
];

export const projectBySlug = (slug: string) =>
  projects.find((project) => project.slug === slug);
