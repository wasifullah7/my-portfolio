"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  BarVisualizer,
  LiveKitRoom,
  RoomAudioRenderer,
  useTranscriptions,
  useVoiceAssistant,
} from "@livekit/components-react";
import { site, hire } from "@/content/site";

/**
 * The voice agent on /talk.
 *
 * The transcript is not a nicety. It is the accessible version of the whole
 * feature, it lets someone follow along with the sound off, and it is the only
 * way a visitor can check that the agent heard them correctly.
 */

type Connection = { token: string; url: string };
type Phase = "idle" | "connecting" | "live" | "ended" | "error";

/** Matches MAX_SESSION_SECONDS in the agent, which is the limit that actually binds. */
const SESSION_SECONDS = 180;

export function VoiceAgent() {
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
        <LiveCall onEnd={end} />
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
          <span aria-hidden className="inline-block transition-transform duration-300 group-hover:translate-x-0.5">
            &rarr;
          </span>
        </button>

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
      </div>

      <p className="measure mono text-xs leading-relaxed text-faint">
        Your microphone is used only for the length of the call. Nothing is recorded
        and nothing is stored. The agent knows what {site.name.split(" ")[0]} has
        published on this site, and nothing else.
      </p>
    </div>
  );
}

function LiveCall({ onEnd }: { onEnd: () => void }) {
  const { state, audioTrack } = useVoiceAssistant();
  const transcriptions = useTranscriptions();
  const [remaining, setRemaining] = useState(SESSION_SECONDS);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1000);
    return () => clearInterval(id);
  }, []);

  // Follow the conversation as it grows, the way a chat log does.
  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [transcriptions.length]);

  const label =
    state === "listening"
      ? "Listening"
      : state === "thinking"
        ? "Thinking"
        : state === "speaking"
          ? "Speaking"
          : state === "connecting"
            ? "Connecting"
            : "Ready";

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
        ref={logRef}
        role="log"
        aria-live="polite"
        aria-label="Conversation transcript"
        className="flex max-h-[50vh] flex-col gap-5 overflow-y-auto"
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
    </div>
  );
}
