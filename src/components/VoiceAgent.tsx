"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  BarVisualizer,
  LiveKitRoom,
  RoomAudioRenderer,
  useDataChannel,
  useTranscriptions,
  useVoiceAssistant,
} from "@livekit/components-react";
import { site, hire } from "@/content/site";

/**
 * The voice agent on /talk.
 *
 * Two things are on screen for a reason. The transcript is the accessible form
 * of the whole feature and the only way a visitor can check the agent heard them
 * correctly. The latency panel is the demonstration: anyone can claim a number
 * in an article, and this one is measured in front of the reader, by the
 * framework itself, on the turn they just spoke.
 */

type Connection = { token: string; url: string };
type Phase = "idle" | "connecting" | "live" | "ended" | "error";

/** Milliseconds, as published by the agent on the data channel. */
type Latency = {
  transcription?: number;
  endOfTurn?: number;
  model?: number;
  synthesis?: number;
  total?: number;
};

/** Matches MAX_SESSION_SECONDS in the agent, which is the limit that binds. */
const SESSION_SECONDS = 180;

/** Matches TOPIC in agent/metrics_bridge.py. */
const METRICS_TOPIC = "agent-metrics";

export function VoiceAgent({ compact = false }: { compact?: boolean }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [connection, setConnection] = useState<Connection | null>(null);
  const [error, setError] = useState<string | null>(null);

  const start = useCallback(async () => {
    setPhase("connecting");
    setError(null);
    try {
      const response = await fetch("/api/livekit-token", { method: "POST" });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "The voice agent is not available right now.");
        setPhase("error");
        return;
      }
      setConnection({ token: data.token, url: data.url });
      setPhase("live");
    } catch {
      setError("Could not reach the voice agent. Check your connection and try again.");
      setPhase("error");
    }
  }, []);

  const end = useCallback(() => {
    setConnection(null);
    setPhase("ended");
  }, []);

  if (phase === "live" && connection) {
    return (
      <LiveKitRoom
        token={connection.token}
        serverUrl={connection.url}
        connect
        audio
        video={false}
        onDisconnected={end}
        onError={() => {
          setError("The call dropped. You can start another one.");
          setPhase("error");
        }}
      >
        <RoomAudioRenderer />
        <LiveCall onEnd={end} compact={compact} />
      </LiveKitRoom>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {phase === "error" ? (
        <p role="status" className="measure text-[1.0625rem] leading-relaxed text-accent">
          {error}
        </p>
      ) : null}

      {phase === "ended" ? (
        <p role="status" className="measure text-[1.0625rem] leading-relaxed text-muted">
          That is the end of the call. If it was useful, the hiring form gets you a
          reply from Wasif himself.
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
        <button
          type="button"
          onClick={start}
          disabled={phase === "connecting"}
          className="group mono inline-flex items-center gap-3 border border-ink px-7 py-3.5 text-xs uppercase tracking-[0.16em] transition-colors duration-300 hover:bg-ink hover:text-paper disabled:cursor-wait disabled:opacity-50"
        >
          {phase === "connecting"
            ? "Connecting"
            : phase === "idle"
              ? "Start the call"
              : "Call again"}
          <span
            aria-hidden
            className="inline-block transition-transform duration-300 group-hover:translate-x-0.5"
          >
            &rarr;
          </span>
        </button>

        {compact ? (
          <a
            href="/talk"
            className="link-underline mono text-xs uppercase tracking-[0.16em] text-muted transition-colors hover:text-ink"
          >
            What it is built on
          </a>
        ) : (
          <>
            <a
              href="/hire"
              className="link-underline mono text-xs uppercase tracking-[0.16em] text-muted transition-colors hover:text-ink"
            >
              Or use the hiring form
            </a>
            {hire.bookingUrl ? (
              <a
                href={hire.bookingUrl}
                target="_blank"
                rel="noreferrer"
                className="link-underline mono text-xs uppercase tracking-[0.16em] text-muted transition-colors hover:text-ink"
              >
                Or book a call with Wasif
              </a>
            ) : null}
          </>
        )}
      </div>

      <p className="measure mono text-xs leading-relaxed text-faint">
        Your microphone is used only for the length of the call. Nothing is recorded
        and nothing is stored. The agent knows what {site.name.split(" ")[0]} has
        published on this site, and nothing else.
      </p>
    </div>
  );
}

function LiveCall({ onEnd, compact }: { onEnd: () => void; compact: boolean }) {
  const { state, audioTrack } = useVoiceAssistant();
  const transcriptions = useTranscriptions();
  const [remaining, setRemaining] = useState(SESSION_SECONDS);
  const [latency, setLatency] = useState<Latency | null>(null);
  const logRef = useRef<HTMLDivElement>(null);

  // The agent publishes one payload per turn on this topic. useDataChannel is
  // the framework's own subscriber, so there is no protocol here to maintain.
  useDataChannel(METRICS_TOPIC, (message) => {
    try {
      setLatency(JSON.parse(new TextDecoder().decode(message.payload)));
    } catch {
      // A malformed packet is not worth breaking a call over.
    }
  });

  useEffect(() => {
    const id = setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [transcriptions.length]);

  const label = useMemo(
    () =>
      state === "listening"
        ? "Listening"
        : state === "thinking"
          ? "Thinking"
          : state === "speaking"
            ? "Speaking"
            : state === "connecting"
              ? "Connecting"
              : "Ready",
    [state],
  );

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-wrap items-center justify-between gap-6 border-b border-rule pb-6">
        <div className="flex items-center gap-5">
          <span className="label text-accent">{label}</span>
          <BarVisualizer
            state={state}
            trackRef={audioTrack}
            barCount={7}
            className="flex h-8 items-center gap-1 [&>span]:w-1 [&>span]:rounded-none [&>span]:bg-accent"
          />
        </div>

        <div className="flex items-center gap-8">
          <span className="tabular text-xs text-faint">
            {Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, "0")} left
          </span>
          <button
            type="button"
            onClick={onEnd}
            className="link-underline mono text-xs uppercase tracking-[0.16em] text-muted transition-colors hover:text-ink"
          >
            End call
          </button>
        </div>
      </div>

      <div
        className={
          compact ? "flex flex-col gap-10" : "grid gap-12 lg:grid-cols-[1fr_240px] lg:gap-16"
        }
      >
        <div
          ref={logRef}
          role="log"
          aria-live="polite"
          aria-label="Conversation transcript"
          className="flex max-h-[46vh] flex-col gap-5 overflow-y-auto"
        >
          {transcriptions.length === 0 ? (
            <p className="measure text-[1.0625rem] leading-relaxed text-faint">
              Say hello, and ask about the voice work, the vision pipelines, or anything
              on this site.
            </p>
          ) : (
            transcriptions.map((entry) => {
              const isVisitor = entry.participantInfo.identity.startsWith("visitor-");
              return (
                <p
                  key={entry.streamInfo.id}
                  className={
                    isVisitor
                      ? "measure text-[1.0625rem] leading-relaxed text-faint"
                      : "measure text-[1.0625rem] leading-relaxed text-ink"
                  }
                >
                  <span className="label mr-3 text-accent">{isVisitor ? "You" : "Agent"}</span>
                  {entry.text}
                </p>
              );
            })
          )}
        </div>

        {!compact ? <LatencyPanel latency={latency} /> : null}
      </div>
    </div>
  );
}

const STAGES: { key: keyof Latency; label: string }[] = [
  { key: "endOfTurn", label: "End of turn" },
  { key: "model", label: "Model" },
  { key: "synthesis", label: "Synthesis" },
];

function LatencyPanel({ latency }: { latency: Latency | null }) {
  return (
    <aside className="rule-t pt-4">
      <p className="label">Latency, last turn</p>

      <dl className="mt-4 flex flex-col gap-2.5">
        {STAGES.map((stage) => (
          <div key={stage.key} className="flex items-baseline justify-between gap-4">
            <dt className="mono text-[0.8125rem] text-muted">{stage.label}</dt>
            <dd className="tabular text-[0.8125rem] text-ink">
              {latency?.[stage.key] != null ? `${latency[stage.key]} ms` : "—"}
            </dd>
          </div>
        ))}

        <div className="rule-t mt-2 flex items-baseline justify-between gap-4 pt-3">
          <dt className="mono text-[0.8125rem] text-ink">Total</dt>
          <dd className="tabular text-base text-accent">
            {latency?.total != null ? `${latency.total} ms` : "—"}
          </dd>
        </div>
      </dl>

      {/* Said plainly, because a recruiter who reads the article first will
          notice the gap, and finding it explained is better than finding it. */}
      <p className="mono mt-5 text-[0.6875rem] leading-relaxed text-faint">
        Measured by the agent on the turn you just spoke, not estimated. Higher than
        the sub-300ms in my writing: that was dedicated infrastructure, this is a
        free tier with an API round trip in the middle.
      </p>
    </aside>
  );
}
