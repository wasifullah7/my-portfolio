"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Route error:", error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-[1400px] flex-col justify-center px-6 py-28 sm:px-10">
      <div className="rule-heavy pt-4">
        <div className="index-rule">
          <span className="tabular text-xs text-accent">500</span>
          <span className="label order-3">Something broke</span>
        </div>
      </div>

      <h1 className="display mt-8 text-[clamp(2.1rem,7vw,5rem)]">
        That did not
        <br />
        work
      </h1>

      <p className="measure mt-7 text-lg leading-relaxed text-muted">
        Something on this page threw an error. Trying again usually fixes it, and if
        it does not, the rest of the site still works.
      </p>

      {error.digest ? (
        <p className="mono mt-4 text-xs text-faint">Reference: {error.digest}</p>
      ) : null}

      <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3">
        <button
          type="button"
          onClick={reset}
          className="group mono inline-flex items-center gap-3 border border-ink px-7 py-3.5 text-xs uppercase tracking-[0.16em] transition-colors duration-300 hover:bg-ink hover:text-paper"
        >
          Try again
          <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
            &rarr;
          </span>
        </button>

        <Link
          href="/"
          className="link-underline mono text-xs uppercase tracking-[0.16em] text-muted transition-colors hover:text-ink"
        >
          Back to the start
        </Link>
      </div>
    </div>
  );
}
