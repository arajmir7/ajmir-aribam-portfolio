import type { Metadata } from "next";
import Link from "next/link";
import { PrintButton } from "@/features/resume/print-button";
import { email, githubUrl, linkedinUrl, pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta(
  "Resume",
  "Resume of Ajmir Aribam, Software Engineer — Backend, Cloud, DevOps, AI Systems, and Quality Engineering.",
  "/resume",
);
export default function Resume() {
  return (
    <main id="main" className="shell page resume-page">
      <div className="resume-top">
        <div>
          <p className="eyebrow">RESUME / SOFTWARE ENGINEERING</p>
          <h1>
            AJMIR
            <br />
            ARIBAM<span className="period">.</span>
          </h1>
          <p>Software Engineer</p>
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
          Software engineer working across backend services, cloud delivery,
          AI-enabled document review, and quality engineering. Projects include
          business billing, institutional publishing, and client-facing web
          work.
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
                <Link href="/work/azaeron-verity">Azaeron Verity ↗</Link>
              </h3>
              <p>
                In-development document review workspace with versioned
                findings, linked sources, explicit uncertainty, and local unit,
                database, and browser checks.
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
      <div className="resume-section resume-section--operations">
        <h2>Operations experience</h2>
        <div className="resume-items">
          <article>
            <span>2021–25</span>
            <div>
              <h3>Banking Correspondent · Axis Bank</h3>
              <p>
                Handled customer banking transactions and digital service
                workflows, with a focus on dependable records and clear
                communication.
              </p>
            </div>
          </article>
          <article>
            <span>2020–25</span>
            <div>
              <h3>Village Level Entrepreneur · Common Service Centre</h3>
              <p>
                Supported access to government digital services and managed
                end-to-end service requests for local residents.
              </p>
            </div>
          </article>
        </div>
      </div>
      <div className="resume-section resume-columns">
        <div>
          <h2>Technical areas</h2>
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
                Playwright · API and database testing · accessibility checks ·
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
      </div>
    </main>
  );
}
