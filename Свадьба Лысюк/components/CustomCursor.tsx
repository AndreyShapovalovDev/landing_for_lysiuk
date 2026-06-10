"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const INTERACTIVE = "a, button, [role='button'], label, input, textarea, select, [tabindex]";

export default function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const dotX    = useMotionValue(-100);
  const dotY    = useMotionValue(-100);

  const springConfig = { damping: 28, stiffness: 200 };
  const springX = useSpring(cursorX, springConfig);
  const springY = useSpring(cursorY, springConfig);

  const [isHovering, setIsHovering] = useState(false);
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
      dotX.set(e.clientX - 3);
      dotY.set(e.clientY - 3);
    };

    // Check nearest interactive ancestor on every mouseover (event bubbles)
    const onOver = (e: MouseEvent) => {
      setIsHovering(!!(e.target as Element).closest?.(INTERACTIVE));
    };

    window.addEventListener("mousemove", move);
    document.addEventListener("mouseover", onOver);
    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", onOver);
    };
  }, [cursorX, cursorY, dotX, dotY]);

  return (
    <>
      {/* Outer ring — scales up and dims on hover */}
      <motion.div
        ref={ringRef}
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9998]"
        style={{
          x: springX,
          y: springY,
          border: "1px solid var(--cursor-ring)",
          boxShadow: "0 0 0 0.5px var(--cursor-shadow)",
        }}
        animate={{
          width:   isHovering ? 56 : 32,
          height:  isHovering ? 56 : 32,
          opacity: isHovering ? 0.45 : 1,
          marginLeft: isHovering ? -12 : 0,
          marginTop:  isHovering ? -12 : 0,
        }}
        transition={{ duration: 0.22, ease: "easeOut" }}
      />
      {/* Inner dot — hides on hover */}
      <motion.div
        ref={dotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full pointer-events-none z-[9999]"
        style={{
          x: dotX,
          y: dotY,
          background: "var(--cursor-dot)",
          boxShadow: "0 0 0 0.5px var(--cursor-shadow)",
        }}
        animate={{ opacity: isHovering ? 0 : 1, scale: isHovering ? 0 : 1 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
      />
    </>
  );
}
