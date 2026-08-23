"use client";

import { useEffect, useRef } from "react";
import { Track } from "livekit-client";
import type { TrackReference } from "@livekit/components-react";
import { useLocalParticipant, useMultibandTrackVolume } from "@livekit/components-react";

const BANDS = 28;
const BARS = 28;

// Pure canvas. Takes levels, draws a rolling trace. No room context, so it also
// renders before a call has started.
export function Scope({
  bands,
  live,
  height = 132,
  label,
}: {
  bands: number[];
  live: boolean;
  height?: number;
  label: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bandsRef = useRef<number[]>(bands);
  const liveRef = useRef(live);
  const smoothed = useRef<number[]>(new Array(BARS).fill(0));

  // The draw loop reads these, so they are kept current after each render
  // rather than written during it.
  useEffect(() => {
    bandsRef.current = bands;
    liveRef.current = live;
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const read = (name: string, fallback: string) =>
      getComputedStyle(canvas).getPropertyValue(name).trim() || fallback;
    const accent = read("--accent", "#e5241b");
    const faint = read("--faint", "#6b7280");

    let raf = 0;
    let stopped = false;

    const frame = () => {
      if (stopped) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const mid = Math.round(h / 2);

      // Ease each band toward its live level so the bars breathe rather than
      // flicker. Falls back faster than it rises, which is how meters behave.
      const incoming = bandsRef.current;
      for (let i = 0; i < BARS; i++) {
        const target = Math.min((incoming[i] ?? 0) * 1.8, 1);
        const current = smoothed.current[i];
        smoothed.current[i] = current + (target - current) * (target > current ? 0.45 : 0.12);
      }

      // Rounded pill bars, symmetric about the centre, resting as dots when
      // there is no signal. Same shape language as the reference animation, but
      // every bar height is the live level for that band rather than a loop.
      const active = liveRef.current;
      const levels = smoothed.current;
      const gap = w / BARS;
      const barW = Math.max(3, Math.min(gap * 0.42, 5));
      const radius = barW / 2;
      const maxAmp = h * 0.4;

      ctx.fillStyle = active ? accent : faint;

      for (let i = 0; i < BARS; i++) {
        const x = gap * i + gap / 2 - barW / 2;
        const amp = Math.max(levels[i] * maxAmp, radius);
        const y = mid - amp;
        const barH = amp * 2;

        ctx.globalAlpha = active ? 0.35 + levels[i] * 0.65 : 0.4;
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(x, y, barW, barH, radius);
        else ctx.rect(x, y, barW, barH);
        ctx.fill();
      }
      ctx.globalAlpha = 1;


      raf = requestAnimationFrame(frame);
    };

    if (reduced) frame();
    else raf = requestAnimationFrame(frame);

    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={label}
      className="w-full"
      style={{ height }}
    />
  );
}

// Inside a room: feeds the scope from whichever side is actually talking.
export function LiveScope({
  agentTrack,
  state,
  height,
}: {
  agentTrack?: TrackReference;
  state: string;
  height?: number;
}) {
  const { localParticipant } = useLocalParticipant();
  const mic = localParticipant?.getTrackPublication(Track.Source.Microphone)?.audioTrack;

  const agentBands = useMultibandTrackVolume(agentTrack, { bands: BANDS });
  const micBands = useMultibandTrackVolume(mic, { bands: BANDS });

  const speaking = state === "speaking";

  return (
    <Scope
      bands={speaking ? agentBands : micBands}
      live
      height={height}
      label={speaking ? "Agent speaking" : "Listening to you"}
    />
  );
}

