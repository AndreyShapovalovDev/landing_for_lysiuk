"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

const NAV_ITEMS = [
  { label: "Программа",   href: "#timeline"  },
  { label: "Место",        href: "#location"  },
  { label: "Подтверждение",href: "#rsvp"      },
];

export default function NavBar() {
  const [visible,  setVisible]  = useState(false);
  const [active,   setActive]   = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const { scrollY } = useScroll();

  // Показываем nav после первого экрана
  useEffect(() => {
    const unsub = scrollY.on("change", v => {
      setVisible(v > window.innerHeight * 0.7);
    });
    return unsub;
  }, [scrollY]);

  // Active section detection
  useEffect(() => {
    const ids = ["timeline", "location", "rsvp"];
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -50% 0px" }
    );
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (href: string) => {
    const id = href.replace("#", "");
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed top-0 left-0 right-0 z-[9988]"
          style={{
            background: "var(--nav-bg)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <div className="max-w-6xl mx-auto px-6 md:px-12 h-14 flex items-center justify-between">
            {/* Monogram */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="text-sm font-light tracking-[0.3em] uppercase transition-opacity duration-300 hover:opacity-60"
              style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--fg)" }}
            >
              D & S
            </button>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-8">
              {NAV_ITEMS.map((item, i) => (
                <motion.button
                  key={item.href}
                  onClick={() => scrollTo(item.href)}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                  className="relative text-[10px] tracking-[0.3em] uppercase font-light transition-colors duration-300"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    color: active === item.href.replace("#", "")
                      ? "var(--fg)"
                      : "var(--fg-30)",
                  }}
                >
                  {item.label}
                  {active === item.href.replace("#", "") && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute -bottom-1 left-0 right-0 h-px"
                      style={{ background: "var(--fg)" }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </motion.button>
              ))}
            </nav>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(o => !o)}
              className="md:hidden flex flex-col gap-1.5 p-2"
              aria-label="Меню"
            >
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  className="w-5 h-px"
                  style={{ background: "var(--fg-50)" }}
                  animate={menuOpen ? {
                    rotate: i === 1 ? 0 : i === 0 ? 45 : -45,
                    y: i === 1 ? 0 : i === 0 ? 7 : -7,
                    opacity: i === 1 ? 0 : 1,
                  } : { rotate: 0, y: 0, opacity: 1 }}
                  transition={{ duration: 0.25 }}
                />
              ))}
            </button>
          </div>

          {/* Mobile dropdown */}
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="md:hidden overflow-hidden"
                style={{ borderTop: "1px solid var(--border)" }}
              >
                <div className="px-6 py-4 flex flex-col gap-4">
                  {NAV_ITEMS.map(item => (
                    <button
                      key={item.href}
                      onClick={() => scrollTo(item.href)}
                      className="text-left text-[11px] tracking-[0.3em] uppercase font-light py-2"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        color: active === item.href.replace("#", "")
                          ? "var(--fg)"
                          : "var(--fg-50)",
                      }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.header>
      )}
    </AnimatePresence>
  );
}
