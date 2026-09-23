"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { email, githubUrl, linkedinUrl } from "@/lib/site";

export function SiteFooter() {
  const pathname = usePathname();
  const large =
    pathname === "/" || pathname === "/work" || pathname === "/contact";

  return (
    <footer
      className={`site-footer ${large ? "site-footer--large" : "site-footer--compact"}`}
    >
      {large ? (
        <div className="shell footer-grid">
          <div>
            <p className="eyebrow">
              {pathname === "/contact" ? "BEFORE YOU GO" : "LET’S TALK"}
            </p>
            {pathname === "/contact" ? (
              <>
                <h2>See the work.</h2>
                <Link className="text-link light" href="/work">
                  Explore selected work <span aria-hidden="true">↗</span>
                </Link>
              </>
            ) : (
              <>
                <h2>
                  Have a system
                  <br />
                  worth building?
                </h2>
                <Link className="text-link light" href="/contact">
                  Start a conversation <span aria-hidden="true">↗</span>
                </Link>
              </>
            )}
          </div>
          <div className="footer-side">
            <p>MD Ajmir Aribam</p>
            <p>Software Engineer — Backend, Cloud &amp; DevOps</p>
            <a href={`mailto:${email}`}>{email}</a>
          </div>
        </div>
      ) : (
        <div className="shell compact-footer-top">
          <div>
            <strong>MD Ajmir Aribam</strong>
            <p>Software Engineer — Backend, Cloud &amp; DevOps</p>
          </div>
          <Link className="text-link light" href="/contact">
            Get in touch <span aria-hidden="true">↗</span>
          </Link>
        </div>
      )}
      <div className="shell footer-bottom">
        <span>© {new Date().getFullYear()} MD AJMIR ARIBAM</span>
        <nav className="footer-links" aria-label="Footer navigation">
          <a href={githubUrl} target="_blank" rel="noopener noreferrer">
            GitHub ↗
          </a>
          <a href={linkedinUrl} target="_blank" rel="noopener noreferrer">
            LinkedIn ↗
          </a>
          <Link href="/contact">Contact</Link>
          <Link href="/privacy">Privacy</Link>
        </nav>
      </div>
    </footer>
  );
}
