import { GraduationCap, BadgeCheck, MapPin } from "lucide-react";
import { site } from "@/content/site";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "./SectionHeading";

export function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-24 sm:px-8">
      <SectionHeading index="01 / About" title="Engineering across the ML boundary" />

      <div className="mt-12 grid gap-12 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-5">
          {site.bio.map((paragraph, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <p className="text-[15px] leading-relaxed text-muted sm:text-base">
                {paragraph}
              </p>
            </Reveal>
          ))}
        </div>

        <div className="space-y-4">
          <Reveal delay={0.1}>
            <div className="card rounded-2xl p-5">
              <div className="flex items-center gap-2 text-sm font-medium">
                <GraduationCap className="size-4 text-primary" />
                Education
              </div>
              <p className="mt-3 font-medium">{site.education.degree}</p>
              <p className="text-sm text-muted">{site.education.school}</p>
              <p className="mt-1 font-mono text-xs text-muted">{site.education.period}</p>
            </div>
          </Reveal>

          <Reveal delay={0.18}>
            <div className="card rounded-2xl p-5">
              <div className="flex items-center gap-2 text-sm font-medium">
                <BadgeCheck className="size-4 text-primary" />
                Certifications
              </div>
              <ul className="mt-3 space-y-2.5">
                {site.certifications.map((cert) => (
                  <li key={cert.name}>
                    <p className="text-sm font-medium">{cert.name}</p>
                    <p className="text-xs text-muted">{cert.issuer}</p>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.26}>
            <div className="card flex items-center gap-2 rounded-2xl p-5 text-sm text-muted">
              <MapPin className="size-4 text-primary" />
              Based in {site.location} · working remotely
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
