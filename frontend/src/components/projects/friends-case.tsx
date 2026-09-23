import Image from "next/image";
import { CaseContents } from "./case-contents";
import { CaseEnd, ImplementationNotes } from "./case-chrome";

const sections = [
  { id: "business", label: "The business" },
  { id: "discovery", label: "Discovery" },
  { id: "product-gallery", label: "Visual system" },
  { id: "inquiry", label: "Inquiry path" },
] as const;

const gallery = [
  {
    src: "/images/projects/friends-window.webp",
    alt: "Aluminium window installation shown in the Friends Aluminium Works catalogue",
    label: "Windows",
  },
  {
    src: "/images/projects/friends-glass-railing.webp",
    alt: "Glass and metal railing work shown on the Friends Aluminium Works website",
    label: "Railings",
  },
  {
    src: "/images/projects/friends-partitions.webp",
    alt: "Interior room partition project shown on the Friends Aluminium Works website",
    label: "Partitions",
  },
];

export function FriendsCase() {
  return (
    <div className="shell case-body case-body--friends">
      <CaseContents sections={sections} />
      <div className="case-main">
        <section id="business" className="case-section">
          <p className="eyebrow">01 / THE BUSINESS</p>
          <h2>Show the work before asking for the inquiry.</h2>
          <p className="section-lede">
            Friends Aluminium Works makes aluminium, steel, and glass work in
            Imphal. A useful site has to answer practical questions quickly:
            what the business makes, what that work looks like, and how to start
            a conversation about a specific job.
          </p>
          <div className="business-questions">
            <span>What is offered?</span>
            <span>What has been made?</span>
            <span>How do I ask for a quote?</span>
          </div>
        </section>

        <section id="discovery" className="case-section">
          <p className="eyebrow">02 / DISCOVERY</p>
          <h2>A catalogue people can move through.</h2>
          <p className="section-lede">
            Products, services, and projects have distinct routes. Category
            imagery makes the range legible before visitors need to read every
            detail; route-specific titles and descriptions give each page a
            clear search identity.
          </p>
          <figure className="editorial-figure friends-site-figure">
            <div className="editorial-image">
              <Image
                src="/images/projects/friends-products.webp"
                alt="Friends Aluminium Works product page with category cards and a navigation path to quotes"
                fill
                sizes="(max-width: 760px) 100vw, 65vw"
              />
            </div>
            <figcaption>
              Live product index · categories and project imagery
            </figcaption>
          </figure>
        </section>

        <section
          id="product-gallery"
          className="case-section case-section--gallery"
        >
          <p className="eyebrow">03 / VISUAL SYSTEM</p>
          <h2>Real material, real scale.</h2>
          <p className="section-lede">
            The visual language comes from the work itself. Photographs show
            windows, railings, and partitions in context, with responsive crops
            and lazy loading so the catalogue remains usable on small screens.
          </p>
          <div className="friends-gallery">
            {gallery.map((item) => (
              <figure key={item.label}>
                <div>
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 760px) 100vw, 22vw"
                  />
                </div>
                <figcaption>{item.label}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section id="inquiry" className="case-section case-section--last">
          <p className="eyebrow">04 / FRONTEND DELIVERY</p>
          <h2>From browsing to a useful first message.</h2>
          <div className="inquiry-path" aria-label="Website inquiry path">
            <span>Discover a service</span>
            <span aria-hidden="true">→</span>
            <span>See related work</span>
            <span aria-hidden="true">→</span>
            <span>Prepare a quote request</span>
          </div>
          <div className="two-col-copy">
            <div>
              <h3>Responsive delivery</h3>
              <p>
                React and TypeScript compose the site from reusable product data
                and route components. Image sizes and lazy loading matter
                because the work is best explained visually.
              </p>
            </div>
            <div>
              <h3>Direct handoff</h3>
              <p>
                Quote requests prepare a WhatsApp message; the contact form
                opens the visitor’s email client. The site makes that handoff
                clear instead of implying a server-side inbox.
              </p>
            </div>
          </div>
          <ImplementationNotes>
            <p>
              The frontend sets route-specific metadata and social previews. Its
              project editor stores changes in that browser’s local storage; it
              is a local tool, not a shared publishing backend.
            </p>
          </ImplementationNotes>
          <p className="case-closing">
            The result is a clear commercial web journey: understand the
            services, inspect the work, and reach the business through a
            familiar channel.
          </p>
        </section>
        <CaseEnd />
      </div>
    </div>
  );
}
