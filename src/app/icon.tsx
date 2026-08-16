import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/**
 * Generated favicon, replacing the Next.js default that shipped with the
 * scaffold. Red ground so the tab is findable in a crowded strip, and a single
 * letterform rather than a logo, which is the honest thing for a personal site.
 */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#e5241b",
          color: "#ffffff",
          fontSize: 46,
          fontWeight: 800,
          letterSpacing: "-0.06em",
          fontFamily: "Helvetica, Arial, sans-serif",
        }}
      >
        W
      </div>
    ),
    size,
  );
}
