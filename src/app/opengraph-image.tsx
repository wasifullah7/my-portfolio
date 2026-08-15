import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = `${site.name}, ${site.role}`;
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
          background: "#efebe3",
          color: "#17150f",
          padding: "64px 72px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #d5cdbe",
            paddingBottom: 20,
          }}
        >
          <div style={{ display: "flex", fontSize: 22, letterSpacing: 2, color: "#6b6455" }}>
            {site.name.toUpperCase()}
          </div>
          <div style={{ display: "flex", fontSize: 20, letterSpacing: 3, color: "#a8431e" }}>
            {site.location.toUpperCase()}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 104,
              lineHeight: 1,
              fontWeight: 800,
              letterSpacing: "-0.04em",
              textTransform: "uppercase",
            }}
          >
            Full-Stack
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 104,
              lineHeight: 1,
              fontWeight: 800,
              letterSpacing: "-0.04em",
              textTransform: "uppercase",
            }}
          >
            AI Engineer
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 26,
              fontSize: 22,
              letterSpacing: 3,
              color: "#6b6455",
            }}
          >
            {site.disciplines.join("   /   ").toUpperCase()}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 64,
            borderTop: "1px solid #d5cdbe",
            paddingTop: 22,
          }}
        >
          {[
            { v: "0.83", l: "MAP, DIAGRAM DETECTION" },
            { v: "97%", l: "ARROW ASSOCIATION" },
            { v: "3", l: "PRODUCTION TEAMS" },
          ].map((stat) => (
            <div key={stat.l} style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", fontSize: 44, fontWeight: 700, color: "#a8431e" }}>
                {stat.v}
              </div>
              <div style={{ display: "flex", fontSize: 16, letterSpacing: 2, color: "#6b6455", marginTop: 6 }}>
                {stat.l}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
