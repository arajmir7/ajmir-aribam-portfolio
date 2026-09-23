import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main" className="shell state-page">
      <p className="eyebrow">404 / PAGE NOT FOUND</p>
      <h1>
        This page isn’t here<span className="period">.</span>
      </h1>
      <p>
        The page may have moved. The work index is a reliable place to resume.
      </p>
      <Link className="button button-primary" href="/work">
        Explore work ↗
      </Link>
    </main>
  );
}
