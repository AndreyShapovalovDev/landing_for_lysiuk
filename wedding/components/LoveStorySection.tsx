"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, useInView, AnimatePresence, useMotionValue, useSpring, useTransform, type MotionValue } from "framer-motion";
import Image from "next/image";
import { ExternalLink, Camera } from "lucide-react";

const MAX_GROUP_URL = "https://max.ru/";

// Фото истории — добавь story-1.webp … story-6.webp в public/photos/ когда будут готовы
const photos = [
  { src: "/photos/1.jpeg", aspect: "portrait", delay: 0    },
  { src: "/photos/2.jpeg", aspect: "portrait", delay: 0.12 },
];

const aspectMap: Record<string, string> = {
  portrait:  "aspect-[3/4]",
  landscape: "aspect-[4/3]",
  square:    "aspect-square",
};

// Dota 2 Meat Hook — максимально детальный с эффектами
function BoneHook() {
  return (
    <svg width="140" height="160" viewBox="0 0 140 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* Красное свечение крюка */}
        <filter id="hookGlow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="4" result="blur"/>
          <feColorMatrix in="blur" type="matrix"
            values="2 0 0 0 0.6  0 0.1 0 0 0  0 0 0.1 0 0  0 0 0 1.5 0" result="glow"/>
          <feMerge><feMergeNode in="glow"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        {/* Кровавое свечение */}
        <filter id="bloodGlow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feColorMatrix in="blur" type="matrix"
            values="3 0 0 0 0.5  0 0 0 0 0  0 0 0 0 0  0 0 0 2 0" result="glow"/>
          <feMerge><feMergeNode in="glow"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        {/* Металлический градиент */}
        <linearGradient id="metalShaft" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#c8a060"/>
          <stop offset="30%"  stopColor="#f0d090"/>
          <stop offset="60%"  stopColor="#d4a850"/>
          <stop offset="100%" stopColor="#8a6030"/>
        </linearGradient>
        <linearGradient id="metalHook" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stopColor="#7a4020"/>
          <stop offset="40%"  stopColor="#b06030"/>
          <stop offset="100%" stopColor="#5a2810"/>
        </linearGradient>
        <linearGradient id="hookShine" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="rgba(255,200,100,0.4)"/>
          <stop offset="100%" stopColor="rgba(255,100,0,0)"/>
        </linearGradient>
        {/* Ржавчина */}
        <filter id="rust">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" result="noise"/>
          <feColorMatrix in="noise" type="saturate" values="0.3" result="colorNoise"/>
          <feBlend in="SourceGraphic" in2="colorNoise" mode="multiply" result="blend"/>
          <feComposite in="blend" in2="SourceGraphic" operator="in"/>
        </filter>
      </defs>

      {/* ── Ambient glow под крюком ── */}
      <ellipse cx="70" cy="140" rx="50" ry="14" fill="rgba(180,40,0,0.2)" filter="url(#hookGlow)"/>

      {/* ── Цепное кольцо (крепление к цепи) ── */}
      <ellipse cx="70" cy="8" rx="16" ry="9" fill="#3a3a3a" stroke="#666" strokeWidth="2.5"/>
      <ellipse cx="70" cy="8" rx="10" ry="5" fill="#222" stroke="#888" strokeWidth="1.5"/>
      <path d="M58 6 Q70 2 82 6" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>

      {/* ── Основной стержень (кость) ── */}
      {/* Тень */}
      <rect x="63" y="14" width="22" height="76" rx="9" fill="rgba(0,0,0,0.4)" transform="translate(3,3)"/>
      {/* Основа */}
      <rect x="63" y="14" width="22" height="76" rx="9" fill="url(#metalShaft)" filter="url(#hookGlow)"/>
      {/* Highlights */}
      <rect x="67" y="16" width="7" height="72" rx="4" fill="rgba(255,240,180,0.35)"/>
      <rect x="66" y="18" width="3" height="68" rx="2" fill="rgba(255,255,220,0.2)"/>
      {/* Линии-надрезы как у настоящей кости */}
      {[28, 44, 60, 76].map((y, i) => (
        <line key={i} x1="64" y1={y} x2="84" y2={y} stroke="rgba(0,0,0,0.25)" strokeWidth="1.5"/>
      ))}
      {/* Пятна ржавчины на стержне */}
      <circle cx="72" cy="35" r="4" fill="rgba(120,60,10,0.4)"/>
      <circle cx="78" cy="55" r="3" fill="rgba(140,70,10,0.35)"/>
      <circle cx="66" cy="70" r="3.5" fill="rgba(100,50,10,0.3)"/>

      {/* ── Верхняя костяная шляпка ── */}
      <ellipse cx="74" cy="16" rx="30" ry="18" fill="#d4b070" stroke="#8a6030" strokeWidth="2"/>
      <ellipse cx="74" cy="16" rx="30" ry="18" fill="url(#hookShine)"/>
      <ellipse cx="74" cy="14" rx="20" ry="11" fill="#e8c880"/>
      <ellipse cx="70" cy="12" rx="12" ry="7"  fill="rgba(255,240,180,0.5)"/>
      {/* Трещины */}
      <path d="M58 12 L65 20" stroke="rgba(80,40,10,0.5)" strokeWidth="1.2" fill="none"/>
      <path d="M82 10 L76 18" stroke="rgba(80,40,10,0.4)" strokeWidth="1" fill="none"/>

      {/* ── Нижняя костяная шляпка ── */}
      <ellipse cx="74" cy="88" rx="30" ry="18" fill="#d4b070" stroke="#8a6030" strokeWidth="2"/>
      <ellipse cx="74" cy="88" rx="30" ry="18" fill="url(#hookShine)"/>
      <ellipse cx="74" cy="88" rx="20" ry="11" fill="#e8c880"/>
      <ellipse cx="70" cy="87" rx="12" ry="7"  fill="rgba(255,240,180,0.45)"/>

      {/* ── Крюк — главная форма ── */}
      {/* Тень крюка */}
      <path d="M74 90 C74 115 74 128 55 135 C36 142 18 136 14 118 C10 100 22 86 40 86"
        stroke="rgba(0,0,0,0.5)" strokeWidth="18" fill="none" strokeLinecap="round" transform="translate(3,3)"/>
      {/* Внешний слой — тёмный металл */}
      <path d="M74 90 C74 115 74 128 55 135 C36 142 18 136 14 118 C10 100 22 86 40 86"
        stroke="#4a1f08" strokeWidth="18" fill="none" strokeLinecap="round"/>
      {/* Средний слой — ржавый */}
      <path d="M74 90 C74 115 74 128 55 135 C36 142 18 136 14 118 C10 100 22 86 40 86"
        stroke="url(#metalHook)" strokeWidth="13" fill="none" strokeLinecap="round"/>
      {/* Внутренний highlight */}
      <path d="M74 90 C74 112 74 124 58 132 C42 138 24 133 18 117"
        stroke="rgba(200,120,60,0.5)" strokeWidth="5" fill="none" strokeLinecap="round"/>
      {/* Блик сверху */}
      <path d="M74 92 C74 110 73 120 60 128"
        stroke="rgba(255,180,80,0.35)" strokeWidth="3" fill="none" strokeLinecap="round"/>

      {/* ── Острие крюка ── */}
      {/* Основа острия */}
      <circle cx="40" cy="86" r="12" fill="#3a1808" filter="url(#hookGlow)"/>
      <circle cx="40" cy="86" r="9"  fill="#6a3018"/>
      <circle cx="40" cy="86" r="6"  fill="#9a5028"/>
      <circle cx="40" cy="86" r="3"  fill="#c07040"/>
      {/* Сам шип */}
      <path d="M34 80 L28 68 L38 78" fill="#8a4020" stroke="#5a2010" strokeWidth="1"/>
      <path d="M34 80 L28 68 L38 78" fill="rgba(255,150,50,0.3)"/>
      {/* Блик на острие */}
      <path d="M30 72 L33 76" stroke="rgba(255,220,100,0.6)" strokeWidth="1.5" strokeLinecap="round"/>

      {/* ── Кровь ── */}
      <g filter="url(#bloodGlow)">
        {/* Крупные капли */}
        <ellipse cx="28" cy="122" rx="4.5" ry="7" fill="#8b0000"/>
        <ellipse cx="28" cy="122" rx="3"   ry="5" fill="#cc0000"/>
        <ellipse cx="16" cy="112" rx="3.5" ry="5.5" fill="#8b0000"/>
        <ellipse cx="16" cy="112" rx="2.5" ry="4"   fill="#cc0000"/>
        {/* Потёки */}
        <path d="M22 130 Q20 138 22 144" stroke="#8b0000" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <path d="M35 136 Q33 145 35 150" stroke="#6b0000" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <path d="M14 108 Q12 116 14 122" stroke="#8b0000" strokeWidth="2" fill="none" strokeLinecap="round"/>
        {/* Маленькие брызги */}
        <circle cx="42" cy="92"  r="2.5" fill="#cc0000" opacity="0.8"/>
        <circle cx="18" cy="100" r="2"   fill="#aa0000" opacity="0.7"/>
        <circle cx="10" cy="118" r="1.5" fill="#cc0000" opacity="0.6"/>
        <circle cx="30" cy="140" r="2"   fill="#880000" opacity="0.8"/>
        {/* Лужица на конце */}
        <ellipse cx="30" cy="153" rx="12" ry="4" fill="#6b0000" opacity="0.5"/>
        <ellipse cx="30" cy="153" rx="7"  ry="2.5" fill="#8b0000" opacity="0.6"/>
      </g>

      {/* ── Дополнительный красный glow вокруг всего ── */}
      <ellipse cx="55" cy="105" rx="55" ry="60"
        fill="none" stroke="rgba(200,40,0,0.08)" strokeWidth="20"/>
    </svg>
  );
}

