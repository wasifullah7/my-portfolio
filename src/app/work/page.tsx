import type { Metadata } from "next";
import Link from "next/link";
import { projects } from "@/content/projects";
import { site } from "@/content/site";
import { Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Case studies",
  description:
    "Production AI case studies by Wasif Ullah: diagram recognition with RF-DETR and SAM2, sub-300ms voice agents, offline document intelligence and quantum grid optimisation.",
  alternates: { canonical: "/work" },
};

export default function WorkIndex() {
  const caseStudies = projects.filter((project) => project.problem);
  const others = projects.filter((project) => !project.problem);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Case studies, ${site.name}`,
    url: `${site.url}/work`,
    hasPart: caseStudies.map((project) => ({
      "@type": "CreativeWork",
      name: project.title,
      url: `${site.url}/work/${project.slug}`,
      description: project.blurb,
    })),
  };

  return (
    <div className="mx-auto max-w-[1400px] px-6 pb-28 pt-28 sm:px-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Reveal>
        <div className="rule-heavy pt-4">
          <div className="index-rule">
            <span className="tabular text-xs text-accent">04</span>
            <span className="label order-3">Case studies</span>
          </div>
        </div>

        <h1 className="display mt-8 text-[clamp(2.1rem,6vw,4.5rem)]">Case studies</h1>

        <p className="measure mt-7 text-lg leading-relaxed text-muted">
          Written up in full: the problem, the approach step by step, and the measured
          outcome. Every number comes from a system that shipped.
        </p>
      </Reveal>

      <div className="mt-16">
        {caseStudies.map((project, i) => (
          <Reveal key={project.slug} delay={i * 0.05}>
            <Link
              href={`/work/${project.slug}`}
              className="row rule-t group grid gap-4 py-8 lg:grid-cols-12 lg:gap-8"
            >
              <span className="tabular text-sm text-accent lg:col-span-1">
                {String(i + 1).padStart(2, "0")}
              </span>

              <span className="lg:col-span-7">
                <span className="block text-[1.2rem] leading-snug text-ink sm:text-[1.5rem]">
                  {project.title}
                </span>
                <span className="measure mt-2 block text-sm leading-relaxed text-muted">
                  {project.blurb}
                </span>
              </span>

              <span className="lg:col-span-3">
                {project.metrics ? (
                  <span className="flex flex-wrap gap-x-8 gap-y-2">
                    {project.metrics.map((metric) => (
                      <span key={metric.label} className="block">
                        <span className="tabular block text-lg text-accent">
                          {metric.value}
                        </span>
                        <span className="label mt-0.5 block">{metric.label}</span>
                      </span>
                    ))}
                  </span>
                ) : null}
              </span>

              <span className="mono text-xs text-faint lg:col-span-1 lg:text-right">
                {project.year}
              </span>
            </Link>
          </Reveal>
        ))}
        <div className="rule-t" />
      </div>

      {others.length ? (
        <Reveal>
          <section className="mt-20">
            <div className="index-rule">
              <span className="label order-3">Also built</span>
            </div>
            <ul className="mt-6">
              {others.map((project) => (
                <li
                  key={project.slug}
                  className="rule-t flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1 py-5"
                >
                  <span className="text-[0.9375rem] text-ink">{project.title}</span>
                  <span className="mono text-xs text-faint">{project.context}</span>
                </li>
              ))}
            </ul>
            <div className="rule-t" />
          </section>
        </Reveal>
      ) : null}
    </div>
  );
}
