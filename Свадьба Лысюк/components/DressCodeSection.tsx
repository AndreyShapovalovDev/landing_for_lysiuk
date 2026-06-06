"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

// TODO: уточнить финальные цвета с молодожёнами
const palette = [
  { name: "Молочный",        hex: "#F5F0E8", note: "Основной" },
  { name: "Слоновая кость",  hex: "#E8DFD0", note: "" },
  { name: "Бежевый",         hex: "#C8B89A", note: "" },
  { name: "Тауп",            hex: "#8A7B6C", note: "" },
  { name: "Тёмно-шоколадный",hex: "#3A2E28", note: "" },
  { name: "Чёрный",          hex: "#1A1A1A", note: "Доступный" },
];

export default function DressCodeSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="relative py-32 md:py-48 px-8 md:px-16 lg:px-24 bg-section overflow-hidden"
    >
      <div className="relative max-w-5xl mx-auto">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 md:mb-24"
        >
          <p
            className="text-[10px] tracking-[0.45em] uppercase mb-6 font-light"
            style={{ fontFamily: "'Inter', sans-serif", color: "var(--fg-30)" }}
          >
            Стиль торжества
          </p>
          <h2
            className="text-[clamp(2.5rem,5vw,5rem)] leading-[0.95]"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, color: "var(--fg)" }}
          >
            Стиль торжества
          </h2>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.15 }}
          className="mb-12 max-w-md font-light leading-relaxed"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            color: "var(--fg-50)",
            fontSize: "1.1rem",
            lineHeight: "1.8",
          }}
        >
          Нам будет особенно приятно, если вы поддержите
          цветовую гамму нашей свадьбы в своих нарядах.
          Вдохновение для образов — нейтральные, тёплые
          и землистые тона.
        </motion.p>

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
