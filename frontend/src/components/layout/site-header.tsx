import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

const links = [
  ["Work", "/work"],
  ["Engineering", "/engineering"],
  ["About", "/about"],
  ["Writing", "/writing"],
  ["Contact", "/contact"],
] as const;

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link className="brand" href="/" aria-label="MD Ajmir Aribam, home">
          <span className="brand-mark">
            A<span>.</span>
          </span>
          <span className="brand-name">
            MD AJMIR
            <br />
            ARIBAM
          </span>
        </Link>
        <nav aria-label="Primary navigation" className="main-nav">
          {links.map(([label, href]) => (
            <Link href={href} key={href}>
              {label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <ThemeToggle />
          <Link href="/resume" className="header-resume">
            Resume <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
