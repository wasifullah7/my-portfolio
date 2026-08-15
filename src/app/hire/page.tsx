import type { Metadata } from "next";
import Link from "next/link";
import { site, hire } from "@/content/site";
import { experience } from "@/content/experience";
import { ContactForm } from "@/components/ContactForm";
import { Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Hire Wasif Ullah",
  description:
    "Full-Stack AI Engineer available for AI engineering and full-stack roles. Computer vision, RAG and production backends, with measured results and published write-ups.",
  alternates: { canonical: "/hire" },
};

export default function HirePage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: hire.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  const current = experience.find((role) => role.current);

  return (
    <div className="mx-auto max-w-[1400px] px-6 pb-28 pt-28 sm:px-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <Reveal>
        <div className="rule-heavy pt-4">
          <div className="index-rule">
            <span className="tabular text-xs text-accent">07</span>
            <span className="label order-3">Hire</span>
          </div>
        </div>

        <h1 className="display mt-8 text-[clamp(2.1rem,6vw,4.5rem)]">{hire.headline}</h1>

        {/* Leading definition: the extractable answer sits in the first 80 words. */}
        <p className="measure mt-7 text-lg leading-relaxed text-muted">
          <strong className="text-ink">{site.name}</strong> is a Full-Stack AI Engineer
          in {site.location}, currently at {current?.company ?? site.currentRole},
          building computer-vision pipelines and production backends. {hire.lead}
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
          <a
            href={`mailto:${site.email}?subject=Role%20enquiry`}
            className="group mono inline-flex items-center gap-3 border border-ink px-7 py-3.5 text-xs uppercase tracking-[0.16em] transition-colors duration-300 hover:bg-ink hover:text-paper"
          >
            Email me
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
              &rarr;
            </span>
          </a>

          {hire.bookingUrl ? (
            <a
              href={hire.bookingUrl}
              target="_blank"
              rel="noreferrer"
              className="link-underline mono text-xs uppercase tracking-[0.16em] text-accent"
            >
              Book a call
            </a>
          ) : null}

          <a
            href={site.resumePath}
            download
            className="link-underline mono text-xs uppercase tracking-[0.16em] text-muted transition-colors hover:text-ink"
          >
            Download CV, PDF
          </a>
        </div>
      </Reveal>

      <div className="mt-20 grid gap-16 lg:grid-cols-[1fr_320px] lg:gap-24">
        <div>
          <Reveal>
            <section>
              <h2 className="label text-accent">What I am looking for</h2>
              <ul className="mt-6">
                {hire.lookingFor.map((item) => (
                  <li
                    key={item}
                    className="rule-t grid grid-cols-[24px_1fr] py-4 text-[1.0625rem] leading-relaxed text-muted"
                  >
                    <span aria-hidden className="mono text-faint">
                      /
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="rule-t" />
            </section>
          </Reveal>

          <Reveal>
            <section className="mt-16">
              <h2 className="label text-accent">Why me</h2>
              <div className="mt-6 space-y-8">
                {hire.strengths.map((item) => (
                  <div key={item.title}>
                    <h3 className="text-[1.05rem] text-ink">{item.title}</h3>
                    <p className="measure mt-2 text-[0.9375rem] leading-relaxed text-muted">
                      {item.body}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </Reveal>

          <Reveal>
            <section className="mt-16">
              <h2 className="label text-accent">Questions recruiters ask</h2>
              <dl className="mt-6">
                {hire.faqs.map((faq) => (
                  <div key={faq.q} className="rule-t py-6">
                    <dt className="text-[1.0625rem] text-ink">{faq.q}</dt>
                    <dd className="measure mt-2.5 text-[0.9375rem] leading-relaxed text-muted">
                      {faq.a}
                    </dd>
                  </div>
                ))}
              </dl>
              <div className="rule-t" />
            </section>
          </Reveal>
        </div>

        <aside>
          <Reveal delay={0.08}>
            <div className="rule-t pt-4">
              <p className="label">Status</p>
              <p className="mt-3 text-[0.9375rem] text-ink">{site.availability}</p>
              <p className="mono mt-2 text-sm text-muted">
                {site.location} · {site.locationNote}
              </p>
            </div>

            <div className="rule-t mt-10 pt-4">
              <p className="label">Direct</p>
              <a
                href={`mailto:${site.email}`}
                className="link-underline mono mt-3 block text-sm text-ink"
              >
                {site.email}
              </a>
              <a
                href={`tel:${site.phoneHref}`}
                className="link-underline mono mt-2 block text-sm text-ink"
              >
                {site.phone}
              </a>
            </div>

            <div className="rule-t mt-10 pt-4">
              <p className="label">More</p>
              <ul className="mt-3 space-y-2">
                <li>
                  <Link href="/blog" className="link-underline text-sm text-ink">
                    Engineering write-ups
                  </Link>
                </li>
                <li>
                  <Link href="/resume" className="link-underline text-sm text-ink">
                    Full résumé
                  </Link>
                </li>
                <li>
                  <a
                    href={site.links.github}
                    target="_blank"
                    rel="noreferrer"
                    className="link-underline text-sm text-ink"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href={site.links.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="link-underline text-sm text-ink"
                  >
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </Reveal>
        </aside>
      </div>

      <Reveal>
        <section className="rule-heavy mt-24 pt-8">
          <h2 className="label text-accent">Send a message</h2>
          <div className="mt-8 max-w-2xl">
            <ContactForm />
          </div>
        </section>
      </Reveal>
    </div>
  );
}
