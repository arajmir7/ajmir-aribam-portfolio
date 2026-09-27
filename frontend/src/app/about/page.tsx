import type { Metadata } from "next";
import {
  CurrentFocus,
  EngineeringProfile,
  HowIWork,
  ProfessionalBackground,
  ProfileClosing,
  ProfileContact,
  ProfileHero,
} from "@/components/about/profile-sections";
import { StructuredData } from "@/components/seo/structured-data";
import { pageMeta, personEntity, siteUrl } from "@/lib/site";

export const metadata: Metadata = pageMeta(
  "About | Software Engineer",
  "Meet Ajmir Aribam, a Software Engineer working across full-stack product engineering, backend services, APIs, quality and delivery.",
  "/about",
);

export default function About() {
  const profilePage = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${siteUrl}/about#profile`,
    url: `${siteUrl}/about`,
    name: "About Ajmir Aribam",
    mainEntity: personEntity,
  };
  return (
    <main id="main">
      <StructuredData value={profilePage} />
      <ProfileHero />
      <EngineeringProfile />
      <ProfessionalBackground />
      <CurrentFocus />
      <HowIWork />
      <ProfileClosing />
      <ProfileContact />
    </main>
  );
}
