"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const E: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface Props {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  style?: React.CSSProperties;
  once?: boolean;
}

export default function RevealText({
  children,
  delay = 0,
  duration = 1.1,
  as: Tag = "h2",
  className,
  style,
  once = true,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, margin: "-80px" });

  return (
    <div ref={ref} style={{ overflow: "hidden" }}>
      <motion.div
        initial={{ clipPath: "inset(100% 0 0 0)" }}
        animate={inView ? { clipPath: "inset(0% 0 0 0)" } : {}}
        transition={{ duration, delay, ease: E }}
      >
        <Tag className={className} style={style}>
          {children}
        </Tag>
      </motion.div>
    </div>
  );
}
