import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SocialLinks } from "@/components/layout/social-links";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta(
  "About",
  "About Ajmir Aribam, a software engineer working across backend, cloud, AI systems, and quality engineering.",
  "/about",
);
export default function About() {
  return (
    <main id="main" className="shell page about-page">
      <div className="page-heading">
        <p className="eyebrow">ABOUT / AJMIR ARIBAM</p>
        <h1>
          The person behind the work<span className="period">.</span>
        </h1>
      </div>
      <div className="about-grid">
        <div className="portrait-frame">
          <Image
            src="/images/ajmir-portrait.jpg"
            alt="Portrait of Ajmir Aribam"
            width={960}
            height={1200}
            priority
            sizes="(max-width: 760px) 100vw, 42vw"
          />
          <span>AJMIR ARIBAM / 2026</span>
        </div>
        <div className="about-copy">
          <p className="lead">
            I’m Ajmir. I build software that people can rely on.
          </p>
          <p>
            Before working deeply in software, I handled banking transactions
            and helped people use public digital services. Records, access, and
            a clear next step mattered to the person standing in front of me.
            They still matter in the products I build.
          </p>
          <p>
            Today I work across backend services, APIs, cloud delivery, and
            frontend products. I’m also building document review software that
            treats AI output as something a person needs to inspect, and I make
            testing and release checks part of the work from the start.
          </p>
          <div className="about-facts">
            <div>
              <span>FOCUS</span>
              <strong>Backend · Cloud · DevOps · AI · Quality</strong>
            </div>
            <div>
              <span>EDUCATION</span>
              <strong>
                MCA, Sharda University <small>(2025–2027)</small>
              </strong>
            </div>
            <div>
              <span>WORK</span>
              <strong>Billing · Publishing · Document review</strong>
            </div>
          </div>
          <p>
            I like the practical questions: What should happen when a payment
            fails? Can an editor undo a bad change? Will the page still work on
            a small screen? Those answers shape the code as much as the first
            feature does.
          </p>
          <div className="about-links">
            <Link className="button button-primary" href="/work">
              View selected work ↗
            </Link>
            <Link className="text-link" href="/resume">
              Read resume ↗
            </Link>
          </div>
          <nav className="about-social" aria-label="Connect with Ajmir">
            <span>ELSEWHERE</span>
            <SocialLinks />
          </nav>
        </div>
      </div>
    </main>
  );
}
