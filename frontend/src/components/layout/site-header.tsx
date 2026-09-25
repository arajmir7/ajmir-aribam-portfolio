"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { ThemeToggle } from "./theme-toggle";

const links = [
  ["Work", "/work"],
  ["Engineering", "/engineering"],
  ["About", "/about"],
  ["Notes", "/notes"],
  ["Résumé", "/resume"],
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
        <Link className="brand" href="/" aria-label="Ajmir Aribam, home">
          <Image
            className="brand-asset brand-full brand-light"
            src="/brand/lockup.svg"
            alt=""
            width={600}
            height={116}
            loading="eager"
          />
          <Image
            className="brand-asset brand-full brand-dark"
            src="/brand/lockup-dark.svg"
            alt=""
            width={600}
            height={116}
            loading="eager"
          />
          <Image
            className="brand-asset brand-compact brand-light"
            src="/brand/compact.svg"
            alt=""
            width={360}
            height={78}
            loading="eager"
          />
          <Image
            className="brand-asset brand-compact brand-dark"
            src="/brand/compact-dark.svg"
            alt=""
            width={360}
            height={78}
            loading="eager"
          />
          <Image
            className="brand-asset brand-monogram brand-light"
            src="/brand/mark.svg"
            alt=""
            width={410}
            height={300}
            loading="eager"
          />
          <Image
            className="brand-asset brand-monogram brand-dark"
            src="/brand/mark-dark.svg"
            alt=""
            width={410}
            height={300}
            loading="eager"
          />
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
          <Link
            href="/contact"
            className="header-contact"
            aria-current={active("/contact") ? "page" : undefined}
          >
            Contact <span aria-hidden="true">↗</span>
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
              {menuOpen ? "×" : "="}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
