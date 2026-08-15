"use client";

import { Canvas } from "@react-three/fiber";
import { useTheme } from "next-themes";
import { NodeGraph } from "./NodeGraph";

export default function HeroScene() {
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme === "dark";

  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 9], fov: 52 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        // Sits behind the type as texture, never competing with it.
        opacity: dark ? 0.55 : 0.4,
      }}
    >
      <NodeGraph
        nodeColor={dark ? "#e0703c" : "#a8431e"}
        edgeColor={dark ? "#6b5142" : "#b9ac97"}
      />
    </Canvas>
  );
}
