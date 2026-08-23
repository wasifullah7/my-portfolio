import { existsSync } from "node:fs";
import { join } from "node:path";
import type { Project } from "@/content/projects";
import { diagrams } from "@/content/diagrams";
import { ProjectDiagramCard } from "./ProjectDiagramCard";

/**
 * What sits in a project's media slot, in order of preference:
 *
 *   1. a real screenshot, if the file is actually on disk
 *   2. the project's architecture, drawn compactly
 *   3. a hatched plate, so the layout never shows a hole
 *
 * The screenshot check is existsSync rather than an <img> onError handler. Every
 * project carries an image path, but most point at files that do not exist yet,
 * and letting the browser discover that meant serving a broken image and
 * swapping it out after the 404 came back. Resolving it here means the right
 * thing is in the HTML from the start. Drop a file into /public/projects and it
 * takes over on the next build, with nothing else to change.
 */
export function ProjectMedia({ project }: { project: Project }) {
  const hasScreenshot =
    !!project.image &&
    existsSync(join(process.cwd(), "public", project.image.replace(/^\//, "")));

  if (hasScreenshot) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={project.image}
        alt={`${project.title} interface`}
        loading="lazy"
        className="aspect-[4/3] w-full object-cover"
      />
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
