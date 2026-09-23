import Link from "next/link";
import { ProjectCard } from "@/components/projects/project-card";
import { projects } from "@/content/projects";
import { githubUrl, linkedinUrl } from "@/lib/site";

export default function Home() {
  return (
    <main id="main">
      <section className="hero shell">
        <div className="hero-top">
          <span className="eyebrow">ENGINEERING PORTFOLIO / 2026</span>
          <span className="hero-availability">
            01 / SYSTEMS, DELIVERY, OPERATIONS
          </span>
        </div>
        <div className="hero-grid">
          <div className="hero-primary">
            <p className="hero-name">MD AJMIR ARIBAM</p>
            <h1>
              Software Engineer<span className="hero-dash"> — </span>
              <em>Backend, Cloud &amp; DevOps.</em>
            </h1>
            <div className="hero-rule" />
            <p className="hero-statement">
              I build software systems designed to survive production.
            </p>
            <p className="hero-copy">
              From backend design and full-stack implementation to testing,
              CI/CD, cloud delivery, and the work that follows launch.
            </p>
            <p className="hero-capability">
              Production systems · Secure APIs · CI/CD · Cloud delivery ·
              Operational ownership
            </p>
            <div className="hero-ctas">
              <Link className="button button-primary" href="/work">
                View selected work <span aria-hidden="true">↗</span>
              </Link>
              <Link className="button button-outline" href="/resume">
                Resume <span aria-hidden="true">↗</span>
              </Link>
            </div>
            <div className="hero-social">
              <a href={githubUrl} target="_blank" rel="noopener noreferrer">
                GitHub ↗
              </a>
              <a href={linkedinUrl} target="_blank" rel="noopener noreferrer">
                LinkedIn ↗
              </a>
              <Link href="/contact">Contact ↗</Link>
            </div>
          </div>
          <aside className="hero-index" aria-label="Selected systems">
            <div className="index-heading">
              <span className="eyebrow">SELECTED SYSTEMS</span>
              <span>01 — 03</span>
            </div>
            {projects.map((p) => (
              <Link className="index-row" href={`/work/${p.slug}`} key={p.slug}>
                <span className="index-number">{p.number}</span>
                <span>
                  <strong>{p.name}</strong>
                  <small>{p.type}</small>
                </span>
                <span aria-hidden="true">↗</span>
              </Link>
            ))}
            <div className="index-bottom">
              <span>Product stories with engineering depth.</span>
              <Link href="/engineering">Explore engineering →</Link>
            </div>
          </aside>
        </div>
        <div className="hero-foot">
          <span>REQUIREMENTS → ARCHITECTURE → CODE → RELEASE → OPERATIONS</span>
          <span>SCROLL TO EXPLORE ↓</span>
        </div>
      </section>
      <section
        className="section shell selected-work"
        aria-labelledby="selected-heading"
      >
        <div className="section-intro">
          <div>
            <p className="eyebrow">01 / SELECTED WORK</p>
            <h2 id="selected-heading">Systems in context.</h2>
          </div>
          <p>
            Three very different problems: financial workflows, institutional
            publishing, and a commercial web experience.
          </p>
        </div>
        <div className="project-grid">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.slug}
              project={project}
              featured={index === 0}
            />
          ))}
        </div>
        <Link className="text-link" href="/work">
          All selected work <span aria-hidden="true">↗</span>
        </Link>
      </section>
      <section className="approach-band">
        <div className="shell approach-grid">
          <div>
            <p className="eyebrow">02 / ENGINEERING PRACTICE</p>
            <h2>
              Build the system.
              <br />
              <em>Own the boundary.</em>
            </h2>
          </div>
          <div>
            <p>
              Requirements become architecture. Architecture becomes explicit
              interfaces and tests. Delivery includes security, deployment, and
              a way to know when something is broken.
            </p>
            <Link className="text-link light" href="/engineering">
              Explore engineering <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
