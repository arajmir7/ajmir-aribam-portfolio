import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AzaeronCase } from "@/components/projects/azaeron-case";
import { CaseHero } from "@/components/projects/case-chrome";
import { DevelopingCase } from "@/components/projects/developing-case";
import { FriendsCase } from "@/components/projects/friends-case";
import { ShapesCase } from "@/components/projects/shapes-case";
import { StructuredData } from "@/components/seo/structured-data";
import { projects, projectBySlug } from "@/content/projects";
import { pageMeta, siteUrl } from "@/lib/site";

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projectBySlug(slug);
  return project
    ? pageMeta(`${project.name} case study`, project.summary, `/work/${slug}`)
    : {};
}

export default async function CaseStudy({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project) notFound();

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Work",
        item: `${siteUrl}/work`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: project.name,
        item: `${siteUrl}/work/${project.slug}`,
      },
    ],
  };

  return (
    <main id="main" className={`case-page case-page--${project.slug}`}>
      <StructuredData value={breadcrumbs} />
      <CaseHero project={project} />
      {slug === "azaeron" && <AzaeronCase project={project} />}
      {slug === "shapes-india" && <ShapesCase />}
      {slug === "friends-aluminium-works" && <FriendsCase />}
      {(slug === "azaeron-verity" || slug === "the-scent-bar-retail-os") && (
        <DevelopingCase project={project} />
      )}
    </main>
  );
}
