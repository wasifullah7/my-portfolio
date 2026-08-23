"use client";

import { useEffect, useRef } from "react";

/**
 * The hero backdrop.
 *
 * At rest there is nothing: white page, black type, red numerals. A precise
 * grid is revealed only in a soft circle under the cursor, so the surface
 * exists exactly where the reader is looking and nowhere else. The lines are
 * dead straight and never move, because on a Swiss layout a wobbling rule
 * reads as a rendering fault rather than as motion.
 *
 * Deliberately not WebGL. This is two background gradients and a mask moved by
 * a CSS custom property, which the compositor handles on its own. It replaced
 * a three.js scene and took the whole 3D stack out of the bundle with it.
 */
export function HeroSpotlight() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let frame = 0;
    let x = 0;
    let y = 0;

    const paint = () => {
      frame = 0;
      el.style.setProperty("--mx", `${x}px`);
      el.style.setProperty("--my", `${y}px`);
    };

    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      x = event.clientX - rect.left;
      y = event.clientY - rect.top;
      if (!el.dataset.lit) {
        el.dataset.lit = "true";
        // Place it before the first paint so it fades in where the cursor is,
        // rather than sweeping across from the corner.
        el.style.setProperty("--mx", `${x}px`);
        el.style.setProperty("--my", `${y}px`);
      }
      if (!frame) frame = requestAnimationFrame(paint);
    };

    const onLeave = () => {
      delete el.dataset.lit;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <div ref={ref} aria-hidden className="hero-spotlight" />;
}
