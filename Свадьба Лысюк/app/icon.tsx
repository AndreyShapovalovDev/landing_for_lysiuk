import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: "#1a1a1a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* Тонкая рамка */}
        <div
          style={{
            position: "absolute",
            inset: 2,
            border: "0.5px solid rgba(248,245,240,0.15)",
            display: "flex",
          }}
        />
        {/* Монограмма */}
        <span
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: 13,
            fontStyle: "italic",
            fontWeight: 400,
            color: "#f8f5f0",
            letterSpacing: "-0.5px",
            lineHeight: 1,
            display: "flex",
          }}
        >
          D&S
        </span>
      </div>
    ),
    { ...size }
  );
}
