"use client";

/**
 * Replaces the whole document when the root layout itself fails, so it cannot
 * rely on any styles or providers from the app. Everything here is inline.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffffff",
          color: "#0a0a0a",
          fontFamily: "Helvetica, Arial, sans-serif",
          padding: "24px",
        }}
      >
        <main style={{ maxWidth: "34rem" }}>
          <p
            style={{
              margin: 0,
              fontSize: "0.6875rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#e5241b",
            }}
          >
            Error
          </p>

          <h1
            style={{
              margin: "16px 0 0",
              fontSize: "2.25rem",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              textTransform: "uppercase",
              fontWeight: 800,
            }}
          >
            The site failed to load
          </h1>

          <p style={{ margin: "20px 0 0", lineHeight: 1.65, color: "#6b7280" }}>
            Something went wrong before the page could render. Reloading usually
            clears it.
          </p>

          {error.digest ? (
            <p style={{ margin: "12px 0 0", fontSize: "0.75rem", color: "#9ca3af" }}>
              Reference: {error.digest}
            </p>
          ) : null}

          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: "32px",
              padding: "14px 28px",
              background: "transparent",
              border: "1px solid #0a0a0a",
              color: "#0a0a0a",
              fontSize: "0.75rem",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Reload
          </button>
        </main>
      </body>
    </html>
  );
}
