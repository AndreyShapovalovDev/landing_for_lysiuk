"use client";

import { useScroll, useSpring, motion } from "framer-motion";

export default function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 1,
        scaleX,
        originX: 0,
        background: "linear-gradient(to right, var(--fg-15), var(--fg-50), var(--fg-15))",
        zIndex: 9999,
        pointerEvents: "none",
      }}
    />
  );
}
