"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Drafting paper, very quietly alive.
 *
 * A single full-bleed quad draws a fine measured grid. A slow wave passes
 * through it so the rules breathe rather than sit still, and the cursor bends
 * the grid around itself like a lens over paper. The centre, where the
 * headline and the paragraph sit, is masked clean, so the backdrop is only
 * ever visible in the margins.
 *
 * One quad, one draw call, all of it in the fragment shader. Deliberately
 * restrained: on a page built from rules and measurements, the backdrop should
 * read as the drawing surface, not as texture laid on top of it.
 */

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragment = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec2  uPointer;
  uniform float uPointerOn;
  uniform vec2  uSpan;
  uniform float uCell;
  uniform vec3  uRule;
  uniform vec3  uAccent;
  uniform float uOpacity;

  varying vec2 vUv;

  void main() {
    vec2 p = (vUv - 0.5) * uSpan;

    // A slow swell moving through the sheet. Small enough that you notice it
    // only if you look, which is the point.
    float t = uTime * 0.11;
    p.x += sin(p.y * 0.22 + t) * 0.30;
    p.y += cos(p.x * 0.18 - t * 0.75) * 0.24;

    // The cursor pulls the rules toward it, the way a lens would.
    vec2  toPointer = p - uPointer;
    float dist = length(toPointer);
    float lens = uPointerOn * smoothstep(5.0, 0.0, dist);
    p -= normalize(toPointer + 1e-5) * lens * lens * 1.15;

    // Fine grid. No derivatives, so line weight stays identical everywhere.
    vec2 minor = abs(fract(p / uCell) - 0.5);
    float minorLine = smoothstep(0.5 - 0.035, 0.5, max(minor.x, minor.y));

    // Every fifth rule is heavier, the way ruled paper is measured.
    vec2 major = abs(fract(p / (uCell * 5.0)) - 0.5);
    float majorLine = smoothstep(0.5 - 0.012, 0.5, max(major.x, major.y));

    float grid = max(minorLine * 0.55, majorLine);

    // Keep the middle clear. The headline and the paragraph live there and
    // nothing should compete with them.
    vec2 fromCentre = (vUv - vec2(0.46, 0.52)) * vec2(1.35, 1.0);
    float clearing = smoothstep(0.16, 0.52, length(fromCentre));

    // Red only under the cursor, so the accent still means "here".
    vec3 color = mix(uRule, uAccent, smoothstep(0.45, 1.0, lens));

    float alpha = uOpacity * grid * clearing * (0.75 + lens * 1.6);

    gl_FragColor = vec4(color, alpha);
  }
`;

type Props = { rule: string; accent: string; opacity: number };

export function GridField({ rule, accent, opacity }: Props) {
  const { viewport } = useThree();
  const pointerTarget = useRef(new THREE.Vector2(0, 0));
  const presence = useRef(0);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uPointerOn: { value: 0 },
      uSpan: { value: new THREE.Vector2(1, 1) },
      uCell: { value: 0.62 },
      uRule: { value: new THREE.Color(rule) },
      uAccent: { value: new THREE.Color(accent) },
      uOpacity: { value: opacity },
    }),
    // Created once; all values are mutated in place below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    uniforms.uRule.value.set(rule);
    uniforms.uAccent.value.set(accent);
    uniforms.uOpacity.value = opacity;
  }, [rule, accent, opacity, uniforms]);

  useEffect(() => {
    uniforms.uSpan.value.set(viewport.width, viewport.height);
  }, [viewport.width, viewport.height, uniforms]);

  useFrame((state, delta) => {
    uniforms.uTime.value += Math.min(delta, 0.05);

    const target = pointerTarget.current.set(
      (state.pointer.x * viewport.width) / 2,
      (state.pointer.y * viewport.height) / 2,
    );
    uniforms.uPointer.value.lerp(target, 0.07);

    const inside =
      Math.abs(state.pointer.x) < 0.999 && Math.abs(state.pointer.y) < 0.999;
    presence.current += ((inside ? 1 : 0) - presence.current) * 0.05;
    uniforms.uPointerOn.value = presence.current;
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[viewport.width, viewport.height, 1, 1]} />
      <shaderMaterial
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}
