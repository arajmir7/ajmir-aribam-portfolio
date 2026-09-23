import type { Metadata, Viewport } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WebVitals } from "@/components/web-vitals";
import { githubUrl, linkedinUrl, siteUrl } from "@/lib/site";
import { headers } from "next/headers";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "MD Ajmir Aribam — Software Engineer",
    template: "%s — MD Ajmir Aribam",
  },
  description:
    "MD Ajmir Aribam builds backend systems, full-stack products, and cloud delivery workflows. Explore implementation evidence and case studies.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "MD Ajmir Aribam",
    title: "MD Ajmir Aribam — Software Engineer",
    description:
      "Backend, Cloud & DevOps. Real systems and inspectable engineering evidence.",
    url: "/",
    images: ["/opengraph-image"],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light dark",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const nonce = (await headers()).get("x-nonce") || undefined;
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "MD Ajmir Aribam",
    url: siteUrl,
    sameAs: [githubUrl, linkedinUrl],
    jobTitle: "Software Engineer",
  };
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <WebVitals />
        <SiteHeader />
        {children}
        <SiteFooter />
        <script
          nonce={nonce}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(person).replace(/</g, "\\u003c"),
          }}
        />
      </body>
    </html>
  );
}
