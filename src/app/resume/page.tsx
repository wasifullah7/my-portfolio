import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Download, Mail, Phone } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/BrandIcons";
import { site } from "@/content/site";
import { experience } from "@/content/experience";
import { skillGroups } from "@/content/skills";
import { projects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Résumé",
  description: `Résumé of ${site.name} — ${site.role}. Experience, skills, projects, and education.`,
};

/**
 * Server-rendered on purpose: the previous site shipped this route as an empty
 * client-only shell, so crawlers and no-JS visitors saw nothing at all.
 */
export default function ResumePage() {
  return (
    <div className="mx-auto max-w-3xl px-5 pb-24 pt-28 sm:px-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-primary"
      >
        <ArrowLeft className="size-3.5" /> Back to portfolio
      </Link>

      <header className="mt-8 flex flex-wrap items-start justify-between gap-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{site.name}</h1>
          <p className="mt-1.5 text-primary">{site.role}</p>
          <p className="mt-1 text-sm text-muted">{site.disciplines.join(" · ")}</p>
        </div>

        <a
          href={site.resumePath}
          download
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-white transition-shadow hover:shadow-[0_0_28px_-6px_var(--primary)]"
        >
          <Download className="size-4" /> Download PDF
        </a>
      </header>

      <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
        <li>
          <a href={`mailto:${site.email}`} className="flex items-center gap-2 hover:text-primary">
            <Mail className="size-3.5" /> {site.email}
          </a>
        </li>
        <li>
          <a href={`tel:${site.phoneHref}`} className="flex items-center gap-2 hover:text-primary">
            <Phone className="size-3.5" /> {site.phone}
          </a>
        </li>
        <li>
          <a
            href={site.links.github}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 hover:text-primary"
          >
            <GithubIcon className="size-3.5" /> wasifullah7
          </a>
        </li>
        <li>
          <a
            href={site.links.linkedin}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 hover:text-primary"
          >
            <LinkedinIcon className="size-3.5" /> wasifullahdev
          </a>
        </li>
      </ul>

      <Section title="Profile">
        <p className="text-sm leading-relaxed text-muted">{site.bio[0]}</p>
      </Section>

      <Section title="Experience">
        <div className="space-y-8">
          {experience.map((role) => (
            <article key={role.company}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-medium">
                  {role.title} · <span className="text-primary">{role.company}</span>
                </h3>
                <span className="font-mono text-xs text-muted">{role.period}</span>
              </div>
              <p className="mt-0.5 text-xs text-muted">{role.location}</p>
              <ul className="mt-3 space-y-2">
                {role.points.map((point) => (
                  <li key={point} className="flex gap-2.5 text-sm leading-relaxed text-muted">
                    <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-primary" />
                    {point}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Section>

      <Section title="Selected Projects">
        <div className="space-y-5">
          {projects.slice(0, 4).map((project) => (
            <article key={project.slug}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-medium">{project.title}</h3>
                <span className="font-mono text-xs text-muted">{project.context}</span>
              </div>
              <p className="mt-1 text-sm leading-relaxed text-muted">{project.blurb}</p>
              <p className="mt-1.5 font-mono text-xs text-muted">{project.stack.join(" · ")}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section title="Skills">
        <div className="space-y-3">
          {skillGroups.map((group) => (
            <div key={group.title} className="grid gap-1 sm:grid-cols-[180px_1fr]">
              <p className="text-sm font-medium">{group.title}</p>
              <p className="text-sm text-muted">{group.items.join(", ")}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Education & Certifications">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="font-medium">{site.education.degree}</p>
          <span className="font-mono text-xs text-muted">{site.education.period}</span>
        </div>
        <p className="text-sm text-muted">{site.education.school}</p>
        <ul className="mt-4 space-y-1.5">
          {site.certifications.map((cert) => (
            <li key={cert.name} className="text-sm text-muted">
              {cert.name} — <span className="text-xs">{cert.issuer}</span>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="hairline pt-5 text-xs font-medium uppercase tracking-widest text-primary">
        {title}
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}
