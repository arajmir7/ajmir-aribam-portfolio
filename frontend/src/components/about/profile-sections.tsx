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
        <div className={styles.heroGrid}>
          <figure className={styles.portrait}>
            <Image
              src="/images/ajmir-portrait.jpg"
              alt="Portrait of Ajmir Aribam"
              width={448}
              height={560}
              preload
              sizes="(max-width: 700px) 144px, (max-width: 1200px) 32vw, 384px"
            />
            <figcaption>Ajmir Aribam · Imphal, India</figcaption>
          </figure>
          <div className={styles.introduction}>
            <p className="section-label">Ajmir Aribam</p>
            <p className={styles.role}>Software Engineer</p>
            <h1>
              I build software end to end—from the interface people use to the
              systems that keep it reliable.
            </h1>
            <p className={styles.heroLede}>
              I work across frontend products, backend services, APIs, data,
              quality and delivery. I care about making the visible experience
              clear while keeping the rules, records and release path dependable
              behind it.
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

const capabilities = [
  {
    title: "Product & frontend",
    detail: "I shape task flows, interface states, and useful feedback.",
  },
  {
    title: "Backend & APIs",
    detail: "I define service behavior and enforce rules at the API.",
  },
  {
    title: "Data & state",
    detail: "I model records and state changes so updates stay traceable.",
  },
  {
    title: "AI-assisted systems",
    detail: "I keep source material and human review visible in AI workflows.",
  },
  {
    title: "Quality",
    detail: "I test the behavior people and connected systems rely on.",
  },
  {
    title: "Delivery",
    detail: "I check builds and release paths before changes ship.",
  },
];

export function WhatIBuild() {
  return (
    <section className={styles.section} aria-labelledby="build-title">
      <div className={styles.frame}>
        <SectionHeading
          id="build-title"
          label="What I build"
          title="Product work, from interface to release."
        />
        <ul className={styles.capabilities}>
          {capabilities.map((capability) => (
            <li key={capability.title}>
              <h3>{capability.title}</h3>
              <p>{capability.detail}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function HowIWork() {
  return (
    <section className={styles.approach} aria-labelledby="approach-title">
      <div className={styles.frame}>
        <p className={`section-label ${styles.approachLabel}`}>How I work</p>
        <div className={styles.approachCopy}>
          <h2 id="approach-title">I follow the work through to release.</h2>
          <p>
            I start with the decision a feature needs to support. Then I map its
            rules, permissions, and failure states, and test the paths people
            depend on before release.
          </p>
        </div>
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
          title="I saw the cost of unclear processes firsthand."
        >
          <p>
            Before software became my main work, I handled banking transactions
            and public digital-service requests. A confusing status or incorrect
            record had a direct effect on the person waiting for help. I carry
            that perspective into the products I build today.
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
          label="Current focus"
          title="What I’m working on now."
        >
          <p>
            My current work spans business operations, public publishing,
            document review, and accessibility. Alongside it, I’m completing my
            MCA at Sharda University.
          </p>
          <Link className={`text-link ${styles.focusLink}`} href="/work">
            Explore the work
          </Link>
        </SectionHeading>
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
            Have something worth building? Let’s talk.
          </h2>
          <div className={styles.contactActions}>
            <Link className="button button-primary" href="/contact">
              Start a conversation
            </Link>
            <Link className="text-link" href="/resume">
              View résumé
            </Link>
          </div>
        </div>
        <div className={styles.contactSocials}>
          <SocialLinks />
        </div>
      </div>
    </section>
  );
}
