import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SocialLinks } from "@/components/layout/social-links";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta(
  "About",
  "About Ajmir Aribam, a software engineer working across product interfaces, backend systems and quality engineering.",
  "/about",
);

export default function About() {
  return (
    <main id="main" className="about-page">
      <header className="shell about-heading">
        <p className="kicker">About Ajmir</p>
        <h1>I cared about records before I wrote software.</h1>
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
            Before software became my main work, I handled banking transactions
            and helped people use public digital services. A missing record or
            an unclear next step had an immediate effect on the person in front
            of me. That experience still shapes the questions I ask when I
            build.
          </p>
          <p>
            My recent projects include billing workflows, an institutional
            publishing platform, a commercial product site and a document review
            system in development. They call for different tools, but each needs
            clear boundaries between what a person asks the system to do and
            what the system can safely promise.
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
          <span>Learning</span>
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
