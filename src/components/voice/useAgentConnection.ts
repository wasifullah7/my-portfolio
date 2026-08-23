"use client";

import { useCallback, useState } from "react";

export type Phase = "idle" | "connecting" | "live" | "ended" | "error";
export type Connection = { token: string; url: string };

export function useAgentConnection() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [connection, setConnection] = useState<Connection | null>(null);
  const [error, setError] = useState<string | null>(null);

  const start = useCallback(async () => {
    setPhase("connecting");
    setError(null);
    try {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const response = await fetch("/api/livekit-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timeZone }),
      });
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

  const fail = useCallback((message: string) => {
    setError(message);
    setPhase("error");
  }, []);

  return { phase, connection, error, start, end, fail };
}
