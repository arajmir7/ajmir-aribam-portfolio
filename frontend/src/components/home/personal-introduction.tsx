import Image from "next/image";
import Link from "next/link";
import { identity } from "@/content/identity";
import { githubUrl, linkedinUrl } from "@/lib/site";
import styles from "./home.module.css";

export function PersonalIntroduction() {
  return (
    <section
      className={styles.introduction}
      aria-labelledby="identity-title"
      data-section="introduction"
    >
      <div className={`shell ${styles.introFrame}`}>
        <div className={styles.introMeta}>
          <span>From interface to release.</span>
          <span>{identity.location}</span>
        </div>
        <div className={styles.identity}>
          <Image
            className={styles.portrait}
            src="/images/ajmir-portrait.jpg"
            alt="Portrait of Ajmir Aribam"
            width={112}
            height={112}
            preload
            sizes="112px"
          />
          <h1 id="identity-title">{identity.name}</h1>
          <p className={styles.role}>{identity.title}</p>
          <p className={styles.positioning}>{identity.positioning}</p>
          <p className={styles.bio}>{identity.introduction}</p>
          <ul
            className={styles.specialisms}
            aria-label="Engineering specialisms"
          >
            {identity.specialisms.map((specialism) => (
              <li key={specialism}>{specialism}</li>
            ))}
          </ul>
          <div className={styles.actions} aria-label="Connect with Ajmir">
            <Link className="button button-primary" href="/work">
              View my work
            </Link>
            <Link className="button button-outline" href="/about">
              About me
            </Link>
          </div>
          <div className={styles.secondaryActions}>
            <Link href="/resume">Résumé</Link>
            <Link href="/contact">Get in touch</Link>
          </div>
          <div className={styles.professionalLinks}>
            <a href={githubUrl} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <a href={linkedinUrl} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </div>
        </div>
        <a className={styles.scrollCue} href="#engineering-proof">
          <span>A little more about how I think</span>
        </a>
      </div>
    </section>
  );
}
