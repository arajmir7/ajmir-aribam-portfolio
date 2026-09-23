import Link from "next/link";
import { email, githubUrl, linkedinUrl } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <p className="eyebrow">END OF RECORD / OPEN CHANNEL</p>
          <h2>
            Have a system
            <br />
            worth building?
          </h2>
          <Link className="text-link light" href="/contact">
            Start a conversation <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <div className="footer-side">
          <p>
            Software Engineer
            <br />
            Backend, Cloud & DevOps
          </p>
          <a href={`mailto:${email}`}>{email}</a>
          <div className="footer-links">
            <a href={githubUrl} target="_blank" rel="noopener noreferrer">
              GitHub ↗
            </a>
            <a href={linkedinUrl} target="_blank" rel="noopener noreferrer">
              LinkedIn ↗
            </a>
            <Link href="/privacy">Privacy</Link>
          </div>
        </div>
      </div>
      <div className="shell footer-bottom">
        <span>© {new Date().getFullYear()} MD AJMIR ARIBAM</span>
        <span>Designed and engineered with evidence in view.</span>
      </div>
    </footer>
  );
}
