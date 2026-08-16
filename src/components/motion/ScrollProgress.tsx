"use client";

import { motion, useScroll, useSpring, useReducedMotion } from "motion/react";

/**
 * A one-pixel rule across the top that fills as you read. Functional rather
 * than decorative: on a long page it is the only thing telling you how much
 * is left, and it costs a single transform.
 */
export function ScrollProgress() {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 30,
    restDelta: 0.001,
  });

  if (reduced) return null;

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-px origin-left bg-accent print:hidden"
    />
  );
}
