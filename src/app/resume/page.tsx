import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/content/site";
import { experience } from "@/content/experience";
import { skillGroups } from "@/content/skills";
import { projects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Résumé",
  description: `Résumé of ${site.name}, ${site.role}. Experience, skills, projects, and education.`,
};

/**
 * Server-rendered on purpose: the previous site shipped this route as an empty
 * client-only shell, so crawlers and no-JS visitors saw nothing at all.
 */
export default function ResumePage() {
  return (
    <div className="mx-auto max-w-3xl px-6 pb-28 pt-28 sm:px-10">
      <Link
        href="/"
        className="link-underline mono text-xs uppercase tracking-[0.16em] text-muted transition-colors hover:text-ink"
      >
        &larr; Back to portfolio
      </Link>

      <header className="mt-10 flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="display text-[clamp(2rem,6vw,3.25rem)]">{site.name}</h1>
          <p className="label mt-3">{site.role}</p>
          <p className="mono mt-1 text-sm text-muted">{site.disciplines.join(" / ")}</p>
        </div>

        <a
          href={site.resumePath}
          download
          className="group mono inline-flex items-center gap-3 border border-ink px-5 py-2.5 text-xs uppercase tracking-[0.16em] transition-colors duration-300 hover:bg-ink hover:text-paper"
        >
          Download PDF
          <span className="inline-block transition-transform duration-300 group-hover:translate-y-0.5">
            &darr;
          </span>
        </a>
      </header>

      <ul className="rule-t mt-8 flex flex-wrap gap-x-8 gap-y-2 pt-4">
        {[
          { href: `mailto:${site.email}`, text: site.email },
          { href: `tel:${site.phoneHref}`, text: site.phone },
          { href: site.links.github, text: "github.com/wasifullah7" },
          { href: site.links.linkedin, text: "linkedin.com/in/wasifullahdev" },
        ].map((item) => (
          <li key={item.text}>
            <a href={item.href} className="link-underline mono text-xs text-muted">
              {item.text}
            </a>
          </li>
        ))}
      </ul>

      <Section title="Profile">
        <p className="text-[0.9375rem] leading-relaxed text-muted">{site.bio[0]}</p>
      </Section>

      <Section title="Experience">
        <div className="space-y-9">
          {experience.map((role) => (
            <article key={role.company}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-[1.0625rem] text-ink">
                  {role.title}
                  <span className="text-muted">, {role.company}</span>
                </h3>
                <span className="tabular text-xs text-accent">{role.period}</span>
              </div>
              <p className="label mt-1">{role.location}</p>
              <ul className="mt-4 space-y-2.5">
                {role.points.map((point) => (
                  <li
                    key={point}
                    className="grid grid-cols-[16px_1fr] text-[0.875rem] leading-relaxed text-muted"
                  >
                    <span aria-hidden className="mono text-faint">
                      /
                    </span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Section>

      <Section title="Selected Projects">
        <div className="space-y-6">
          {projects.slice(0, 4).map((project) => (
            <article key={project.slug}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-[1.0625rem] text-ink">{project.title}</h3>
                <span className="label">{project.context}</span>
              </div>
              <p className="mt-1.5 text-[0.875rem] leading-relaxed text-muted">
                {project.blurb}
              </p>
              <p className="mono mt-2 text-xs text-faint">{project.stack.join(" / ")}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section title="Skills">
        <div className="space-y-4">
          {skillGroups.map((group) => (
            <div key={group.code} className="grid gap-1 sm:grid-cols-[160px_1fr]">
              <p className="mono text-[0.8125rem] text-ink">{group.title}</p>
              <p className="text-[0.875rem] text-muted">{group.items.join(", ")}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Education & Certifications">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-[1.0625rem] text-ink">{site.education.degree}</p>
          <span className="tabular text-xs text-accent">{site.education.period}</span>
        </div>
        <p className="text-sm text-muted">
          {site.education.school}
          <span className="mono ml-2 text-xs text-faint">{site.education.detail}</span>
        </p>
        <ul className="mt-5 space-y-2">
          {site.certifications.map((cert) => (
            <li
              key={cert.name}
              className="flex flex-wrap items-baseline justify-between gap-2 text-[0.875rem] text-muted"
            >
              <span>
                {cert.name}
                <span className="mono text-xs text-faint">, {cert.issuer}</span>
              </span>
              <span className="tabular text-xs text-faint">{cert.date}</span>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rule-t mt-14 pt-5">
      <h2 className="label text-accent">{title}</h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}
