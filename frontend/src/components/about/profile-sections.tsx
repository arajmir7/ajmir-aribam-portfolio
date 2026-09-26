import Image from "next/image";
import Link from "next/link";
import { SocialLinks } from "@/components/layout/social-links";
import styles from "./profile.module.css";

const practiceAreas = [
  {
    title: "Product interfaces",
    detail:
      "Clear screens, useful feedback, and interaction paths that respect a person’s time.",
  },
  {
    title: "Backend systems & APIs",
    detail:
      "Services and contracts that put business rules in one place instead of scattering them through the interface.",
  },
  {
    title: "Data & application rules",
    detail:
      "Records, permissions, and state changes designed to stay understandable as a product grows.",
  },
  {
    title: "AI-assisted workflows",
    detail:
      "Assisted work that keeps source material, uncertainty, and human judgment in view.",
  },
  {
    title: "Quality engineering",
    detail:
      "Tests and review paths that check the behavior people actually depend on.",
  },
  {
    title: "Delivery & operations",
    detail:
      "Build, release, and readiness work treated as part of the product rather than an afterthought.",
  },
];

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
        <p className="section-label">About Ajmir Aribam</p>
        <div className={styles.heroGrid}>
          <div>
            <p className={styles.role}>Software Engineer</p>
            <h1>
              I build software across the product, from the interface people use
              to the systems that keep it working.
            </h1>
            <p className={styles.heroLede}>
              I work across frontend products, backend services, APIs, data,
              quality, and delivery. The common thread is practical software:
              clear to use, deliberate in its rules, and ready to be maintained.
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

export function PersonalBackground() {
  return (
    <section className={styles.section} aria-labelledby="background-title">
      <div className={styles.frame}>
        <SectionHeading
          id="background-title"
          label="Personal background"
          title="A practical view of systems."
        >
          <p>
            Before software became my main work, I handled banking transactions
            and public digital-service requests. It taught me that unclear
            information and fragile processes are never abstract problems.
          </p>
        </SectionHeading>
        <div className={styles.copyBlock}>
          <p>
            That experience is useful context, not my headline. It informs how I
            approach software now: understand the real task, make the next step
            legible, and be careful with the rules beneath it.
          </p>
        </div>
      </div>
    </section>
  );
}

export function EngineeringPhilosophy() {
  return (
    <section className={styles.section} aria-labelledby="philosophy-title">
      <div className={styles.frame}>
        <SectionHeading
          id="philosophy-title"
          label="Engineering philosophy"
          title="Build for the next decision."
        >
          <p>
            The work is not complete when a screen looks finished. It is
            complete when the product can handle the next real action with
            clarity.
          </p>
        </SectionHeading>
        <ol className={styles.principles}>
          <li>
            <strong>Begin with the task.</strong>
            <span>
              Understand what a person needs to accomplish before choosing the
              technical shape.
            </span>
          </li>
          <li>
            <strong>Put rules where they hold.</strong>
            <span>
              Keep important decisions in the application boundary every caller
              has to meet.
            </span>
          </li>
          <li>
            <strong>Check the result.</strong>
            <span>
              Use tests, review, and release checks to learn whether a change
              works in practice.
            </span>
          </li>
        </ol>
      </div>
    </section>
  );
}

export function PracticeAreas() {
  return (
    <section className={styles.section} aria-labelledby="practice-title">
      <div className={styles.frame}>
        <SectionHeading
          id="practice-title"
          label="Areas I work across"
          title="One product, connected concerns."
        >
          <p>
            I am most useful where the product surface, application logic, and
            delivery path need to agree with one another.
          </p>
        </SectionHeading>
        <ul className={styles.practiceList}>
          {practiceAreas.map((area, index) => (
            <li key={area.title}>
              <span aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3>{area.title}</h3>
              <p>{area.detail}</p>
            </li>
          ))}
        </ul>
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
          title="Full-stack systems that can carry real work."
        >
          <p>
            I am building product and backend systems where the visible flow and
            the underlying rules need equal attention.
          </p>
        </SectionHeading>
        <div className={styles.focusCopy}>
          <p>
            My current work spans business operations, public publishing,
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
          <h2 id="closing-title">
            Good engineering makes the next step easier.
          </h2>
        </div>
        <div className={styles.closingCopy}>
          <p>
            I enjoy working with people who care about the details: a clear
            product decision, an honest technical boundary, and a release that
            has been properly checked.
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
            Have a product or system worth working through?
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
