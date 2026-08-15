"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left";
};

/**
 * Wipes content into view with a clip-path inset rather than fading it.
 * The content itself never changes opacity, so images and type arrive at full
 * fidelity instead of ghosting in.
 */
export function ClipReveal({
  children,
  className,
  delay = 0,
  direction = "up",
}: Props) {
  const reduced = useReducedMotion();

  const hidden =
    direction === "up" ? "inset(100% 0% 0% 0%)" : "inset(0% 100% 0% 0%)";

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ clipPath: hidden }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 1.05, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
