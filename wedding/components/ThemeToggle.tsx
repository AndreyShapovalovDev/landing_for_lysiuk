"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("wedding-theme");
    const dark = stored !== "light";
    setIsDark(dark);
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    const theme = next ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("wedding-theme", theme);
  };

  // Не рендерим до гидрации — иначе мигание и пропадание
  if (!mounted) return null;

  return (
    <motion.button
      onClick={toggle}
      aria-label="Переключить тему"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 4.2 }}
      className="fixed top-5 right-16 z-[9992] w-11 h-11 rounded-full flex items-center justify-center"
      style={{
        background: isDark ? "rgba(248,245,240,0.1)" : "rgba(26,26,26,0.1)",
        border: isDark ? "1px solid rgba(248,245,240,0.25)" : "1px solid rgba(26,26,26,0.2)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        boxShadow: isDark
          ? "0 2px 16px rgba(0,0,0,0.4)"
          : "0 2px 16px rgba(0,0,0,0.12)",
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.92 }}
    >
      <AnimatePresence mode="wait">
        {isDark ? (
          <motion.div
            key="sun"
            initial={{ opacity: 0, rotate: -80 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 80 }}
            transition={{ duration: 0.25 }}
          >
            <Sun size={16} strokeWidth={1.5} style={{ color: "rgba(248,245,240,0.75)" }} />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ opacity: 0, rotate: 80 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: -80 }}
            transition={{ duration: 0.25 }}
          >
            <Moon size={16} strokeWidth={1.5} style={{ color: "rgba(26,26,26,0.7)" }} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
