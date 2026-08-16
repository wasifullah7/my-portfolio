"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { SceneFallback } from "./SceneFallback";

// ssr:false keeps three.js out of the server render and off the critical path.
const HeroScene = dynamic(() => import("./HeroScene"), {
  ssr: false,
  loading: () => <SceneFallback />,
});

/**
 * Decides whether this visitor gets WebGL at all. Phones and reduced-motion
 * users get the CSS fallback and never pay for the three.js chunk.
 *
 * The scene also recedes as you scroll out of the hero. It is background
 * texture for the headline, not something to keep looking at, and fading it
 * hands attention to the content below instead of competing with it.
 */
export function HeroCanvas() {
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const reduced = useReducedMotion();

  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.matchMedia("(max-width: 767px)").matches;

    let webgl = false;
    try {
      const canvas = document.createElement("canvas");
      webgl = Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
    } catch {
      webgl = false;
    }

    setEnabled(!reducedMotion && !small && webgl);
  }, []);

  return (
    <motion.div
      aria-hidden
      className="absolute inset-0"
      style={reduced ? undefined : { opacity }}
    >
      {enabled === true ? <HeroScene /> : <SceneFallback />}
    </motion.div>
  );
}
