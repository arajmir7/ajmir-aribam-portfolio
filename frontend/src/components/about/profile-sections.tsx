import Image from "next/image";
import Link from "next/link";
import { SocialLinks } from "@/components/layout/social-links";
import styles from "./profile.module.css";

function SectionHeading({
  id,
  label,
  title,
  children,
}: {
  id: string;
  label: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <header className={styles.sectionHeading}>
      <p className="section-label">{label}</p>
      <div>
        <h2 id={id}>{title}</h2>
        {children}
      </div>
    </header>
  );
}

export function ProfileHero() {
  return (
    <header className={styles.hero}>
      <div className={styles.frame}>
        <p className="section-label">Ajmir Aribam</p>
        <div className={styles.heroGrid}>
          <div>
            <p className={styles.role}>Software Engineer</p>
            <h1>
              I build software across the product, from the interface people use
              to the systems that keep it working.
            </h1>
            <p className={styles.heroLede}>
              I build frontend products and backend services, then work through
              the APIs, data, tests, and releases that connect them.
            </p>
          </div>
          <figure className={styles.portrait}>
            <Image
              src="/images/ajmir-portrait.jpg"
              alt="Portrait of Ajmir Aribam"
              width={448}
              height={560}
              preload
              sizes="(max-width: 700px) 144px, 224px"
            />
            <figcaption>Ajmir Aribam · Imphal, India</figcaption>
          </figure>
        </div>
      </div>
    </header>
  );
}

export function EngineeringCapability() {
  return (
    <section className={styles.section} aria-labelledby="capability-title">
      <div className={styles.frame}>
        <SectionHeading
          id="capability-title"
          label="Engineering capability"
          title="The interface is only one part of the system."
        >
          <p>
            I like working across the boundaries where products become
            difficult: state changes, permissions, data ownership, failure
            handling, deployment, and verification.
          </p>
        </SectionHeading>
        <ul className={styles.principles}>
          <li>
            <strong>Product surface</strong>
            <span>
              Interfaces that make the next step clear and offer useful feedback
              when something cannot happen.
            </span>
          </li>
          <li>
            <strong>Application rules &amp; data</strong>
            <span>
              Services, APIs, permissions, and records with important rules kept
              in one accountable place.
            </span>
          </li>
          <li>
            <strong>Quality &amp; delivery</strong>
            <span>
              Tests, review, and release checks that connect a change to the
              behavior people depend on.
            </span>
          </li>
        </ul>
      </div>
    </section>
  );
}

export function PersonalBackground() {
  return (
    <section className={styles.section} aria-labelledby="background-title">
      <div className={styles.frame}>
        <SectionHeading
          id="background-title"
          label="Background"
          title="I learned to care about reliability before I wrote software."
        >
          <p>
            Before software became my main work, I spent years handling banking
            transactions and public digital-service requests. A wrong record,
            unclear status, or failed process had an immediate consequence for
            someone.
          </p>
        </SectionHeading>
        <div className={styles.copyBlock}>
          <p>
            That experience still shapes how I build: I think about a failed
            payment, who can change a record, what a person sees when a service
            is unavailable, and how a team knows a release works.
          </p>
        </div>
      </div>
    </section>
  );
}

export function CurrentFocus() {
  return (
    <section className={styles.section} aria-labelledby="focus-title">
      <div className={styles.frame}>
        <SectionHeading
          id="focus-title"
          label="Current focus"
          title="Current work, from product flow to release."
        >
          <p>
            Today I work across frontend products, backend services, APIs, data,
            AI-assisted workflows, quality engineering, and delivery.
          </p>
        </SectionHeading>
        <div className={styles.focusCopy}>
          <p>
            My current work includes business operations, public publishing,
            document review, accessibility tooling, and early product
            prototypes. I am also continuing my MCA at Sharda University.
          </p>
          <Link className="text-link" href="/work">
            Explore the work
          </Link>
        </div>
      </div>
    </section>
  );
}

export function ProfileClosing() {
  return (
    <section className={styles.closing} aria-labelledby="closing-title">
      <div className={styles.frame}>
        <div>
          <p className="section-label">Working together</p>
          <h2 id="closing-title">I value clear thinking and useful work.</h2>
        </div>
        <div className={styles.closingCopy}>
          <p>
            I enjoy working with people who care about the problem, can make a
            decision when the details are clear, and want to leave the software
            easier to understand than they found it.
          </p>
          <SocialLinks />
        </div>
      </div>
    </section>
  );
}

export function ProfileContact() {
  return (
    <section className={styles.contact} aria-labelledby="profile-contact-title">
      <div className={styles.frame}>
        <p className="section-label">Contact</p>
        <div className={styles.contactRow}>
          <h2 id="profile-contact-title">
            Working through a product or system? Let’s talk.
          </h2>
          <div className={styles.contactActions}>
            <Link className="button button-primary" href="/contact">
              Start a conversation
            </Link>
            <Link className="text-link" href="/resume">
              Read my résumé
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
