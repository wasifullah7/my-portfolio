"use client";

import { useState } from "react";
import { site } from "@/content/site";

type Status = "idle" | "sending" | "sent" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

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
        setError(body.error ?? "Something went wrong. Please email me directly at");
        setStatus("error");
        return;
      }

      form.reset();
      setStatus("sent");
    } catch {
      setError("Network error. Please email me directly at");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="rule-t pt-6">
        <p className="label text-accent">Sent</p>
        <p className="mt-4 text-lg text-ink">Thanks for reaching out.</p>
        <p className="mt-2 text-sm text-muted">I will reply shortly.</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="link-underline mono mt-6 text-xs uppercase tracking-[0.16em] text-muted hover:text-ink"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit}>
      {/* Honeypot: hidden from people, tempting to bots. */}
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-x-10 sm:grid-cols-2">
        <Field label="Name" name="name" placeholder="Your name" />
        <Field label="Email" name="email" type="email" placeholder="you@company.com" />
      </div>

      <div className="rule-t mt-8 pt-4">
        <label htmlFor="message" className="label">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          minLength={10}
          rows={5}
          placeholder="What are you building?"
          className="mt-3 w-full resize-y bg-transparent text-[0.9375rem] text-ink outline-none placeholder:text-faint"
        />
      </div>

      {status === "error" ? (
        <p className="rule-t mt-6 pt-4 text-sm text-muted">
          {error}{" "}
          <a href={`mailto:${site.email}`} className="link-underline text-accent">
            {site.email}
          </a>
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "sending"}
        className="group mono mt-10 inline-flex items-center gap-3 border border-ink px-7 py-3.5 text-xs uppercase tracking-[0.16em] transition-colors duration-300 hover:bg-ink hover:text-paper disabled:opacity-50"
      >
        {status === "sending" ? "Sending" : "Send message"}
        <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
          &rarr;
        </span>
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
    <div className="rule-t pt-4">
      <label htmlFor={name} className="label">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required
        placeholder={placeholder}
        className="mt-3 w-full bg-transparent text-[0.9375rem] text-ink outline-none placeholder:text-faint"
      />
    </div>
  );
}
