export function CaseContents({
  sections,
}: {
  sections: readonly { id: string; label: string }[];
}) {
  return (
    <nav className="case-contents" aria-label="In this case study">
      <span>In this case</span>
      <div>
        {sections.map((section) => (
          <a href={`#${section.id}`} key={section.id}>
            {section.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
