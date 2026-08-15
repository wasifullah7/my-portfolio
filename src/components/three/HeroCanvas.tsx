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
 */
export function HeroCanvas() {
  const [enabled, setEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.matchMedia("(max-width: 767px)").matches;

    let webgl = false;
    try {
      const canvas = document.createElement("canvas");
      webgl = Boolean(
        canvas.getContext("webgl2") ?? canvas.getContext("webgl"),
      );
    } catch {
      webgl = false;
    }

    setEnabled(!reduced && !small && webgl);
  }, []);

  if (enabled !== true) return <SceneFallback />;
  return <HeroScene />;
}
