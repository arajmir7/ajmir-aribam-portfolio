"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ThemeToggle } from "./theme-toggle";

const links = [
  ["Work", "/work"],
  ["Engineering", "/engineering"],
  ["About", "/about"],
  ["Résumé", "/resume"],
] as const;

function Brand() {
  return (
    <Link className="brand" href="/" aria-label="Ajmir Aribam, home">
      <Image
        className="brand-mark brand-light"
        src="/brand/mark.svg"
        alt=""
        width={410}
        height={300}
        loading="eager"
      />
      <Image
        className="brand-mark brand-dark"
        src="/brand/mark-dark.svg"
        alt=""
        width={410}
        height={300}
        loading="eager"
      />
      <span className="brand-name">Ajmir Aribam</span>
    </Link>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const active = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const desktop = matchMedia("(min-width: 821px)");
    const closeOnDesktop = () => {
      if (desktop.matches) dialog.current?.close();
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => {
      document.body.style.overflow = previousOverflow;
      desktop.removeEventListener("change", closeOnDesktop);
    };
  }, [menuOpen]);

  function closeMenu() {
    dialog.current?.close();
  }

  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Brand />
        <nav aria-label="Primary navigation" className="main-nav">
          {links.map(([label, href]) => (
            <Link
              href={href}
              key={href}
              aria-current={active(href) ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <ThemeToggle />
          <Link
            href="/contact"
            className="header-contact-mobile"
            aria-label="Contact Ajmir"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m4 7 8 6 8-6" />
            </svg>
          </Link>
          <Link
            href="/contact"
            className="header-contact"
            aria-current={active("/contact") ? "page" : undefined}
          >
            Contact
          </Link>
          <button
            className="menu-toggle"
            type="button"
            ref={menuButton}
            aria-controls="mobile-navigation"
            aria-expanded={menuOpen}
            aria-label="Open menu"
            onClick={() => {
              dialog.current?.showModal();
              setMenuOpen(true);
            }}
          >
            <span>Menu</span>
            <span className="menu-glyph" aria-hidden="true">
              =
            </span>
          </button>
        </div>
      </div>
      <dialog
        ref={dialog}
        className="mobile-menu"
        aria-label="Site navigation"
        onKeyDown={(event) => {
          if (event.key !== "Tab") return;
          const controls = Array.from(
            event.currentTarget.querySelectorAll<HTMLElement>(
              "button, a[href]",
            ),
          );
          const first = controls[0];
          const last = controls.at(-1);
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last?.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first?.focus();
          }
        }}
        onClose={() => {
          setMenuOpen(false);
          menuButton.current?.focus();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeMenu();
        }}
      >
        <div className="mobile-menu-panel">
          <div className="mobile-menu-top">
            <span className="section-label">Ajmir Aribam</span>
            <button className="menu-close" type="button" onClick={closeMenu}>
              Close <span aria-hidden="true">×</span>
            </button>
          </div>
          <nav
            id="mobile-navigation"
            aria-label="Primary navigation"
            className="mobile-nav"
          >
            {[
              ["Home", "/"] as const,
              ...links,
              ["Contact", "/contact"] as const,
            ].map(([label, href]) => (
              <Link
                href={href}
                key={href}
                onClick={closeMenu}
                aria-current={active(href) ? "page" : undefined}
              >
                {label}
              </Link>
            ))}
          </nav>
          <p className="mobile-menu-caption">
            Software Engineer · Imphal, India
          </p>
        </div>
      </dialog>
    </header>
  );
}
