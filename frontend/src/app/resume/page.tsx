import type { Metadata } from "next";
import Link from "next/link";
import { PrintButton } from "@/features/resume/print-button";
import { email, githubUrl, linkedinUrl, pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta(
  "Résumé",
  "Résumé of Ajmir Aribam, Software Engineer, with project, professional experience and technical capabilities.",
  "/resume",
);

export default function Resume() {
  return (
    <main id="main" className="shell resume-page">
      <header className="resume-top">
        <div>
          <p className="kicker">Résumé</p>
          <h1>Ajmir Aribam</h1>
          <p>Software Engineer</p>
        </div>
        <PrintButton />
      </header>
      <div className="resume-contact">
        <a href={`mailto:${email}`}>{email}</a>
        <a href={githubUrl} target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        <a href={linkedinUrl} target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
      </div>
      <section className="resume-section">
        <h2>Profile</h2>
        <p>
          Software engineer working across backend services, full-stack
          products, cloud delivery, AI-enabled document workflows and quality
          engineering. Recent projects include business billing, institutional
          publishing, procurement, accessibility engineering and commercial web.
        </p>
      </section>
      <section className="resume-section">
        <h2>Professional experience</h2>
        <div className="resume-items">
          <article>
            <span>2021–2025</span>
            <div>
              <h3>Banking Correspondent · Axis Bank</h3>
              <p>
                Handled customer banking transactions and digital service
                workflows, with attention to dependable records and clear
                communication.
              </p>
            </div>
          </article>
          <article>
            <span>2020–2025</span>
            <div>
              <h3>Village Level Entrepreneur · Common Service Centre</h3>
              <p>
                Supported access to government digital services and managed
                service requests for local residents.
              </p>
            </div>
          </article>
        </div>
      </section>
      <section className="resume-section">
        <h2>Selected software projects</h2>
        <div className="resume-items">
          <article>
            <span>2026</span>
            <div>
              <h3>
                <Link href="/work/azaeron">Azaeron</Link> · Billing system
              </h3>
              <p>
                React and TypeScript interface, Express API, MongoDB
                persistence, invoice lifecycle checks, access permissions and
                release configuration.
              </p>
            </div>
          </article>
          <article>
            <span>2026</span>
            <div>
              <h3>
                <Link href="/work/shapes-india">SHAPES India</Link> ·
                Institutional platform
              </h3>
              <p>
                Flask and SQLAlchemy content models, publishing lifecycle,
                administrative permissions and operational checks.
              </p>
            </div>
          </article>
          <article>
            <span>2026</span>
            <div>
              <h3>
                <Link href="/work/friends-aluminium-works">
                  Friends Aluminium Works
                </Link>{" "}
                · Commercial site
              </h3>
              <p>
                React and TypeScript product and project pages, responsive UI,
                search metadata and email/WhatsApp inquiry handoff.
              </p>
            </div>
          </article>
          <article>
            <span>2026</span>
            <div>
              <h3>
                <Link href="/work/azaeron-verity">Azaeron Verity</Link> · In
                development
              </h3>
              <p>
                Document review workspace with versioned findings, linked
                sources and clear unavailable-analysis states. The project is
                still in development; no production model is running.
              </p>
            </div>
          </article>
        </div>
      </section>
      <section className="resume-section resume-columns">
        <div>
          <h2>Technical capabilities</h2>
          <dl className="resume-skills">
            <div>
              <dt>Languages</dt>
              <dd>Python · JavaScript · TypeScript · SQL</dd>
            </div>
            <div>
              <dt>Backend &amp; data</dt>
              <dd>
                Node.js · Express · Flask · FastAPI · REST APIs · PostgreSQL ·
                MongoDB · Redis
              </dd>
            </div>
            <div>
              <dt>Frontend</dt>
              <dd>React · Next.js · Vite · responsive UI</dd>
            </div>
            <div>
              <dt>AI systems</dt>
              <dd>
                Document review · versioned analysis · evidence linking · human
                review
              </dd>
            </div>
            <div>
              <dt>Quality</dt>
              <dd>
                Playwright · API and database tests · accessibility checks ·
                release verification
              </dd>
            </div>
            <div>
              <dt>Delivery</dt>
              <dd>Docker · GitHub Actions · CI/CD · deployment checks</dd>
            </div>
          </dl>
        </div>
        <div>
          <h2>Education</h2>
          <p>MCA · Sharda University, Greater Noida · 2025–2027</p>
          <p>B.Com · Manipur University · 2021–2024</p>
          <p>B.Sc. Botany · Manipur University · 2019–2022</p>
          <p>DCA · NIELIT · 2022</p>
        </div>
      </section>
    </main>
  );
}
