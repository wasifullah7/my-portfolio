import type { Project } from "@/content/projects";
import { ProjectMedia } from "./ProjectMedia";
import { ClipReveal } from "./motion/ClipReveal";
import { Reveal } from "./motion/Reveal";
import { cn } from "@/lib/utils";

export function ProjectEntry({ project, index }: { project: Project; index: number }) {
  const reversed = index % 2 === 1;
  const number = String(index + 1).padStart(2, "0");

  return (
    <article className="rule-t grid gap-8 py-14 lg:grid-cols-12 lg:gap-10">
      <Reveal className="lg:col-span-1">
        <span className="tabular text-sm text-accent">{number}</span>
      </Reveal>

      <Reveal
        delay={0.05}
        className={cn("lg:col-span-6", reversed ? "lg:order-2" : undefined)}
      >
        <div className="flex flex-wrap items-baseline gap-x-4">
          <span className="label">{project.context}</span>
          <span className="tabular text-xs text-faint">{project.year}</span>
        </div>

        <h3 className="mt-4 text-[clamp(1.5rem,3vw,2.25rem)] leading-tight tracking-tight text-ink">
          {project.title}
        </h3>

        <p className="measure mt-4 text-[0.9375rem] leading-relaxed text-muted">
          {project.blurb}
        </p>

        {project.metrics ? (
          <dl className="mt-7 flex flex-wrap gap-x-12 gap-y-4">
            {project.metrics.map((metric) => (
              <div key={metric.label}>
                <dt className="tabular text-2xl text-accent">{metric.value}</dt>
                <dd className="label mt-1">{metric.label}</dd>
              </div>
            ))}
          </dl>
        ) : null}

        <ul className="mt-7 space-y-3">
          {project.highlights.map((highlight) => (
            <li
              key={highlight}
              className="measure grid grid-cols-[16px_1fr] text-[0.875rem] leading-relaxed text-muted"
            >
              <span aria-hidden className="mono text-faint">
                /
              </span>
              <span>{highlight}</span>
            </li>
          ))}
        </ul>

        <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2">
          {project.stack.map((tech) => (
            <li key={tech} className="mono text-[0.75rem] text-faint">
              {tech}
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
          {project.demoUrl ? (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noreferrer"
              className="group mono inline-flex items-center gap-2 border border-ink px-5 py-2.5 text-[0.6875rem] uppercase tracking-[0.16em] transition-colors duration-300 hover:bg-ink hover:text-paper"
            >
              Live demo
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                &rarr;
              </span>
            </a>
          ) : null}

          {project.repoUrl ? (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="link-underline mono text-[0.6875rem] uppercase tracking-[0.16em] text-muted transition-colors hover:text-ink"
            >
              Source
            </a>
          ) : null}

          {!project.repoUrl && !project.demoUrl ? (
            <span className="mono text-[0.6875rem] uppercase tracking-[0.16em] text-faint">
              Proprietary, details on request
            </span>
          ) : null}
        </div>
      </Reveal>

      <ClipReveal
        delay={0.1}
        className={cn("lg:col-span-5", reversed ? "lg:order-1" : undefined)}
      >
        <ProjectMedia project={project} />
      </ClipReveal>
    </article>
  );
}
