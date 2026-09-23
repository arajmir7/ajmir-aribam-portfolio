"use client";

import { useEffect } from "react";

export function ThemeToggle() {
  useEffect(() => {
    const stored = localStorage.getItem("portfolio-theme");
    const chosen =
      stored === "dark" || stored === "light"
        ? stored
        : matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
    document.documentElement.dataset.theme = chosen;
  }, []);
  function toggle() {
    const next =
      document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("portfolio-theme", next);
  }
  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={toggle}
      aria-label="Toggle color theme"
      title="Change color theme"
    >
      ◐
    </button>
  );
}
