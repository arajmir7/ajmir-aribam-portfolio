export function canonicalSiteOrigin(
  rawValue: string | undefined,
  environment: string | undefined,
): string {
  const configured = rawValue?.trim();
  if (!configured) {
    if (environment === "production") {
      throw new Error("NEXT_PUBLIC_SITE_URL is required in production builds.");
    }
    return "http://localhost:3000";
  }

  let url: URL;
  try {
    url = new URL(configured);
  } catch {
    throw new Error("NEXT_PUBLIC_SITE_URL must be an absolute HTTP(S) origin.");
  }
  if (
    !["https:", "http:"].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash ||
    (environment === "production" && url.protocol !== "https:")
  ) {
    throw new Error(
      "NEXT_PUBLIC_SITE_URL must be a canonical HTTPS origin in production.",
    );
  }
  return url.origin;
}

export const siteUrl = canonicalSiteOrigin(
  process.env.NEXT_PUBLIC_SITE_URL,
  process.env.NODE_ENV,
);
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
