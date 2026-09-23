"use client";
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main id="main" className="shell state-page" role="alert">
      <p className="eyebrow">ERROR / REQUEST COULD NOT COMPLETE</p>
      <h1>
        Something interrupted this page<span className="period">.</span>
      </h1>
      <p>Please try again. If the issue continues, use the contact route.</p>
      <button className="button button-primary" type="button" onClick={reset}>
        Try again ↗
      </button>
    </main>
  );
}
