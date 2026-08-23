/**
 * Shown instead of the WebGL grid on small screens, when reduced motion is
 * requested, or before the canvas mounts. Pure CSS, so three.js is never
 * downloaded in those cases. Matches the shader's resting state: a fine ruled
 * grid that stays out of the middle where the headline sits.
 */
export function SceneFallback() {
  return (
    <div
      aria-hidden
      className="absolute inset-0"
      style={{
        backgroundImage:
          "linear-gradient(to right, var(--rule) 1px, transparent 1px), linear-gradient(to bottom, var(--rule) 1px, transparent 1px)",
        backgroundSize: "56px 56px",
        opacity: 0.5,
        maskImage:
          "radial-gradient(ellipse 46% 42% at 46% 52%, transparent 25%, #000 78%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 46% 42% at 46% 52%, transparent 25%, #000 78%)",
      }}
    />
  );
}
