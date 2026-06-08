"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const E: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface Props {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: "text" | "email" | "tel";
  required?: boolean;
  multiline?: boolean;
  rows?: number;
}

export default function FloatingInput({
  label, value, onChange, type = "text", required, multiline, rows = 3,
}: Props) {
  const [focused, setFocused] = useState(false);
  const lifted = focused || value.length > 0;

  const shared: React.CSSProperties = {
    fontFamily: "'Cormorant Garamond', serif",
    background: "transparent",
    color: "var(--fg)",
    width: "100%",
    outline: "none",
    padding: "22px 0 8px",
    fontSize: "1.05rem",
    border: "none",
    borderBottom: "1px solid transparent",
    resize: "none" as const,
  };

  return (
    <div style={{ position: "relative", paddingTop: 0 }}>
      {/* Floating label */}
      <motion.label
        animate={{
          y:        lifted ? -6  : 16,
          fontSize: lifted ? "9px" : "1rem",
          opacity:  lifted ? 1 : 0.45,
          letterSpacing: lifted ? "0.35em" : "0",
          color: focused ? "var(--fg)" : "var(--fg-30)",
        }}
        transition={{ duration: 0.3, ease: E }}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          fontFamily: "'Inter', sans-serif",
          textTransform: lifted ? "uppercase" : "none",
          fontWeight: 300,
          pointerEvents: "none",
          transformOrigin: "left top",
        }}
      >
        {label}{required ? " *" : ""}
      </motion.label>

      {/* Input */}
      {multiline ? (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          rows={rows}
          style={shared}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          required={required}
          style={shared}
        />
      )}

      {/* Bottom border — статичная подложка */}
      <div style={{
        position: "absolute",
        bottom: 0, left: 0, right: 0,
        height: 1,
        background: "var(--fg-15)",
      }} />

      {/* Bottom border — рисует себя при фокусе */}
      <motion.div
        animate={{ scaleX: focused ? 1 : 0 }}
        transition={{ duration: 0.4, ease: E }}
        style={{
          position: "absolute",
          bottom: 0, left: 0, right: 0,
          height: 1,
          background: "var(--fg)",
          originX: 0,
        }}
      />
    </div>
  );
}