// Частицы-искры при полёте крюка
function HookTrail({ x, y, ang }: { x: number; y: number; ang: number }) {
  const sparks = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    ox: (Math.sin(i * 1.3) * 30),
    oy: (Math.cos(i * 1.7) * 30),
    size: 2 + Math.random() * 4,
    delay: i * 0.04,
  }));

  return (
    <motion.div
      className="fixed pointer-events-none"
      style={{ left: x - 20, top: y - 20, zIndex: 9991 }}
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      {sparks.map(s => (
        <motion.div
          key={s.id}
          className="absolute rounded-full"
          style={{
            width: s.size, height: s.size,
            background: s.id % 3 === 0 ? "#ff6600" : s.id % 3 === 1 ? "#ff2200" : "#ffaa00",
            boxShadow: `0 0 ${s.size * 2}px ${s.id % 2 === 0 ? "#ff4400" : "#ffaa00"}`,
            left: 20, top: 20,
          }}
          animate={{ x: s.ox, y: s.oy, opacity: [1, 0], scale: [1, 0] }}
          transition={{ duration: 0.5, delay: s.delay, ease: "easeOut" }}
        />
      ))}
      {/* Кровавые капли */}
      {[0,1,2].map(i => (
        <motion.div
          key={`blood-${i}`}
          className="absolute rounded-full"
          style={{
            width: 4 + i * 2, height: 4 + i * 2,
            background: "#8b0000",
            boxShadow: "0 0 6px #cc0000",
            left: 20, top: 20,
          }}
          animate={{
            x: Math.sin(i * 2.1 + 1) * 40,
            y: Math.cos(i * 2.1 + 1) * 40 + 20,
            opacity: [0.9, 0],
            scaleY: [1, 2],
          }}
          transition={{ duration: 0.7, delay: i * 0.08, ease: "easeOut" }}
        />
      ))}
    </motion.div>
  );
}

