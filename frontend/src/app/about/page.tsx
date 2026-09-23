import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta(
  "About",
  "About MD Ajmir Aribam, software engineer working across backend, cloud delivery and full-stack systems.",
  "/about",
);
export default function About() {
  return (
    <main id="main" className="shell page about-page">
      <div className="page-heading">
        <p className="eyebrow">ABOUT / THE ENGINEER</p>
        <h1>
          Built with intent<span className="period">.</span>
        </h1>
      </div>
      <div className="about-grid">
        <div className="portrait-frame">
          <Image
            src="/images/ajmir-portrait.jpg"
            alt="Portrait of MD Ajmir Aribam"
            width={960}
            height={1200}
            priority
            sizes="(max-width: 760px) 100vw, 42vw"
          />
          <span>MD AJMIR ARIBAM / 2026</span>
        </div>
        <div className="about-copy">
          <p className="lead">
            I work where product requirements meet system boundaries.
          </p>
          <p>
            I’m MD Ajmir Aribam, a software engineer focused on backend systems,
            full-stack delivery, cloud deployment, and the operational work that
            keeps software useful after launch.
          </p>
          <p>
            The projects here range from billing workflows and controlled
            institutional publishing to a commercial site designed around clear
            discovery and inquiry. Each has a different level of complexity;
            each deserves an honest account of what the implementation proves.
          </p>
          <div className="about-facts">
            <div>
              <span>FOCUS</span>
              <strong>Backend · Cloud · DevOps</strong>
            </div>
            <div>
              <span>EDUCATION</span>
              <strong>
                MCA, Sharda University{" "}
                <small>(2025–2027, per supplied resume)</small>
              </strong>
            </div>
            <div>
              <span>METHOD</span>
              <strong>Architecture through operations</strong>
            </div>
          </div>
          <p>
            My MCA studies sit alongside practical work in production-oriented
            repositories. I prefer explicit interfaces, traceable decisions, and
            claims that can survive source inspection.
          </p>
          <div className="about-links">
            <Link className="button button-primary" href="/work">
              Inspect selected work ↗
            </Link>
            <Link className="text-link" href="/resume">
              Read resume ↗
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
