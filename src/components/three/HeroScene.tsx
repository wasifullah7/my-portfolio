"use client";

import { Canvas } from "@react-three/fiber";
import { useTheme } from "next-themes";
import { NodeGraph } from "./NodeGraph";

export default function HeroScene() {
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme !== "light";

  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 9], fov: 52 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <NodeGraph
        nodeColor={dark ? "#5eb0ff" : "#0b73e8"}
        edgeColor={dark ? "#3f6fa8" : "#9dbde4"}
      />
    </Canvas>
  );
}
