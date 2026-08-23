"use client";

import { useEffect, useRef } from "react";
import { Track } from "livekit-client";
import type { TrackReference } from "@livekit/components-react";
import { useLocalParticipant, useMultibandTrackVolume } from "@livekit/components-react";

const BANDS = 24;
const HISTORY = 190;

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
  const history = useRef<number[]>(new Array(HISTORY).fill(0));
  const level = useRef(0);
  const sweep = useRef(0);

  bandsRef.current = bands;
  liveRef.current = live;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const read = (name: string, fallback: string) =>
      getComputedStyle(canvas).getPropertyValue(name).trim() || fallback;
    const rule = read("--rule", "#e4e4e7");
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

      ctx.strokeStyle = rule;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, mid + 0.5);
      ctx.lineTo(w, mid + 0.5);
      ctx.stroke();
      for (let x = 0; x <= w; x += 44) {
        ctx.beginPath();
        ctx.moveTo(x + 0.5, mid - 4);
        ctx.lineTo(x + 0.5, mid + 4);
        ctx.stroke();
      }

      const peak = peakOf(bandsRef.current);
      level.current += (peak - level.current) * 0.3;
      history.current.push(level.current);
      if (history.current.length > HISTORY) history.current.shift();

      const active = liveRef.current;
      const step = w / HISTORY;
      ctx.strokeStyle = active ? accent : faint;
      ctx.lineWidth = 2;

      for (let i = 0; i < history.current.length; i++) {
        const amp = Math.max(history.current[i] * h * 0.42, active ? 1 : 0.5);
        const x = i * step + step / 2;
        ctx.globalAlpha = 0.2 + (i / history.current.length) * 0.8;
        ctx.beginPath();
        ctx.moveTo(x, mid - amp);
        ctx.lineTo(x, mid + amp);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      if (!active && !reduced) {
        sweep.current = (sweep.current + 1.3) % w;
        ctx.fillStyle = accent;
        ctx.fillRect(sweep.current, mid - 3, 2, 6);
      }

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

function peakOf(bands: number[]) {
  if (!bands?.length) return 0;
  let peak = 0;
  for (const b of bands) if (b > peak) peak = b;
  return Math.min(peak * 1.7, 1);
}
