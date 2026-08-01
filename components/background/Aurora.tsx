"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "framer-motion";

export default function Aurora() {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 20% 40%, var(--aurora-1) 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 80% 20%, var(--aurora-2) 0%, transparent 50%),
            radial-gradient(ellipse 50% 60% at 50% 80%, var(--aurora-3) 0%, transparent 50%)
          `,
        }}
      />
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Layer 1 */}
      <motion.div
        className="absolute -inset-[20%] opacity-50 blur-3xl"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 30% 20%, var(--aurora-1) 0%, transparent 55%),
            radial-gradient(ellipse 60% 80% at 70% 60%, var(--aurora-2) 0%, transparent 50%)
          `,
        }}
        animate={{
          x: ["0%", "8%", "-5%", "0%"],
          y: ["0%", "-6%", "4%", "0%"],
          rotate: [0, 3, -2, 0],
          scale: [1, 1.05, 0.98, 1],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Layer 2 */}
      <motion.div
        className="absolute -inset-[15%] opacity-40 blur-3xl"
        style={{
          background: `
            radial-gradient(ellipse 70% 60% at 80% 30%, var(--aurora-3) 0%, transparent 50%),
            radial-gradient(ellipse 50% 70% at 20% 70%, var(--aurora-1) 0%, transparent 55%)
          `,
        }}
        animate={{
          x: ["0%", "-10%", "6%", "0%"],
          y: ["0%", "7%", "-4%", "0%"],
          rotate: [0, -4, 2, 0],
          scale: [1, 0.96, 1.04, 1],
        }}
        transition={{
          duration: 34,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      {/* Layer 3 – slower, softer */}
      <motion.div
        className="absolute -inset-[10%] opacity-30 blur-2xl"
        style={{
          background: `
            radial-gradient(ellipse 90% 40% at 50% 50%, var(--aurora-2) 0%, transparent 60%)
          `,
        }}
        animate={{
          scale: [1, 1.08, 0.95, 1],
          opacity: [0.25, 0.4, 0.2, 0.25],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}