"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

type TextRevealProps = {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
};

/**
 * Per-word mask reveal. Each word sits in an overflow-hidden span and slides
 * up from below the line box.
 */
export function TextReveal({
  text,
  className,
  wordClassName,
  delay = 0,
}: TextRevealProps) {
  const reduced = useReducedMotion();
  const words = text.split(" ");

  if (reduced) return <span className={className}>{text}</span>;

  return (
    <span className={cn("inline-flex flex-wrap", className)}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="inline-block overflow-hidden pb-[0.12em] align-bottom"
        >
          <motion.span
            className={cn("inline-block", wordClassName)}
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            transition={{
              duration: 0.8,
              delay: delay + i * 0.055,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
