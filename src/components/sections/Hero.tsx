import { ArrowDown, ArrowUpRight } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/BrandIcons";
import { site } from "@/content/site";
import { HeroCanvas } from "@/components/three/HeroCanvas";
import { TextReveal } from "@/components/motion/TextReveal";
import { Reveal } from "@/components/motion/Reveal";
import { Magnetic } from "@/components/motion/MagneticButton";

export function Hero() {
  return (
    <section
      id="home"
      className="glow-field relative flex min-h-[100svh] items-center overflow-hidden pt-16"
    >
      <div className="absolute inset-0 bg-grid" aria-hidden />
      <HeroCanvas />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 sm:px-8">
        <Reveal y={0}>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-3 py-1 text-xs text-muted backdrop-blur">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-70" />
              <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
            </span>
            {site.availability}
          </span>
        </Reveal>

        <h1 className="mt-6 max-w-4xl text-[clamp(2.4rem,7vw,5rem)] font-semibold leading-[1.02] tracking-tight">
          <TextReveal text={site.role} className="text-gradient" delay={0.1} />
        </h1>

        <Reveal delay={0.45}>
          <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-sm text-muted">
            {site.disciplines.map((item, i) => (
              <span key={item} className="flex items-center gap-3">
                {i > 0 ? <span className="text-border">/</span> : null}
                {item}
              </span>
            ))}
          </p>
        </Reveal>

        <Reveal delay={0.55}>
          <p className="balance mt-7 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            {site.tagline}
          </p>
        </Reveal>

        <Reveal delay={0.65}>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Magnetic>
              <a
                href="#work"
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-white transition-shadow hover:shadow-[0_0_32px_-4px_var(--primary)]"
              >
                View selected work
                <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-6 py-3 text-sm font-medium backdrop-blur transition-colors hover:border-primary hover:text-primary"
              >
                Get in touch
              </a>
            </Magnetic>

            <div className="ml-1 flex items-center gap-2">
              <a
                href={site.links.github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="grid size-11 place-items-center rounded-full border border-border text-muted transition-colors hover:border-primary hover:text-primary"
              >
                <GithubIcon className="size-4" />
              </a>
              <a
                href={site.links.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="grid size-11 place-items-center rounded-full border border-border text-muted transition-colors hover:border-primary hover:text-primary"
              >
                <LinkedinIcon className="size-4" />
              </a>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.8}>
          <dl className="mt-16 grid max-w-2xl grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3">
            {site.stats.map((stat) => (
              <div key={stat.label} className="bg-surface/70 px-5 py-4 backdrop-blur">
                <dt className="text-2xl font-semibold tracking-tight text-foreground">
                  {stat.value}
                </dt>
                <dd className="mt-0.5 text-xs text-muted">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>

      <a
        href="#about"
        aria-label="Scroll to about"
        className="absolute bottom-7 left-1/2 z-10 hidden -translate-x-1/2 text-muted transition-colors hover:text-primary md:block"
      >
        <ArrowDown className="size-5 animate-bounce" />
      </a>
    </section>
  );
}
