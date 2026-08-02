"use client";

import { useEffect, useRef } from "react";
import type { UIMessage } from "ai";
import { parseActions } from "@/lib/ai/actions";
import { runPortfolioAction } from "@/lib/actions/navigate";

/**
 * Runs any `[[action:...]]` tokens found in the latest finished assistant
 * message. Guards against re-running the same message twice (e.g. on a
 * parent re-render) with a ref-backed set of processed message ids.
 */
export function usePortfolioActions(
  messages: UIMessage[],
  status: "submitted" | "streaming" | "ready" | "error",
  onNotice: (message: string) => void
) {
  const processed = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (status !== "ready") return;
    const last = messages[messages.length - 1];
    if (!last || last.role !== "assistant" || processed.current.has(last.id)) return;

    processed.current.add(last.id);

    const text = last.parts
      .filter((p): p is { type: "text"; text: string } => p.type === "text")
      .map((p) => p.text)
      .join(" ");

    const { actions } = parseActions(text);
    if (actions.length === 0) return;

    void (async () => {
      for (const action of actions) {
        const result = await runPortfolioAction(action);
        if (result) onNotice(result.message);
      }
    })();
  }, [messages, status, onNotice]);
}
