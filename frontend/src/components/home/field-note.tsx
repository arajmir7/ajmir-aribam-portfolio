import Link from "next/link";
import { writing } from "@/content/writing";
import styles from "./home.module.css";

export function FieldNote() {
  const note = writing[0];
  return (
    <section className={`shell ${styles.note}`} aria-labelledby="note-title">
      <p className="section-label">From my notebook</p>
      <div>
        <p className={styles.noteMeta}>
          {note.topic} · {note.reading}
        </p>
        <h2 id="note-title">{note.title}</h2>
        <p>{note.description}</p>
      </div>
      <Link className="text-link" href={`/notes/${note.slug}`}>
        Read the note <span aria-hidden="true">↗</span>
      </Link>
    </section>
  );
}
