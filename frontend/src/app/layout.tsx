import type { Metadata, Viewport } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { WebVitals } from "@/features/telemetry/web-vitals";
import {
  githubUrl,
  instagramUrl,
  linkedinUrl,
  publicName,
  siteUrl,
  xUrl,
} from "@/lib/site";
import { headers } from "next/headers";
import localFont from "next/font/local";
import "./globals.css";
import "./product.css";

const instrumentSans = localFont({
  src: "../assets/instrument-sans-latin.woff2",
  variable: "--font-instrument",
  display: "swap",
  weight: "400 700",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Ajmir Aribam — Software Engineer",
    template: "%s — Ajmir Aribam",
  },
  description:
    "Ajmir Aribam is a software engineer working across backend, cloud, DevOps, AI systems, and quality engineering. Explore the projects behind the work.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Ajmir Aribam",
    title: "Ajmir Aribam — Software Engineer",
    description:
      "Backend · Cloud · DevOps · AI Systems · Quality Engineering. Real projects and their engineering decisions.",
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
    name: publicName,
    url: siteUrl,
    sameAs: [githubUrl, linkedinUrl, instagramUrl, xUrl],
    jobTitle: "Software Engineer",
  };
  return (
    <html lang="en" className={instrumentSans.variable}>
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
