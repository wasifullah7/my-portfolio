"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

const REST_WEIGHT = 680;
const PEAK_WEIGHT = 900;
const RADIUS = 190; // px from the cursor at which a glyph stops reacting

type Props = {
  lines: readonly string[];
  className?: string;
  lineClassName?: string;
  delay?: number;
};

/**
 * The headline, and the only interactive thing in the hero.
 *
 * Two behaviours in one component so the entrance and the interaction cannot
 * fight each other. First each glyph rides up from behind its own line box.
 * Then the type responds to the cursor: Archivo is served as a variable font
 * with a continuous 100 to 900 weight axis, so glyphs near the pointer thicken
 * and glyphs further away stay light. On a page whose whole design is
 * typography, making the type itself the interaction is the honest choice.
 *
 * Skipped entirely for reduced-motion visitors and for coarse pointers, where
 * there is no cursor to track and the weight would just flicker on tap.
 */
export function MagneticHeadline({ lines, className, lineClassName, delay = 0 }: Props) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const root = rootRef.current;
    if (!root) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const glyphs = Array.from(
      root.querySelectorAll<HTMLElement>("[data-glyph]"),
    );
    if (!glyphs.length) return;

    // Cache glyph centres. Measuring inside the pointer handler would force
    // layout on every mouse move.
    let centres: { x: number; y: number }[] = [];
    const measure = () => {
      centres = glyphs.map((el) => {
        const r = el.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      });
    };

    let frame = 0;
    let pointerX = -9999;
    let pointerY = -9999;

    const paint = () => {
      frame = 0;
      for (let i = 0; i < glyphs.length; i++) {
        const c = centres[i];
        if (!c) continue;
        const dx = c.x - pointerX;
        const dy = c.y - pointerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        // Ease the falloff so the effect has a soft shoulder, not a hard edge.
        const t = Math.max(0, 1 - distance / RADIUS);
        const eased = t * t * (3 - 2 * t);
        const weight = Math.round(REST_WEIGHT + (PEAK_WEIGHT - REST_WEIGHT) * eased);
        glyphs[i].style.fontVariationSettings = `"wght" ${weight}`;
      }
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };

    const onPointerMove = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      schedule();
    };

    const onPointerLeave = () => {
      pointerX = -9999;
      pointerY = -9999;
      schedule();
    };

    // Let the entrance finish before measuring, or every centre is wrong.
    const settle = window.setTimeout(measure, (delay + 1.2) * 1000);

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, { passive: true });

    return () => {
      window.clearTimeout(settle);
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure);
    };
  }, [reduced, delay]);

  let index = 0;

  return (
    <span ref={rootRef} className={cn("block", className)}>
      {/* Split glyphs are decorative: a screen reader would otherwise spell
          the headline out one letter at a time. */}
      <span className="sr-only">{lines.join(" ")}</span>

      <span aria-hidden className="block">
        {lines.map((line, lineIndex) => (
          <span key={lineIndex} className={cn("block overflow-hidden", lineClassName)}>
            <span className="inline-block pb-[0.06em]">
              {Array.from(line).map((char, charIndex) => {
                const i = index++;
                const content = char === " " ? " " : char;

                if (reduced) {
                  return (
                    <span key={charIndex} className="inline-block">
                      {content}
                    </span>
                  );
                }

                return (
                  <motion.span
                    key={charIndex}
                    data-glyph
                    className="inline-block will-change-transform"
                    style={{ fontVariationSettings: `"wght" ${REST_WEIGHT}` }}
                    initial={{ y: "105%" }}
                    animate={{ y: 0 }}
                    transition={{
                      duration: 0.95,
                      delay: delay + i * 0.028,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    {content}
                  </motion.span>
                );
              })}
            </span>
          </span>
        ))}
      </span>
    </span>
  );
}
