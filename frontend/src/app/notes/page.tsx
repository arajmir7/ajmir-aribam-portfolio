import type { Metadata } from "next";
import Link from "next/link";
import { writing } from "@/content/writing";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta(
  "Engineering Notes",
  "Notes on the decisions behind the software projects of Ajmir Aribam.",
  "/notes",
);

export default function Writing() {
  return (
    <main id="main" className="notes-page shell">
      <header className="notes-heading">
        <p className="kicker">Notes</p>
        <h1>Notes from the work.</h1>
        <p>
          Short notes on decisions behind the work, starting with why status
          changes belong on the server.
        </p>
      </header>
      <div className="notes-index">
        <div className="notes-index-label">Latest note</div>
        {writing.map((note) => (
          <article className="note-feature" key={note.slug}>
            <div className="note-feature-meta">
              <span>{note.topic}</span>
              <span>
                {note.date} · {note.reading}
              </span>
            </div>
            <h2>
              <Link href={`/notes/${note.slug}`}>{note.title}</Link>
            </h2>
            <p>{note.description}</p>
            <div className="note-feature-bottom">
              <span>Related: {note.relatedSystems.join(" · ")}</span>
              <Link href={`/notes/${note.slug}`}>Read note</Link>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
