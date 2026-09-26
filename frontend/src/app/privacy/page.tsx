import type { Metadata } from "next";
import { email, pageMeta } from "@/lib/site";
export const metadata: Metadata = pageMeta(
  "Privacy",
  "How this portfolio handles contact inquiries and basic operational data.",
  "/privacy",
);
export default function Privacy() {
  return (
    <main id="main" className="shell page narrow-page">
      <div className="page-heading">
        <p className="eyebrow">POLICY / CONTACT DATA</p>
        <h1>
          Privacy<span className="period">.</span>
        </h1>
        <p>Last updated 23 September 2026.</p>
      </div>
      <div className="prose">
        <h2>What is collected</h2>
        <p>
          If you submit the contact form, the service stores the name, email,
          topic, message, submission time and a request identifier. A hash of
          network address is used for abuse throttling and removed by a
          scheduled retention task. The full network address and full message
          are not written to application logs.
        </p>
        <h2>Why it is used</h2>
        <p>
          The information is used to respond to your inquiry and protect the
          form against abuse. The site does not run advertising trackers or sell
          contact information.
        </p>
        <h2>Storage and retention</h2>
        <p>
          Inquiry records are stored in the site database. A retention period
          has not yet been set for public operation; it will be published before
          the form opens on a public domain. Backups may keep records until
          their configured expiry.
        </p>
        <h2>Your choices</h2>
        <p>
          You can email <a href={`mailto:${email}`}>{email}</a> to request
          access to or deletion of an inquiry. External links to GitHub,
          LinkedIn and project sites are governed by their own policies.
        </p>
        <h2>Measurement</h2>
        <p>
          First-party web-vitals and error telemetry send metric values and
          error types to the application log. They do not include message bodies
          or email addresses.
        </p>
      </div>
    </main>
  );
}
