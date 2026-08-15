"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { GithubIcon } from "@/components/BrandIcons";
import type { Project } from "@/content/projects";

/**
 * Screenshot with a designed fallback. Real files dropped into
 * /public/projects swap in automatically; until then the motif renders.
 */
function Cover({ project }: { project: Project }) {
  const [failed, setFailed] = useState(false);

  if (project.image && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={project.image}
        alt={`${project.title} interface`}
        loading="lazy"
        onError={() => setFailed(true)}
        className="size-full object-cover"
      />
    );
  }

  return (
    <div className="relative grid size-full place-items-center overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 25% 25%, var(--glow-a), transparent 60%), radial-gradient(circle at 75% 70%, var(--glow-b), transparent 60%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--grid) 1px, transparent 1px), linear-gradient(to bottom, var(--grid) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <span className="relative font-mono text-xs tracking-widest text-muted">
        {project.stack.slice(0, 3).join("  ·  ")}
      </span>
    </div>
  );
}

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rx = useSpring(useTransform(py, [-0.5, 0.5], ["6deg", "-6deg"]), {
    stiffness: 200,
    damping: 20,
  });
  const ry = useSpring(useTransform(px, [-0.5, 0.5], ["-6deg", "6deg"]), {
    stiffness: 200,
    damping: 20,
  });

  return (
    <motion.article
      ref={ref}
      initial={reduced ? false : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: (index % 2) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      onPointerMove={(event) => {
        if (reduced || !ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        px.set((event.clientX - rect.left) / rect.width - 0.5);
        py.set((event.clientY - rect.top) / rect.height - 0.5);
      }}
      onPointerLeave={() => {
        px.set(0);
        py.set(0);
      }}
      style={reduced ? undefined : { rotateX: rx, rotateY: ry, transformPerspective: 1200 }}
      className="card card-lit group flex h-full flex-col overflow-hidden rounded-3xl"
    >
      <div className="relative aspect-[16/9] overflow-hidden border-b border-border bg-surface-2">
        <Cover project={project} />
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-[11px] uppercase tracking-widest text-primary">
            {project.context}
          </span>
          <span className="font-mono text-[11px] text-muted">{project.year}</span>
        </div>

        <h3 className="mt-3 text-xl font-medium tracking-tight">{project.title}</h3>
        <p className="mt-2.5 text-sm leading-relaxed text-muted">{project.blurb}</p>

        {project.metrics ? (
          <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
            {project.metrics.map((metric) => (
              <div key={metric.label}>
                <dt className="text-lg font-semibold tracking-tight">{metric.value}</dt>
                <dd className="text-[11px] text-muted">{metric.label}</dd>
              </div>
            ))}
          </dl>
        ) : null}

        <ul className="mt-5 space-y-2">
          {project.highlights.map((highlight) => (
            <li key={highlight} className="flex gap-2.5 text-[13px] leading-relaxed text-muted">
              <span aria-hidden className="mt-1.5 size-1 shrink-0 rounded-full bg-primary" />
              {highlight}
            </li>
          ))}
        </ul>

        <ul className="mt-6 flex flex-wrap gap-1.5">
          {project.stack.map((tech) => (
            <li
              key={tech}
              className="rounded-full border border-border bg-surface-2 px-2.5 py-1 font-mono text-[11px] text-muted"
            >
              {tech}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-6">
          {project.demoUrl ? (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-medium text-white transition-shadow hover:shadow-[0_0_24px_-6px_var(--primary)]"
            >
              Live demo <ArrowUpRight className="size-3.5" />
            </a>
          ) : null}
          {project.repoUrl ? (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-medium transition-colors hover:border-primary hover:text-primary"
            >
              <GithubIcon className="size-3.5" /> Source
            </a>
          ) : null}
          {!project.repoUrl && !project.demoUrl ? (
            <span className="font-mono text-[11px] text-muted">
              Proprietary — details on request
            </span>
          ) : null}
        </div>
      </div>
    </motion.article>
  );
}
