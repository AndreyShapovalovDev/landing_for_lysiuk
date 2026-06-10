"use client";

import { useRef } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

interface Props {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  strength?: number; // 0–1, сила притяжения
}

export default function MagneticButton({ children, className, style, strength = 0.28 }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const x = useSpring(rawX, { stiffness: 280, damping: 22, mass: 0.5 });
  const y = useSpring(rawY, { stiffness: 280, damping: 22, mass: 0.5 });

  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const r  = ref.current.getBoundingClientRect();
    const cx = r.left + r.width  / 2;
    const cy = r.top  + r.height / 2;
    rawX.set((e.clientX - cx) * strength);
    rawY.set((e.clientY - cy) * strength);
  };

  const onLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{ x, y, display: "inline-flex", ...style }}
      className={className}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </motion.div>
  );
}
