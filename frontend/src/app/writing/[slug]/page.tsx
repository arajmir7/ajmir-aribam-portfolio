import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { writing } from "@/content/writing";
import { pageMeta } from "@/lib/site";
import { siteUrl } from "@/lib/site";
import { StructuredData } from "@/components/seo/structured-data";

export function generateStaticParams() {
  return writing.map((x) => ({ slug: x.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = writing.find((x) => x.slug === slug);
  return article
    ? {
        ...pageMeta(article.title, article.description, `/writing/${slug}`),
        openGraph: {
          title: article.title,
          description: article.description,
          url: `/writing/${slug}`,
          type: "article",
          publishedTime: article.date,
        },
      }
    : {};
}
export default async function Article({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = writing.find((x) => x.slug === slug);
  if (!article) notFound();
  const structured = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    author: { "@type": "Person", name: "MD Ajmir Aribam" },
    mainEntityOfPage: `${siteUrl}/writing/${slug}`,
  };
  return (
    <main id="main" className="shell article-page">
      <StructuredData value={structured} />
      <Link className="back-link" href="/writing">
        ← All writing
      </Link>
      <div className="article-head">
        <p className="eyebrow">ENGINEERING NOTE / {article.date}</p>
        <h1>
          {article.title}
          <span className="period">.</span>
        </h1>
        <p>{article.description}</p>
      </div>
      <div className="article-body">
        <p className="lead">
          A status field looks simple until another part of the system depends
          on it.
        </p>
        <p>
          In the Azaeron invoice source, moving an invoice to <code>paid</code>{" "}
          is guarded by a payment summary. The lifecycle service rejects a paid
          transition while an outstanding balance exists. It also records a
          journal event and an audit entry after changing state. The
          implementation treats a transition as a business operation, not a
          display update.
        </p>
        <p>
          The SHAPES publishing service makes a similar choice for a different
          domain. Content moves through draft, review, approved, scheduled,
          published and archival states. The service validates each move and
          creates a revision record. Routes call that service so one workflow
          owns the rules.
        </p>
        <h2>Why this boundary matters</h2>
        <p>
          When UI controls are the only guard, another API caller can skip them.
          When multiple routes each implement a slice of the same rules, they
          drift. A domain service gives the operation one explicit place to
          reject invalid state, record context, and keep related effects
          together.
        </p>
        <p>
          That does not make every transition perfectly atomic by itself.
          Transaction boundaries, side effects, and retries still need review
          against the real datastore and deployment. The source shows a clear
          architectural intention; production outcomes require separate
          evidence.
        </p>
        <div className="article-sources">
          <strong>Read the inspection records</strong>
          <Link href="/work/azaeron">Azaeron case study ↗</Link>
          <Link href="/work/shapes-india">SHAPES case study ↗</Link>
        </div>
      </div>
    </main>
  );
}
