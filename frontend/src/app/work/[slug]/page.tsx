import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StructuredData } from "@/components/seo/structured-data";
import { statusLabel } from "@/components/projects/project-card";
import { projects, projectBySlug } from "@/content/projects";
import { caseStories } from "@/content/case-stories";
import { pageMeta, siteUrl } from "@/lib/site";

function publicLimitation(value: string) {
  const text = value.replace(/^TODO_OWNER_VERIFY:\s*/i, "");
  return `${text.charAt(0).toUpperCase()}${text.slice(1)}`;
}

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}
export const dynamicParams = false;
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projectBySlug(slug);
  return project
    ? pageMeta(`${project.name} case study`, project.summary, `/work/${slug}`)
    : {};
}

export default async function CaseStudy({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project) notFound();
  const story = caseStories[slug];
  const secondVisual = project.gallery.find(
    (visual) => visual.src !== project.visual.src,
  );
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Work",
        item: `${siteUrl}/work`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: project.name,
        item: `${siteUrl}/work/${project.slug}`,
      },
    ],
  };
  return (
    <main id="main" className={`rebuild-case case-${slug}`}>
      <StructuredData value={breadcrumbs} />
      <header className="shell case-opening">
        <Link className="back-link" href="/work">
          All work
        </Link>
        <div className="case-opening-grid">
          <div>
            <p className="section-label">
              {statusLabel(project)} / {project.year} /{" "}
              {project.type.split(" · ")[0]}
            </p>
            <h1>{project.name}</h1>
            <p className="case-opening-lede">{project.lede}</p>
          </div>
          <p className="case-opening-focus">{project.technicalFocus}</p>
        </div>
        <dl className="case-facts">
          <div>
            <dt>Role</dt>
            <dd>{project.role ?? "Individual role to be confirmed"}</dd>
          </div>
          <div>
            <dt>Scope</dt>
            <dd>{project.audience}</dd>
          </div>
          <div>
            <dt>Stack</dt>
            <dd>{project.stack.slice(0, 3).join(" · ")}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>{statusLabel(project)}</dd>
          </div>
        </dl>
        <figure className={`case-visual case-visual--${slug}`}>
          <div>
            <Image
              src={project.visual.src}
              alt={project.visual.alt}
              fill
              priority
              sizes="(max-width: 760px) 100vw, 1100px"
            />
          </div>
          <figcaption>{project.visual.caption}</figcaption>
        </figure>
      </header>
      <div className="shell case-layout">
        <nav className="case-local-nav" aria-label="In this case study">
          <span>In this case</span>
          <a href="#product">Product</a>
          <a href="#problem">Problem</a>
          <a href="#contribution">Contribution</a>
          <a href="#decisions">Decisions</a>
          <a href="#system">System</a>
          <a href="#evidence">Quality &amp; evidence</a>
          <a href="#current">Current state</a>
          <a href="#limits">Limits</a>
        </nav>
        <div className="case-story">
          <section id="product" className="story-section">
            <span className="story-index">01 / Product</span>
            <h2>What the product does</h2>
            <p className="story-lede">{story.product}</p>
          </section>
          <section id="problem" className="story-section">
            <span className="story-index">02 / Problem</span>
            <h2>The problem it addresses</h2>
            <p>{project.problem}</p>
          </section>
          <section id="contribution" className="story-section">
            <span className="story-index">03 / Contribution</span>
            <h2>What was built</h2>
            <p className="story-lede">{story.contribution}</p>
          </section>
          <section id="decisions" className="story-section">
            <span className="story-index">04 / Decisions</span>
            <h2>Decisions that shape the work</h2>
            <div className="case-decisions">
              {project.decisions.slice(0, 3).map((decision, index) => (
                <article key={decision.title}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{decision.title}</h3>
                    <p>{decision.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
          <section id="system" className="story-section">
            <span className="story-index">05 / System</span>
            <h2>How the pieces connect</h2>
            <p className="story-lede">{story.system}</p>
            <ol className="case-boundaries">
              {project.boundaries.map((item, index) => (
                <li key={item.label}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{item.label}</strong>
                  <p>{item.detail}</p>
                </li>
              ))}
            </ol>
          </section>
          <section id="evidence" className="story-section">
            <span className="story-index">06 / Quality &amp; evidence</span>
            <h2>How it was checked</h2>
            <p className="story-lede">{story.validation}</p>
            {secondVisual && (
              <figure className="case-secondary-visual">
                <div>
                  <Image
                    src={secondVisual.src}
                    alt={secondVisual.alt}
                    fill
                    sizes="(max-width: 760px) 100vw, 680px"
                  />
                </div>
                <figcaption>{secondVisual.caption}</figcaption>
              </figure>
            )}
          </section>
          <section id="current" className="story-section">
            <span className="story-index">07 / Current state</span>
            <h2>Where the work stands</h2>
            <div className="case-current">
              <p>{story.current}</p>
            </div>
            {project.live && (
              <a
                className="text-link"
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
              >
                {project.maturity === "prototype"
                  ? "Open hosted preview"
                  : "Visit live product"}
              </a>
            )}
          </section>
          <section id="limits" className="story-section">
            <span className="story-index">08 / Limits</span>
            <h2>What remains unconfirmed</h2>
            <ul className="case-limits">
              {project.limitations.map((limitation) => (
                <li key={limitation}>{publicLimitation(limitation)}</li>
              ))}
            </ul>
          </section>
          <nav className="case-end" aria-label="Case study next steps">
            <Link href="/work">All work</Link>
            <Link href="/contact">Discuss a project</Link>
          </nav>
        </div>
      </div>
    </main>
  );
}
