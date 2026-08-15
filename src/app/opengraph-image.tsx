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
          background: "#ffffff",
          color: "#0a0a0a",
          padding: "60px 72px",
          fontFamily: "Helvetica, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "3px solid #0a0a0a",
            paddingBottom: 18,
          }}
        >
          <div style={{ display: "flex", fontSize: 22, letterSpacing: 3 }}>
            {site.name.toUpperCase()}
          </div>
          <div style={{ display: "flex", fontSize: 20, letterSpacing: 3, color: "#e5241b" }}>
            {site.location.toUpperCase()}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 116,
              lineHeight: 0.9,
              fontWeight: 800,
              letterSpacing: "-0.05em",
            }}
          >
            FULL-STACK
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 116,
              lineHeight: 0.9,
              fontWeight: 800,
              letterSpacing: "-0.05em",
            }}
          >
            AI ENGINEER
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 24,
              fontSize: 21,
              letterSpacing: 3,
              color: "#6b7280",
            }}
          >
            {site.disciplines.join("   /   ").toUpperCase()}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 60,
            borderTop: "1px solid #e4e4e7",
            paddingTop: 20,
          }}
        >
          {[
            { v: "0.83", l: "MAP, DIAGRAM DETECTION" },
            { v: "97%", l: "ARROW ASSOCIATION" },
            { v: "89%", l: "RAG ACCURACY" },
            { v: "UK / EU / US", l: "CLIENTS SHIPPED FOR" },
          ].map((stat) => (
            <div key={stat.l} style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", fontSize: 40, fontWeight: 700, color: "#e5241b" }}>
                {stat.v}
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: 15,
                  letterSpacing: 2,
                  color: "#6b7280",
                  marginTop: 6,
                }}
              >
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
