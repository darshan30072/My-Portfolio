"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export function Toast({ message }: { message: string | null }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          role="status"
          aria-live="polite"
          className="glass fixed bottom-[7.5rem] right-5 z-[60] flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-medium text-foreground shadow-lg sm:right-8"
        >
          <CheckCircle2 className="h-3.5 w-3.5 text-success" />
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
