import { experience } from "@/content/experience";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "./SectionHeading";

export function Experience() {
  return (
    <section id="experience" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-24 sm:px-8">
      <SectionHeading
        index="03 / Experience"
        title="Where I've shipped"
        lead="Three teams, each one a step further into production ML."
      />

      <ol className="mt-14 space-y-4">
        {experience.map((role, i) => (
          <Reveal key={role.company} delay={i * 0.08}>
            <li className="card card-lit relative rounded-2xl p-6 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3 className="text-lg font-medium">{role.title}</h3>
                    {role.current ? (
                      <span className="rounded-full bg-primary-soft px-2.5 py-0.5 text-[11px] font-medium text-primary">
                        Current
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-sm text-primary">
                    {role.company} · {role.location}
                  </p>
                </div>
                <p className="font-mono text-xs text-muted">{role.period}</p>
              </div>

              <p className="mt-4 text-sm text-muted">{role.summary}</p>

              <ul className="mt-5 space-y-2.5">
                {role.points.map((point) => (
                  <li key={point} className="flex gap-3 text-sm leading-relaxed text-muted">
                    <span
                      aria-hidden
                      className="mt-2 size-1 shrink-0 rounded-full bg-primary"
                    />
                    {point}
                  </li>
                ))}
              </ul>

              <ul className="mt-5 flex flex-wrap gap-2">
                {role.stack.map((tech) => (
                  <li
                    key={tech}
                    className="rounded-full border border-border px-2.5 py-1 font-mono text-[11px] text-muted"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </li>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
