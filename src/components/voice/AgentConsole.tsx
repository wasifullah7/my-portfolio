"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  useDataChannel,
  useTranscriptions,
  useVoiceAssistant,
} from "@livekit/components-react";
import { useAgentConnection } from "./useAgentConnection";
import { LiveScope, Scope } from "./AgentScope";

type Latency = {
  endOfTurn?: number;
  model?: number;
  synthesis?: number;
  total?: number;
};

const METRICS_TOPIC = "agent-metrics";
const SESSION_SECONDS = 180;

const STAGES: { key: keyof Latency; label: string }[] = [
  { key: "endOfTurn", label: "End of turn" },
  { key: "model", label: "Model" },
  { key: "synthesis", label: "Synthesis" },
];

const STACK = [
  ["Transport", "LiveKit, WebRTC"],
  ["Recognition", "Whisper large v3 turbo"],
  ["Model", "gpt-oss, open weights"],
  ["Synthesis", "Piper, on the worker"],
  ["Turn taking", "Silero"],
];

export function AgentConsole() {
  const { phase, connection, error, start, end, fail } = useAgentConnection();

  if (phase === "live" && connection) {
    return (
      <LiveKitRoom
        token={connection.token}
        serverUrl={connection.url}
        connect
        audio
        video={false}
        onDisconnected={end}
        onError={() => fail("The call dropped. You can start another one.")}
      >
        <RoomAudioRenderer />
        <Console live onEnd={end} />
      </LiveKitRoom>
    );
  }

  return <Console live={false} phase={phase} error={error} onStart={start} />;
}

function Console({
  live,
  phase,
  error,
  onStart,
  onEnd,
}: {
  live: boolean;
  phase?: string;
  error?: string | null;
  onStart?: () => void;
  onEnd?: () => void;
}) {
  return (
    <div className="grid gap-px border border-rule bg-rule lg:grid-cols-[1fr_minmax(320px,420px)_1fr]">
      <Panel title="Transcript">
        {live ? <LiveTranscript /> : <IdleTranscript phase={phase} error={error} />}
      </Panel>

      <Panel title="Session" center>
        {live ? <LiveStage onEnd={onEnd} /> : <IdleStage phase={phase} onStart={onStart} />}
      </Panel>

      <Panel title="Latency, last turn">
        {live ? <LiveLatency /> : <Readout latency={null} />}
      </Panel>
    </div>
  );
}

function Panel({
  title,
  children,
  center,
}: {
  title: string;
  children: React.ReactNode;
  center?: boolean;
}) {
  return (
    <section className="flex min-h-[280px] flex-col bg-paper p-5 sm:p-6">
      <h2 className="label border-b border-rule pb-3">{title}</h2>
      <div className={center ? "flex flex-1 flex-col items-center justify-center gap-6" : "flex-1 pt-4"}>
        {children}
      </div>
    </section>
  );
}

/* Idle -------------------------------------------------------------------- */

function IdleTranscript({ phase, error }: { phase?: string; error?: string | null }) {
  if (phase === "error") {
    return <p className="text-[0.9375rem] leading-relaxed text-accent">{error}</p>;
  }
  return (
    <div className="flex flex-col gap-4">
      <p className="text-[0.9375rem] leading-relaxed text-muted">
        {phase === "ended"
          ? "That is the end of the call. The hiring form gets you a reply from me."
          : "Ask what I actually did to cut voice latency, how the diagram pipeline resolves arrows, or what I am looking for."}
      </p>
      <p className="mono text-[0.6875rem] leading-relaxed text-faint">
        Nothing is recorded. It answers from what I have published here and says so
        when it does not know.
      </p>
    </div>
  );
}

