"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const COUNT = 88;
const MAX_EDGES = 640;
const LINK_DIST = 1.85;
const SPREAD_X = 11;
const SPREAD_Y = 6.5;
const SPREAD_Z = 5;

/** Soft round sprite so points read as glowing nodes, not square pixels. */
function makeDotTexture() {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.4, "rgba(255,255,255,0.65)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

type Props = { nodeColor: string; edgeColor: string };

/**
 * A drifting constellation of nodes wired by proximity — a nod to the graph
 * extraction work in the AI Board Scanner rather than a generic 3D object.
 * Topology is recomputed every frame into preallocated buffers, so nothing
 * allocates inside the render loop.
 */
export function NodeGraph({ nodeColor, edgeColor }: Props) {
  const group = useRef<THREE.Group>(null);

  const scene = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const velocities = new Float32Array(COUNT * 3);

    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * SPREAD_X;
      positions[i * 3 + 1] = (Math.random() - 0.5) * SPREAD_Y;
      positions[i * 3 + 2] = (Math.random() - 0.5) * SPREAD_Z;
      velocities[i * 3] = (Math.random() - 0.5) * 0.0055;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.0055;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.0035;
    }

    const pointGeometry = new THREE.BufferGeometry();
    pointGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const linePositions = new Float32Array(MAX_EDGES * 6);
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    lineGeometry.setDrawRange(0, 0);

    const dot = makeDotTexture();
    const pointMaterial = new THREE.PointsMaterial({
      size: 0.13,
      map: dot,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const lineMaterial = new THREE.LineBasicMaterial({
      transparent: true,
      opacity: 0.3,
      depthWrite: false,
    });

    return {
      positions,
      velocities,
      linePositions,
      pointGeometry,
      lineGeometry,
      pointMaterial,
      lineMaterial,
      dot,
    };
  }, []);

  // Theme changes recolor in place — no scene rebuild.
  useEffect(() => {
    scene.pointMaterial.color.set(nodeColor);
    scene.lineMaterial.color.set(edgeColor);
  }, [nodeColor, edgeColor, scene]);

  useEffect(() => {
    return () => {
      scene.pointGeometry.dispose();
      scene.lineGeometry.dispose();
      scene.pointMaterial.dispose();
      scene.lineMaterial.dispose();
      scene.dot.dispose();
    };
  }, [scene]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05) * 60;
    const { positions, velocities, linePositions } = scene;

    for (let i = 0; i < COUNT; i++) {
      const ix = i * 3;
      positions[ix] += velocities[ix] * dt;
      positions[ix + 1] += velocities[ix + 1] * dt;
      positions[ix + 2] += velocities[ix + 2] * dt;

      if (Math.abs(positions[ix]) > SPREAD_X / 2) velocities[ix] *= -1;
      if (Math.abs(positions[ix + 1]) > SPREAD_Y / 2) velocities[ix + 1] *= -1;
      if (Math.abs(positions[ix + 2]) > SPREAD_Z / 2) velocities[ix + 2] *= -1;
    }

    let edge = 0;
    for (let i = 0; i < COUNT && edge < MAX_EDGES; i++) {
      const ix = i * 3;
      for (let j = i + 1; j < COUNT && edge < MAX_EDGES; j++) {
        const jx = j * 3;
        const dx = positions[ix] - positions[jx];
        const dy = positions[ix + 1] - positions[jx + 1];
        const dz = positions[ix + 2] - positions[jx + 2];
        if (dx * dx + dy * dy + dz * dz > LINK_DIST * LINK_DIST) continue;

        const ex = edge * 6;
        linePositions[ex] = positions[ix];
        linePositions[ex + 1] = positions[ix + 1];
        linePositions[ex + 2] = positions[ix + 2];
        linePositions[ex + 3] = positions[jx];
        linePositions[ex + 4] = positions[jx + 1];
        linePositions[ex + 5] = positions[jx + 2];
        edge++;
      }
    }

    scene.pointGeometry.attributes.position.needsUpdate = true;
    scene.lineGeometry.attributes.position.needsUpdate = true;
    scene.lineGeometry.setDrawRange(0, edge * 2);

    if (group.current) {
      const { x, y } = state.pointer;
      group.current.rotation.y += (x * 0.32 - group.current.rotation.y) * 0.035;
      group.current.rotation.x += (-y * 0.2 - group.current.rotation.x) * 0.035;
      group.current.position.z = Math.sin(state.clock.elapsedTime * 0.15) * 0.4;
    }
  });

  return (
    <group ref={group}>
      <points geometry={scene.pointGeometry} material={scene.pointMaterial} />
      <lineSegments geometry={scene.lineGeometry} material={scene.lineMaterial} />
    </group>
  );
}
