import { site } from "@/content/site";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "./SectionHeading";

export function About() {
  return (
    <section
      id="about"
      className="mx-auto max-w-[1400px] scroll-mt-24 px-6 py-28 sm:px-10 sm:py-36"
    >
      <SectionHeading index="01" eyebrow="About" title="Across the ML boundary" />

      <div className="mt-16 grid gap-14 lg:grid-cols-[1.5fr_1fr] lg:gap-24">
        <div className="space-y-6">
          {site.bio.map((paragraph, i) => (
            <Reveal key={i} delay={i * 0.07}>
              <p className="measure text-[1.0625rem] leading-[1.7] text-muted">
                {paragraph}
              </p>
            </Reveal>
          ))}
        </div>

        <div>
          <Reveal delay={0.1}>
            <div className="rule-t pt-4">
              <p className="label">Education</p>
              <p className="mt-3 text-[0.95rem] text-ink">{site.education.degree}</p>
              <p className="mt-1 text-sm text-muted">{site.education.school}</p>
              <p className="tabular mt-2 text-xs text-faint">
                {site.education.period} · {site.education.detail}
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.18}>
            <div className="rule-t mt-10 pt-4">
              <p className="label">Certifications</p>
              <ul className="mt-3 space-y-3">
                {site.certifications.map((cert) => (
                  <li key={cert.name}>
                    <p className="text-[0.95rem] text-ink">{cert.name}</p>
                    <p className="text-sm text-muted">
                      {cert.issuer}
                      <span className="tabular ml-2 text-xs text-faint">{cert.date}</span>
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
