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
    <section className={styles.section} aria-labelledby="approach-title">
      <div className={styles.frame}>
        <SectionHeading
          id="approach-title"
          label="How I work"
          title="Follow the task through the system."
        >
          <p>
            I trace a feature from the user’s task through its rules and failure
            paths, then test the behaviors that matter before release.
          </p>
        </SectionHeading>
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
          title="Experience with real-world services."
        >
          <p>
            Before software became my main work, I handled banking transactions
            and public-service requests. Seeing how unclear records and failed
            processes affect people shaped the care I bring to systems today.
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
          title="Products and systems in progress."
        >
          <p>
            I’m working on business operations, public publishing, document
            review, accessibility tooling, and early product prototypes.
            Alongside that work, I’m completing my MCA at Sharda University.
          </p>
        </SectionHeading>
        <div className={styles.focusCopy}>
          <Link className="text-link" href="/work">
            Explore the work
          </Link>
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
