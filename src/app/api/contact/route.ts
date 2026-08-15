import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { site } from "@/content/site";

const schema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(120),
  email: z.email("That email doesn't look right"),
  message: z.string().trim().min(10, "Tell me a little more").max(5000),
  // Honeypot: real people never fill this in.
  company: z.string().optional(),
});

// Best-effort throttle. Resets on cold start, which is fine for a portfolio.
const hits = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60 * 60 * 1000;
const LIMIT = 5;

function rateLimited(ip: string) {
  const now = Date.now();
  const entry = hits.get(ip);

  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > LIMIT;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many messages. Try again later or email me directly." },
      { status: 429 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Please check the form." },
      { status: 400 },
    );
  }

  // Silently accept bot submissions so they don't retry.
  if (parsed.data.company) {
    return NextResponse.json({ ok: true });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "The contact form isn't connected yet. Please email me at" },
      { status: 503 },
    );
  }

  const { name, email, message } = parsed.data;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: process.env.CONTACT_FROM ?? "Portfolio <onboarding@resend.dev>",
      to: process.env.CONTACT_TO ?? site.email,
      replyTo: email,
      subject: `Portfolio enquiry — ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Could not send right now. Please email me at" },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact route failed:", err);
    return NextResponse.json(
      { error: "Could not send right now. Please email me at" },
      { status: 500 },
    );
  }
}
