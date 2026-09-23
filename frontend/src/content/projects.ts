export type Project = {
  slug: string;
  number: string;
  name: string;
  type: string;
  lede: string;
  summary: string;
  live: string;
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
    lede: "A billing platform where state, access, and money have to agree.",
    summary:
      "Invoice and business operations software with a React interface, Express API, and MongoDB persistence.",
    live: "https://invoice.web-com.live/",
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
          "GitHub Actions release gate; Vercel frontend and Render API described in source configuration.",
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
    lede: "A public institution site backed by controlled publishing.",
    summary:
      "An institutional web platform for six centres, public resources, and content operations.",
    live: "https://shapesindia.org/",
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
    lede: "A trade business translated into a clear, inspectable web presence.",
    summary:
      "A responsive product, service, project, and inquiry site for an Imphal fabrication business.",
    live: "https://friendsaluminiumworks.com/",
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
];

export const projectBySlug = (slug: string) =>
  projects.find((project) => project.slug === slug);
