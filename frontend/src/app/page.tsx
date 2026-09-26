import Image from "next/image";
import Link from "next/link";
import { projects } from "@/content/projects";
import { writing } from "@/content/writing";

const bySlug = (slug: string) =>
  projects.find((project) => project.slug === slug)!;

const selectedWork = [
  bySlug("azaeron"),
  bySlug("azaeron-verity"),
  bySlug("accessforge"),
];

const maturityLabel = {
  live: "Live",
  development: "In development",
  prototype: "Prototype",
} as const;

export default function Home() {
  return (
    <main id="main" className="portfolio-home">
      <section className="home-hero" aria-labelledby="home-title">
        <div className="shell home-hero-main">
          <div className="home-hero-copy">
            <p className="home-eyebrow">Software Engineer · Imphal, India</p>
            <h1 id="home-title">
              <span>Ajmir</span> <span>Aribam</span>
            </h1>
            <p className="home-role">Software Engineer</p>
            <p className="home-proposition">
              I build dependable software from interface to infrastructure.
            </p>
            <p className="home-support">
              My work spans full-stack products, backend systems, cloud delivery
              and quality engineering. I turn complex workflows into clear,
              maintainable software.
            </p>
            <div className="home-actions" aria-label="Introduction links">
              <Link className="button button-primary" href="/work">
                Explore work <span aria-hidden="true">↗</span>
              </Link>
              <Link className="text-link" href="/about">
                About <span aria-hidden="true">↗</span>
              </Link>
              <Link className="text-link" href="/resume">
                Résumé <span aria-hidden="true">↗</span>
              </Link>
              <Link className="text-link" href="/contact">
                Contact <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>

          <figure className="home-portrait">
            <div className="home-portrait-frame">
              <Image
                src="/images/ajmir-portrait.jpg"
                alt="Portrait of Ajmir Aribam"
                fill
                priority
                sizes="(max-width: 700px) calc(100vw - 2.25rem), (max-width: 1000px) 34vw, 390px"
              />
            </div>
            <figcaption>
              <span>Ajmir Aribam</span>
              <span>Software Engineer</span>
            </figcaption>
          </figure>
        </div>

        <dl className="shell home-proof" aria-label="Engineering strengths">
          <div>
            <dt>Product</dt>
            <dd>Full-stack interfaces shaped around real work</dd>
          </div>
          <div>
            <dt>Systems</dt>
            <dd>APIs, business rules and data that stay coherent</dd>
          </div>
          <div>
            <dt>Delivery</dt>
            <dd>Cloud releases with explicit readiness checks</dd>
          </div>
          <div>
            <dt>Quality</dt>
            <dd>Tests for the paths and failures that matter</dd>
          </div>
        </dl>
      </section>

      <section
        className="shell home-profile"
        aria-labelledby="home-profile-title"
      >
        <p className="section-label">Profile</p>
        <div className="home-profile-body">
          <h2 id="home-profile-title">
            Engineering judgment grounded in how systems are used.
          </h2>
          <div className="home-profile-copy">
            <p>
              Before working in software, I handled banking and public digital
              service workflows where an unclear status or incorrect record had
              an immediate effect on someone.
            </p>
            <p>
              That experience shapes how I engineer today: make state explicit,
              protect important transitions, and leave a release path another
              person can understand and repeat.
            </p>
          </div>
          <Link className="text-link" href="/about">
            More about my background <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>

      <section className="home-work" aria-labelledby="selected-title">
        <div className="shell">
          <header className="home-section-heading">
            <p className="section-label">Selected work</p>
            <div>
              <h2 id="selected-title">Systems built around clear decisions.</h2>
              <p>
                Three representative projects across billing, document review
                and accessibility engineering.
              </p>
            </div>
          </header>

          <ol className="home-work-list">
            {selectedWork.map((project, index) => (
              <li key={project.slug}>
                <article className="home-work-item">
                  <div className="home-work-meta">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <span>
                      {project.year} · {maturityLabel[project.maturity]}
                    </span>
                  </div>
                  <div className="home-work-summary">
                    <h3>
                      <Link href={`/work/${project.slug}`}>{project.name}</Link>
                    </h3>
                    <p>{project.summary}</p>
                  </div>
                  <div className="home-work-detail">
                    <span>{project.technicalFocus}</span>
                    <Link href={`/work/${project.slug}`}>
                      Read case study <span aria-hidden="true">↗</span>
                    </Link>
                  </div>
                </article>
              </li>
            ))}
          </ol>

          <Link className="home-work-all" href="/work">
            <span>View all nine projects</span>
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>

      <section className="shell home-practice" aria-labelledby="practice-title">
        <header className="home-section-heading">
          <p className="section-label">Engineering practice</p>
          <div>
            <h2 id="practice-title">
              The product and its boundaries must agree.
            </h2>
            <p>
              I work through the interface, application rules and release path
              as one connected system.
            </p>
          </div>
        </header>
        <ol className="home-practice-list">
          <li>
            <span>01</span>
            <h3>Make the work legible.</h3>
            <p>
              Clarify the task, the current state and the next safe action
              before adding interface detail.
            </p>
          </li>
          <li>
            <span>02</span>
            <h3>Keep rules at the boundary.</h3>
            <p>
              Put authorization, transitions and validation where every caller
              meets the same decision.
            </p>
          </li>
          <li>
            <span>03</span>
            <h3>Make release evidence repeatable.</h3>
            <p>
              Test meaningful failures, verify readiness and document what the
              system can honestly claim.
            </p>
          </li>
        </ol>
        <Link className="text-link" href="/engineering">
          Read my engineering approach <span aria-hidden="true">↗</span>
        </Link>
      </section>

      <section className="home-writing" aria-labelledby="writing-title">
        <div className="shell home-writing-inner">
          <p className="section-label">Latest note</p>
          <div>
            <p className="home-writing-meta">
              {writing[0].topic} · {writing[0].reading}
            </p>
            <h2 id="writing-title">{writing[0].title}</h2>
            <p>{writing[0].description}</p>
            <Link className="text-link" href={`/notes/${writing[0].slug}`}>
              Read the note <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="shell home-contact" aria-label="Contact Ajmir">
        <div>
          <p className="section-label">Contact</p>
          <h2>Let’s talk about useful software.</h2>
        </div>
        <Link className="button button-primary" href="/contact">
          Start a conversation <span aria-hidden="true">↗</span>
        </Link>
      </section>
    </main>
  );
}
