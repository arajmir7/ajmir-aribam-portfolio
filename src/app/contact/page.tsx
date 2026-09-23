import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { email, githubUrl, linkedinUrl, pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta(
  "Contact",
  "Contact MD Ajmir Aribam about backend, cloud and full-stack engineering work.",
  "/contact",
);
export default function Contact() {
  return (
    <main id="main" className="shell page">
      <div className="page-heading">
        <p className="eyebrow">OPEN CHANNEL / INQUIRIES</p>
        <h1>
          Let’s talk systems<span className="period">.</span>
        </h1>
        <p>
          Share the problem, context, and what a useful next step would look
          like.
        </p>
      </div>
      <div className="contact-grid">
        <aside className="contact-aside">
          <p className="eyebrow">DIRECT ROUTES</p>
          <h2>A good brief starts with the constraint.</h2>
          <p>
            If the form is unavailable, email directly. Include enough context
            to make the first reply useful.
          </p>
          <a href={`mailto:${email}`}>{email} ↗</a>
          <div className="footer-links">
            <a href={githubUrl} target="_blank" rel="noopener noreferrer">
              GitHub ↗
            </a>
            <a href={linkedinUrl} target="_blank" rel="noopener noreferrer">
              LinkedIn ↗
            </a>
          </div>
        </aside>
        <ContactForm />
      </div>
    </main>
  );
}
