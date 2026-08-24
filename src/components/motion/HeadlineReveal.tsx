"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

const WEIGHT = 900;

type Props = {
  lines: readonly string[];
  className?: string;
  lineClassName?: string;
  delay?: number;
};

/**
 * The headline. Each glyph rides up from behind its own line box on load, then
 * stops. Archivo is a variable font, so the weight is set on the axis directly
 * rather than left to the browser to synthesise.
 */
export function HeadlineReveal({ lines, className, lineClassName, delay = 0 }: Props) {
  const reduced = useReducedMotion();
  let index = 0;

  return (
    <span className={cn("block", className)} style={{ fontVariationSettings: `"wght" ${WEIGHT}` }}>
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
                    className="inline-block will-change-transform"
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
