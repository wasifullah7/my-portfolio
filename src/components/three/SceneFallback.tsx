/**
 * Shown instead of the WebGL scene on small screens, when reduced motion is
 * requested, or before the canvas mounts. Pure CSS — three.js is never
 * downloaded in these cases.
 */
export function SceneFallback() {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(circle at 18% 22%, var(--glow-a), transparent 55%), radial-gradient(circle at 78% 30%, var(--glow-b), transparent 55%)",
        }}
      />
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.16]"
        viewBox="0 0 800 400"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern id="dots" width="36" height="36" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.6" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="800" height="400" fill="url(#dots)" className="text-primary" />
      </svg>
    </div>
  );
}
