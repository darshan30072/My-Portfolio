"use client";

import { useEffect, useState } from "react";

export type OllamaHealth = {
  online: boolean;
  checking: boolean;
};

/**
 * Since Ollama runs on a self-hosted machine, it can be offline (laptop
 * asleep, server restarted, etc.) even while the site itself is up. This
 * hook checks once when `active` becomes true and then on an interval, so
 * the UI can degrade gracefully instead of silently failing every message.
 */
export function useOllamaHealth(active: boolean, intervalMs = 30_000): OllamaHealth {
  const [state, setState] = useState<OllamaHealth>({ online: true, checking: true });

  useEffect(() => {
    if (!active) return;

    let cancelled = false;

    async function check() {
      try {
        const res = await fetch("/api/health", { cache: "no-store" });
        const data = (await res.json()) as { online: boolean };
        if (!cancelled) setState({ online: data.online, checking: false });
      } catch {
        if (!cancelled) setState({ online: false, checking: false });
      }
    }

    check();
    const id = setInterval(check, intervalMs);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [active, intervalMs]);

  return state;
}
