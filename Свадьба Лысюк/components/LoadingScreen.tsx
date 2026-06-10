"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const letters = ["D", "&", "S"];
const CURTAIN_EASE: [number, number, number, number] = [0.76, 0, 0.24, 1];

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 3200);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* ── Left curtain panel ── */}
          <motion.div
            key="curtain-left"
            className="fixed inset-y-0 left-0 z-[9999]"
            style={{ right: "50%", background: "var(--bg)" }}
            exit={{ x: "-101%", transition: { duration: 1.05, ease: CURTAIN_EASE } }}
          />

          {/* ── Right curtain panel ── */}
          <motion.div
            key="curtain-right"
            className="fixed inset-y-0 right-0 z-[9999]"
            style={{ left: "50%", background: "var(--bg)" }}
            exit={{ x: "101%", transition: { duration: 1.05, ease: CURTAIN_EASE } }}
          />

          {/* ── Content — fades out before curtains open ── */}
          <motion.div
            key="content"
            className="fixed inset-0 z-[10000] flex flex-col items-center justify-center gap-8"
            exit={{ opacity: 0, transition: { duration: 0.35 } }}
          >
            {/* Monogram with rings */}
            <div className="relative flex items-center justify-center" style={{ width: 180, height: 100 }}>
              {/* Ring 1 */}
              <motion.div
                style={{
                  position: "absolute",
                  width: 160, height: 160,
                  borderRadius: "50%",
                  border: "1px solid var(--fg-15)",
                  top: "50%", left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
              />
              {/* Ring 2 */}
              <motion.div
                style={{
                  position: "absolute",
                  width: 200, height: 200,
                  borderRadius: "50%",
                  border: "1px solid var(--fg-15)",
                  top: "50%", left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.4, delay: 1.3, ease: [0.16, 1, 0.3, 1] }}
              />

              {/* Letters */}
              <div className="relative flex items-center gap-2">
                {letters.map((letter, i) => (
                  <motion.span
                    key={letter}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 + i * 0.22, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontWeight: 300,
                      fontSize: letter === "&" ? "2.8rem" : "4rem",
                      lineHeight: 1,
                      color: letter === "&" ? "var(--fg-30)" : "var(--fg)",
                      letterSpacing: "0.05em",
                      fontStyle: letter === "&" ? "italic" : "normal",
                    }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Date */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 1.0, ease: "easeOut" }}
              className="text-xs tracking-[0.4em] uppercase font-light"
              style={{ fontFamily: "'Inter', sans-serif", color: "var(--fg-30)" }}
            >
              07 · 09 · 2026
            </motion.p>

            {/* Progress line */}
            <motion.div className="w-24 h-px overflow-hidden" style={{ background: "var(--fg-08)" }}>
              <motion.div
                className="h-full"
                style={{ background: "var(--fg-50)" }}
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 2.4, ease: [0.16, 1, 0.3, 1] }}
              />
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
