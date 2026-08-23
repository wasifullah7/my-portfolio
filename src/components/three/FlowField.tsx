"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * A Swiss grid made kinetic.
 *
 * The page is built on a typographic grid, so the backdrop is that grid taken
 * literally: a field of tick marks that rotate to follow a slow simplex flow,
 * the way iron filings line up in a field. The cursor pushes the field around
 * it, and marks sitting in the fastest part of the flow pick up the accent.
 *
 * Everything animates in the vertex shader. Per frame the CPU updates two
 * uniforms, time and pointer, and issues one instanced draw call for the whole
 * grid, so frame cost does not grow with the number of marks.
 */

const vertex = /* glsl */ `
  precision highp float;

  attribute vec2 aCell;      // grid coordinate for this instance
  attribute float aSeed;     // per-mark jitter so the field never looks stamped

  uniform float uTime;
  uniform vec2  uPointer;    // world-space cursor
  uniform float uPointerOn;  // 0 when the cursor has left the page
  uniform vec2  uSpan;       // world size of the field
  uniform float uTick;       // length of one mark

  varying float vIntensity;
  varying vec2  vUv;

  // Simplex noise, Ashima Arts / Stefan Gustavson. MIT.
  vec3 mod289(vec3 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
  vec2 mod289(vec2 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
  vec3 permute(vec3 x){ return mod289(((x*34.0)+1.0)*x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                       -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0))
                             + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m; m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vUv = uv;

    // Where this mark sits in the world.
    vec2 cell = (aCell - 0.5) * uSpan;

    // The flow: two octaves drifting at different rates so the field never
    // settles into a visible loop.
    float t = uTime * 0.06;
    float n1 = snoise(cell * 0.16 + vec2(t, t * 0.7));
    float n2 = snoise(cell * 0.41 - vec2(t * 1.3, t));
    float field = n1 + n2 * 0.4;

    float angle = field * 2.4 + aSeed * 0.25;

    // The cursor shoves the field aside and speeds it up nearby.
    vec2  toPointer = cell - uPointer;
    float d = length(toPointer);
    float influence = uPointerOn * smoothstep(3.4, 0.0, d);
    angle += atan(toPointer.y, toPointer.x) * influence * 1.15;

    float speed = abs(field) + influence * 1.4;
    vIntensity = clamp(speed * 0.55, 0.0, 1.0);

    // Marks in fast flow stretch; still ones stay short.
    float len = uTick * (0.45 + vIntensity * 1.25);

    vec2 local = vec2(position.x * len, position.y * uTick * 0.085);
    float s = sin(angle), c = cos(angle);
    vec2 rotated = vec2(local.x * c - local.y * s, local.x * s + local.y * c);

    // Slight drift along the flow, so the grid breathes rather than spins in place.
    vec2 drift = vec2(c, s) * field * 0.09;

    gl_Position = projectionMatrix * modelViewMatrix
                * vec4(cell + rotated + drift, 0.0, 1.0);
  }
`;

const fragment = /* glsl */ `
  precision highp float;

  uniform vec3  uInk;
  uniform vec3  uAccent;
  uniform float uOpacity;

  varying float vIntensity;
  varying vec2  vUv;

  void main() {
    // Accent only where the flow is fastest, so red stays a signal.
    float hot = smoothstep(0.62, 0.98, vIntensity);
    vec3 color = mix(uInk, uAccent, hot);

    // Soften the ends of each mark so the grid reads as drawn, not stamped.
    float taper = smoothstep(0.0, 0.14, vUv.x) * smoothstep(1.0, 0.86, vUv.x);
    float alpha = uOpacity * taper * (0.30 + vIntensity * 0.85);

    gl_FragColor = vec4(color, alpha);
  }
`;

type Props = { ink: string; accent: string; opacity: number };

export function FlowField({ ink, accent, opacity }: Props) {
  const { viewport } = useThree();
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const pointer = useRef(new THREE.Vector2(0, 0));
  const pointerOn = useRef(0);

  // Grid density is derived from the viewport so marks stay evenly spaced at
  // any aspect ratio, rather than stretching.
  const { geometry, columns, rows } = useMemo(() => {
    const spacing = 0.42;
    const cols = Math.min(160, Math.ceil(viewport.width / spacing));
    const rws = Math.min(110, Math.ceil(viewport.height / spacing));
    const count = cols * rws;

    const base = new THREE.PlaneGeometry(1, 1);
    const geo = new THREE.InstancedBufferGeometry();
    geo.index = base.index;
    geo.setAttribute("position", base.attributes.position);
    geo.setAttribute("uv", base.attributes.uv);
    geo.instanceCount = count;

    const cells = new Float32Array(count * 2);
    const seeds = new Float32Array(count);
    let i = 0;
    for (let y = 0; y < rws; y++) {
      for (let x = 0; x < cols; x++) {
        cells[i * 2] = cols === 1 ? 0.5 : x / (cols - 1);
        cells[i * 2 + 1] = rws === 1 ? 0.5 : y / (rws - 1);
        seeds[i] = Math.random() * 6.28318;
        i++;
      }
    }
    geo.setAttribute("aCell", new THREE.InstancedBufferAttribute(cells, 2));
    geo.setAttribute("aSeed", new THREE.InstancedBufferAttribute(seeds, 1));
    base.dispose();

    return { geometry: geo, columns: cols, rows: rws };
  }, [viewport.width, viewport.height]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uPointerOn: { value: 0 },
      uSpan: { value: new THREE.Vector2(1, 1) },
      uTick: { value: 0.42 },
      uInk: { value: new THREE.Color(ink) },
      uAccent: { value: new THREE.Color(accent) },
      uOpacity: { value: opacity },
    }),
    // Built once; every value below is updated in place.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    uniforms.uInk.value.set(ink);
    uniforms.uAccent.value.set(accent);
    uniforms.uOpacity.value = opacity;
  }, [ink, accent, opacity, uniforms]);

  useEffect(() => {
    // Overscan slightly so marks never pop in at the edges.
    uniforms.uSpan.value.set(viewport.width * 1.08, viewport.height * 1.08);
    uniforms.uTick.value = Math.min(
      (viewport.width * 1.08) / columns,
      (viewport.height * 1.08) / rows,
    ) * 2.1;
  }, [viewport.width, viewport.height, columns, rows, uniforms]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((state, delta) => {
    uniforms.uTime.value += Math.min(delta, 0.05);

    // state.pointer is normalised; convert to the same world space as the grid.
    const target = pointer.current.set(
      (state.pointer.x * viewport.width) / 2,
      (state.pointer.y * viewport.height) / 2,
    );
    uniforms.uPointer.value.lerp(target, 0.08);

    const inside = Math.abs(state.pointer.x) < 0.999 && Math.abs(state.pointer.y) < 0.999;
    pointerOn.current += ((inside ? 1 : 0) - pointerOn.current) * 0.06;
    uniforms.uPointerOn.value = pointerOn.current;
  });

  return (
    <mesh frustumCulled={false}>
      <primitive object={geometry} attach="geometry" />
      <shaderMaterial
        ref={materialRef}
        attach="material"
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}
