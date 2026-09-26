import type { Metadata } from "next";
import {
  CurrentFocus,
  EngineeringCapability,
  PersonalBackground,
  ProfileClosing,
  ProfileContact,
  ProfileHero,
} from "@/components/about/profile-sections";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta(
  "About",
  "Ajmir Aribam is a software engineer working across product interfaces, backend systems, APIs, data, quality engineering and delivery.",
  "/about",
);

export default function About() {
  return (
    <main id="main">
      <ProfileHero />
      <EngineeringCapability />
      <PersonalBackground />
      <CurrentFocus />
      <ProfileClosing />
      <ProfileContact />
    </main>
  );
}
