"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { MapPin, Navigation, ExternalLink } from "lucide-react";

const VENUE = {
  name: "Особняк",
  address: "Братский переулок, 47, Ростов-на-Дону",
  description: "Элегантная площадка в историческом особняке в самом сердце Ростова-на-Дону",
  yandexUrl: "https://yandex.ru/maps/39/rostov-na-donu/?text=Братский%20переулок%2047%2C%20Ростов-на-Дону&z=17",
  // Iframe embed — Яндекс Карты конструктор
  iframeSrc: "https://yandex.ru/map-widget/v1/?ll=39.719500%2C47.220800&z=17&pt=39.719500%2C47.220800%2Cpm2rdm",
};

export default function LocationSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "center center"] });
  const headingScale = useTransform(scrollYProgress, [0, 1], [0.92, 1]);
  const headingY     = useTransform(scrollYProgress, [0, 1], [40, 0]);

  return (
    <section id="location" ref={sectionRef} className="relative py-32 md:py-48 px-8 md:px-16 lg:px-24 bg-section overflow-hidden">
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{ backgroundImage: "repeating-linear-gradient(0deg,var(--fg) 0px,var(--fg) 1px,transparent 1px,transparent 80px),repeating-linear-gradient(90deg,var(--fg) 0px,var(--fg) 1px,transparent 1px,transparent 80px)" }} />
      <div className="absolute top-0 left-0 right-0 h-32 pointer-events-none z-10"
        style={{ background: "linear-gradient(to bottom, var(--bg-2), transparent)" }} />

      <motion.div ref={ref} initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8 }} className="relative max-w-6xl mx-auto">

        <motion.div style={{ scale: headingScale, y: headingY }} className="mb-16 md:mb-24">
          <p className="text-[10px] tracking-[0.45em] uppercase mb-6 font-light"
            style={{ fontFamily: "'Inter', sans-serif", color: "var(--fg-30)" }}>
            Место проведения
          </p>
          <h2 className="text-[clamp(2.5rem,5vw,5rem)] leading-[0.95]"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, color: "var(--fg)" }}>
            Где это<br /><span style={{ fontStyle: "italic" }}>будет</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Glass card */}
          <motion.div initial={{ opacity: 0, x: -40 }} animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative rounded-2xl overflow-hidden"
            style={{ background: "var(--glass-bg)", backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)", border: "1px solid var(--glass-border)" }}>
            <div className="p-8 md:p-12 flex flex-col gap-8 h-full">
              <div className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ border: "1px solid var(--fg-15)" }}>
                <MapPin size={18} strokeWidth={1} style={{ color: "var(--fg-50)" }} />
              </div>
              <div>
                <p className="text-[10px] tracking-[0.35em] uppercase mb-3 font-light"
                  style={{ fontFamily: "'Inter', sans-serif", color: "var(--fg-30)" }}>Площадка</p>
                <h3 className="text-3xl md:text-4xl"
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontStyle: "italic", color: "var(--fg)" }}>
                  {VENUE.name}
                </h3>
              </div>
              <div className="h-px" style={{ background: "var(--fg-08)" }} />
              <div className="flex items-start gap-4">
                <Navigation size={14} className="mt-0.5 flex-shrink-0" strokeWidth={1.5} style={{ color: "var(--fg-30)" }} />
                <p className="text-sm font-light leading-relaxed"
                  style={{ fontFamily: "'Inter', sans-serif", color: "var(--fg-50)" }}>
                  {VENUE.address}
                </p>
              </div>
              <p className="font-light leading-relaxed flex-1"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic",
                  fontSize: "1.05rem", lineHeight: "1.75", color: "var(--fg-50)" }}>
                {VENUE.description}
              </p>
              <a href={VENUE.yandexUrl} target="_blank" rel="noopener noreferrer"
                className="group flex items-center gap-3 w-fit">
                <span className="text-xs tracking-[0.25em] uppercase font-light transition-opacity duration-300 group-hover:opacity-60"
                  style={{ fontFamily: "'Inter', sans-serif", color: "var(--fg-50)" }}>
                  Открыть в Яндекс Картах
                </span>
                <ExternalLink size={12} strokeWidth={1.5} style={{ color: "var(--fg-30)" }} />
              </a>
            </div>
          </motion.div>

          {/* Яндекс Карты iframe */}
          <motion.div initial={{ opacity: 0, x: 40 }} animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1.2, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative rounded-2xl overflow-hidden"
            style={{ minHeight: 420, border: "1px solid var(--glass-border)" }}>

            {inView && (
              <iframe
                src={VENUE.iframeSrc}
                title="Карта — Особняк, Братский переулок 47"
                className="absolute inset-0 w-full h-full"
                style={{ border: "none" }}
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            )}

            {/* Подпись */}
            <div className="absolute bottom-4 left-4 z-10 px-3 py-2 rounded-sm pointer-events-none"
              style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}>
              <p className="text-[9px] tracking-[0.2em] uppercase font-light"
                style={{ fontFamily: "'Inter', sans-serif", color: "rgba(248,245,240,0.65)" }}>
                Братский пер., 47 · Ростов-на-Дону
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
