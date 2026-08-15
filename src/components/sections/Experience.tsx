import { experience } from "@/content/experience";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "./SectionHeading";

export function Experience() {
  return (
    <section
      id="experience"
      className="mx-auto max-w-[1400px] scroll-mt-24 px-6 py-28 sm:px-10 sm:py-36"
    >
      <SectionHeading
        index="03"
        eyebrow="Experience"
        title="Where I've shipped"
        lead="Three teams, each one a step further into production ML."
      />

      <div className="mt-16">
        {experience.map((role, i) => (
          <Reveal key={role.company} delay={i * 0.06}>
            <article className="rule-t grid gap-6 py-10 lg:grid-cols-[200px_1fr] lg:gap-16">
              <div>
                <p className="tabular text-sm text-accent">{role.period}</p>
                <p className="label mt-2">{role.location}</p>
                {role.current ? (
                  <p className="mono mt-3 inline-block border border-accent px-2 py-0.5 text-[0.6875rem] uppercase tracking-[0.14em] text-accent">
                    Current
                  </p>
                ) : null}
              </div>

              <div>
                <h3 className="text-xl text-ink sm:text-2xl">
                  {role.title}
                  <span className="text-muted">, {role.company}</span>
                </h3>

                <p className="measure mt-3 text-[0.95rem] text-muted">{role.summary}</p>

                <ul className="mt-6 space-y-3">
                  {role.points.map((point) => (
                    <li
                      key={point}
                      className="measure grid grid-cols-[16px_1fr] text-[0.9375rem] leading-relaxed text-muted"
                    >
                      <span aria-hidden className="mono text-faint">
                        /
                      </span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>

                <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
                  {role.stack.map((tech) => (
                    <li key={tech} className="mono text-[0.75rem] text-faint">
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </Reveal>
        ))}
        <div className="rule-t" />
      </div>
    </section>
  );
}
