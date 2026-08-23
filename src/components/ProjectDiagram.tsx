import { diagrams, type DiagramStage } from "@/content/diagrams";

/**
 * Draws a project's architecture as SVG.
 *
 * The SVG is inlined rather than referenced through <img> so it can read the
 * page's custom properties and follow the theme toggle. That also means colours
 * and fonts have to come from real CSS rules, not presentation attributes:
 * var() does not resolve inside fill="" or font-family="". Everything here
 * carries a class, and .project-diagram in globals.css supplies the paint.
 */

const COLS = 3;
const BOX_W = 300;
const BOX_H = 88;
const GAP_X = 40;
const GAP_Y = 56;
const PAD = 10;
const WIDTH = PAD * 2 + COLS * BOX_W + (COLS - 1) * GAP_X;
const HEAD_H = 34;

/** Roughly 11.5px JetBrains Mono across BOX_W minus the box padding. */
const NOTE_CHARS = 36;

function wrap(text: string, limit: number): string[] {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(" ")) {
    if (line && (line + " " + word).length > limit) {
      lines.push(line);
      line = word;
    } else {
      line = line ? line + " " + word : word;
    }
  }
  if (line) lines.push(line);
  // Two lines is all the box has room for. Longer notes are an authoring bug,
  // so let it show rather than silently truncating mid-thought.
  return lines.slice(0, 2);
}

const colOf = (i: number) => i % COLS;
const rowOf = (i: number) => Math.floor(i / COLS);
const xOf = (i: number) => PAD + colOf(i) * (BOX_W + GAP_X);
const yOf = (i: number) => HEAD_H + rowOf(i) * (BOX_H + GAP_Y);

export function ProjectDiagram({
  slug,
  title,
  year,
}: {
  slug: string;
  title: string;
  year: string;
}) {
  const stages: DiagramStage[] | undefined = diagrams[slug];
  if (!stages || stages.length === 0) return null;

  const rows = Math.ceil(stages.length / COLS);
  const height = HEAD_H + rows * BOX_H + (rows - 1) * GAP_Y + PAD;

  const links = stages.slice(0, -1).map((_, i) => {
    const next = i + 1;
    const sameRow = rowOf(i) === rowOf(next);

    if (sameRow) {
      // A straight run between neighbours, arrowhead just short of the box.
      const x1 = xOf(i) + BOX_W;
      const x2 = xOf(next);
      const y = yOf(i) + BOX_H / 2;
      return <path key={i} className="d-link" d={`M${x1} ${y} H${x2 - 7}`} />;
    }

    // Row break: drop out of the bottom of the last box, run back across the
    // gutter, and come down into the top of the first box on the next row.
    const x1 = xOf(i) + BOX_W / 2;
    const y1 = yOf(i) + BOX_H;
    const x2 = xOf(next) + BOX_W / 2;
    const y2 = yOf(next);
    const mid = y1 + GAP_Y / 2;
    const r = 10;
    const dir = x2 < x1 ? -1 : 1;
    return (
      <path
        key={i}
        className="d-link"
        d={
          `M${x1} ${y1} V${mid - r} ` +
          `Q${x1} ${mid} ${x1 + dir * r} ${mid} ` +
          `H${x2 - dir * r} ` +
          `Q${x2} ${mid} ${x2} ${mid + r} ` +
          `V${y2 - 7}`
        }
      />
    );
  });

  return (
    // No margin of its own: the caller supplies the spacing, and a margin here
    // collapses against it, which shifts the figure out from under ClipReveal’s
    // clip path and slices the top row off.
    <figure className="project-diagram project-diagram-wide not-prose overflow-x-auto">
      <svg
        viewBox={`0 0 ${WIDTH} ${height}`}
        width={WIDTH}
        height={height}
        role="img"
        aria-labelledby={`${slug}-diagram-title ${slug}-diagram-desc`}
      >
        <title id={`${slug}-diagram-title`}>{`${title}: system architecture`}</title>
        <desc id={`${slug}-diagram-desc`}>
          {stages
            .map((s) => (s.note ? `${s.label}, ${s.note}` : s.label))
            .join(". Then ")}
          .
        </desc>

        <defs>
          <marker
            id={`${slug}-arrow`}
            markerWidth="7"
            markerHeight="7"
            refX="6"
            refY="3.5"
            orient="auto"
          >
            <path className="d-head" d="M0 0 L7 3.5 L0 7 z" />
          </marker>
        </defs>

        <text className="d-eyebrow" x={PAD} y={14}>
          {title}
        </text>
        <text className="d-eyebrow" x={WIDTH - PAD} y={14} textAnchor="end">
          {year}
        </text>
        <path className="d-rule" d={`M${PAD} ${HEAD_H - 14} H${WIDTH - PAD}`} />

        <g markerEnd={`url(#${slug}-arrow)`}>{links}</g>

        {stages.map((stage, i) => {
          const x = xOf(i);
          const y = yOf(i);
          const noteLines = stage.note ? wrap(stage.note, NOTE_CHARS) : [];
          // Centre the block vertically, since notes run to one or two lines.
          const top = y + (BOX_H - (22 + noteLines.length * 15)) / 2 + 16;
          return (
            <g key={stage.label}>
              <rect
                className={stage.accent ? "d-box d-box-accent" : "d-box"}
                x={x}
                y={y}
                width={BOX_W}
                height={BOX_H}
              />
              <text
                className={stage.accent ? "d-label d-label-accent" : "d-label"}
                x={x + 18}
                y={top}
              >
                {stage.label}
              </text>
              {noteLines.map((line, n) => (
                <text className="d-note" key={line} x={x + 18} y={top + 20 + n * 15}>
                  {line}
                </text>
              ))}
            </g>
          );
        })}
      </svg>
    </figure>
  );
}
