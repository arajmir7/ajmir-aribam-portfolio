import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta(
  "Engineering",
  "Capability evidence across backend, frontend, cloud delivery, security and operations.",
  "/engineering",
);

const capabilities = [
  {
    label: "Backend systems",
    detail: "Domain transitions, route boundaries, and durable records",
    refs: [
      ["Azaeron invoice lifecycle", "/work/azaeron"],
      ["SHAPES publishing", "/work/shapes-india"],
    ],
  },
  {
    label: "API design",
    detail: "Express merchant routes and Flask administrative/public routes",
    refs: [
      ["Azaeron", "/work/azaeron"],
      ["SHAPES", "/work/shapes-india"],
    ],
  },
  {
    label: "Data architecture",
    detail: "Mongoose business records; SQLAlchemy content and revisions",
    refs: [
      ["Azaeron", "/work/azaeron"],
      ["SHAPES", "/work/shapes-india"],
    ],
  },
  {
    label: "Authentication & authorization",
    detail: "Server-side role permissions and object-level editorial policies",
    refs: [
      ["Azaeron", "/work/azaeron"],
      ["SHAPES", "/work/shapes-india"],
    ],
  },
  {
    label: "Frontend systems",
    detail: "React merchant workflow and responsive commercial discovery",
    refs: [
      ["Azaeron", "/work/azaeron"],
      ["Friends Aluminium Works", "/work/friends-aluminium-works"],
    ],
  },
  {
    label: "Cloud delivery & CI/CD",
    detail:
      "Release gates, platform configuration, migration and readiness paths",
    refs: [
      ["Azaeron", "/work/azaeron"],
      ["SHAPES", "/work/shapes-india"],
    ],
  },
  {
    label: "Security",
    detail:
      "Validation, permission checks, rate limits, CSRF and safe publishing boundaries",
    refs: [
      ["Azaeron", "/work/azaeron"],
      ["SHAPES", "/work/shapes-india"],
    ],
  },
  {
    label: "Reliability & observability",
    detail:
      "Readiness, request context, operational checks and recovery plans in source",
    refs: [
      ["Azaeron", "/work/azaeron"],
      ["SHAPES", "/work/shapes-india"],
    ],
  },
  {
    label: "Testing & performance",
    detail:
      "Repository test/build gates, responsive image delivery and route checks",
    refs: [
      ["Azaeron", "/work/azaeron"],
      ["Friends Aluminium Works", "/work/friends-aluminium-works"],
    ],
  },
] as const;

export default function Engineering() {
  return (
    <main id="main" className="shell page">
      <div className="page-heading">
        <p className="eyebrow">PRACTICE / EVIDENCE MAP</p>
        <h1>
          Engineering<span className="period">.</span>
        </h1>
        <p>
          Capabilities are more useful when they point to decisions and code.
          Follow each thread into a case study and its source inspection record.
        </p>
      </div>
      <div className="capability-list">
        {capabilities.map((c, i) => (
          <article key={c.label}>
            <span className="index">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <h2>{c.label}</h2>
              <p>{c.detail}</p>
            </div>
            <div className="capability-links">
              {c.refs.map(([label, href]) => (
                <Link href={href} key={href}>
                  {label} ↗
                </Link>
              ))}
            </div>
          </article>
        ))}
      </div>
      <div className="inline-note">
        <strong>Working approach</strong>
        <p>
          Requirements → architecture → implementation → testing → security →
          CI/CD → deployment → production operations. The published cases
          identify which parts are directly observable and which need
          confirmation.
        </p>
      </div>
    </main>
  );
}
