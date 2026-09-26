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
import "./identity.css";

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
    "Ajmir Aribam is a software engineer working across product interfaces, backend services, APIs, data, delivery and quality engineering.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Ajmir Aribam",
    title: "Ajmir Aribam — Software Engineer",
    description:
      "Software that has to work beyond the screen. Public work, systems in development and the decisions behind them.",
    url: "/",
    images: ["/opengraph-image"],
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/apple-icon.png",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f4ee" },
    { media: "(prefers-color-scheme: dark)", color: "#101716" },
  ],
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
