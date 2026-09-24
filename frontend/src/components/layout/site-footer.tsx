import Image from "next/image";
import Link from "next/link";
import { email } from "@/lib/site";
import { SocialLinks } from "./social-links";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-main">
        <div className="footer-identity">
          <Image src="/brand/mark.svg" alt="" width={34} height={34} />
          <div>
            <strong>Ajmir Aribam</strong>
            <span>Software Engineer</span>
          </div>
        </div>
        <div className="footer-contact">
          <span>Have a project in mind?</span>
          <a href={`mailto:${email}`}>
            {email} <span aria-hidden="true">↗</span>
          </a>
        </div>
        <nav aria-label="Footer navigation" className="footer-nav">
          <Link href="/work">Work</Link>
          <Link href="/engineering">Engineering</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/privacy">Privacy</Link>
        </nav>
      </div>
      <div className="shell footer-bottom">
        <span>© {new Date().getFullYear()} Ajmir Aribam</span>
        <SocialLinks compact />
        <span>Built and checked with care.</span>
      </div>
    </footer>
  );
}
