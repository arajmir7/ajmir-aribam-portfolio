import type { Metadata } from "next";
import { SocialLinks } from "@/components/layout/social-links";
import { ContactForm } from "@/features/contact/contact-form";
import { email, pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta(
  "Contact",
  "Contact Ajmir Aribam about a software engineering project or opportunity.",
  "/contact",
);

export default function Contact() {
  return (
    <main id="main" className="contact-page shell">
      <header className="contact-heading">
        <p className="kicker">Contact</p>
        <h1>Tell me what you’re working on.</h1>
        <p>
          A short note about the product, role or problem is enough to start.
        </p>
      </header>
      <div className="contact-layout">
        <aside className="contact-direct">
          <span>Direct email</span>
          <a href={`mailto:${email}`}>
            {email} <span aria-hidden="true">↗</span>
          </a>
          <p>
            If the form is inconvenient, write to me directly. I’ll reply from
            this address.
          </p>
          <div>
            <span>Elsewhere</span>
            <SocialLinks />
          </div>
        </aside>
        <ContactForm />
      </div>
    </main>
  );
}
