"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useMotionTemplate } from "framer-motion";

const phrases = [
  { eyebrow: "Начало",         line1: "Мы познакомились", line2: "совсем случайно...",    ambient: "01", side: "left"  as const },
  { eyebrow: "Момент",         line1: "И поняли —",        line2: "это навсегда",          ambient: "02", side: "right" as const },
  { eyebrow: "07 · 09 · 2026", line1: "Теперь мы хотим",  line2: "разделить это с вами",  ambient: "03", side: "left"  as const },
];

function PhraseBlock({ phrase }: { phrase: typeof phrases[0] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Ambient число — сильный горизонтальный drift + вертикальный + scale
  const ambientX = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    phrase.side === "left" ? ["-18%", "0%", "18%"] : ["18%", "0%", "-18%"]
  );
  const ambientY     = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const ambientScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.82, 1.0, 0.82]);

  // Текст — line1 движется чуть быстрее чем line2 (разная глубина)
  const line1Y = useTransform(scrollYProgress, [0, 1], ["6%", "-6%"]);
  const line2Y = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);

  // Eyebrow — самый медленный слой
  const eyebrowY = useTransform(scrollYProgress, [0, 1], ["3%", "-3%"]);

  // Blur-to-focus: в центре (0.5) — фокус, на краях — blur
  const blurPx = useTransform(scrollYProgress, [0, 0.3, 0.5, 0.7, 1], [12, 0, 0, 0, 12]);
  const blurFilter = useMotionTemplate`blur(${blurPx}px)`;
  const contentOpacity = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], [0.4, 1, 1, 1, 0.4]);

  return (
    <div
      ref={ref}
      style={{
        minHeight: "88vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "6vh clamp(1.5rem, 6vw, 8rem)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient число — scroll-linked drift + scale */}
      <motion.div
        aria-hidden
        style={{
          position: "absolute",
          [phrase.side]: "-0.1em",
          top: "50%",
          x: ambientX,
          y: ambientY,
          scale: ambientScale,
          translateY: "-50%",
          fontFamily: "'Cormorant Garamond', serif",
          fontWeight: 300,
          fontStyle: "italic",
          fontSize: "clamp(18rem, 42vw, 38rem)",
          lineHeight: 0.85,
          letterSpacing: "-0.05em",
          color: "var(--fg)",
          opacity: 1,
          userSelect: "none",
          pointerEvents: "none",
          WebkitMaskImage: phrase.side === "left"
            ? "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.15) 60%)"
            : "linear-gradient(to left, transparent 0%, rgba(0,0,0,0.15) 60%)",
          maskImage: phrase.side === "left"
            ? "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.15) 60%)"
            : "linear-gradient(to left, transparent 0%, rgba(0,0,0,0.15) 60%)",
        }}
      >
        {phrase.ambient}
      </motion.div>

      {/* Content — три слоя с разной скоростью */}
      <motion.div
        style={{
          textAlign: "center",
          width: "100%",
          position: "relative",
          zIndex: 1,
          filter: blurFilter,
          opacity: contentOpacity,
        }}
      >

        {/* Eyebrow — медленный слой */}
        <motion.p
          style={{
            y: eyebrowY,
            fontFamily: "'Inter', sans-serif",
            fontSize: "10px",
            letterSpacing: "0.5em",
            textTransform: "uppercase",
            color: "var(--fg-30)",
            fontWeight: 300,
            marginBottom: "clamp(1.5rem, 4vw, 3rem)",
          }}
        >
          {phrase.eyebrow}
        </motion.p>

        {/* Line 1 */}
        <motion.div
          style={{
            y: line1Y,
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 300,
            fontStyle: "italic",
            fontSize: "clamp(3.5rem, 14vw, 13rem)",
            lineHeight: 0.95,
            letterSpacing: "-0.03em",
            color: "var(--fg)",
          }}
        >
          {phrase.line1}
        </motion.div>

        {/* Line 2 */}
        <motion.div
          style={{
            y: line2Y,
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 300,
            fontStyle: "italic",
            fontSize: "clamp(3.5rem, 14vw, 13rem)",
            lineHeight: 0.95,
            letterSpacing: "-0.03em",
            color: "var(--fg-30)",
          }}
        >
          {phrase.line2}
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function StickyScrollSection() {
  return (
    <section style={{ backgroundColor: "var(--bg)", overflow: "hidden" }}>
      {phrases.map((phrase, i) => (
        <PhraseBlock key={i} phrase={phrase} />
      ))}
    </section>
  );
}