// The whole panel is the control, not a small button under it. A visitor should
// not have to find the affordance.
function IdleStage({ phase, onStart }: { phase?: string; onStart?: () => void }) {
  const connecting = phase === "connecting";
  const label = connecting ? "Connecting" : phase === "idle" ? "Start the call" : "Call again";

  return (
    <button
      type="button"
      onClick={onStart}
      disabled={connecting}
      aria-label={`${label}. Talk to the voice agent.`}
      className="group -m-2 flex w-full flex-col items-center gap-6 p-2 transition-colors duration-300 hover:bg-paper-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-wait"
    >
      <div className="w-full">
        <Scope bands={[]} live={false} label="Waiting to start" />
        <p className="mono mt-2 flex items-center justify-center gap-2 text-[0.6875rem] uppercase tracking-[0.16em] text-faint">
          <span className={connecting ? "agent-pulse" : "agent-pulse"} aria-hidden />
          {connecting ? "Connecting" : "Ready when you are"}
        </p>
      </div>

      <span className="mono inline-flex items-center gap-3 border border-ink bg-ink px-7 py-3.5 text-xs uppercase tracking-[0.16em] text-paper transition-transform duration-300 group-hover:-translate-y-0.5 group-disabled:opacity-50">
        {label}
        <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
          &rarr;
        </span>
      </span>

      <span className="text-[0.8125rem] leading-relaxed text-muted">
        It answers out loud. Your microphone is only on while you are talking.
      </span>
    </button>
  );
}

/* Live -------------------------------------------------------------------- */

function LiveTranscript() {
  const transcriptions = useTranscriptions();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.scrollTo({ top: ref.current.scrollHeight });
  }, [transcriptions.length]);

  return (
    <div
      ref={ref}
      role="log"
      aria-live="polite"
      aria-label="Conversation transcript"
      className="flex max-h-[240px] flex-col gap-4 overflow-y-auto"
    >
      {transcriptions.length === 0 ? (
        <p className="text-[0.9375rem] leading-relaxed text-faint">Listening.</p>
      ) : (
        transcriptions.map((entry) => {
          const visitor = entry.participantInfo.identity.startsWith("visitor-");
          return (
            <p
              key={entry.streamInfo.id}
              className={`text-[0.9375rem] leading-relaxed ${visitor ? "text-faint" : "text-ink"}`}
            >
              <span className="label mr-2.5 text-accent">{visitor ? "You" : "Agent"}</span>
              {entry.text}
            </p>
          );
        })
      )}
    </div>
  );
}

function LiveStage({ onEnd }: { onEnd?: () => void }) {
  const { state, audioTrack } = useVoiceAssistant();
  const [remaining, setRemaining] = useState(SESSION_SECONDS);

  useEffect(() => {
    const id = setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1000);
    return () => clearInterval(id);
  }, []);

  const label =
    state === "listening"
      ? "Listening"
      : state === "thinking"
        ? "Thinking"
        : state === "speaking"
          ? "Speaking"
          : "Connecting";

  return (
    <>
      <div className="w-full">
        <LiveScope agentTrack={audioTrack} state={state} />
      </div>

      <div className="flex flex-col items-center gap-3">
        <span className="label text-accent">{label}</span>
        <div className="flex items-center gap-6">
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
    </>
  );
}

function LiveLatency() {
  const [latency, setLatency] = useState<Latency | null>(null);

  useDataChannel(METRICS_TOPIC, (message) => {
    try {
      setLatency(JSON.parse(new TextDecoder().decode(message.payload)));
    } catch {
      // ignore a malformed packet
    }
  });

  return <Readout latency={latency} />;
}

/* Shared ------------------------------------------------------------------ */

function Readout({ latency }: { latency: Latency | null }) {
  return (
    <div className="flex flex-col gap-5">
      <dl className="flex flex-col gap-2.5">
        {STAGES.map((stage) => (
          <div key={stage.key} className="flex items-baseline justify-between gap-4">
            <dt className="mono text-[0.8125rem] text-muted">{stage.label}</dt>
            <dd className="tabular text-[0.8125rem] text-ink">
              {latency?.[stage.key] != null ? `${latency[stage.key]} ms` : "—"}
            </dd>
          </div>
        ))}
        <div className="flex items-baseline justify-between gap-4 border-t border-rule pt-3">
          <dt className="mono text-[0.8125rem] text-ink">Total</dt>
          <dd className="tabular text-base text-accent">
            {latency?.total != null ? `${latency.total} ms` : "—"}
          </dd>
        </div>
      </dl>

      <dl className="flex flex-col gap-2 border-t border-rule pt-4">
        {STACK.map(([role, what]) => (
          <div key={role} className="flex items-baseline justify-between gap-4">
            <dt className="label">{role}</dt>
            <dd className="mono text-[0.75rem] text-muted">{what}</dd>
          </div>
        ))}
      </dl>

      <Link
        href="/talk"
        className="link-underline mono text-[0.6875rem] uppercase tracking-[0.16em] text-accent"
      >
        How it is built
      </Link>
    </div>
  );
}
