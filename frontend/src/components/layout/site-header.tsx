"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { ThemeToggle } from "./theme-toggle";

const links = [
  ["Work", "/work"],
  ["Engineering", "/engineering"],
  ["About", "/about"],
  ["Notes", "/writing"],
  ["Contact", "/contact"],
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const active = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className="site-header"
      onKeyDown={(event) => {
        if (event.key === "Escape" && menuOpen) {
          setMenuOpen(false);
          menuButton.current?.focus();
        }
      }}
    >
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
        <nav
          id="primary-navigation"
          aria-label="Primary navigation"
          className={`main-nav${menuOpen ? " is-open" : ""}`}
        >
          {links.map(([label, href]) => (
            <Link
              href={href}
              key={href}
              aria-current={active(href) ? "page" : undefined}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <ThemeToggle />
          <Link href="/resume" className="header-resume">
            Resume <span aria-hidden="true">↗</span>
          </Link>
          <button
            className="menu-toggle"
            type="button"
            ref={menuButton}
            aria-controls="primary-navigation"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((value) => !value)}
          >
            <span aria-hidden="true">{menuOpen ? "Close" : "Menu"}</span>
            <span className="menu-glyph" aria-hidden="true">
              {menuOpen ? "×" : "+"}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
