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
              APIs and data. I pay attention to how an interface explains its
              state and how the rules behave when something goes wrong.
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
            I work between the product and its implementation: shaping
            interfaces, application rules, data models and APIs, then testing
            how they behave.
          </p>
        </SectionHeading>
        <div className={styles.profileColumns}>
          <article>
            <h3>Product engineering</h3>
            <p>Interfaces and workflows that make the next action clear.</p>
          </article>
          <article>
            <h3>Systems engineering</h3>
            <p>
              APIs, permissions and state with clear responsibility for each
              rule.
            </p>
          </article>
          <article>
            <h3>Quality &amp; delivery</h3>
            <p>
              Tests, accessibility checks and safeguards for likely failure
              paths.
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
            transactions and public digital-service workflows. Records needed to
            be correct, transactions traceable and status clear to the person
            waiting.
          </p>
          <p>
            I still apply that experience by making state explicit, explaining
            failure clearly and checking changes before they reach people.
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
            document intelligence, accessibility engineering, procurement and
            web applications. I’m interested in how product decisions shape the
            information people rely on.
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
            <p>Start with what a person or business needs to do.</p>
          </li>
          <li>
            <h3>Put responsibility in the right layer.</h3>
            <p>Keep rules where every request has to follow them.</p>
          </li>
          <li>
            <h3>Verify the behavior.</h3>
            <p>Test the change, surrounding paths and likely failure cases.</p>
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
        <p className="section-label">What I care about</p>
        <div className={styles.closingCopy}>
          <h2 id="closing-title">
            Software that is clear to use and straightforward to trust.
          </h2>
          <p>
            I care about the details that make that possible: understandable
            interfaces, explicit rules, reliable records, useful failure states
            and changes that can be verified before they reach people.
          </p>
        </div>
      </div>
    </section>
  );
}

export function ProfileContact() {
  return (
    <section className={styles.contact} aria-labelledby="profile-contact-title">
      <div className={styles.frame}>
        <div className={styles.contactRow}>
          <p className="section-label">Contact</p>
          <div className={styles.contactCopy}>
            <h2 id="profile-contact-title">Have something worth building?</h2>
            <p>
              I’m always interested in thoughtful product and engineering
              conversations.
            </p>
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
      </div>
    </section>
  );
}
