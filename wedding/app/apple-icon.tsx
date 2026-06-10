import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: "#1a1a1a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* Рамка */}
        <div
          style={{
            position: "absolute",
            inset: 14,
            border: "1px solid rgba(248,245,240,0.12)",
            display: "flex",
          }}
        />
        {/* Монограмма */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <span
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: 56,
              fontStyle: "italic",
              fontWeight: 400,
              color: "#f8f5f0",
              letterSpacing: "-1px",
              lineHeight: 1,
              display: "flex",
            }}
          >
            D&S
          </span>
          <span
            style={{
              fontFamily: "Georgia, serif",
              fontSize: 11,
              fontWeight: 400,
              color: "rgba(248,245,240,0.3)",
              letterSpacing: "4px",
              textTransform: "uppercase",
              display: "flex",
            }}
          >
            2026
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
