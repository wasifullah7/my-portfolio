import { diagrams } from "@/content/diagrams";

/**
 * The compact form of a project's architecture, sized for the 4:3 media slot
 * beside a project row.
 *
 * The full <ProjectDiagram> cannot be reused here. It lays three columns across
 * 1000 units, and squeezed into this slot its 15px labels land near 9px, which
 * is unreadable. So the same stages run down a single column instead, at a
 * viewBox close to the rendered size so the type stays honest.
 *
 * Colours and fonts come from .project-diagram in globals.css, for the same
 * reason as the full diagram: var() does not resolve inside SVG presentation
 * attributes, so everything is driven by class.
 */

const W = 600;
const H = 450;
const PAD_X = 30;
const PAD_TOP = 34;
const PAD_BOTTOM = 46;
const RAIL_X = PAD_X + 4;
const TEXT_X = RAIL_X + 20;

/** Roughly 11px JetBrains Mono across the width left for a note. */
const NOTE_CHARS = 52;

export function ProjectDiagramCard({
  slug,
  stack,
}: {
  slug: string;
  stack: string[];
}) {
  const stages = diagrams[slug];
  if (!stages || stages.length === 0) return null;

  const step = (H - PAD_TOP - PAD_BOTTOM) / stages.length;
  const centreOf = (i: number) => PAD_TOP + step * i + step / 2;
  const first = centreOf(0);
  const last = centreOf(stages.length - 1);

  return (
    <div className="project-diagram aspect-[4/3] w-full bg-paper-2">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-full w-full"
        role="img"
        aria-label={`${slug} architecture: ${stages.map((s) => s.label).join(", then ")}`}
      >
        {/* One rail behind the whole run, so the stages read as a sequence
            rather than as an unordered list. */}
        <path className="d-rail" d={`M${RAIL_X} ${first} V${last}`} />

        {stages.map((stage, i) => {
          const y = centreOf(i);
          const note =
            stage.note && stage.note.length <= NOTE_CHARS ? stage.note : undefined;
          return (
            <g key={stage.label}>
              <circle
                className={stage.accent ? "d-node d-node-accent" : "d-node"}
                cx={RAIL_X}
                cy={y}
                r={3.5}
              />
              <text
                className={stage.accent ? "d-label d-label-accent" : "d-label"}
                x={TEXT_X}
                y={note ? y - 2 : y + 5}
              >
                {stage.label}
              </text>
              {note ? (
                <text className="d-note" x={TEXT_X} y={y + 15}>
                  {note}
                </text>
              ) : null}
            </g>
          );
        })}

        <text className="d-eyebrow" x={PAD_X} y={H - 20}>
          {stack.slice(0, 3).join("  /  ")}
        </text>
      </svg>
    </div>
  );
}
