import { skillGroups, marqueeSkills } from "@/content/skills";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "./SectionHeading";

export function Skills() {
  return (
    <section id="skills" className="scroll-mt-24 py-28 sm:py-36">
      <div className="mx-auto max-w-[1400px] px-6 sm:px-10">
        <SectionHeading
          index="02"
          eyebrow="Stack"
          title="What I build with"
          lead="Grouped by what it solves, not by what language it happens to be written in."
        />

        <div className="mt-16">
          {skillGroups.map((group, i) => (
            <Reveal key={group.code} delay={i * 0.06}>
              <div className="row rule-t grid grid-cols-1 gap-4 py-7 md:grid-cols-[80px_240px_1fr] md:gap-8">
                <span className="tabular text-sm text-accent">{group.code}</span>

                <div>
                  <h3 className="text-[1.05rem] text-ink">{group.title}</h3>
                  <p className="mt-1 text-sm text-muted">{group.caption}</p>
                </div>

                <ul className="flex flex-wrap items-start gap-x-5 gap-y-2 md:justify-end">
                  {group.items.map((item) => (
                    <li key={item} className="mono text-[0.8125rem] text-muted">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
          <div className="rule-t" />
        </div>
      </div>

      <div className="marquee-mask mt-20 overflow-hidden">
        <div className="animate-marquee flex w-max gap-12">
          {[...marqueeSkills, ...marqueeSkills].map((skill, i) => (
            <span
              key={`${skill}-${i}`}
              className="mono whitespace-nowrap text-sm text-faint"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
