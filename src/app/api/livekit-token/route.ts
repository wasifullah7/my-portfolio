import { NextResponse } from "next/server";
import { AccessToken } from "livekit-server-sdk";
import { RoomAgentDispatch, RoomConfiguration } from "@livekit/protocol";

/**
 * Mints the short-lived token the browser needs to join the agent's room.
 * Counters are per-instance on Vercel, so the daily budget is a floor on
 * spending rather than a guarantee. Redis when this sees real traffic.
 */

export const runtime = "nodejs";

/** Must match agent_name in agent/agent.py, or nothing is ever dispatched. */
const AGENT_NAME = "portfolio-agent";

const PER_IP_LIMIT = 3;
const PER_IP_WINDOW_MS = 60 * 60 * 1000;

/** Roughly how long a capped session runs, used to spend down the daily budget. */
const SESSION_MINUTES = 3;
const DAILY_MINUTE_BUDGET = Number(process.env.VOICE_DAILY_MINUTES ?? 120);

/** The token only has to survive the join, not the conversation. */
const TOKEN_TTL = "2m";

const hits = new Map<string, { count: number; resetAt: number }>();
let spent = { minutes: 0, resetAt: 0 };

function rateLimited(ip: string) {
  const now = Date.now();
  const entry = hits.get(ip);

  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + PER_IP_WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > PER_IP_LIMIT;
}

function budgetExhausted() {
  const now = Date.now();
  if (now > spent.resetAt) {
    spent = { minutes: 0, resetAt: now + 24 * 60 * 60 * 1000 };
  }
  if (spent.minutes + SESSION_MINUTES > DAILY_MINUTE_BUDGET) return true;
  spent.minutes += SESSION_MINUTES;
  return false;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json(
      {
        error:
          "You have had a few calls already. Take it to the hiring form and Wasif will reply himself.",
      },
      { status: 429 },
    );
  }

  if (budgetExhausted()) {
    return NextResponse.json(
      {
        error:
          "The agent has hit its budget for today. It will be back tomorrow, and the hiring form is always open.",
      },
      { status: 503 },
    );
  }

  const url = process.env.LIVEKIT_URL;
  const key = process.env.LIVEKIT_API_KEY;
  const secret = process.env.LIVEKIT_API_SECRET;

  if (!url || !key || !secret) {
    console.error("livekit-token: LIVEKIT_URL, _API_KEY or _API_SECRET missing");
    return NextResponse.json(
      { error: "The voice agent is not available right now." },
      { status: 503 },
    );
  }

  const room = `portfolio-${crypto.randomUUID()}`;
  const identity = `visitor-${crypto.randomUUID().slice(0, 8)}`;

  const token = new AccessToken(key, secret, { identity, ttl: TOKEN_TTL });
  token.addGrant({
    room,
    roomJoin: true,
    canPublish: true,
    canSubscribe: true,
    canPublishData: false,
    canUpdateOwnMetadata: false,
  });

  // Naming the worker disables automatic dispatch, so it has to be summoned.
  token.roomConfig = new RoomConfiguration({
    agents: [new RoomAgentDispatch({ agentName: AGENT_NAME })],
    emptyTimeout: 20,
    maxParticipants: 2,
  });

  return NextResponse.json({
    token: await token.toJwt(),
    url,
    room,
  });
}
