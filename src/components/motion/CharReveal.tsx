"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

type Props = {
  lines: readonly string[];
  className?: string;
  lineClassName?: string;
  delay?: number;
};

/**
 * Per-character mask reveal. Each glyph rides up from beneath its own line box,
 * staggered across the line. Distinct from a fade: nothing changes opacity, so
 * the type stays crisp and the motion reads as mechanical rather than soft.
 */
export function CharReveal({ lines, className, lineClassName, delay = 0 }: Props) {
  const reduced = useReducedMotion();
  let globalIndex = 0;

  return (
    <span className={cn("block", className)}>
      {/* Split glyphs are decorative: a screen reader would otherwise spell
          the headline out one letter at a time. */}
      <span className="sr-only">{lines.join(" ")}</span>

      <span aria-hidden className="block">
        {lines.map((line, lineIndex) => (
        <span key={lineIndex} className={cn("block overflow-hidden", lineClassName)}>
          <span className="inline-block pb-[0.06em]">
            {Array.from(line).map((char, charIndex) => {
              const i = globalIndex++;
              if (reduced) {
                return (
                  <span key={charIndex} className="inline-block">
                    {char === " " ? " " : char}
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
                  {char === " " ? " " : char}
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
