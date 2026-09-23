import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects, projectBySlug } from "@/content/projects";
import { SystemDiagram } from "@/components/system-diagram";
import { StructuredData } from "@/components/structured-data";
import { pageMeta } from "@/lib/site";
import { siteUrl } from "@/lib/site";

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = projectBySlug(slug);
  return p ? pageMeta(`${p.name} case study`, p.summary, `/work/${slug}`) : {};
}

export default async function CaseStudy({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = projectBySlug(slug);
  if (!p) notFound();
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
        name: p.name,
        item: `${siteUrl}/work/${p.slug}`,
      },
    ],
  };
  return (
    <main id="main">
      <StructuredData value={breadcrumbs} />
      <div className="case-hero">
        <div className="shell">
          <Link className="back-link" href="/work">
            ← Back to work
          </Link>
          <div className="case-hero-grid">
            <div>
              <p className="eyebrow">
                CASE STUDY / {p.number} — {p.type}
              </p>
              <h1>
                {p.name}
                <span className="period">.</span>
              </h1>
              <p className="case-lede">{p.lede}</p>
            </div>
            <div className="case-hero-side">
              <span>YEAR / {p.year}</span>
              <p>{p.summary}</p>
              <div className="case-actions">
                <a href={p.live} target="_blank" rel="noopener noreferrer">
                  Visit product ↗
                </a>
                <a href="#decisions">Inspect evidence notes ↓</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="shell case-body">
        <aside className="case-sidebar">
          <span className="eyebrow">IN THIS RECORD</span>
          <a href="#context">01 Context</a>
          <a href="#architecture">02 Architecture</a>
          <a href="#decisions">03 Decisions</a>
          <a href="#delivery">04 Delivery</a>
          <a href="#reflection">05 Reflection</a>
        </aside>
        <div className="case-main">
          <section id="context" className="case-section">
            <p className="eyebrow">01 / CONTEXT</p>
            <h2>The problem behind the interface.</h2>
            <div className="two-col-copy">
              <div>
                <h3>Context</h3>
                <p>{p.context}</p>
                <h3>Problem</h3>
                <p>{p.problem}</p>
              </div>
              <div>
                <h3>Ownership</h3>
                <p>{p.ownership}</p>
                <h3>Constraints</h3>
                <ul>
                  {p.constraints.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
          <section id="architecture" className="case-section">
            <p className="eyebrow">02 / SYSTEM DESIGN</p>
            <h2>Boundaries before buzzwords.</h2>
            <SystemDiagram project={p} />
            <div className="stack-line">
              <span>INSPECTED STACK</span>
              <p>{p.stack.join(" / ")}</p>
            </div>
          </section>
          <section id="decisions" className="case-section">
            <p className="eyebrow">03 / ENGINEERING DECISIONS</p>
            <h2>What the source actually shows.</h2>
            <div className="decision-list">
              {p.decisions.map((d, i) => (
                <article key={d.title}>
                  <span className="index">0{i + 1}</span>
                  <div>
                    <h3>{d.title}</h3>
                    <p>{d.body}</p>
                    <span className="source-reference">
                      Inspected source: {d.evidence} · revision{" "}
                      {p.revision.slice(0, 7)}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </section>
          <section id="delivery" className="case-section">
            <p className="eyebrow">04 / DELIVERY &amp; OPERATIONS</p>
            <h2>Beyond a successful build.</h2>
            <div className="two-col-copy">
              <div>
                <h3>CI/CD &amp; deployment</h3>
                <p>{p.delivery}</p>
              </div>
              <div>
                <h3>Operational boundary</h3>
                <p>{p.operations}</p>
              </div>
            </div>
          </section>
          <section id="reflection" className="case-section">
            <p className="eyebrow">05 / REFLECTION</p>
            <h2>Outcome &amp; lessons.</h2>
            <div className="two-col-copy">
              <div>
                <h3>Observed outcome</h3>
                <p>{p.outcome}</p>
              </div>
              <div>
                <h3>Lesson</h3>
                <p>{p.lessons}</p>
              </div>
            </div>
            <div className="verification-note">
              <strong>Verification boundary</strong>
              <p>
                Source inspection supports the implementation details above.
                Deployment configuration and business results require
                independent confirmation before stronger claims are made.
              </p>
            </div>
          </section>
          <div className="case-end">
            <Link href="/work">← All work</Link>
            <Link href="/contact">Discuss a system ↗</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
