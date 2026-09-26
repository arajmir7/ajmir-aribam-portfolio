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
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta(
  "About",
  "Ajmir Aribam is a software engineer working across product engineering, backend services, APIs, data, quality and delivery.",
  "/about",
);

export default function About() {
  return (
    <main id="main">
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
