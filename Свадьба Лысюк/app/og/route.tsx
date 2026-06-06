import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#1a1a1a",
          position: "relative",
        }}
      >
        {/* Subtle border frame */}
        <div
          style={{
            position: "absolute",
            inset: "32px",
            border: "1px solid rgba(248,245,240,0.08)",
            display: "flex",
          }}
        />

        {/* Corner accents */}
        {[
          { top: 32, left: 32 },
          { top: 32, right: 32 },
          { bottom: 32, left: 32 },
          { bottom: 32, right: 32 },
        ].map((pos, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: "20px",
              height: "20px",
              borderTop: i < 2 ? "1px solid rgba(248,245,240,0.25)" : undefined,
              borderBottom: i >= 2 ? "1px solid rgba(248,245,240,0.25)" : undefined,
              borderLeft: i % 2 === 0 ? "1px solid rgba(248,245,240,0.25)" : undefined,
              borderRight: i % 2 === 1 ? "1px solid rgba(248,245,240,0.25)" : undefined,
              display: "flex",
              ...pos,
            }}
          />
        ))}

        {/* Date label */}
        <div
          style={{
            fontFamily: "serif",
            fontSize: "13px",
            letterSpacing: "0.45em",
            textTransform: "uppercase",
            color: "rgba(248,245,240,0.35)",
            marginBottom: "32px",
            display: "flex",
          }}
        >
          07 · 09 · 2026
        </div>

        {/* Main headline */}
        <div
          style={{
            fontFamily: "serif",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "96px",
            color: "#f8f5f0",
            lineHeight: 0.95,
            letterSpacing: "-0.01em",
            marginBottom: "28px",
            display: "flex",
          }}
        >
          Мы женимся!
        </div>

        {/* Names */}
        <div
          style={{
            fontFamily: "serif",
            fontSize: "40px",
            fontWeight: 300,
            color: "rgba(248,245,240,0.75)",
            letterSpacing: "0.08em",
            marginBottom: "40px",
            display: "flex",
          }}
        >
          Данил & Софья
        </div>

        {/* Divider line */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div style={{ width: "60px", height: "1px", background: "rgba(248,245,240,0.2)", display: "flex" }} />
          <div
            style={{
              fontFamily: "sans-serif",
              fontSize: "11px",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: "rgba(248,245,240,0.3)",
              display: "flex",
            }}
          >
            Свадебное приглашение
          </div>
          <div style={{ width: "60px", height: "1px", background: "rgba(248,245,240,0.2)", display: "flex" }} />
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
