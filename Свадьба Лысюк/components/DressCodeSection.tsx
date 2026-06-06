"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

// TODO: уточнить финальные цвета с молодожёнами
const palette = [
  { name: "Молочный",        hex: "#F5F0E8", note: "Основной" },
  { name: "Слоновая кость",  hex: "#E8DFD0", note: "" },
  { name: "Бежевый",         hex: "#C8B89A", note: "" },
  { name: "Тауп",            hex: "#8A7B6C", note: "" },
  { name: "Тёмно-шоколадный",hex: "#3A2E28", note: "" },
  { name: "Чёрный",          hex: "#1A1A1A", note: "Доступный" },
];

function WordReveal({ text, delay = 0, style }: { text: string; delay?: number; style?: React.CSSProperties }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const words = text.split(" ");
  return (
    <span ref={ref}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: delay + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: "inline-block", marginRight: "0.28em", ...style }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

export default function DressCodeSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "center center"] });
  const headingScale = useTransform(scrollYProgress, [0, 1], [0.93, 1]);
  const headingY     = useTransform(scrollYProgress, [0, 1], [50, 0]);

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      className="relative py-32 md:py-48 px-8 md:px-16 lg:px-24 bg-section overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-32 pointer-events-none z-10"
        style={{ background: "linear-gradient(to bottom, var(--bg-3), transparent)" }} />
      <div className="relative max-w-5xl mx-auto">

        {/* Heading */}
        <motion.div
          ref={ref}
          style={{ scale: headingScale, y: headingY }}
          className="mb-16 md:mb-24"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8 }}
            className="text-[10px] tracking-[0.45em] uppercase mb-6 font-light"
            style={{ fontFamily: "'Inter', sans-serif", color: "var(--fg-30)" }}
          >
            Дресс-код
          </motion.p>
          <h2
            className="text-[clamp(2.5rem,5vw,5rem)] leading-[0.95] mb-8"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, color: "var(--fg)" }}
          >
            <WordReveal text="Стиль торжества" />
          </h2>
          <p
            className="max-w-md font-light"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              color: "var(--fg-50)",
              fontSize: "1.1rem",
              lineHeight: "1.8",
            }}
          >
            <WordReveal
              text="Нам будет особенно приятно, если вы поддержите цветовую гамму нашей свадьбы в своих нарядах. Вдохновение для образов — нейтральные, тёплые и землистые тона."
              delay={0.2}
            />
          </p>
        </motion.div>

        {/* Color palette */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
          {palette.map((color, i) => (
            <motion.div
              key={color.hex}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.1 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-3 group cursor-default"
            >
              {/* Swatch */}
              <div
                className="w-full aspect-square md:aspect-[3/4] rounded-sm transition-transform duration-500 group-hover:scale-[1.03]"
                style={{ backgroundColor: color.hex }}
              />
              {/* Label */}
              <div className="flex flex-col gap-0.5">
                <span
                  className="text-[9px] tracking-[0.15em] uppercase font-light"
                  style={{ fontFamily: "'Inter', sans-serif", color: "var(--fg-50)" }}
                >
                  {color.name}
                </span>
                {color.note && (
                  <span
                    className="text-[8px] tracking-[0.1em] uppercase"
                    style={{ fontFamily: "'Inter', sans-serif", color: "var(--fg-30)" }}
                  >
                    {color.note}
                  </span>
                )}
                <span
                  className="font-mono text-[8px] mt-0.5"
                  style={{ color: "var(--fg-15)" }}
                >
                  {color.hex}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.5, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 h-px"
          style={{
            background: "linear-gradient(to right, transparent, var(--border), transparent)",
            originX: 0,
          }}
        />
      </div>
    </section>
  );
}
