"use client";

import { Canvas } from "@react-three/fiber";
import { useTheme } from "next-themes";
import { FlowField } from "./FlowField";

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
      <FlowField
        ink={dark ? "#8b8b93" : "#12121a"}
        accent={dark ? "#ff3b2f" : "#e5241b"}
        opacity={dark ? 0.5 : 0.34}
      />
    </Canvas>
  );
}
