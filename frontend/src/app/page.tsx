import { PersonalIntroduction } from "@/components/home/personal-introduction";
import { EngineeringProof } from "@/components/home/engineering-proof";
import { SelectedWork } from "@/components/home/selected-work";
import { FieldNote } from "@/components/home/field-note";
import { ContactClose } from "@/components/layout/contact-close";
import { CurrentWork } from "@/components/home/current-work";
import { AboutBridge } from "@/components/home/about-bridge";
import { StructuredData } from "@/components/seo/structured-data";
import { websiteEntity } from "@/lib/site";

export default function Home() {
  return (
    <main id="main" className="identity-home">
      <StructuredData value={websiteEntity} />
      <PersonalIntroduction />
      <EngineeringProof />
      <SelectedWork />
      <CurrentWork />
      <FieldNote />
      <AboutBridge />
      <ContactClose />
    </main>
  );
}
