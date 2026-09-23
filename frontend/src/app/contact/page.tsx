import type { Metadata } from "next";
import { SocialLinks } from "@/components/layout/social-links";
import { ContactForm } from "@/features/contact/contact-form";
import { email, pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta(
  "Contact",
  "Contact Ajmir Aribam about software engineering, backend, cloud, AI systems, and quality work.",
  "/contact",
);
export default function Contact() {
  return (
    <main id="main" className="shell page">
      <div className="page-heading">
        <p className="eyebrow">CONTACT / AJMIR ARIBAM</p>
        <h1>
          Let’s talk<span className="period">.</span>
        </h1>
        <p>
          Tell me what you’re building or where you need help. A short note is
          enough to start.
        </p>
      </div>
      <div className="contact-grid">
        <aside className="contact-aside">
          <p className="eyebrow">DIRECT EMAIL</p>
          <h2>Prefer your inbox?</h2>
          <p>You can email me directly. I’ll reply from the same address.</p>
          <a href={`mailto:${email}`}>{email} ↗</a>
          <SocialLinks />
        </aside>
        <ContactForm />
      </div>
    </main>
  );
}
