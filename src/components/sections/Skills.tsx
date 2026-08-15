import { skillGroups, marqueeSkills } from "@/content/skills";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { SectionHeading } from "./SectionHeading";

export function Skills() {
  return (
    <section id="skills" className="scroll-mt-24 py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          index="02 / Stack"
          title="What I build with"
          lead="Grouped by the problem it solves rather than by language."
        />

        <Stagger className="mt-12 grid gap-4 sm:grid-cols-2">
          {skillGroups.map((group) => (
            <StaggerItem key={group.title}>
              <div className="card card-lit h-full rounded-2xl p-6">
                <h3 className="font-medium">{group.title}</h3>
                <p className="mt-1.5 text-sm text-muted">{group.caption}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-border bg-surface-2 px-3 py-1 font-mono text-xs text-muted"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>

      <div className="marquee-mask mt-14 overflow-hidden py-2">
        <div className="animate-marquee flex w-max gap-3">
          {[...marqueeSkills, ...marqueeSkills].map((skill, i) => (
            <span
              key={`${skill}-${i}`}
              className="whitespace-nowrap rounded-full border border-border px-4 py-1.5 font-mono text-xs text-muted"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
