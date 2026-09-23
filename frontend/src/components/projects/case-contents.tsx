"use client";

import { useEffect, useState } from "react";

export function CaseContents({
  sections,
}: {
  sections: readonly { id: string; label: string }[];
}) {
  const [current, setCurrent] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setCurrent(visible[0].target.id);
      },
      { rootMargin: "-18% 0px -68% 0px" },
    );
    for (const section of sections) {
      const node = document.getElementById(section.id);
      if (node) observer.observe(node);
    }
    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav className="case-sidebar" aria-label="On this page">
      <span className="eyebrow">ON THIS PAGE</span>
      {sections.map((section, index) => (
        <a
          key={section.id}
          href={`#${section.id}`}
          aria-current={current === section.id ? "location" : undefined}
          onClick={() => setCurrent(section.id)}
        >
          <span>{String(index + 1).padStart(2, "0")}</span> {section.label}
        </a>
      ))}
    </nav>
  );
}
