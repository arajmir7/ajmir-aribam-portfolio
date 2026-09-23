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
    principle: "Make business rules explicit at the write boundary.",
    detail: "Domain transitions, route boundaries, and durable records",
    refs: [
      ["Azaeron invoice lifecycle", "/work/azaeron"],
      ["SHAPES publishing", "/work/shapes-india"],
    ],
  },
  {
    label: "API design",
    principle: "Keep public contracts smaller than internal implementation.",
    detail: "Express merchant routes and Flask administrative/public routes",
    refs: [
      ["Azaeron", "/work/azaeron"],
      ["SHAPES", "/work/shapes-india"],
    ],
  },
  {
    label: "Data architecture",
    principle: "Model the record and its history together.",
    detail: "Mongoose business records; SQLAlchemy content and revisions",
    refs: [
      ["Azaeron", "/work/azaeron"],
      ["SHAPES", "/work/shapes-india"],
    ],
  },
  {
    label: "Authentication & authorization",
    principle: "Enforce access where data changes hands.",
    detail: "Server-side role permissions and object-level editorial policies",
    refs: [
      ["Azaeron", "/work/azaeron"],
      ["SHAPES", "/work/shapes-india"],
    ],
  },
  {
    label: "Frontend systems",
    principle: "Design the user path around real tasks.",
    detail: "React merchant workflow and responsive commercial discovery",
    refs: [
      ["Azaeron", "/work/azaeron"],
      ["Friends Aluminium Works", "/work/friends-aluminium-works"],
    ],
  },
  {
    label: "Cloud delivery & CI/CD",
    principle: "Make release and recovery steps repeatable.",
    detail:
      "Release gates, platform configuration, migration and readiness paths",
    refs: [
      ["Azaeron", "/work/azaeron"],
      ["SHAPES", "/work/shapes-india"],
    ],
  },
  {
    label: "Security",
    principle: "Validate inputs and narrow privileged actions.",
    detail:
      "Validation, permission checks, rate limits, CSRF and safe publishing boundaries",
    refs: [
      ["Azaeron", "/work/azaeron"],
      ["SHAPES", "/work/shapes-india"],
    ],
  },
  {
    label: "Reliability & observability",
    principle: "Make failures visible before they become mysteries.",
    detail: "Readiness, request context, operational checks and recovery paths",
    refs: [
      ["Azaeron", "/work/azaeron"],
      ["SHAPES", "/work/shapes-india"],
    ],
  },
  {
    label: "Testing & performance",
    principle: "Test the paths people use and keep delivery lean.",
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
          I work across the path from product requirements to the systems that
          keep a release useful. Each capability points to a project where it
          shaped a concrete decision.
        </p>
      </div>
      <div className="capability-list">
        {capabilities.map((c, i) => (
          <article key={c.label}>
            <span className="index">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <h2>{c.label}</h2>
              <p className="capability-principle">{c.principle}</p>
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
          CI/CD → deployment → production operations. The same discipline
          applies whether the work is a billing rule or a responsive product
          page.
        </p>
      </div>
    </main>
  );
}
