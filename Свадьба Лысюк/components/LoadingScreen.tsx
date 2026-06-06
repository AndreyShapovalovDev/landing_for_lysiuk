"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 2200);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1, ease: "easeInOut" } }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-8"
          style={{ background: "var(--bg)" }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span
              className="text-7xl tracking-[0.15em]"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, color: "var(--fg)" }}
            >
              Д&С
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5, ease: "easeOut" }}
            className="text-xs tracking-[0.4em] uppercase font-light"
            style={{ fontFamily: "'Inter', sans-serif", color: "var(--fg-30)" }}
          >
            07 · 09 · 2026
          </motion.p>

          <motion.div className="w-24 h-px overflow-hidden" style={{ background: "var(--fg-08)" }}>
            <motion.div
              className="h-full"
              style={{ background: "var(--fg-50)" }}
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
