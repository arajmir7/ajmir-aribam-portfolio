export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
).replace(/\/$/, "");
export const githubUrl = "https://github.com/arajmir7";
export const linkedinUrl = "https://linkedin.com/in/ajmir-aribam/";
export const instagramUrl = "https://www.instagram.com/ajmiraribam/";
export const xUrl = "https://x.com/AribamAjmir";
export const email = "arajmir7@gmail.com";
export const publicName = "Ajmir Aribam";

export function pageMeta(title: string, description: string, path: string) {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      type: "website" as const,
      images: ["/opengraph-image"],
    },
    twitter: {
      card: "summary_large_image" as const,
      title,
      description,
      images: ["/opengraph-image"],
    },
  };
}
