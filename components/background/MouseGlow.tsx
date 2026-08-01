"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

export default function MouseGlow() {
  const prefersReducedMotion = useReducedMotion();
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
      setIsVisible(true);
    };

    const handleLeave = () => setIsVisible(false);

    // Smooth lerp
    const animate = () => {
      current.current.x += (target.current.x - current.current.x) * 0.12;
      current.current.y += (target.current.y - current.current.y) * 0.12;

      setMouse({ x: current.current.x, y: current.current.y });
      rafId.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseleave", handleLeave);
    rafId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseleave", handleLeave);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) return null;

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-10"
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.4 }}
    >
      <div
        className="absolute rounded-full"
        style={{
          width: 600,
          height: 600,
          left: mouse.x - 300,
          top: mouse.y - 300,
          background: `radial-gradient(
            circle,
            var(--glow-color) 0%,
            transparent 70%
          )`,
          filter: "blur(40px)",
          opacity: 0.35,
          transform: "translateZ(0)", // GPU
        }}
      />
    </motion.div>
  );
}