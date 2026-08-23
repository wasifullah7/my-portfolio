import { existsSync } from "node:fs";
import { join } from "node:path";
import type { Project } from "@/content/projects";
import { diagrams } from "@/content/diagrams";
import { ProjectDiagramCard } from "./ProjectDiagramCard";
import imageAlt from "@/content/image-alt.json";

/**
 * Resolves a configured path against what is actually on disk, trying the usual
 * encodings. Saving a PNG straight out of a browser is the common case, and
 * having it silently not appear because the path ends in .webp is a trap.
 *
 * This is existsSync rather than an <img> onError handler. Every project carries
 * an image path but most point at files that do not exist yet, and letting the
 * browser discover that meant serving a broken image and swapping it out once
 * the 404 came back. Deciding here puts the right thing in the HTML from the
 * start. Drop a file into /public/projects and it takes over on the next build.
 */
export function resolveImage(image: string | undefined): string | undefined {
  if (!image) return undefined;
  const rel = image.replace(/^\//, "");
  const candidates = [
    rel,
    ...[".webp", ".png", ".jpg", ".jpeg"].map((ext) => rel.replace(/\.[a-z]+$/i, ext)),
  ];
  for (const candidate of candidates) {
    if (existsSync(join(process.cwd(), "public", candidate))) return "/" + candidate;
  }
  return undefined;
}

/**
 * What sits in a project's media slot, in order of preference:
 *
 *   1. a real image of the work, if the file is actually on disk
 *   2. the project's architecture, drawn compactly
 *   3. a hatched plate, so the layout never shows a hole
 */
export function ProjectMedia({ project }: { project: Project }) {
  const resolved = resolveImage(project.image);

  if (resolved) {
    // Contained, not cropped. These are diagrams, dashboards and charts rather
    // than photographs, so object-cover would cut the sides off and take the
    // labels with them. Letterboxing on the panel ground keeps them readable.
    const described = (imageAlt as Record<string, string>)[resolved];
    return (
      <div className="flex aspect-[4/3] w-full items-center justify-center overflow-hidden bg-paper-2 p-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={resolved}
          alt={described || project.title}
          loading="lazy"
          className="max-h-full max-w-full object-contain"
        />
      </div>
    );
  }

  if (diagrams[project.slug]) {
    return <ProjectDiagramCard slug={project.slug} stack={project.stack} />;
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
