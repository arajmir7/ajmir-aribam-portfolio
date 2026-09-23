import type { Metadata } from "next";
import Link from "next/link";
import { writing } from "@/content/writing";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta(
  "Engineering notes",
  "A small collection of engineering notes on product and system decisions.",
  "/notes",
);
export default function Writing() {
  return (
    <main id="main" className="shell page">
      <div className="page-heading">
        <p className="eyebrow">ENGINEERING / NOTES</p>
        <h1>
          Engineering notes<span className="period">.</span>
        </h1>
        <p>A short note on a decision that came up in two projects.</p>
      </div>
      <div className="writing-list">
        {writing.map((x) => (
          <article key={x.slug}>
            <span>
              {x.date} / {x.reading}
            </span>
            <h2>
              <Link href={`/notes/${x.slug}`}>{x.title} ↗</Link>
            </h2>
            <p>{x.description}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
