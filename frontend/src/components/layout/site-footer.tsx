import Image from "next/image";
import Link from "next/link";
import { email } from "@/lib/site";
import { SocialLinks } from "./social-links";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-main">
        <div>
          <Link
            className="footer-identity"
            href="/"
            aria-label="Ajmir Aribam, home"
          >
            <Image
              className="footer-mark brand-light"
              src="/brand/mark.svg"
              alt=""
              width={410}
              height={300}
            />
            <Image
              className="footer-mark brand-dark"
              src="/brand/mark-dark.svg"
              alt=""
              width={410}
              height={300}
            />
            <div>
              <strong>Ajmir Aribam</strong>
              <span>Software Engineer · Imphal, India</span>
            </div>
          </Link>
          <a className="footer-email" href={`mailto:${email}`}>
            {email}
          </a>
        </div>
        <nav aria-label="Footer navigation" className="footer-nav">
          <div>
            <span className="section-label">Explore</span>
            <Link href="/work">Work</Link>
            <Link href="/engineering">Engineering</Link>
            <Link href="/about">About</Link>
            <Link href="/resume">Résumé</Link>
          </div>
          <div>
            <span className="section-label">More</span>
            <Link href="/notes">Notes</Link>
            <Link href="/labs">Labs & experiments</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/privacy">Privacy</Link>
          </div>
        </nav>
      </div>
      <div className="shell footer-bottom">
        <span>© {new Date().getFullYear()} Ajmir Aribam</span>
        <SocialLinks compact />
      </div>
    </footer>
  );
}
