import Link from "next/link";
import { site } from "@/content/site";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "./SectionHeading";

export function Contact() {
  return (
    <section
      id="contact"
      className="mx-auto max-w-[1400px] scroll-mt-24 px-6 py-28 sm:px-10 sm:py-36"
    >
      <SectionHeading
        index="05"
        eyebrow="Contact"
        title="Get in touch"
        lead="If you are hiring, the form on the hire page asks the few things I need to give you a straight answer. Otherwise, email works fine."
      />

      <div className="mt-14 grid gap-14 lg:grid-cols-[1.2fr_1fr] lg:gap-24">
        <Reveal>
          <div>
            <Link
              href="/hire"
              className="group mono inline-flex items-center gap-3 border border-ink px-7 py-3.5 text-xs uppercase tracking-[0.16em] transition-colors duration-300 hover:bg-ink hover:text-paper"
            >
              Hiring? Start here
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                &rarr;
              </span>
            </Link>

            <p className="measure mt-8 text-[0.9375rem] leading-relaxed text-muted">
              I read everything that comes in and normally reply within a day. If it
              is about a role, telling me the type of engagement and rough timeline
              saves us both an email.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div>
            <div className="rule-t pt-4">
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
              <p className="label">Elsewhere</p>
              <ul className="mt-3 space-y-2">
                {[
                  { href: site.links.github, label: "GitHub", handle: "wasifullah7" },
                  { href: site.links.linkedin, label: "LinkedIn", handle: "wasifullahdev" },
                  { href: site.links.medium, label: "Medium", handle: "wasifullahdev" },
                ].map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-baseline justify-between gap-4"
                    >
                      <span className="text-sm text-ink">{item.label}</span>
                      <span className="mono text-xs text-faint transition-colors group-hover:text-accent">
                        {item.handle}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rule-t mt-10 pt-4">
              <p className="label">Location</p>
              <p className="mono mt-3 text-sm text-ink">
                {site.location} · {site.locationNote}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
