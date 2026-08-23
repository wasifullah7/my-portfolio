"use client";

import { Canvas } from "@react-three/fiber";
import { useTheme } from "next-themes";
import { GridField } from "./GridField";

export default function HeroScene() {
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme === "dark";

  return (
    <Canvas
      orthographic
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 10], zoom: 46 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <GridField
        rule={dark ? "#3a3a42" : "#c9c9d2"}
        accent={dark ? "#ff3b2f" : "#e5241b"}
        opacity={dark ? 0.85 : 0.9}
      />
    </Canvas>
  );
}
