import { site } from "@/content/site";
import { HeroSpotlight } from "@/components/HeroSpotlight";
import { MagneticHeadline } from "@/components/motion/MagneticHeadline";
import { Reveal } from "@/components/motion/Reveal";
import { Counter } from "@/components/motion/Counter";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <section id="home" className="relative min-h-[100svh] overflow-hidden pt-24">
      <HeroSpotlight />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 sm:px-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(180px,220px)_1fr] lg:gap-16">
          {/* Instrument readout column */}
          <Reveal y={0} delay={0.9} className="order-2 lg:order-1 lg:pt-4">
            <dl className="space-y-6">
              {[
                { term: "Currently", value: site.currentRole },
                { term: "Based", value: site.location },
                { term: "Status", value: site.locationNote },
              ].map((item) => (
                <div key={item.term} className="rule-t pt-3">
                  <dt className="label">{item.term}</dt>
                  <dd className="mono mt-1.5 text-sm text-ink">{item.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <div className="order-1 lg:order-2">
            <h1 className="display text-[clamp(2.9rem,10.5vw,9.5rem)]">
              <MagneticHeadline lines={site.roleLines} delay={0.15} />
            </h1>

            <Reveal delay={0.75}>
              <div className="rule-t mt-8 flex flex-wrap gap-x-8 gap-y-2 pt-4">
                {site.disciplines.map((item) => (
                  <span key={item} className="label text-ink/70">
                    {item}
                  </span>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.85}>
              <p className="measure mt-8 text-[1.0625rem] leading-[1.65] text-muted sm:text-lg">
                {site.tagline}
              </p>
            </Reveal>

            <Reveal delay={0.95}>
              <div className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-4">
                <a
                  href="#work"
                  className="group mono inline-flex items-center gap-3 border border-ink px-6 py-3 text-xs uppercase tracking-[0.16em] transition-colors duration-300 hover:bg-ink hover:text-paper"
                >
                  Selected work
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                    &rarr;
                  </span>
                </a>
                <a
                  href="#contact"
                  className="link-underline mono text-xs uppercase tracking-[0.16em] text-muted transition-colors hover:text-ink"
                >
                  Get in touch
                </a>
                <a
                  href={site.resumePath}
                  download
                  className="link-underline mono text-xs uppercase tracking-[0.16em] text-muted transition-colors hover:text-ink"
                >
                  Résumé, PDF
                </a>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Measurement band */}
        <Reveal delay={1.05}>
          <div className="rule-t mt-16 grid grid-cols-2 lg:grid-cols-4">
            {site.stats.map((stat, i) => (
              <div
                key={stat.label}
                className={cn(
                  "py-6 pr-6 sm:pr-10",
                  i > 0 && "sm:pl-10 sm:border-l sm:border-rule",
                  i >= 2 && "rule-t lg:border-t-0",
                )}
              >
                <div className="tabular text-3xl font-medium tracking-tight text-accent sm:text-4xl">
                  <Counter
                    value={stat.value}
                    decimals={stat.decimals}
                    suffix={stat.suffix}
                  />
                </div>
                <div className="label mt-2 leading-relaxed">{stat.label}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
