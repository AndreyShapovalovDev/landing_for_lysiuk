"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useIsLoaded } from "@/lib/useIsLoaded";

const E: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const loaded = useIsLoaded();

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY           = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const textY         = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity       = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const bottomFadeOp  = useTransform(scrollYProgress, [0.15, 0.6], [0, 1]);

  return (
    <section ref={ref} className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden">

      {/* Background photo */}
      <motion.div className="absolute inset-0 w-full h-[115%]" style={{ y: bgY }}>
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.08 }}
          animate={{ scale: 1.0 }}
          transition={{ duration: 20, ease: "linear" }}
        >
          <Image
            src="/hero.jpg"
            alt="Данил и Софья"
            fill priority
            className="object-cover object-center"
            style={{ filter: "grayscale(25%) brightness(0.55)" }}
          />
        </motion.div>
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 30%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0.95) 100%)"
        }} />

        {/* Scroll-linked crossfade: reveals next section background colour */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-64 pointer-events-none"
          style={{
            background: "linear-gradient(to top, var(--bg), transparent)",
            opacity: bottomFadeOp,
          }}
        />
      </motion.div>

      {/* Text content */}
      <motion.div
        className="relative z-10 text-center px-6 md:px-16 max-w-2xl mx-auto flex flex-col items-center gap-6 md:gap-8 w-full"
        style={{ y: textY, opacity }}
      >
        {/* Greeting */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={loaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.3, delay: 0, ease: E }}
          style={{
            fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontWeight: 300,
            fontSize: "clamp(1.4rem, 3.5vw, 2.2rem)", color: "rgba(248,245,240,0.85)", lineHeight: 1.5,
          }}
        >
          Дорогие родные и друзья!
        </motion.p>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={loaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.3, delay: 0.22, ease: E }}
          style={{
            fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontWeight: 300,
            fontSize: "clamp(1rem, 2vw, 1.3rem)", color: "rgba(248,245,240,0.55)", lineHeight: 1.8,
          }}
        >
          Вы получили это приглашение,<br />
          а значит мы спешим сообщить вам важную новость!
        </motion.p>

        {/* Main headline — clip-path reveal conditioned on loaded */}
        <div style={{ overflow: "hidden" }}>
          <motion.h1
            initial={{ clipPath: "inset(100% 0 0 0)" }}
            animate={loaded ? { clipPath: "inset(0% 0 0 0)" } : {}}
            transition={{ duration: 1.4, delay: 0.4, ease: E }}
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              fontWeight: 300,
              fontSize: "clamp(3rem, 9vw, 7rem)",
              color: "#f8f5f0",
              lineHeight: 0.95,
            }}
          >
            Мы женимся!
          </motion.h1>
        </div>

        {/* Names */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={loaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, delay: 0.75, ease: E }}
          className="flex flex-col items-center gap-3"
        >
          <p style={{
            fontFamily: "'Cormorant Garamond', serif", fontWeight: 300,
            fontSize: "clamp(1.6rem, 4vw, 3rem)", color: "rgba(248,245,240,0.9)", letterSpacing: "0.04em",
          }}>
            Данил & Софья
          </p>
          <div className="flex items-center gap-4">
            <div className="w-10 h-px" style={{ background: "rgba(248,245,240,0.3)" }} />
            <span style={{
              fontFamily: "'Inter', sans-serif", fontWeight: 300,
              fontSize: "11px", letterSpacing: "0.4em", textTransform: "uppercase",
              color: "rgba(248,245,240,0.45)",
            }}>
              07 сентября 2026
            </span>
            <div className="w-10 h-px" style={{ background: "rgba(248,245,240,0.3)" }} />
          </div>
        </motion.div>

        {/* Invite text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={loaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, delay: 1.0, ease: E }}
          style={{
            fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontWeight: 300,
            fontSize: "clamp(0.95rem, 1.8vw, 1.2rem)", color: "rgba(248,245,240,0.5)",
            lineHeight: 1.8, maxWidth: 440,
          }}
        >
          Приглашаем вас разделить с нами радость этого особенного дня<br />
          и стать частью нашей семейной истории
        </motion.p>

        {/* Date */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={loaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, delay: 1.2, ease: E }}
          style={{
            fontFamily: "'Cormorant Garamond', serif", fontWeight: 300,
            fontSize: "clamp(1.1rem, 2.5vw, 1.6rem)", color: "rgba(248,245,240,0.65)",
            letterSpacing: "0.05em",
          }}
        >
          Ждём вас: <span style={{ fontStyle: "italic" }}>7 Сентября 2026</span>
        </motion.p>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={loaded ? { opacity: 1 } : {}}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10"
      >
        <motion.div
          className="w-px h-12"
          style={{
            background: "linear-gradient(to bottom, rgba(248,245,240,0), rgba(248,245,240,0.4), rgba(248,245,240,0))",
            originY: 0,
          }}
          animate={{ scaleY: [0, 1, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
        <span style={{
          fontFamily: "'Inter', sans-serif", fontSize: "9px", letterSpacing: "0.4em",
          textTransform: "uppercase", color: "rgba(248,245,240,0.25)",
        }}>
          scroll
        </span>
      </motion.div>
    </section>
  );
}
