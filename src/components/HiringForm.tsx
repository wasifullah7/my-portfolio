"use client";

import { useId, useRef, useState } from "react";
import { site, hiringForm } from "@/content/site";

type Status = "idle" | "sending" | "sent" | "error";
type Errors = Partial<Record<string, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(data: {
  name: string;
  email: string;
  engagement: string[];
  message: string;
}): Errors {
  const errors: Errors = {};

  if (data.name.trim().length < 2) errors.name = "Please add your name.";
  if (!EMAIL_RE.test(data.email.trim()))
    errors.email = "That email address does not look right.";
  if (data.engagement.length === 0)
    errors.engagement = "Pick at least one, so I know what you have in mind.";
  if (data.message.trim().length < 10)
    errors.message = "A sentence or two is enough, but I need something to go on.";

  return errors;
}

export function HiringForm() {
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);

  const [engagement, setEngagement] = useState<string[]>([]);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState("");

  const fieldId = (name: string) => `${uid}-${name}`;
  const errorId = (name: string) => `${uid}-${name}-error`;

  function currentValues() {
    const form = formRef.current;
    if (!form) return { name: "", email: "", engagement, message: "" };
    const data = new FormData(form);
    return {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      engagement,
      message: String(data.get("message") ?? ""),
    };
  }

  /** Only re-validate on blur once the visitor has tried to submit. */
  function revalidate() {
    if (!submitted) return;
    setErrors(validate(currentValues()));
  }

  function toggleEngagement(option: string) {
    setEngagement((current) => {
      const next = current.includes(option)
        ? current.filter((item) => item !== option)
        : [...current, option];
      if (submitted) {
        setErrors(validate({ ...currentValues(), engagement: next }));
      }
      return next;
    });
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);

    const form = event.currentTarget;
    const found = validate(currentValues());
    setErrors(found);

    if (Object.keys(found).length > 0) {
      const first = Object.keys(found)[0];
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    const data = Object.fromEntries(new FormData(form));
    setStatus("sending");
    setServerError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, engagement }),
      });
      const body = (await response.json()) as { error?: string };

      if (!response.ok) {
        setServerError(body.error ?? "Something went wrong. Email me directly at");
        setStatus("error");
        return;
      }

      form.reset();
      setEngagement([]);
      setSubmitted(false);
      setStatus("sent");
    } catch {
      setServerError("Network error. Email me directly at");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div role="status" className="rule-heavy pt-6">
        <p className="label text-accent">Sent</p>
        <p className="mt-4 text-lg text-ink">{hiringForm.successTitle}</p>
        <p className="measure mt-2 text-sm text-muted">{hiringForm.successBody}</p>
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
    <form ref={formRef} onSubmit={onSubmit} noValidate>
      {/* Honeypot. Named "website" because "company" is now a real field. */}
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor={fieldId("website")}>Website</label>
        <input id={fieldId("website")} name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <fieldset className="border-0 p-0">
        <legend className="label text-accent">Who you are</legend>

        <div className="mt-5 grid gap-x-12 sm:grid-cols-2">
          <Field
            id={fieldId("name")}
            errorId={errorId("name")}
            name="name"
            label="Name"
            placeholder="Your name"
            error={errors.name}
            onBlur={revalidate}
          />
          <Field
            id={fieldId("email")}
            errorId={errorId("email")}
            name="email"
            type="email"
            label="Work email"
            placeholder="you@company.com"
            error={errors.email}
            onBlur={revalidate}
          />
          <Field
            id={fieldId("company")}
            errorId={errorId("company")}
            name="company"
            label="Company"
            placeholder="Optional"
          />
          <Field
            id={fieldId("roleTitle")}
            errorId={errorId("roleTitle")}
            name="roleTitle"
            label="Your role"
            placeholder="Optional"
          />
        </div>
      </fieldset>

      <fieldset className="mt-14 border-0 p-0">
        <legend className="label text-accent">What you have in mind</legend>

        <div className="rule-t mt-5 pt-4">
          <span id={fieldId("engagement-label")} className="label">
            Type of engagement
          </span>
          <div
            role="group"
            aria-labelledby={fieldId("engagement-label")}
            aria-invalid={Boolean(errors.engagement)}
            aria-describedby={errors.engagement ? errorId("engagement") : undefined}
            className="mt-4 flex flex-wrap gap-2"
          >
            {hiringForm.engagementOptions.map((option) => {
              const active = engagement.includes(option);
              return (
                <button
                  key={option}
                  type="button"
                  name="engagement"
                  aria-pressed={active}
                  onClick={() => toggleEngagement(option)}
                  className={`mono border px-4 py-2 text-[0.75rem] transition-colors duration-200 ${
                    active
                      ? "border-ink bg-ink text-paper"
                      : "border-rule text-muted hover:border-ink hover:text-ink"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
          <FieldError id={errorId("engagement")} message={errors.engagement} />
        </div>

        <div className="rule-t mt-8 pt-4">
          <span id={fieldId("timeline-label")} className="label">
            Timeline
          </span>
          <div
            role="radiogroup"
            aria-labelledby={fieldId("timeline-label")}
            className="mt-4 flex flex-wrap gap-x-8 gap-y-3"
          >
            {hiringForm.timelineOptions.map((option) => (
              <label
                key={option}
                className="flex cursor-pointer items-center gap-2.5 text-sm text-muted transition-colors hover:text-ink"
              >
                <input
                  type="radio"
                  name="timeline"
                  value={option}
                  className="size-3.5 accent-[var(--accent)]"
                />
                {option}
              </label>
            ))}
          </div>
        </div>

        <div className="rule-t mt-8 pt-4">
          <label htmlFor={fieldId("budget")} className="label">
            Budget or salary range
          </label>
          <input
            id={fieldId("budget")}
            name="budget"
            aria-describedby={fieldId("budget-help")}
            placeholder="Optional"
            className="mt-3 w-full bg-transparent text-[0.9375rem] text-ink outline-none placeholder:text-faint"
          />
          <p id={fieldId("budget-help")} className="measure mt-2 text-xs text-faint">
            {hiringForm.budgetHelp}
          </p>
        </div>

        <div className="rule-t mt-8 pt-4">
          <label htmlFor={fieldId("message")} className="label">
            What are you building
          </label>
          <textarea
            id={fieldId("message")}
            name="message"
            rows={5}
            onBlur={revalidate}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? errorId("message") : undefined}
            placeholder="The problem, the team, anything that helps me answer properly."
            className="mt-3 w-full resize-y bg-transparent text-[0.9375rem] text-ink outline-none placeholder:text-faint"
          />
          <FieldError id={errorId("message")} message={errors.message} />
        </div>
      </fieldset>

      {status === "error" ? (
        <p role="status" className="rule-t mt-8 pt-4 text-sm text-muted">
          {serverError}{" "}
          <a href={`mailto:${site.email}`} className="link-underline text-accent">
            {site.email}
          </a>
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "sending"}
        className="group mono mt-12 inline-flex items-center gap-3 border border-ink px-7 py-3.5 text-xs uppercase tracking-[0.16em] transition-colors duration-300 hover:bg-ink hover:text-paper disabled:opacity-50"
      >
        {status === "sending" ? "Sending" : "Send message"}
        <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
          &rarr;
        </span>
      </button>
    </form>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mono mt-2.5 text-xs text-accent">
      {message}
    </p>
  );
}

function Field({
  id,
  errorId,
  name,
  label,
  type = "text",
  placeholder,
  error,
  onBlur,
}: {
  id: string;
  errorId: string;
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  error?: string;
  onBlur?: () => void;
}) {
  return (
    <div className="rule-t pt-4">
      <label htmlFor={id} className="label">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        onBlur={onBlur}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className="mt-3 w-full bg-transparent text-[0.9375rem] text-ink outline-none placeholder:text-faint"
      />
      <FieldError id={errorId} message={error} />
    </div>
  );
}
