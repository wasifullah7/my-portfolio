"use client";

import { useState } from "react";
import { Loader2, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { site } from "@/content/site";

type Status = "idle" | "sending" | "sent" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    setStatus("sending");
    setError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(body.error ?? "Something went wrong. Please email me directly.");
        setStatus("error");
        return;
      }

      form.reset();
      setStatus("sent");
    } catch {
      setError("Network error. Please email me directly.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="card flex flex-col items-start gap-3 rounded-2xl p-8">
        <CheckCircle2 className="size-6 text-primary" />
        <h3 className="text-lg font-medium">Message sent</h3>
        <p className="text-sm text-muted">
          Thanks for reaching out — I&apos;ll reply to you shortly.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-2 text-sm text-primary hover:underline"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card rounded-2xl p-6 sm:p-8">
      {/* Honeypot — hidden from people, tempting to bots. */}
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" name="name" placeholder="Your name" />
        <Field label="Email" name="email" type="email" placeholder="you@company.com" />
      </div>

      <div className="mt-4">
        <label htmlFor="message" className="text-sm font-medium">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          minLength={10}
          rows={5}
          placeholder="What are you building?"
          className="mt-2 w-full resize-y rounded-xl border border-border bg-surface-2 px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-muted/70 focus:border-primary"
        />
      </div>

      {status === "error" ? (
        <p className="mt-4 flex items-start gap-2 rounded-xl border border-border bg-surface-2 p-3 text-sm text-muted">
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-primary" />
          <span>
            {error}{" "}
            <a href={`mailto:${site.email}`} className="text-primary hover:underline">
              {site.email}
            </a>
          </span>
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-white transition-shadow hover:shadow-[0_0_28px_-6px_var(--primary)] disabled:opacity-60"
      >
        {status === "sending" ? (
          <>
            <Loader2 className="size-4 animate-spin" /> Sending…
          </>
        ) : (
          <>
            Send message <Send className="size-4" />
          </>
        )}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-border bg-surface-2 px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-muted/70 focus:border-primary"
      />
    </div>
  );
}
