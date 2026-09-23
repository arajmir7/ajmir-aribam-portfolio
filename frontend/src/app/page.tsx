import Image from "next/image";
import Link from "next/link";
import { projects } from "@/content/projects";
import { githubUrl } from "@/lib/site";

const [azaeron, shapes, friends] = projects;

const engineeringAreas = [
  ["Backend", "Business rules, APIs, and services", "/work/azaeron", "Azaeron"],
  [
    "Data",
    "Durable records and controlled state",
    "/work/shapes-india",
    "SHAPES India",
  ],
  [
    "AI systems",
    "Versioned analysis for human review",
    "/work/azaeron-verity",
    "Verity",
  ],
  [
    "Quality",
    "Tests, accessibility, and release checks",
    "/engineering",
    "Engineering",
  ],
  ["Cloud", "Containers, CI, and deployment paths", "/work/azaeron", "Azaeron"],
  [
    "Security",
    "Permissions at the point of change",
    "/work/the-scent-bar-retail-os",
    "The Scent Bar",
  ],
] as const;

export default function Home() {
  return (
    <main id="main">
      <section className="home-hero shell" aria-labelledby="home-title">
        <div className="home-hero-top">
          <span className="eyebrow">SOFTWARE ENGINEERING / PORTFOLIO</span>
          <span>BACKEND · CLOUD · DEVOPS · AI · QUALITY</span>
        </div>
        <div className="home-hero-grid">
          <div className="home-hero-main">
            <h1 id="home-title">
              Ajmir
              <br />
              Aribam<span className="period">.</span>
            </h1>
            <p className="home-role">Software Engineer</p>
            <p className="home-capability-line">
              Backend · Cloud · DevOps · AI Systems · Quality Engineering
            </p>
            <p className="home-proposition">
              I build reliable software products, from backend logic and APIs to
              deployment, testing, and the services that keep them running.
            </p>
            <p className="home-summary">
              My work includes business rules, data, permissions, background
              jobs, release pipelines, and the interfaces people use to reach
              them.
            </p>
            <div className="home-actions">
              <Link className="button button-primary" href="/work">
                View selected work <span aria-hidden="true">↗</span>
              </Link>
              <Link className="button button-outline" href="/resume">
                Resume <span aria-hidden="true">↗</span>
              </Link>
              <Link className="home-contact-link" href="/contact">
                Contact ↗
              </Link>
            </div>
          </div>
          <aside className="home-evidence-index" aria-label="Selected projects">
            <div className="home-index-head">
              <span>SELECTED SYSTEMS</span>
              <span>01 — 03</span>
            </div>
            {projects.slice(0, 3).map((project) => (
              <Link href={`/work/${project.slug}`} key={project.slug}>
                <span>{project.number}</span>
                <strong>{project.name}</strong>
                <small>{project.type}</small>
                <span aria-hidden="true">↗</span>
              </Link>
            ))}
            <p>Start with the work. The details are in each case study.</p>
          </aside>
        </div>
        <div className="home-hero-foot">
          <span>BACKEND · CLOUD · DEVOPS · AI SYSTEMS · QUALITY</span>
          <a href={githubUrl} target="_blank" rel="noopener noreferrer">
            GitHub ↗
          </a>
        </div>
      </section>

      <section className="home-flagship" aria-labelledby="flagship-title">
        <div className="shell">
          <div className="section-line section-line--light">
            <span>01 / FLAGSHIP SYSTEM</span>
            <span>PRODUCT + ENGINEERING</span>
          </div>
          <div className="home-flagship-grid">
            <div className="home-flagship-copy">
              <p className="eyebrow">AZAERON / BILLING SYSTEMS</p>
              <h2 id="flagship-title">
                Billing, stock, and customers in one place.
              </h2>
              <p>
                Azaeron connects invoices, quotations, inventory, point of sale,
                payments, and customer records. The difficult part is making
                those views agree when money or access changes.
              </p>
              <div className="flagship-path" aria-label="Azaeron product areas">
                <span>Sell</span>
                <span aria-hidden="true">→</span>
                <span>Collect</span>
                <span aria-hidden="true">→</span>
                <span>Operate</span>
              </div>
              <Link className="text-link light" href="/work/azaeron">
                Explore the Azaeron case study <span aria-hidden="true">↗</span>
              </Link>
            </div>
            <figure className="home-flagship-visual">
              <div>
                <Image
                  src={azaeron.visual.src}
                  alt={azaeron.visual.alt}
                  fill
                  sizes="(max-width: 900px) 100vw, 56vw"
                  priority
                />
              </div>
              <figcaption>{azaeron.visual.caption}</figcaption>
            </figure>
          </div>
          <div className="home-flagship-meta">
            <span>React · TypeScript · Express · MongoDB</span>
            <span>Lifecycle rules · authorization · release checks</span>
          </div>
        </div>
      </section>

      <section
        className="home-other-work shell"
        aria-labelledby="other-work-title"
      >
        <div className="home-section-heading">
          <div>
            <p className="eyebrow">02 / SELECTED SYSTEMS</p>
            <h2 id="other-work-title">Products built for different people.</h2>
          </div>
          <Link className="text-link" href="/work">
            Full work index <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <article className="home-project-row home-project-row--shapes">
          <div className="home-project-image">
            <Image
              src={shapes.visual.src}
              alt={shapes.visual.alt}
              fill
              sizes="(max-width: 800px) 100vw, 55vw"
            />
          </div>
          <div className="home-project-copy">
            <p className="eyebrow">02 / INSTITUTIONAL PLATFORM</p>
            <h3>SHAPES India</h3>
            <p>
              SHAPES India brings six centres into one public website. A
              publishing service lets editors prepare and review changes before
              they appear on the site.
            </p>
            <span>Flask · SQLAlchemy · PostgreSQL</span>
            <Link href="/work/shapes-india">Read the case study ↗</Link>
          </div>
        </article>
        <article className="home-project-row home-project-row--friends">
          <div className="home-project-copy">
            <p className="eyebrow">03 / COMMERCIAL FRONTEND</p>
            <h3>Friends Aluminium Works</h3>
            <p>
              A product and project website for an Imphal fabrication business.
              Visitors can see the work and send a quote request through
              WhatsApp or email.
            </p>
            <span>React · TypeScript · Responsive UI</span>
            <Link href="/work/friends-aluminium-works">
              Read the case study ↗
            </Link>
          </div>
          <div className="home-project-image">
            <Image
              src={friends.visual.src}
              alt={friends.visual.alt}
              fill
              sizes="(max-width: 800px) 100vw, 55vw"
            />
          </div>
        </article>
      </section>

      <section className="home-method" aria-labelledby="method-title">
        <div className="shell">
          <div className="home-method-intro">
            <div>
              <p className="eyebrow">03 / ENGINEERING SURFACE</p>
              <h2 id="method-title">What I build and how I check it.</h2>
            </div>
            <p>
              Each area connects to a project or a concrete delivery practice.
            </p>
          </div>
          <div className="home-area-grid">
            {engineeringAreas.map(
              ([label, description, href, project], index) => (
                <article key={label}>
                  <span>
                    0{index + 1} / {label}
                  </span>
                  <h3>{description}</h3>
                  <Link href={href}>
                    See {project} <span aria-hidden="true">↗</span>
                  </Link>
                </article>
              ),
            )}
          </div>
          <Link className="text-link" href="/engineering">
            Explore the engineering practice <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>

      <section className="home-personal shell" aria-labelledby="personal-title">
        <div className="home-personal-image">
          <Image
            src="/images/ajmir-portrait.jpg"
            alt="Portrait of Ajmir Aribam"
            fill
            sizes="(max-width: 700px) 35vw, 220px"
          />
        </div>
        <div>
          <p className="eyebrow">04 / THE PERSON BEHIND THE WORK</p>
          <h2 id="personal-title">
            People notice when software gets the details wrong.
          </h2>
          <p>
            Earlier work in banking and public digital services shaped how I
            think about dependable records, clear process, and the people who
            rely on a system after it ships.
          </p>
        </div>
        <div className="home-personal-links">
          <Link href="/about">About Ajmir ↗</Link>
          <Link href="/resume">Resume ↗</Link>
        </div>
      </section>
    </main>
  );
}