// Chain link — MASSIVE, metallic, Dota-style
function ChainLink({ rotate }: { rotate?: boolean }) {
  return (
    <svg
      width={rotate ? "34" : "50"}
      height={rotate ? "50" : "34"}
      viewBox="0 0 50 34"
      fill="none"
      style={{ transform: rotate ? "rotate(90deg)" : undefined, flexShrink: 0 }}
    >
      {/* Outer ring */}
      <ellipse cx="25" cy="17" rx="24" ry="16" fill="#2a2a2a" stroke="#5a5a5a" strokeWidth="3"/>
      {/* Inner hole */}
      <ellipse cx="25" cy="17" rx="15" ry="9" fill="#111" stroke="#444" strokeWidth="2"/>
      {/* Metal highlight top */}
      <path d="M10 10 Q25 5 40 10" stroke="rgba(255,255,255,0.18)" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      {/* Metal shadow bottom */}
      <path d="M10 24 Q25 29 40 24" stroke="rgba(0,0,0,0.4)" strokeWidth="2" fill="none" strokeLinecap="round"/>
      {/* Rust spots */}
      <circle cx="8"  cy="17" r="2.5" fill="#5a3010" opacity="0.6"/>
      <circle cx="42" cy="17" r="2.5" fill="#5a3010" opacity="0.6"/>
    </svg>
  );
}

// ─── PUDGE SCENE ──────────────────────────────────────────────────────────────
type Phase = "idle" | "enter" | "aim" | "throw" | "retract" | "exit";

interface HookState {
  phase: Phase;
  tx: number;
  ty: number;
}

