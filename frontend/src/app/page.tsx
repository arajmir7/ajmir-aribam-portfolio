import Image from "next/image";
import Link from "next/link";
import { ProjectCard, ProjectMedia } from "@/components/projects/project-card";
import { projects } from "@/content/projects";

const bySlug = (slug: string) =>
  projects.find((project) => project.slug === slug)!;
const featured = [
  bySlug("azaeron"),
  bySlug("azaeron-verity"),
  bySlug("accessforge"),
  bySlug("shapes-india"),
];

export default function Home() {
  return (
    <main id="main" className="rebuild-home">
      <section className="shell home-hero" aria-labelledby="home-title">
        <div className="home-hero-copy">
          <p className="section-label">Software engineering / Imphal, India</p>
          <h1 id="home-title">Ajmir Aribam</h1>
          <p className="home-role">Software Engineer</p>
          <p className="home-proposition">
            I build the product people use and the systems that make it
            dependable.
          </p>
          <p className="home-support">
            I work across interfaces, APIs, data and delivery. Recent projects
            include billing software, public information sites and tools for
            reviewing evidence.
          </p>
          <div className="home-actions">
            <Link className="button button-primary" href="/work">
              View work <span aria-hidden="true">↗</span>
            </Link>
            <Link className="text-link" href="/about">
              About Ajmir <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
        <aside className="home-evidence" aria-label="Featured product evidence">
          <div className="home-evidence-top">
            <span>Selected system</span>
            <span>01 / 09</span>
          </div>
          <Link
            href="/work/azaeron"
            className="home-evidence-image"
            aria-label="Explore Azaeron billing system"
          >
            <ProjectMedia project={featured[0]} priority />
          </Link>
          <div className="home-evidence-bottom">
            <div>
              <strong>Azaeron</strong>
              <span>Billing and business operations</span>
            </div>
            <Link href="/work/azaeron" aria-label="Read Azaeron case study">
              ↗
            </Link>
          </div>
        </aside>
      </section>
      <section className="shell home-selected" aria-labelledby="selected-title">
        <div className="section-intro">
          <p className="section-label">01 / Selected work</p>
          <div>
            <h2 id="selected-title">
              Billing, document review, accessibility and publishing.
            </h2>
            <p>
              See what each product does, how it works and where it stands
              today.
            </p>
          </div>
        </div>
        <div className="home-project-grid">
          {featured.map((project, index) => (
            <ProjectCard
              key={project.slug}
              project={project}
              index={index + 1}
              large={index === 0}
              src={
                index === 0
                  ? "/images/projects/azaeron-documentation.webp"
                  : undefined
              }
            />
          ))}
        </div>
        <Link className="archive-link" href="/work">
          View all nine projects <span aria-hidden="true">↗</span>
        </Link>
      </section>
      <section className="home-method" aria-labelledby="method-title">
        <div className="shell">
          <div className="section-intro">
            <p className="section-label">02 / Engineering</p>
            <div>
              <h2 id="method-title">The layers have to agree.</h2>
              <p>
                A useful interface depends on the rules, records and release
                path behind it.
              </p>
            </div>
          </div>
          <ol className="method-list">
            <li>
              <span>01 / Interface</span>
              <strong>Make the next action clear.</strong>
              <p>
                SHAPES gives visitors a route through six centres and their
                public information.
              </p>
              <Link href="/work/shapes-india">Publishing surface ↗</Link>
            </li>
            <li>
              <span>02 / Application</span>
              <strong>Keep rules in one place.</strong>
              <p>
                Azaeron checks invoice transitions and permissions in its API.
              </p>
              <Link href="/work/azaeron#decisions">Invoice rules ↗</Link>
            </li>
            <li>
              <span>03 / Data</span>
              <strong>Preserve what happened.</strong>
              <p>
                Verity links findings to exact document versions and source
                records.
              </p>
              <Link href="/work/azaeron-verity">Evidence model ↗</Link>
            </li>
            <li>
              <span>04 / Quality</span>
              <strong>Verify the whole path.</strong>
              <p>
                AccessForge turns findings into a rescan and recorded proof
                loop.
              </p>
              <Link href="/work/accessforge">Verification loop ↗</Link>
            </li>
          </ol>
          <Link className="method-more" href="/engineering">
            How I approach engineering <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
      <section
        className="shell home-about"
        aria-labelledby="about-preview-title"
      >
        <div className="home-about-photo">
          <Image
            src="/images/ajmir-portrait.jpg"
            alt="Portrait of Ajmir Aribam"
            fill
            sizes="(max-width: 700px) 38vw, 230px"
          />
        </div>
        <div>
          <p className="section-label">03 / About</p>
          <h2 id="about-preview-title">
            I care about what a system records, and what it promises.
          </h2>
          <p>
            Earlier work in banking and public digital services made reliability
            tangible. I bring that attention to software now, from the first
            screen to the final check.
          </p>
          <Link className="text-link" href="/about">
            Get to know me <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
      <section className="shell home-contact" aria-label="Contact Ajmir">
        <p>Have something worth building?</p>
        <Link href="/contact">
          Start a conversation <span aria-hidden="true">↗</span>
        </Link>
      </section>
    </main>
  );
}
