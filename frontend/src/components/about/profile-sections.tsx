import Image from "next/image";
import Link from "next/link";
import styles from "./profile.module.css";

function SectionHeading({
  id,
  number,
  label,
  title,
  children,
}: {
  id: string;
  number: string;
  label: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <header className={styles.sectionHeading}>
      <p className="section-label">
        <span aria-hidden="true">{number} — </span>
        {label}
      </p>
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
        <div className={styles.heroGrid}>
          <figure className={styles.portrait}>
            <Image
              src="/images/ajmir-portrait.jpg"
              alt="Portrait of Ajmir Aribam"
              width={448}
              height={560}
              preload
              sizes="(max-width: 760px) 80vw, (max-width: 1200px) 38vw, 430px"
            />
            <figcaption>Imphal, India</figcaption>
          </figure>
          <div className={styles.introduction}>
            <p className="section-label">Ajmir Aribam</p>
            <p className={styles.role}>Software Engineer</p>
            <h1>
              I build dependable software from the product interface to the
              systems behind it.
            </h1>
            <p className={styles.heroLede}>
              I work across full-stack product engineering, backend services,
              APIs, data, quality and delivery. I care about making software
              clear for the people using it and dependable in the places they
              cannot see.
            </p>
            <nav className={styles.heroActions} aria-label="About page actions">
              <Link href="/work">View my work</Link>
              <Link href="/resume">Résumé</Link>
              <Link href="/contact">Get in touch</Link>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}

export function EngineeringProfile() {
  return (
    <section className={styles.section} aria-labelledby="engineering-title">
      <div className={styles.frame}>
        <SectionHeading
          id="engineering-title"
          number="01"
          label="Engineering profile"
          title="Product thinking with systems depth."
        >
          <p>
            My work sits between the visible product and the engineering
            underneath it. I move between interface decisions, application
            rules, data models, APIs, testing and release paths rather than
            treating them as separate problems.
          </p>
        </SectionHeading>
        <div className={styles.profileColumns}>
          <article>
            <h3>Product engineering</h3>
            <p>
              Interfaces, workflows and interaction states that make the next
              action clear.
            </p>
          </article>
          <article>
            <h3>Systems engineering</h3>
            <p>
              APIs, business rules, permissions, state and data designed around
              explicit boundaries.
            </p>
          </article>
          <article>
            <h3>Quality &amp; delivery</h3>
            <p>
              Tests, accessibility, release checks and operational safeguards
              that verify the product beyond the happy path.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}

export function ProfessionalBackground() {
  return (
    <section className={styles.section} aria-labelledby="background-title">
      <div className={styles.frame}>
        <SectionHeading
          id="background-title"
          number="02"
          label="Background"
          title="Reliability became practical before software became my main work."
        >
          <p>
            Before focusing on software engineering, I worked with banking
            transactions and public digital-service workflows. That experience
            made reliability concrete. Records had to be correct, transactions
            had to be traceable, and an unclear status could create a real
            problem for the person waiting on the other side.
          </p>
          <p>
            It still influences how I engineer software today: make state
            explicit, keep important rules enforceable, communicate failure
            clearly and verify a change before calling it finished.
          </p>
        </SectionHeading>
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
          number="03"
          label="Current focus"
          title="Building across product, systems and delivery."
        >
          <p>
            Today my work spans business software, institutional publishing,
            document intelligence, accessibility engineering, procurement
            workflows and production-oriented web applications. I am
            particularly interested in systems where product experience,
            business rules, data integrity and release quality need to work
            together.
          </p>
          <p className={styles.currentLine}>
            <strong>Currently:</strong> Software engineering · MCA, Sharda
            University
          </p>
        </SectionHeading>
      </div>
    </section>
  );
}

export function HowIWork() {
  return (
    <section className={styles.section} aria-labelledby="approach-title">
      <div className={styles.frame}>
        <SectionHeading
          id="approach-title"
          number="04"
          label="How I work"
          title="Clear decisions. Explicit boundaries. Verified changes."
        />
        <ol className={styles.workingPrinciples}>
          <li>
            <h3>Understand the real task.</h3>
            <p>
              Start with what the person or business needs to accomplish before
              choosing the technical shape.
            </p>
          </li>
          <li>
            <h3>Put responsibility in the right layer.</h3>
            <p>
              Keep important decisions where every caller has to respect them.
            </p>
          </li>
          <li>
            <h3>Verify the behavior.</h3>
            <p>
              Test what changed, the paths around it and the conditions under
              which it can fail.
            </p>
          </li>
        </ol>
      </div>
    </section>
  );
}

export function ProfileClosing() {
  return (
    <section className={styles.closing} aria-labelledby="closing-title">
      <div className={styles.frame}>
        <h2 id="closing-title">
          I like building software where the details matter.
        </h2>
        <p>
          Good products are easier to use, easier to reason about and easier for
          the next engineer to change safely. That is the standard I try to
          bring to the work.
        </p>
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
          <h2 id="profile-contact-title">Have something worth building?</h2>
          <div className={styles.contactActions}>
            <Link href="/contact">
              Start a conversation <span aria-hidden="true">→</span>
            </Link>
            <Link href="/resume">
              View résumé <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
