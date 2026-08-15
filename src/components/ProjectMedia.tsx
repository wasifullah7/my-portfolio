"use client";

import { useState } from "react";
import type { Project } from "@/content/projects";

/**
 * Screenshot with a designed fallback. Real files dropped into /public/projects
 * swap in automatically; until then the plate renders, so the layout never
 * shows a broken image.
 */
export function ProjectMedia({ project }: { project: Project }) {
  const [failed, setFailed] = useState(false);

  if (project.image && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={project.image}
        alt={`${project.title} interface`}
        loading="lazy"
        onError={() => setFailed(true)}
        className="aspect-[4/3] w-full object-cover"
      />
    );
  }

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden bg-paper-2">
      <svg
        aria-hidden
        className="absolute inset-0 h-full w-full text-rule"
        preserveAspectRatio="none"
        viewBox="0 0 400 300"
      >
        <defs>
          <pattern id={`hatch-${project.slug}`} width="7" height="7" patternUnits="userSpaceOnUse">
            <line x1="0" y1="7" x2="7" y2="0" stroke="currentColor" strokeWidth="0.6" />
          </pattern>
        </defs>
        <rect width="400" height="300" fill={`url(#hatch-${project.slug})`} />
        <line x1="0" y1="0" x2="400" y2="300" stroke="currentColor" strokeWidth="0.6" />
        <line x1="400" y1="0" x2="0" y2="300" stroke="currentColor" strokeWidth="0.6" />
      </svg>
      <div className="absolute inset-0 flex items-end p-5">
        <span className="mono text-[0.6875rem] uppercase tracking-[0.16em] text-faint">
          {project.stack.slice(0, 3).join(" / ")}
        </span>
      </div>
    </div>
  );
}
