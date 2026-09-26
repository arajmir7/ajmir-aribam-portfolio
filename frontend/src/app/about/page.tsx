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
        <h1>
          I learned to care about reliability before I started writing software.
        </h1>
      </header>
      <div className="shell about-story">
        <figure className="about-portrait">
          <Image
            src="/images/ajmir-portrait.jpg"
            alt="Portrait of Ajmir Aribam"
            width={768}
            height={960}
            preload
            sizes="(max-width: 820px) 180px, 230px"
          />
          <figcaption>Ajmir Aribam</figcaption>
        </figure>
        <div className="about-narrative">
          <p className="about-lede">
            Before software became my main work, I spent years handling banking
            transactions and public digital-service requests. When a record was
            wrong, a status was unclear or a process failed, somebody felt the
            consequence immediately.
          </p>
          <p>
            That experience still shapes how I build. I think about what happens
            when a payment fails, who is allowed to change a record, what a
            person should see when something is unavailable, and how a team can
            tell whether a release actually works.
          </p>
          <p>
            Today I work across frontend products, backend services, APIs, data,
            delivery, AI-assisted workflows and quality engineering. The tools
            differ, but each system needs clear boundaries between what a person
            asks it to do and what it can safely promise.
          </p>
          <p>
            I enjoy the practical questions: who can approve a revision, what
            supports a finding, and how a change is checked before release.
          </p>
          <div className="about-next">
            <Link className="button button-primary" href="/work">
              Explore the work
            </Link>
            <Link className="text-link" href="/resume">
              Read my résumé
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
