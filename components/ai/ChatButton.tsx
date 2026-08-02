"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function ChatButton({
  isOpen,
  onClick,
  invite,
}: {
  isOpen: boolean;
  onClick: () => void;
  /** Show a subtle pulse ring to draw a first-time visitor's eye. */
  invite: boolean;
}) {
  return (
    <div className="fixed bottom-5 right-5 z-[60] sm:bottom-6 sm:right-6">
      {invite && !isOpen && (
        <span className="absolute inset-0 animate-ping rounded-full bg-primary/40" aria-hidden />
      )}
      <button
        type="button"
        onClick={onClick}
        suppressHydrationWarning
        aria-label={isOpen ? "Close portfolio assistant" : "Open portfolio assistant"}
        aria-expanded={isOpen}
        className={cn(
          "relative flex h-14 w-14 items-center justify-center rounded-full",
          "bg-gradient-to-br from-primary to-secondary text-white",
          "shadow-lg shadow-primary/30 transition-shadow duration-300",
          "hover:shadow-xl hover:shadow-primary/50",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        )}
      >
        <span className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-secondary opacity-70 blur-md" aria-hidden />
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isOpen ? "close" : "open"}
            initial={{ opacity: 0, rotate: -45, scale: 0.6 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 45, scale: 0.6 }}
            transition={{ duration: 0.18 }}
            className="relative"
          >
            {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
          </motion.span>
        </AnimatePresence>
      </button>
    </div>
  );
}