function PudgeScene({ hook }: { hook: HookState }) {
  const pudgeW = 280;
  const pudgeH = 280;

  // Position Pudge at bottom-left, slightly above screen bottom
  const pudgeBottom = 20;
  const pudgeLeft   = -20;

  // Hook chain origin = Pudge's right arm area (right side of image, mid-height)
  const chainOriginX = pudgeLeft + pudgeW * 0.82;
  const chainOriginY = typeof window !== "undefined"
    ? window.innerHeight - pudgeBottom - pudgeH * 0.42
    : 400;

  const dx  = hook.tx - chainOriginX;
  const dy  = hook.ty - chainOriginY;
  const len = Math.sqrt(dx * dx + dy * dy);
  const ang = Math.atan2(dy, dx) * (180 / Math.PI);

  // Number of chain links — 50px per link
  const linkCount = Math.max(1, Math.floor((len - 110) / 50));

  const isVisible = hook.phase !== "idle";
  const isOut        = hook.phase === "throw";
  const isRetracting = hook.phase === "retract";
  const isHit        = hook.phase === "retract"; // момент удара = начало возврата

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="pudge-scene"
          className="fixed inset-0 pointer-events-none"
          style={{ zIndex: 9990 }}
          exit={{ opacity: 1 }}
        >
          {/* Частицы-искры в точке удара */}
          {isHit && (
            <HookTrail x={hook.tx} y={hook.ty} ang={ang} />
          )}

          {/* Кровавая вспышка на весь экран */}
          <AnimatePresence>
            {isHit && (
              <motion.div
                key="flash"
                className="fixed inset-0 pointer-events-none"
                style={{ background: "radial-gradient(ellipse at var(--fx) var(--fy), rgba(180,0,0,0.35) 0%, transparent 60%)",
                  ["--fx" as string]: `${hook.tx}px`,
                  ["--fy" as string]: `${hook.ty}px`,
                  zIndex: 9989 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.5, times: [0, 0.2, 1] }}
              />
            )}
          </AnimatePresence>
          {/* ── Pudge character ── */}
          <motion.div
            className="absolute"
            style={{ bottom: pudgeBottom, left: pudgeLeft }}
            initial={{ x: -(pudgeW + 40), opacity: 0 }}
            animate={
              hook.phase === "enter" || hook.phase === "aim" || hook.phase === "throw" || hook.phase === "retract"
                ? { x: 0, opacity: 1 }
                : { x: -(pudgeW + 40), opacity: 0 }
            }
            transition={{
              x: hook.phase === "exit"
                ? { duration: 0.45, ease: [0.6, 0, 1, 1] }
                : { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
              opacity: { duration: 0.3 },
            }}
          >
            {/* Actual Pudge image from Steam CDN */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/pudge.png"
              alt="Pudge"
              width={pudgeW}
              height={pudgeH}
              style={{
                width: pudgeW,
                height: pudgeH,
                objectFit: "cover",
                objectPosition: "center top",
                imageRendering: "crisp-edges",
                filter: "drop-shadow(0 4px 24px rgba(180,60,0,0.5)) contrast(1.08) saturate(1.1)",
                transform: hook.phase === "aim" || hook.phase === "throw"
                  ? "scaleX(-1) rotate(-4deg)"
                  : "scaleX(-1)",
                transition: "transform 0.25s ease",
              }}
            />

            {/* MEAT HOOK label */}
            <AnimatePresence>
              {hook.phase === "throw" && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.7 }}
                  animate={{ opacity: 1, y: -16, scale: 1 }}
                  exit={{ opacity: 0, y: -28 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    position: "absolute",
                    top: -10,
                    left: "50%",
                    transform: "translateX(-50%)",
                    whiteSpace: "nowrap",
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 900,
                    fontSize: "18px",
                    letterSpacing: "0.25em",
                    color: "#ff3300",
                    textShadow: "0 0 20px rgba(255,80,0,1), 0 0 50px rgba(200,40,0,0.8), 0 2px 4px rgba(0,0,0,0.8)",
                    textTransform: "uppercase",
                  }}
                >
                  🪝 MEAT HOOK!
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* ── Hook chain + bone hook ── */}
          <AnimatePresence>
            {(isOut || isRetracting) && (
              <motion.div
                key="chain"
                className="absolute"
                style={{
                  left: chainOriginX,
                  top: chainOriginY,
                  transformOrigin: "0 0",
                  rotate: ang,
                }}
                initial={{}}
                exit={{}}
              >
                {/* Chain links */}
                {/* Chain */}
                <motion.div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    transformOrigin: "0 50%",
                    height: 34,
                    overflow: "hidden",
                    gap: "-4px",
                  }}
                  initial={{ width: 0 }}
                  animate={isOut
                    ? { width: Math.max(0, len - 110) }
                    : { width: 0 }}
                  transition={{ duration: isOut ? 0.32 : 0.24, ease: isOut ? [0.4,0,0.2,1] : [0.4,0,1,1] }}
                >
                  {Array.from({ length: linkCount }).map((_, i) => (
                    <ChainLink key={i} rotate={i % 2 === 1} />
                  ))}
                </motion.div>

                {/* Bone Hook head — Dota 2 style */}
                <motion.div
                  style={{ position: "absolute", top: -55, left: 0 }}
                  initial={{ x: 0 }}
                  animate={isOut
                    ? { x: Math.max(0, len - 110) }
                    : { x: 0 }}
                  transition={{ duration: isOut ? 0.3 : 0.22, ease: isOut ? [0.4,0,0.2,1] : [0.4,0,1,1] }}
                >
                  <BoneHook />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── PHOTO CARD ───────────────────────────────────────────────────────────────
function PhotoCard({
  photo,
  index,
  onHook,
  disabled,
  depth,
  mouseX,
  mouseY,
}: {
  photo: typeof photos[0];
  index: number;
  onHook: (rect: DOMRect) => void;
  disabled: boolean;
  depth: number;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
}) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [caught, setCaught] = useState(false);
  const [toast,  setToast]  = useState(false);

  // Hover-parallax: each card shifts by depth * 6px max
  const shiftX = useTransform(mouseX, [0, 1], [-depth * 6, depth * 6]);
  const shiftY = useTransform(mouseY, [0, 1], [-depth * 4, depth * 4]);

  const handleClick = () => {
    if (disabled || !ref.current) return;
    onHook(ref.current.getBoundingClientRect());
    setCaught(true); setToast(true);
    setTimeout(() => setCaught(false), 800);
    setTimeout(() => setToast(false),  2500);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60, scale: 0.96 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 1.2, delay: photo.delay, ease: [0.16, 1, 0.3, 1] }}
      className={`relative overflow-visible group w-full ${aspectMap[photo.aspect]} ${disabled ? "" : "cursor-crosshair"}`}
      onClick={handleClick}
      title={disabled ? "" : "Кликни — Пудж придёт"}
    >
      {/* Parallax wrapper — shifts on mouse move */}
      <motion.div
        style={{ x: shiftX, y: shiftY, position: "absolute", inset: 0 }}
        transition={{ type: "spring", stiffness: 60, damping: 20 }}
      >
      <motion.div
        className="absolute inset-0 overflow-hidden"
        animate={caught
          ? { x: [0, -12, 16, -10, 6, 0], rotate: [0, -3, 4, -2, 1, 0], scale: [1, 1.04, 1.04, 1] }
          : { x: 0, rotate: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <Image
          src={photo.src}
          alt={`Даниил и София — фото ${index + 1}`}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          style={{ filter: "grayscale(20%)" }}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/12 transition-colors duration-500" />

        {/* Crosshair hint on hover */}
        {!disabled && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <span style={{ fontSize: 28, filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.6))" }}>🎯</span>
          </div>
        )}

        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-[9px] tracking-[0.3em] uppercase"
            style={{ color: "rgba(248,245,240,0.6)", fontFamily: "'Inter', sans-serif" }}>
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
      </motion.div>

      {/* CAUGHT toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: 12, scale: 0.75 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="absolute -top-12 left-1/2 -translate-x-1/2 px-4 py-2 z-20 pointer-events-none whitespace-nowrap"
            style={{
              background: "linear-gradient(135deg, #8b0000, #cc3300)",
              color: "#fff",
              fontFamily: "'Inter', sans-serif",
              fontSize: "11px",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              fontWeight: 800,
              borderRadius: "2px",
              boxShadow: "0 0 24px rgba(200,40,0,0.7), 0 4px 12px rgba(0,0,0,0.4)",
            }}
          >
            🩸 HOOKED!
          </motion.div>
        )}
      </AnimatePresence>
      </motion.div> {/* end parallax wrapper */}
    </motion.div>
  );
}

