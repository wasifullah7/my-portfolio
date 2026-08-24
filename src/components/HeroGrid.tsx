"use client";

import { useEffect, useRef } from "react";

const SPACING = 68;
const DRIFT_SECONDS = 14;
const REACH = 230; // px either side of the cursor at which a rule stops reacting
const EASE = 0.09; // how hard the sweep chases the pointer
const IDLE_MS = 2200; // still cursor for this long and the drift takes back over

/**
 * The hero backdrop: drawing paper.
 *
 * A fixed hairline grid with a registration dot at each intersection. The rules
 * nearest the cursor take the accent, so the sheet reads as a plotter tracking
 * the reader rather than as a glow following them. Lines only, no radial wash.
 *
 * The grid itself never moves, because on a Swiss layout a wobbling rule reads
 * as a rendering fault rather than as motion. When the cursor goes still or
 * leaves, the highlight eases back into a slow sweep of its own so the surface
 * is never completely dead.
 *
 * 2D canvas rather than WebGL, so the 3D stack stays out of the bundle.
 */
export function HeroGrid() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tracks = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    let width = 0;
    let height = 0;
    let rule = "#e4e4e7";
    let accent = "229, 36, 27";
    let frame = 0;
    let start = 0;
    let visible = true;

    let sweepX = -1; // eased, -1 until the first frame seeds it from the drift
    let sweepY = 0;
    let pointerX = 0;
    let pointerY = 0;
    let movedAt = 0;
    let attention = 0; // 0 drifting, 1 fully following the cursor

    const readTheme = () => {
      const style = getComputedStyle(document.documentElement);
      rule = style.getPropertyValue("--rule").trim() || rule;
      const hex = style.getPropertyValue("--accent").trim();
      const m = /^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(hex);
      if (m) accent = `${parseInt(m[1], 16)}, ${parseInt(m[2], 16)}, ${parseInt(m[3], 16)}`;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const smooth = (t: number) => t * t * (3 - 2 * t);
    const falloff = (a: number, b: number) => {
      const t = Math.max(0, 1 - Math.abs(a - b) / REACH);
      return smooth(t);
    };

    const draw = (now: number) => {
      frame = 0;
      if (!start) start = now;

      const drift = (((now - start) / (DRIFT_SECONDS * 1000)) % 1) * (width + REACH * 2) - REACH;
      if (sweepX < 0) {
        sweepX = drift;
        sweepY = height / 2;
      }

      const following = tracks && now - movedAt < IDLE_MS;
      attention += ((following ? 1 : 0) - attention) * 0.05;

      const targetX = following ? pointerX : drift;
      sweepX += (targetX - sweepX) * EASE;
      sweepY += (pointerY - sweepY) * EASE;

      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = 1;

      for (let x = SPACING; x < width; x += SPACING) {
        const l = falloff(x, sweepX);
        ctx.strokeStyle = l > 0.01 ? `rgba(${accent}, ${0.05 + l * 0.42})` : rule;
        ctx.beginPath();
        ctx.moveTo(x + 0.5, 0);
        ctx.lineTo(x + 0.5, height);
        ctx.stroke();
      }

      // A lit horizontal rule would run the full width and underline whatever
      // text it crossed, so it is faded out either side of the cursor instead.
      // The result is a crosshair rather than a ruled line.
      for (let y = SPACING; y < height; y += SPACING) {
        ctx.strokeStyle = rule;
        ctx.beginPath();
        ctx.moveTo(0, y + 0.5);
        ctx.lineTo(width, y + 0.5);
        ctx.stroke();

        const l = falloff(y, sweepY) * attention;
        if (l <= 0.01) continue;
        const wash = ctx.createLinearGradient(sweepX - REACH, 0, sweepX + REACH, 0);
        wash.addColorStop(0, `rgba(${accent}, 0)`);
        wash.addColorStop(0.5, `rgba(${accent}, ${l * 0.42})`);
        wash.addColorStop(1, `rgba(${accent}, 0)`);
        ctx.strokeStyle = wash;
        ctx.beginPath();
        ctx.moveTo(Math.max(0, sweepX - REACH), y + 0.5);
        ctx.lineTo(Math.min(width, sweepX + REACH), y + 0.5);
        ctx.stroke();
      }

      for (let x = SPACING; x < width; x += SPACING) {
        const lx = falloff(x, sweepX);
        for (let y = SPACING; y < height; y += SPACING) {
          const l = Math.max(lx, falloff(y, sweepY) * attention * lx);
          ctx.fillStyle = l > 0.01 ? `rgba(${accent}, ${0.15 + l * 0.55})` : rule;
          const size = 1 + l * 1.6;
          ctx.fillRect(x - size / 2, y - size / 2, size, size);
        }
      }

      if (!still && visible) frame = requestAnimationFrame(draw);
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };

    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointerX = event.clientX - rect.left;
      pointerY = event.clientY - rect.top;
      movedAt = performance.now();
      schedule();
    };

    const onLeave = () => {
      movedAt = 0;
    };

    // Nothing below the fold needs a 60fps repaint of a grid nobody is looking at.
    const seen = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) schedule();
        else if (frame) {
          cancelAnimationFrame(frame);
          frame = 0;
        }
      },
      { threshold: 0 },
    );
    seen.observe(canvas);

    readTheme();
    resize();
    schedule();

    const onResize = () => {
      resize();
      schedule();
    };
    window.addEventListener("resize", onResize);
    if (tracks && !still) {
      window.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerleave", onLeave);
    }

    // The theme toggle swaps a class on <html>, and the grid colour goes with it.
    const observer = new MutationObserver(() => {
      readTheme();
      schedule();
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      seen.disconnect();
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full [mask-image:linear-gradient(to_bottom,transparent,#000_14%,#000_46%,transparent_72%)]"
    />
  );
}
