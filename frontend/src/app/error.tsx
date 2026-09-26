"use client";
import Link from "next/link";
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main id="main" className="shell state-page" role="alert">
      <p className="eyebrow">ERROR / REQUEST COULD NOT COMPLETE</p>
      <h1>
        Something interrupted this page<span className="period">.</span>
      </h1>
      <p>Try again, or get in touch if the problem continues.</p>
      <div className="state-actions">
        <button className="button button-primary" type="button" onClick={reset}>
          Try again
        </button>
        <Link className="button button-outline" href="/contact">
          Contact
        </Link>
      </div>
    </main>
  );
}
