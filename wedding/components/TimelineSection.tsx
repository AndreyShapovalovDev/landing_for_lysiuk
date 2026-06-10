"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform, useSpring, type MotionValue } from "framer-motion";
import RevealText from "./RevealText";

const events = [
  {
    time: "16:00",
    title: "Сбор гостей",
    description: "Ждём вас — время встретиться, обняться и настроиться на праздник",
  },
  {
    time: "16:30",
    title: "Выездная регистрация",
    description: "Торжественная церемония бракосочетания",
  },
  {
    time: "23:00",
    title: "Завершение вечера",
    description: "Спасибо, что были рядом в этот особенный день",
  },
];

function WordReveal({ text, delay = 0 }: { text: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const words = text.split(" ");

  return (
    <span ref={ref} style={{ display: "inline" }}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.7,
            delay: delay + i * 0.07,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{ display: "inline-block", marginRight: "0.28em" }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

function ScrollLine({ sectionRef }: { sectionRef: React.RefObject<HTMLDivElement | null> }) {
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.7", "end 0.8"],
  });
  const smooth     = useSpring(scrollYProgress, { stiffness: 80, damping: 24 });
  // strokeDashoffset goes 1→0 as the line "draws" from top to bottom
  const dashOffset = useTransform(smooth, [0, 1], [1, 0]) as MotionValue<number>;

  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        left: "calc(4rem + 2rem + 5.5px)",
        top: 6,
        bottom: 80,
        width: 2,
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      <svg
        width="2"
        height="100%"
        viewBox="0 0 2 100"
        preserveAspectRatio="none"
        style={{ display: "block", overflow: "visible" }}
      >
        <motion.line
          x1="1" y1="0"
          x2="1" y2="100"
          stroke="var(--fg-30)"
          strokeWidth="1"
          pathLength="1"
          strokeDasharray="1"
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}

function TimelineItem({
  event,
  index,
  total,
}: {
  event: (typeof events)[0];
  index: number;
  total: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const isLast = index === total - 1;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -30 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
      className="relative flex gap-8 md:gap-16"
    >
      {/* Time */}
      <div className="w-16 md:w-24 flex-shrink-0 pt-0.5">
        <motion.span
          className="text-xs tracking-[0.2em] font-light"
          style={{ fontFamily: "'Inter', sans-serif", color: "var(--fg-30)", display: "block" }}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {event.time}
        </motion.span>
      </div>

      {/* Dot + line */}
      <div className="flex flex-col items-center flex-shrink-0">
        <motion.div
          className="w-3 h-3 rounded-full flex items-center justify-center"
          style={{ border: "1px solid var(--fg-15)" }}
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.1, type: "spring", stiffness: 300 }}
        >
          <div className="w-1 h-1 rounded-full" style={{ background: "var(--fg-30)" }} />
        </motion.div>
        {!isLast && (
          <div className="w-px flex-1 mt-4" style={{ background: "var(--fg-08)", minHeight: "80px" }} />
        )}
      </div>

      {/* Content */}
      <div className="pb-16 md:pb-20 flex-1">
        <p
          className="text-[10px] tracking-[0.35em] uppercase mb-3 font-light"
          style={{ fontFamily: "'Inter', sans-serif", color: "var(--fg-30)" }}
        >
          {String(index + 1).padStart(2, "0")}
        </p>
        <h3
          className="text-2xl md:text-3xl mb-3"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, color: "var(--fg)" }}
        >
          <WordReveal text={event.title} delay={0.15} />
        </h3>
        <p
          className="text-sm font-light"
          style={{ fontFamily: "'Inter', sans-serif", color: "var(--fg-30)", lineHeight: 1.7 }}
        >
          <WordReveal text={event.description} delay={0.3} />
        </p>
      </div>
    </motion.div>
  );
}


export default function TimelineSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const titleInView = useInView(titleRef, { once: true, margin: "-60px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <section
      id="timeline"
      ref={sectionRef}
      className="relative py-32 md:py-48 bg-section-2 overflow-hidden"
    >
      {/* Subtle parallax grid */}
      <motion.div
        className="absolute inset-0 opacity-[0.018] pointer-events-none"
        style={{
          y: bgY,
          backgroundImage:
            "repeating-linear-gradient(0deg,var(--fg) 0px,var(--fg) 1px,transparent 1px,transparent 100px),repeating-linear-gradient(90deg,var(--fg) 0px,var(--fg) 1px,transparent 1px,transparent 100px)",
        }}
      />

      {/* Top fade from hero */}
      <div
        className="absolute top-0 left-0 right-0 h-32 pointer-events-none z-10"
        style={{ background: "linear-gradient(to bottom, var(--bg), transparent)" }}
      />

      <div className="relative px-8 md:px-16 lg:px-24 max-w-4xl">
        {/* Heading */}
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 40 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-20 md:mb-32"
        >
          <p
            className="text-[10px] tracking-[0.45em] uppercase mb-6 font-light"
            style={{ fontFamily: "'Inter', sans-serif", color: "var(--fg-30)" }}
          >
            07 · 09 · 2026
          </p>
          <RevealText
            as="h2"
            delay={0.1}
            className="text-[clamp(2.5rem,5vw,5rem)] leading-[0.95]"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, color: "var(--fg)" }}
          >
            Программа
            <br />
            <span style={{ fontStyle: "italic", color: "var(--fg-50)" }}>торжественного дня</span>
          </RevealText>
        </motion.div>

        {/* Timeline items */}
        <div className="relative">
          {/* Scroll-driven vertical line behind dots */}
          <ScrollLine sectionRef={sectionRef} />
          {events.map((event, i) => (
            <TimelineItem key={i} event={event} index={i} total={events.length} />
          ))}
        </div>

        {/* Venue photo — sticky on desktop */}
      </div>
    </section>
  );
}
