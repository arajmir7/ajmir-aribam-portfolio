import type { Metadata } from "next";
import Link from "next/link";
import { ProjectCollection } from "@/components/projects/project-collection";
import { ContactClose } from "@/components/layout/contact-close";
import { publicWork, currentWork, prototypes } from "@/content/project-groups";
import { pageMeta } from "@/lib/site";
import { StructuredData } from "@/components/seo/structured-data";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = pageMeta(
  "Software Engineering Projects",
  "Public websites, software in development and prototypes by Ajmir Aribam, with contributions, decisions and unfinished work explained.",
  "/work",
);

const groups = [
  {
    id: "public-work",
    label: "01 / Public work",
    title: "Open on the web",
    description:
      "Four public experiences you can visit today. Zam Zam Academy is a hosted prototype; the other projects are live products.",
    projects: publicWork,
    compact: false,
  },
  {
    id: "current-work",
    label: "02 / Current work",
    title: "Currently building",
    description:
      "Systems that are functional enough to inspect, but still have important release work ahead.",
    projects: currentWork,
    compact: true,
  },
  {
    id: "labs",
    label: "03 / Labs",
    title: "Prototype exploration",
    description:
      "An early exploration shown with its current boundaries intact.",
    projects: prototypes,
    compact: false,
  },
];

export default function Work() {
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: "Work",
        item: `${siteUrl}/work`,
      },
    ],
  };
  return (
    <main id="main" className="work-index">
      <StructuredData value={breadcrumbs} />
      <header className="shell work-opening">
        <p className="section-label">Work / 2026</p>
        <h1>Work</h1>
        <p>
          Software products and public experiences I have designed, built or
          helped bring into working form. Each case explains the product, my
          contribution, the decisions behind it and what remains unfinished.
        </p>
        <nav className="work-key" aria-label="Work collections">
          {groups.map((group) => (
            <a key={group.id} href={`#${group.id}`}>
              {group.title}
            </a>
          ))}
        </nav>
      </header>
      {groups.map((group) => (
        <section
          key={group.id}
          id={group.id}
          className="shell work-collection"
          aria-labelledby={`${group.id}-title`}
          data-section={group.id}
        >
          <header className="work-collection-heading">
            <p className="section-label">{group.label}</p>
            <h2 id={`${group.id}-title`}>{group.title}</h2>
            <p>{group.description}</p>
          </header>
          <ProjectCollection
            projects={group.projects}
            compact={group.compact}
          />
          {group.id === "labs" && (
            <Link className="text-link work-labs-link" href="/labs">
              Explore Labs
            </Link>
          )}
        </section>
      ))}
      <ContactClose />
    </main>
  );
}
