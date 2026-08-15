import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = `${site.name} — ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#07080c",
          backgroundImage:
            "radial-gradient(circle at 15% 0%, rgba(77,163,255,0.28), transparent 45%), radial-gradient(circle at 85% 20%, rgba(167,139,250,0.22), transparent 45%)",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 52,
              height: 52,
              borderRadius: 12,
              background: "#4da3ff",
              color: "#04060b",
              fontSize: 30,
              fontWeight: 700,
            }}
          >
            W
          </div>
          <div style={{ display: "flex", fontSize: 26, color: "#eef1f7", fontWeight: 600 }}>
            {site.name}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 82,
              lineHeight: 1.05,
              fontWeight: 700,
              color: "#eef1f7",
              letterSpacing: "-0.03em",
            }}
          >
            {site.role}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 20,
              fontSize: 30,
              color: "#93a4c0",
            }}
          >
            {site.disciplines.join("  ·  ")}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
          {site.stats.map((stat) => (
            <div key={stat.label} style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", fontSize: 34, fontWeight: 700, color: "#4da3ff" }}>
                {stat.value}
              </div>
              <div style={{ display: "flex", fontSize: 19, color: "#828fa8", marginTop: 4 }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
