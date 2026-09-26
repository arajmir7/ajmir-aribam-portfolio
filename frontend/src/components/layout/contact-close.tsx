import Link from "next/link";
import { email } from "@/lib/site";

export function ContactClose() {
  return (
    <section className="contact-close" aria-labelledby="contact-close-title">
      <div className="shell contact-close-inner">
        <div>
          <p className="section-label">Have something in mind?</p>
          <h2 id="contact-close-title">Let’s work through it.</h2>
          <a className="contact-close-email" href={`mailto:${email}`}>
            {email} <span aria-hidden="true">↗</span>
          </a>
        </div>
        <div className="contact-close-actions">
          <Link className="button button-primary" href="/contact">
            Start a conversation <span aria-hidden="true">↗</span>
          </Link>
          <Link className="text-link" href="/resume">
            Read my résumé <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
