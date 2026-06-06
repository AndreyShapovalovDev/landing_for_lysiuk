"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

export default function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY     = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const textY   = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  return (
    <section ref={ref} className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden">

      {/* Background photo */}
      <motion.div className="absolute inset-0 w-full h-[115%]" style={{ y: bgY }}>
        <Image
          src="/hero.jpg"
          alt="Данил и Софья"
          fill priority
          className="object-cover object-center"
          style={{ filter: "grayscale(25%) brightness(0.55)" }}
        />
        {/* Gradient */}
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 30%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0.95) 100%)"
        }} />
      </motion.div>

      {/* Text content — centered like reference */}
      <motion.div
        className="relative z-10 text-center px-6 md:px-16 max-w-2xl mx-auto flex flex-col items-center gap-6 md:gap-8 w-full"
        style={{ y: textY, opacity }}
      >
        {/* Greeting */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontWeight: 300,
            fontSize: "clamp(1.4rem, 3.5vw, 2.2rem)", color: "rgba(248,245,240,0.85)", lineHeight: 1.5 }}
        >
          Дорогие родные и друзья!
        </motion.p>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontWeight: 300,
            fontSize: "clamp(1rem, 2vw, 1.3rem)", color: "rgba(248,245,240,0.55)", lineHeight: 1.8 }}
        >
          Вы получили это приглашение,<br />
          а значит мы спешим сообщить вам важную новость!
        </motion.p>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.6, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontWeight: 300,
            fontSize: "clamp(3rem, 9vw, 7rem)", color: "#f8f5f0", lineHeight: 0.95, letterSpacing: "-0.01em" }}
        >
          Мы женимся!
        </motion.h1>

        {/* Names */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center gap-3"
        >
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300,
            fontSize: "clamp(1.6rem, 4vw, 3rem)", color: "rgba(248,245,240,0.9)", letterSpacing: "0.04em" }}>
            Данил & Софья
          </p>
          <div className="flex items-center gap-4">
            <div className="w-10 h-px" style={{ background: "rgba(248,245,240,0.3)" }} />
            <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300,
              fontSize: "11px", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(248,245,240,0.45)" }}>
              07 сентября 2026
            </span>
            <div className="w-10 h-px" style={{ background: "rgba(248,245,240,0.3)" }} />
          </div>
        </motion.div>

        {/* Invite text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.35, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontWeight: 300,
            fontSize: "clamp(0.95rem, 1.8vw, 1.2rem)", color: "rgba(248,245,240,0.5)", lineHeight: 1.8, maxWidth: 440 }}
        >
          Приглашаем вас разделить с нами радость этого особенного дня<br />
          и стать частью нашей семейной истории
        </motion.p>

        {/* Date big */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.55, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300,
            fontSize: "clamp(1.1rem, 2.5vw, 1.6rem)", color: "rgba(248,245,240,0.65)", letterSpacing: "0.05em" }}
        >
          Ждём вас: <span style={{ fontStyle: "italic" }}>7 Сентября 2026</span>
        </motion.p>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10"
      >
        <motion.div
          className="w-px h-12"
          style={{ background: "linear-gradient(to bottom, rgba(248,245,240,0), rgba(248,245,240,0.4), rgba(248,245,240,0))", originY: 0 }}
          animate={{ scaleY: [0, 1, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "9px", letterSpacing: "0.4em",
          textTransform: "uppercase", color: "rgba(248,245,240,0.25)" }}>
          scroll
        </span>
      </motion.div>
    </section>
  );
}
