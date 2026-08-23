"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
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
 * The scene recedes as you scroll out of the hero, but that fade is a native
 * CSS scroll-driven animation rather than a scroll listener. It runs on the
 * compositor, so it stays smooth even while the main thread is busy, and it
 * costs no JavaScript at all. Browsers without support simply keep the
 * backdrop, which is a fine resting state.
 */
export function HeroCanvas() {
  const [enabled, setEnabled] = useState<boolean | null>(null);

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
    <div aria-hidden className="hero-backdrop absolute inset-0">
      {enabled === true ? <HeroScene /> : <SceneFallback />}
    </div>
  );
}