// ─── SECTION ──────────────────────────────────────────────────────────────────
export default function LoveStorySection() {
  const headingRef    = useRef<HTMLDivElement>(null);
  const headingInView = useInView(headingRef, { once: true, margin: "-60px" });
  const sectionRef    = useRef<HTMLElement>(null);

  const [hookState, setHookState] = useState<HookState>({ phase: "idle", tx: 0, ty: 0 });
  const busy = hookState.phase !== "idle";

  // Mouse-tracking for hover parallax (desktop only)
  const rawMouseX = useMotionValue(0.5);
  const rawMouseY = useMotionValue(0.5);
  const mouseX = useSpring(rawMouseX, { stiffness: 55, damping: 18 });
  const mouseY = useSpring(rawMouseY, { stiffness: 55, damping: 18 });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    rawMouseX.set((e.clientX - rect.left) / rect.width);
    rawMouseY.set((e.clientY - rect.top)  / rect.height);
  };
  const handleMouseLeave = () => {
    rawMouseX.set(0.5);
    rawMouseY.set(0.5);
  };

  const fireHook = useCallback((rect: DOMRect) => {
    if (busy) return;

    const tx = rect.left + rect.width  / 2;
    const ty = rect.top  + rect.height / 2;

    // Pudge enters → aims → throws → retracts → exits → idle
    setHookState({ phase: "enter",   tx, ty });
    setTimeout(() => setHookState(s => ({ ...s, phase: "aim" })),     450);
    setTimeout(() => setHookState(s => ({ ...s, phase: "throw" })),   750);
    setTimeout(() => setHookState(s => ({ ...s, phase: "retract" })), 1100);
    setTimeout(() => setHookState(s => ({ ...s, phase: "exit" })),    1500);
    setTimeout(() => setHookState(s => ({ ...s, phase: "idle" })),    2100);
  }, [busy]);

  return (
    <section
      ref={sectionRef}
      className="relative py-32 md:py-48 px-8 md:px-16 lg:px-24 bg-section overflow-visible"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >

      <PudgeScene hook={hookState} />

      {/* Heading */}
      <motion.div
        ref={headingRef}
        initial={{ opacity: 0, x: -30 }}
        animate={headingInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 1, ease: "easeOut" }}
        className="mb-16 md:mb-24"
      >
        <p className="text-[10px] tracking-[0.45em] uppercase mb-6 font-light"
          style={{ fontFamily: "'Inter', sans-serif", color: "var(--fg-30)" }}>
          История
        </p>
        <h2 className="text-[clamp(2.5rem,5vw,5rem)] leading-[0.95]"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, color: "var(--fg)" }}>
          История, которая стала
          <br /><span style={{ fontStyle: "italic" }}>началом новой семьи</span>
        </h2>

        {/* Easter egg hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={headingInView ? { opacity: 1 } : {}}
          transition={{ delay: 1.5, duration: 1 }}
          className="mt-4 text-[10px] tracking-[0.2em] uppercase font-light"
          style={{ fontFamily: "'Inter', sans-serif", color: "var(--fg-15)" }}
        >
          🎯 кликни на фото
        </motion.p>
      </motion.div>

      {/* Masonry grid — 6 фото */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5 max-w-6xl mx-auto">
        {photos.map((photo, i) => (
          <PhotoCard
            key={i}
            photo={photo}
            index={i}
            onHook={fireHook}
            disabled={busy}
            depth={0.6 + (i % 3) * 0.4}
            mouseX={mouseX}
            mouseY={mouseY}
          />
        ))}
      </div>

      {/* MAX CTA */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        className="mt-20 flex flex-col items-center gap-6"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-px" style={{ background: "var(--border)" }} />
          <Camera size={14} style={{ color: "var(--fg-30)" }} strokeWidth={1.5} />
          <div className="w-16 h-px" style={{ background: "var(--border)" }} />
        </div>
        <p className="text-center max-w-xs font-light"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "1.1rem", lineHeight: "1.75", color: "var(--fg-50)" }}>
          Делитесь вашими фотографиями с праздника в нашей группе
        </p>
        <a href={MAX_GROUP_URL} target="_blank" rel="noopener noreferrer"
          className="relative group flex items-center gap-3 px-8 py-3.5 overflow-hidden"
          style={{ border: "1px solid var(--border)" }}>
          <span className="relative text-[10px] tracking-[0.3em] uppercase font-light"
            style={{ fontFamily: "'Inter', sans-serif", color: "var(--fg-50)" }}>
            Открыть группу в MAX
          </span>
          <ExternalLink size={11} strokeWidth={1.5} style={{ color: "var(--fg-30)" }} className="relative" />
          <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
            style={{ background: "var(--fg-08)" }} />
        </a>
      </motion.div>
    </section>
  );
}
