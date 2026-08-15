import { Mail, Phone, PenLine, ArrowUpRight } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/BrandIcons";
import { site } from "@/content/site";
import { ContactForm } from "@/components/ContactForm";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "./SectionHeading";

export function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-24 sm:px-8">
      <SectionHeading
        index="05 / Contact"
        title="Let's build something"
        lead={site.availability + ". Tell me what you're working on and I'll get back to you."}
      />

      <div className="mt-12 grid gap-5 lg:grid-cols-[1.2fr_1fr]">
        <Reveal>
          <ContactForm />
        </Reveal>

        <Reveal delay={0.1}>
          <div className="space-y-4">
            <a
              href={`mailto:${site.email}`}
              className="card group flex items-center gap-4 rounded-2xl p-5 transition-colors hover:border-primary"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary-soft text-primary">
                <Mail className="size-4" />
              </span>
              <span className="min-w-0">
                <span className="block text-xs text-muted">Email</span>
                <span className="block truncate text-sm">{site.email}</span>
              </span>
            </a>

            <a
              href={`tel:${site.phoneHref}`}
              className="card group flex items-center gap-4 rounded-2xl p-5 transition-colors hover:border-primary"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary-soft text-primary">
                <Phone className="size-4" />
              </span>
              <span>
                <span className="block text-xs text-muted">Phone</span>
                <span className="block text-sm">{site.phone}</span>
              </span>
            </a>

            <div className="card rounded-2xl p-5">
              <p className="text-xs text-muted">Elsewhere</p>
              <div className="mt-3 space-y-1">
                {[
                  {
                    href: site.links.github,
                    label: "GitHub",
                    handle: "@wasifullah7",
                    Icon: GithubIcon,
                  },
                  {
                    href: site.links.linkedin,
                    label: "LinkedIn",
                    handle: "@wasifullahdev",
                    Icon: LinkedinIcon,
                  },
                  {
                    href: site.links.medium,
                    label: "Medium",
                    handle: "@wasifullahdev",
                    Icon: PenLine,
                  },
                ].map(({ href, label, handle, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center justify-between gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-surface-2"
                  >
                    <span className="flex items-center gap-3 text-sm">
                      <Icon className="size-4 text-muted" />
                      {label}
                      <span className="font-mono text-xs text-muted">{handle}</span>
                    </span>
                    <ArrowUpRight className="size-3.5 text-muted transition-colors group-hover:text-primary" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
