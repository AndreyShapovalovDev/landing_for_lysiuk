"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

const WEDDING_DATE = new Date("2026-09-07T16:00:00");

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calcTimeLeft(): TimeLeft {
  const diff = WEDDING_DATE.getTime() - new Date().getTime();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours:   Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function Unit({ value, label, delay }: { value: number; label: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.1, delay, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center gap-3 md:gap-5"
    >
      <motion.span
        key={value}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="block text-[clamp(3rem,8vw,7rem)] leading-none tabular-nums"
        style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, letterSpacing: "-0.02em", color: "var(--fg)" }}
      >
        {String(value).padStart(2, "0")}
      </motion.span>
      <span
        className="text-[9px] md:text-[10px] tracking-[0.4em] uppercase font-light"
        style={{ fontFamily: "'Inter', sans-serif", color: "var(--fg-30)" }}
      >
        {label}
      </span>
    </motion.div>
  );
}

export default function CountdownSection() {
  // Начинаем с нулей — сервер и клиент совпадают, потом useEffect обновит
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true });

  useEffect(() => {
    setTimeLeft(calcTimeLeft()); // первый рендер на клиенте
    const id = setInterval(() => setTimeLeft(calcTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  const sep = (delay: number) => (
    <motion.span
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ delay }}
      className="text-[clamp(2rem,5vw,5rem)] leading-none pt-2 md:pt-4"
      style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, color: "var(--fg-15)" }}
    >
      :
    </motion.span>
  );

  return (
    <section ref={sectionRef} className="relative py-32 md:py-48 bg-section-3 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-32 pointer-events-none z-10"
        style={{ background: "linear-gradient(to bottom, var(--bg-2), transparent)" }} />
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-10"
        style={{ background: "linear-gradient(to top, var(--bg), transparent)" }} />

      {/* Large bg text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" aria-hidden>
        <span
          className="text-[20vw] leading-none"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, color: "var(--fg-08)" }}
        >
          07.09
        </span>
      </div>

      <div className="relative px-8 md:px-16 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9 }}
          className="text-[10px] tracking-[0.45em] uppercase mb-16 md:mb-24 font-light"
          style={{ fontFamily: "'Inter', sans-serif", color: "var(--fg-30)" }}
        >
          До особого дня
        </motion.p>

        {/* Desktop: одна строка */}
        <div className="hidden sm:flex items-start justify-center gap-6 md:gap-10 lg:gap-16">
          <Unit value={timeLeft.days}    label="Дней"   delay={0}   />
          {sep(0.3)}
          <Unit value={timeLeft.hours}   label="Часов"  delay={0.1} />
          {sep(0.35)}
          <Unit value={timeLeft.minutes} label="Минут"  delay={0.2} />
          {sep(0.4)}
          <Unit value={timeLeft.seconds} label="Секунд" delay={0.3} />
        </div>
        {/* Mobile: сетка 2×2 */}
        <div className="sm:hidden grid grid-cols-2 gap-x-8 gap-y-10 max-w-[280px] mx-auto">
          <Unit value={timeLeft.days}    label="Дней"   delay={0}   />
          <Unit value={timeLeft.hours}   label="Часов"  delay={0.1} />
          <Unit value={timeLeft.minutes} label="Минут"  delay={0.2} />
          <Unit value={timeLeft.seconds} label="Секунд" delay={0.3} />
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.5 }}
          className="mt-16 md:mt-24 font-light"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "1.15rem", color: "var(--fg-30)" }}
        >
          07 сентября 2026
        </motion.p>
      </div>
    </section>
  );
}
