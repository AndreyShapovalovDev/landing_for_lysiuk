"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import RingGame from "@/components/RingGame";

function LetterStagger({ text, inView, delay = 0, style }: {
  text: string; inView: boolean; delay?: number; style?: React.CSSProperties;
}) {
  return (
    <span style={{ display: "inline" }}>
      {text.split("").map((ch, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
          animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.65, delay: delay + i * 0.04, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: ch === " " ? "inline" : "inline-block", ...style }}
        >
          {ch === " " ? " " : ch}
        </motion.span>
      ))}
    </span>
  );
}

export default function FinalSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bgY   = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["5%",  "-5%"]);

  return (
    <section
      ref={ref}
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background */}
      <motion.div className="absolute inset-0 w-full h-full" style={{ y: bgY }}>
        <motion.div
          className="absolute inset-0 w-full h-[120%]"
          initial={{ scale: 1.08 }}
          animate={{ scale: 1.0 }}
          transition={{ duration: 24, ease: "linear" }}
        >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/final.jpg"
          alt=""
          className="w-full h-full object-cover object-center"
          style={{ filter: "grayscale(60%) brightness(0.5)" }}
        />
        </motion.div>
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.82) 100%)" }}
        />
        <div className="absolute top-0 left-0 right-0 h-48"
          style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)" }} />
        <div className="absolute bottom-0 left-0 right-0 h-48"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.5), transparent)" }} />
      </motion.div>

      {/* Content */}
      <motion.div className="relative z-10 text-center px-8 md:px-16" style={{ y: textY }}>
        {/* Monogram with glow halo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12 relative flex items-center justify-center"
        >
          {/* Halo */}
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{ width: 180, height: 180, background: "radial-gradient(circle, rgba(248,245,240,0.08) 0%, transparent 70%)" }}
            animate={inView ? { scale: [1, 1.12, 1], opacity: [0.5, 1, 0.5] } : {}}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <span
            className="text-7xl md:text-9xl relative"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 300,
              color: "rgba(248,245,240,0.9)",
              textShadow: "0 0 60px rgba(248,245,240,0.15), 0 0 120px rgba(248,245,240,0.07)",
            }}
          >
            <LetterStagger text="D&S" inView={inView} delay={0.2} />
          </span>
        </motion.div>

        <div className="mb-8 max-w-2xl mx-auto">
          <h2
            className="text-[clamp(1.8rem,4vw,3.5rem)] leading-[1.2]"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontStyle: "italic", color: "rgba(248,245,240,0.9)" }}
          >
            <LetterStagger text="Для нас огромное счастье —" inView={inView} delay={0.5} />
            <br />
            <LetterStagger text="видеть вас рядом в этот день" inView={inView} delay={0.9} />
          </h2>
        </div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.4, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-center gap-6 mb-8"
          style={{ originX: 0.5 }}
        >
          <div className="w-16 h-px" style={{ background: "rgba(248,245,240,0.25)" }} />
          <span
            className="text-[10px] tracking-[0.4em] uppercase font-light"
            style={{ fontFamily: "'Inter', sans-serif", color: "rgba(248,245,240,0.4)" }}
          >
            07 · 09 · 2026
          </span>
          <div className="w-16 h-px" style={{ background: "rgba(248,245,240,0.25)" }} />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, delay: 0.55 }}
          className="text-[clamp(1.5rem,3vw,2.5rem)]"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, color: "rgba(248,245,240,0.65)" }}
        >
          Данил & Софья
        </motion.p>

        {/* Easter egg */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1.5, duration: 1 }}
          className="mt-10 flex justify-center"
        >
          <RingGame />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-10 left-0 right-0 text-center"
      >
        <p
          className="text-[9px] tracking-[0.4em] uppercase font-light"
          style={{ fontFamily: "'Inter', sans-serif", color: "rgba(248,245,240,0.18)" }}
        >
          Лысюк · 2026
        </p>
      </motion.div>
    </section>
  );
}
