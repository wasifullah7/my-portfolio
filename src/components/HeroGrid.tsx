"use client";

import { useEffect, useRef } from "react";

const SPACING = 68;
const SWEEP_SECONDS = 14;
const SWEEP_WIDTH = 230;

/**
 * The hero backdrop: drawing paper.
 *
 * A fixed hairline grid with a registration dot at each intersection, and one
 * slow vertical sweep that brightens the rules it passes over. The grid never
 * moves, because on a Swiss layout a wobbling rule reads as a rendering fault
 * rather than as motion. Only the sweep travels.
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
    let width = 0;
    let height = 0;
    let rule = "#e4e4e7";
    let accent = "229, 36, 27";
    let frame = 0;
    let start = 0;

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

    const draw = (now: number) => {
      frame = 0;
      if (!start) start = now;
      const progress = still ? -1 : ((now - start) / (SWEEP_SECONDS * 1000)) % 1;
      const sweep = progress * (width + SWEEP_WIDTH * 2) - SWEEP_WIDTH;

      ctx.clearRect(0, 0, width, height);

      // Distance from the sweep, eased, so rules near it lift toward the accent.
      const lift = (x: number) => {
        if (still) return 0;
        const t = Math.max(0, 1 - Math.abs(x - sweep) / SWEEP_WIDTH);
        return t * t * (3 - 2 * t);
      };

      ctx.lineWidth = 1;

      for (let x = SPACING; x < width; x += SPACING) {
        const l = lift(x);
        ctx.strokeStyle = l > 0.01 ? `rgba(${accent}, ${0.05 + l * 0.42})` : rule;
        ctx.beginPath();
        ctx.moveTo(x + 0.5, 0);
        ctx.lineTo(x + 0.5, height);
        ctx.stroke();
      }

      ctx.strokeStyle = rule;
      for (let y = SPACING; y < height; y += SPACING) {
        ctx.beginPath();
        ctx.moveTo(0, y + 0.5);
        ctx.lineTo(width, y + 0.5);
        ctx.stroke();
      }

      for (let x = SPACING; x < width; x += SPACING) {
        const l = lift(x);
        ctx.fillStyle = l > 0.01 ? `rgba(${accent}, ${0.15 + l * 0.55})` : rule;
        const size = 1 + l * 1.6;
        for (let y = SPACING; y < height; y += SPACING) {
          ctx.fillRect(x - size / 2, y - size / 2, size, size);
        }
      }

      if (!still && visible) frame = requestAnimationFrame(draw);
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };

    // Nothing below the fold needs a 60fps repaint of a grid nobody is looking at.
    let visible = true;
    const seen = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) {
          start = 0;
          schedule();
        } else if (frame) {
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

    // The theme toggle swaps a class on <html>, and the grid colour goes with it.
    const observer = new MutationObserver(() => {
      readTheme();
      schedule();
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
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
