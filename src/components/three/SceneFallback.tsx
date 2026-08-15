/**
 * Shown instead of the WebGL scene on small screens, when reduced motion is
 * requested, or before the canvas mounts. Pure SVG, so three.js is never
 * downloaded in those cases.
 */
export function SceneFallback() {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      <svg
        className="absolute inset-0 h-full w-full text-accent opacity-[0.13]"
        viewBox="0 0 900 600"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern id="node-dots" width="46" height="46" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="900" height="600" fill="url(#node-dots)" />
        <g stroke="currentColor" strokeWidth="0.7" opacity="0.55">
          <line x1="140" y1="120" x2="324" y2="212" />
          <line x1="324" y1="212" x2="508" y2="166" />
          <line x1="508" y1="166" x2="646" y2="304" />
          <line x1="324" y1="212" x2="278" y2="396" />
          <line x1="278" y1="396" x2="462" y2="442" />
          <line x1="646" y1="304" x2="784" y2="212" />
        </g>
      </svg>
    </div>
  );
}
