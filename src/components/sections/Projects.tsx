import { ArrowUpRight } from "lucide-react";
import { projects, earlierWork } from "@/content/projects";
import { site } from "@/content/site";
import { ProjectCard } from "@/components/ProjectCard";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "./SectionHeading";

export function Projects() {
  return (
    <section id="work" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-24 sm:px-8">
      <SectionHeading
        index="04 / Work"
        title="Selected work"
        lead="Production systems first, research second. Every number below is measured, not estimated."
      />

      <div className="mt-14 grid gap-5 lg:grid-cols-2">
        {projects.map((project, i) => (
          <ProjectCard key={project.slug} project={project} index={i} />
        ))}
      </div>

      <Reveal>
        <div className="card mt-6 rounded-3xl p-6 sm:p-8">
          <h3 className="text-sm font-medium">Earlier work</h3>
          <p className="mt-1 text-sm text-muted">
            Foundational projects, still public.
          </p>
          <ul className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2">
            {earlierWork.map((item) => (
              <li key={item.title}>
                <a
                  href={item.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-baseline justify-between gap-4 border-b border-border py-2.5 transition-colors hover:border-primary"
                >
                  <span className="text-sm">
                    {item.title}
                    <span className="ml-2 text-xs text-muted">{item.note}</span>
                  </span>
                  <ArrowUpRight className="size-3.5 shrink-0 text-muted transition-colors group-hover:text-primary" />
                </a>
              </li>
            ))}
          </ul>

          <a
            href={site.links.github}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
          >
            All repositories on GitHub <ArrowUpRight className="size-3.5" />
          </a>
        </div>
      </Reveal>
    </section>
  );
}
