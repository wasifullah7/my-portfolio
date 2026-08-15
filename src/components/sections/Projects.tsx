import Link from "next/link";
import { projects, earlierWork } from "@/content/projects";
import { site } from "@/content/site";
import { ProjectEntry } from "@/components/ProjectEntry";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "./SectionHeading";

export function Projects() {
  return (
    <section
      id="work"
      className="mx-auto max-w-[1400px] scroll-mt-24 px-6 py-28 sm:px-10 sm:py-36"
    >
      <SectionHeading
        index="04"
        eyebrow="Work"
        title="Selected work"
        lead="Production systems first, research second. Every number below is measured, not estimated."
      />

      <div className="mt-14">
        {projects.map((project, i) => (
          <ProjectEntry key={project.slug} project={project} index={i} />
        ))}
        <div className="rule-t" />
      </div>

      <Reveal>
        <div className="mt-20">
          <div className="index-rule">
            <span className="label order-3">Earlier work</span>
          </div>

          <ul className="mt-6">
            {earlierWork.map((item) => (
              <li key={item.title}>
                <a
                  href={item.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="row rule-t group flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1 py-5"
                >
                  <span className="text-[0.9375rem] text-ink">{item.title}</span>
                  <span className="mono text-xs text-faint">{item.note}</span>
                </a>
              </li>
            ))}
          </ul>
          <div className="rule-t" />

          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
            <Link
              href="/work"
              className="link-underline mono text-xs uppercase tracking-[0.16em] text-accent"
            >
              All case studies
            </Link>
            <a
              href={site.links.github}
              target="_blank"
              rel="noreferrer"
              className="link-underline mono text-xs uppercase tracking-[0.16em] text-muted transition-colors hover:text-ink"
            >
              All repositories on GitHub
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
