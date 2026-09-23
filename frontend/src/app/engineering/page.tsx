import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta(
  "Engineering",
  "Backend, AI systems, quality engineering, cloud delivery, and product development through Ajmir Aribam's projects.",
  "/engineering",
);

const capabilities = [
  {
    label: "Backend & application systems",
    text: "I put business rules in services that every caller has to use. Azaeron's invoice lifecycle checks the payment state before it changes an invoice; SHAPES does the same for publishing.",
    refs: [
      ["Azaeron", "/work/azaeron"],
      ["SHAPES India", "/work/shapes-india"],
    ],
  },
  {
    label: "API & data architecture",
    text: "I design routes and records around the work they represent. That includes invoice and payment data in Azaeron, and versioned content records in SHAPES.",
    refs: [
      ["Azaeron", "/work/azaeron"],
      ["SHAPES India", "/work/shapes-india"],
    ],
  },
  {
    label: "Authentication & secure systems",
    text: "The server checks who can act and which records they can reach. Azaeron uses API permissions; The Scent Bar derives tenant and branch access from the signed-in person.",
    refs: [
      ["Azaeron", "/work/azaeron"],
      ["The Scent Bar", "/work/the-scent-bar-retail-os"],
    ],
  },
  {
    label: "Frontend & product engineering",
    text: "A useful interface makes the next action obvious. I have built merchant screens, a six-centre public site, and a visual catalogue with direct inquiry paths.",
    refs: [
      ["Azaeron", "/work/azaeron"],
      ["Friends Aluminium Works", "/work/friends-aluminium-works"],
      ["SHAPES India", "/work/shapes-india"],
    ],
  },
  {
    label: "AI-enabled systems",
    text: "Verity puts document analysis next to the version and recorded material behind it. Its review flow can abstain when evidence or a calibrated model is unavailable. The project is still in development.",
    refs: [
      ["Azaeron Verity", "/work/azaeron-verity"],
      ["Verity's current limits", "/work/azaeron-verity#limits"],
    ],
  },
  {
    label: "Quality engineering",
    text: "I build checks into delivery: unit and API tests for rules, database checks for migrations and tenant scope, browser journeys for the UI, and release gates that stop on failure.",
    refs: [
      ["Verity checks", "/work/azaeron-verity#quality"],
      ["The Scent Bar checks", "/work/the-scent-bar-retail-os#quality"],
      ["Azaeron", "/work/azaeron"],
    ],
  },
  {
    label: "Cloud & delivery",
    text: "I keep build, migration, and deployment steps explicit. Azaeron has a release workflow and separate frontend and API targets; SHAPES includes deployment checks and a migration path.",
    refs: [
      ["Azaeron", "/work/azaeron"],
      ["SHAPES India", "/work/shapes-india"],
    ],
  },
  {
    label: "Reliability & observability",
    text: "A service needs to say when it can take traffic and leave enough context to investigate a failure. The inspected APIs use readiness checks and request identifiers.",
    refs: [
      ["Azaeron", "/work/azaeron"],
      ["SHAPES India", "/work/shapes-india"],
    ],
  },
  {
    label: "Performance & accessibility",
    text: "I check image delivery, responsive layouts, keyboard paths, and accessibility regressions in the interface itself. The portfolio's browser gate covers mobile widths and automated WCAG checks.",
    refs: [
      ["Friends Aluminium Works", "/work/friends-aluminium-works"],
      ["SHAPES India", "/work/shapes-india"],
    ],
  },
  {
    label: "Production operations",
    text: "The job continues after a build passes. I look for a clear startup path, health signals, and recovery instructions, then keep production claims separate from local test results.",
    refs: [
      ["SHAPES India", "/work/shapes-india"],
      ["Azaeron Verity", "/work/azaeron-verity"],
    ],
  },
] as const;

export default function Engineering() {
  return (
    <main id="main" className="shell page engineering-page">
      <div className="page-heading">
        <p className="eyebrow">ENGINEERING / THROUGH THE WORK</p>
        <h1>
          Engineering<span className="period">.</span>
        </h1>
        <p>
          I prefer to show the work itself: the rule that stops an invalid
          invoice state, the permission check that protects a branch, or the
          test that catches a broken release.
        </p>
      </div>
      <div className="capability-grid">
        {capabilities.map((capability, index) => (
          <article key={capability.label}>
            <span className="index">{String(index + 1).padStart(2, "0")}</span>
            <h2>{capability.label}</h2>
            <p>{capability.text}</p>
            <div className="capability-links">
              {capability.refs.map(([label, href]) => (
                <Link href={href} key={href}>
                  {label} <span aria-hidden="true">↗</span>
                </Link>
              ))}
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
