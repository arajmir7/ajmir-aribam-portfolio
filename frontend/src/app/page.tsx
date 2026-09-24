import Image from "next/image";
import Link from "next/link";
import { projects } from "@/content/projects";

const [azaeron, shapes, friends] = projects;

export default function Home() {
  return (
    <main id="main" className="home-page">
      <section className="shell home-opening" aria-labelledby="home-title">
        <div className="home-intro">
          <p className="kicker">
            Ajmir Aribam <span aria-hidden="true">/</span> Software Engineer
          </p>
          <h1 id="home-title">I build the product and the system behind it.</h1>
          <p className="home-intro-lede">
            Interfaces, APIs, business rules, tests and releases. I work across
            the pieces that need to agree before software is useful.
          </p>
          <div className="home-intro-actions">
            <Link className="button button-primary" href="/work">
              Explore the work <span aria-hidden="true">↗</span>
            </Link>
            <Link className="text-link" href="/about">
              Get to know me <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <p className="home-intro-note">
            Backend · Product engineering · Cloud delivery · AI systems ·
            Quality
          </p>
        </div>
        <div className="home-showcase" aria-label="Selected product surfaces">
          <Link className="home-showcase-lead" href="/work/azaeron">
            <Image
              src={azaeron.visual.src}
              alt={azaeron.visual.alt}
              fill
              sizes="(max-width: 800px) 100vw, 57vw"
              priority
            />
            <span>
              <strong>Azaeron</strong>
              <small>Billing and business operations</small>
            </span>
          </Link>
          <Link className="home-showcase-secondary" href="/work/shapes-india">
            <Image
              src={shapes.visual.src}
              alt={shapes.visual.alt}
              fill
              sizes="(max-width: 800px) 50vw, 27vw"
            />
            <span>
              SHAPES India <span aria-hidden="true">↗</span>
            </span>
          </Link>
          <Link
            className="home-showcase-secondary home-showcase-secondary--photo"
            href="/work/friends-aluminium-works"
          >
            <Image
              src={friends.visual.src}
              alt={friends.visual.alt}
              fill
              sizes="(max-width: 800px) 50vw, 27vw"
            />
            <span>
              Friends Aluminium Works <span aria-hidden="true">↗</span>
            </span>
          </Link>
        </div>
      </section>

      <section
        className="shell home-projects"
        aria-labelledby="home-projects-title"
      >
        <div className="section-heading">
          <p className="kicker">Selected work</p>
          <div>
            <h2 id="home-projects-title">
              Three products, three different jobs.
            </h2>
            <Link className="text-link" href="/work">
              See all work <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
        <article className="home-project home-project--shapes">
          <div className="home-project-media">
            <Image
              src="/images/projects/shapes-home.webp"
              alt="SHAPES India public homepage showing its institutional introduction"
              fill
              sizes="(max-width: 800px) 100vw, 57vw"
            />
          </div>
          <div className="home-project-content">
            <span className="project-sequence">
              01 <span>/</span> Live institutional platform
            </span>
            <h3>One public home for six centres.</h3>
            <p>
              SHAPES India gives visitors a way into learning, services and
              research. An editorial workflow lets staff prepare and review
              updates before publication.
            </p>
            <Link href="/work/shapes-india">
              Explore SHAPES India <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </article>
        <article className="home-project home-project--friends">
          <div className="home-project-content">
            <span className="project-sequence">
              02 <span>/</span> Live commercial site
            </span>
            <h3>Show the work. Make it easy to ask.</h3>
            <p>
              For Friends Aluminium Works in Imphal, product and project pages
              lead visitors toward a direct quote request by WhatsApp or email.
            </p>
            <Link href="/work/friends-aluminium-works">
              Explore Friends Aluminium Works <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <div className="home-project-media">
            <Image
              src="/images/projects/friends-glass-railing.webp"
              alt="Glass railing work by Friends Aluminium Works"
              fill
              sizes="(max-width: 800px) 100vw, 57vw"
            />
          </div>
        </article>
      </section>

      <section className="home-practice" aria-labelledby="home-practice-title">
        <div className="shell">
          <div className="home-practice-intro">
            <p className="kicker">How I work</p>
            <h2 id="home-practice-title">The screen is one part of the job.</h2>
            <p>
              A product also needs rules for changing data, a way to recover
              when something fails, and checks before it ships.
            </p>
          </div>
          <div className="practice-path" role="list">
            <div role="listitem">
              <span>01</span>
              <h3>Model the rule</h3>
              <p>
                Azaeron checks payment state before an invoice can become paid.
              </p>
              <Link href="/work/azaeron">See the decision ↗</Link>
            </div>
            <div role="listitem">
              <span>02</span>
              <h3>Build the path</h3>
              <p>
                SHAPES keeps public pages and editor actions connected to one
                publishing record.
              </p>
              <Link href="/work/shapes-india">See the system ↗</Link>
            </div>
            <div role="listitem">
              <span>03</span>
              <h3>Check the change</h3>
              <p>
                Unit, API, database and browser checks catch different kinds of
                failure.
              </p>
              <Link href="/engineering">See the practice ↗</Link>
            </div>
          </div>
        </div>
      </section>

      <section
        className="shell home-person"
        aria-labelledby="home-person-title"
      >
        <div className="home-person-image">
          <Image
            src="/images/ajmir-portrait.jpg"
            alt="Portrait of Ajmir Aribam"
            fill
            sizes="(max-width: 680px) 100vw, 320px"
          />
        </div>
        <div>
          <p className="kicker">A little context</p>
          <h2 id="home-person-title">
            I came to software through work where records and follow-through
            mattered.
          </h2>
          <p>
            Banking and public digital-service roles made reliability feel
            concrete. Now I bring that attention to the products I engineer.
          </p>
          <Link className="text-link" href="/about">
            More about me <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
      <div className="shell home-closing">
        <span>Building something with moving parts?</span>
        <Link href="/contact">
          Let’s talk <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </main>
  );
}
