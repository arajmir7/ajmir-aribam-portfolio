import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { projects } from "@/content/projects";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta(
  "Selected work",
  "Billing, publishing, commercial web, document review, and retail platform work by Ajmir Aribam.",
  "/work",
);

const [azaeron, shapes, friends, verity, scentBar] = projects;

export default function WorkPage() {
  return (
    <main id="main" className="work-index">
      <div className="shell work-index-intro">
        <div className="section-line">
          <span>SELECTED WORK</span>
          <span>LIVE WORK + IN-DEVELOPMENT SYSTEMS</span>
        </div>
        <div className="work-index-heading">
          <h1>
            Selected work<span className="period">.</span>
          </h1>
          <p>
            Software for business operations, publishing, document review, and
            the people using each product. Every case explains what is live and
            what is still being built.
          </p>
        </div>
      </div>

      <section className="shell work-feature" aria-labelledby="work-azaeron">
        <div className="work-feature-visual">
          <Image
            src={azaeron.visual.src}
            alt={azaeron.visual.alt}
            fill
            sizes="(max-width: 850px) 100vw, 58vw"
            priority
          />
          <span>PUBLIC PRODUCT SURFACE / AZAERON</span>
        </div>
        <div className="work-feature-content">
          <div className="work-entry-meta">
            <span>01 / FLAGSHIP</span>
            <span>LIVE PRODUCT ↗</span>
          </div>
          <h2 id="work-azaeron">Azaeron</h2>
          <p className="work-entry-lede">
            Invoices, quotations, payments, inventory, and customer records in
            one merchant workspace.
          </p>
          <dl className="work-entry-details">
            <div>
              <dt>My work</dt>
              <dd>Backend systems · Full-stack implementation · Delivery</dd>
            </div>
            <div>
              <dt>Technology</dt>
              <dd>React · TypeScript · Express · MongoDB</dd>
            </div>
          </dl>
          <div className="work-entry-actions">
            <Link href="/work/azaeron">Explore case study ↗</Link>
            <a href={azaeron.live!} target="_blank" rel="noopener noreferrer">
              Visit live product ↗
            </a>
          </div>
        </div>
      </section>

      <div className="shell work-secondary-intro">
        <span>02 / OTHER SYSTEMS</span>
        <p>
          A public institution site and a commercial website, each built around
          the tasks its visitors need to complete.
        </p>
      </div>

      <section
        className="shell work-editorial work-editorial--shapes"
        aria-labelledby="work-shapes"
      >
        <div className="work-editorial-visual">
          <Image
            src="/images/projects/shapes-home.webp"
            alt="SHAPES India public homepage introducing its institutional work"
            fill
            sizes="(max-width: 800px) 100vw, 52vw"
          />
          <span>PUBLIC EXPERIENCE / SHAPES INDIA</span>
        </div>
        <div className="work-editorial-content">
          <div className="work-entry-meta">
            <span>02 / INSTITUTIONAL</span>
            <span>LIVE SITE ↗</span>
          </div>
          <h2 id="work-shapes">SHAPES India</h2>
          <p>
            A public website for six centres, supported by a controlled
            publishing process for editors.
          </p>
          <dl className="work-entry-details">
            <div>
              <dt>My work</dt>
              <dd>Public platform · Publishing workflow</dd>
            </div>
            <div>
              <dt>Technology</dt>
              <dd>Flask · SQLAlchemy · PostgreSQL</dd>
            </div>
          </dl>
          <div className="work-entry-actions">
            <Link href="/work/shapes-india">Explore case study ↗</Link>
            <a href={shapes.live!} target="_blank" rel="noopener noreferrer">
              Visit live site ↗
            </a>
          </div>
        </div>
      </section>

      <section
        className="shell work-editorial work-editorial--friends"
        aria-labelledby="work-friends"
      >
        <div className="work-editorial-content">
          <div className="work-entry-meta">
            <span>03 / COMMERCIAL</span>
            <span>LIVE SITE ↗</span>
          </div>
          <h2 id="work-friends">Friends Aluminium Works</h2>
          <p>
            A visual catalogue of aluminium and glass work, with direct email
            and WhatsApp inquiry paths.
          </p>
          <dl className="work-entry-details">
            <div>
              <dt>My work</dt>
              <dd>Frontend design · Responsive delivery</dd>
            </div>
            <div>
              <dt>Technology</dt>
              <dd>React · TypeScript · Vite</dd>
            </div>
          </dl>
          <div className="work-entry-actions">
            <Link href="/work/friends-aluminium-works">
              Explore case study ↗
            </Link>
            <a href={friends.live!} target="_blank" rel="noopener noreferrer">
              Visit live site ↗
            </a>
          </div>
        </div>
        <div className="work-editorial-visual work-editorial-visual--photo">
          <Image
            src={friends.visual.src}
            alt={friends.visual.alt}
            fill
            sizes="(max-width: 800px) 100vw, 52vw"
          />
          <span>PROJECT PHOTOGRAPHY / FRIENDS ALUMINIUM WORKS</span>
        </div>
      </section>
      <section
        className="shell work-progress"
        aria-labelledby="work-progress-title"
      >
        <div className="work-progress-heading">
          <p className="eyebrow">IN DEVELOPMENT / INSPECTABLE WORK</p>
          <h2 id="work-progress-title">The next systems are taking shape.</h2>
          <p>
            These projects have working code and open release gates. Their
            current scope is stated in each case study.
          </p>
        </div>
        <div className="work-progress-grid">
          {[verity, scentBar].map((project) => (
            <article key={project.slug}>
              <div className="work-progress-image">
                <Image
                  src={project.visual.src}
                  alt={project.visual.alt}
                  fill
                  sizes="(max-width: 760px) 100vw, 45vw"
                />
              </div>
              <div className="work-progress-copy">
                <span>
                  {project.status} / {project.type.split(" · ")[0]}
                </span>
                <h3>{project.name}</h3>
                <p>{project.lede}</p>
                <Link href={`/work/${project.slug}`}>
                  Explore current build <span aria-hidden="true">↗</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
      <div className="shell work-labs-link">
        <p>
          <strong>Also exploring</strong> · SCMIRN and Zam Zam Academy are
          labeled prototypes in Labs.
        </p>
        <Link href="/labs">See Labs &amp; Experiments ↗</Link>
      </div>
    </main>
  );
}
