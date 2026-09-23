export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
).replace(/\/$/, "");
export const githubUrl = "https://github.com/arajmir7";
export const linkedinUrl =
  "https://www.linkedin.com/in/ajmir-aribam-backend-python/";
export const email = "arajmir7@gmail.com";

export function pageMeta(title: string, description: string, path: string) {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, type: "website" as const },
  };
}
