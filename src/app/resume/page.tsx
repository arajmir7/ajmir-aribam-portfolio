import type { Metadata } from "next";
import Link from "next/link";
import { PrintButton } from "@/components/print-button";
import { email, githubUrl, linkedinUrl, pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta(
  "Resume",
  "Resume of MD Ajmir Aribam, Software Engineer — Backend, Cloud & DevOps.",
  "/resume",
);
export default function Resume() {
  return (
    <main id="main" className="shell page resume-page">
      <div className="resume-top">
        <div>
          <p className="eyebrow">RESUME / CURRENT SUMMARY</p>
          <h1>
            MD AJMIR
            <br />
            ARIBAM<span className="period">.</span>
          </h1>
          <p>Software Engineer — Backend, Cloud &amp; DevOps</p>
        </div>
        <PrintButton />
      </div>
      <div className="resume-contact">
        <a href={`mailto:${email}`}>{email}</a>
        <a href={githubUrl} target="_blank" rel="noopener noreferrer">
          GitHub ↗
        </a>
        <a href={linkedinUrl} target="_blank" rel="noopener noreferrer">
          LinkedIn ↗
        </a>
      </div>
      <div className="resume-section">
        <h2>Profile</h2>
        <p>
          Software engineer working across backend services, full-stack
          products, cloud delivery, security controls, and production
          operations. Project evidence includes billing workflows, institutional
          publishing, and client-facing web delivery.
        </p>
      </div>
      <div className="resume-section">
        <h2>Selected work</h2>
        <div className="resume-items">
          <article>
            <span>2026</span>
            <div>
              <h3>
                <Link href="/work/azaeron">Azaeron ↗</Link>
              </h3>
              <p>
                Invoice and business operations platform. React/TypeScript
                interface, Express API, MongoDB persistence, invoice lifecycle
                checks, access permissions and release configuration.
              </p>
            </div>
          </article>
          <article>
            <span>2026</span>
            <div>
              <h3>
                <Link href="/work/shapes-india">SHAPES India ↗</Link>
              </h3>
              <p>
                Institutional Flask platform with SQLAlchemy content models,
                publishing lifecycle, administrative permissions and operational
                checks.
              </p>
            </div>
          </article>
          <article>
            <span>2026</span>
            <div>
              <h3>
                <Link href="/work/friends-aluminium-works">
                  Friends Aluminium Works ↗
                </Link>
              </h3>
              <p>
                React/TypeScript commercial site for product discovery, project
                browsing, search metadata and email/WhatsApp inquiry handoff.
              </p>
            </div>
          </article>
        </div>
      </div>
      <div className="resume-section resume-columns">
        <div>
          <h2>Technical areas</h2>
          <p>
            Backend systems, API design, data models,
            authentication/authorization, frontend architecture, cloud delivery,
            CI/CD, testing, security and operational readiness.
          </p>
        </div>
        <div>
          <h2>Education</h2>
          <p>
            Master of Computer Applications, Sharda University, Greater Noida ·
            2025–2027 <small>(per supplied resume)</small>
          </p>
          <p>
            B.Com, Manipur University · 2021–2024{" "}
            <small>(per supplied resume)</small>
          </p>
        </div>
      </div>
      <p className="resume-note">
        This resume intentionally omits unverified business and performance
        metrics. Source paths and revision references are in each case study.
      </p>
    </main>
  );
}
