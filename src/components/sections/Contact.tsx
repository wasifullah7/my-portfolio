import { site } from "@/content/site";
import { ContactForm } from "@/components/ContactForm";
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
        title="Let's build something"
        lead={`${site.availability}. Tell me what you are working on and I will get back to you.`}
      />

      <div className="mt-16 grid gap-16 lg:grid-cols-[1.3fr_1fr] lg:gap-24">
        <Reveal>
          <ContactForm />
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
