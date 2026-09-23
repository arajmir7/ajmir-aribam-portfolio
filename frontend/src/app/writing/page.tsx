import type { Metadata } from "next";
import Link from "next/link";
import { writing } from "@/content/writing";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta(
  "Writing",
  "Engineering notes grounded in inspected implementation decisions.",
  "/writing",
);
export default function Writing() {
  return (
    <main id="main" className="shell page">
      <div className="page-heading">
        <p className="eyebrow">FIELD NOTES / ENGINEERING</p>
        <h1>
          Writing<span className="period">.</span>
        </h1>
        <p>Short notes on the decisions behind reliable product work.</p>
      </div>
      <div className="writing-list">
        {writing.map((x) => (
          <article key={x.slug}>
            <span>
              {x.date} / {x.reading}
            </span>
            <h2>
              <Link href={`/writing/${x.slug}`}>{x.title} ↗</Link>
            </h2>
            <p>{x.description}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
