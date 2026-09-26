import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SocialLinks } from "@/components/layout/social-links";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta(
  "About",
  "About Ajmir Aribam, a software engineer building products across interfaces, backend systems, delivery and quality engineering.",
  "/about",
);

export default function About() {
  return (
    <main id="main" className="about-page">
      <header className="shell about-heading">
        <p className="kicker">About Ajmir</p>
        <h1>Reliability mattered before I wrote software.</h1>
      </header>
      <div className="shell about-story">
        <figure className="about-portrait">
          <Image
            src="/images/ajmir-portrait.jpg"
            alt="Portrait of Ajmir Aribam"
            width={768}
            height={960}
            priority
            sizes="(max-width: 760px) 100vw, 38vw"
          />
          <figcaption>Ajmir Aribam</figcaption>
        </figure>
        <div className="about-narrative">
          <p className="about-lede">
            I’m a software engineer who works across the product: the screen
            people see, the rules behind it, and the checks before it ships.
          </p>
          <p>
            Before I focused on software, I handled banking and public
            digital-service workflows. A wrong record, unclear status, or broken
            process affected a real person immediately. That experience still
            shapes the questions I ask when I build.
          </p>
          <p>
            My current work spans billing, procurement, institutional
            publishing, commercial web, accessibility engineering and document
            review. The tools differ, but each system needs a clear boundary
            between what a person asks it to do and what it can safely promise.
          </p>
          <p>
            I enjoy the practical questions: what happens when a payment fails,
            who can approve a revision, what evidence supports a finding, and
            how a change is tested before release.
          </p>
          <div className="about-next">
            <Link className="button button-primary" href="/work">
              Explore the work <span aria-hidden="true">↗</span>
            </Link>
            <Link className="text-link" href="/resume">
              Read my résumé <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </div>
      <section
        className="shell about-details"
        aria-label="Background and current focus"
      >
        <div>
          <span>Previously</span>
          <p>Banking correspondent and public digital-service work.</p>
        </div>
        <div>
          <span>Now</span>
          <p>Backend, product engineering, cloud delivery and quality.</p>
        </div>
        <div>
          <span>Education</span>
          <p>MCA at Sharda University, 2025–2027.</p>
        </div>
      </section>
      <section className="shell about-connect">
        <div>
          <p className="kicker">Elsewhere</p>
          <h2>Follow the work, or say hello.</h2>
        </div>
        <SocialLinks />
      </section>
    </main>
  );
}
