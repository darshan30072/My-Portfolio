"use client";

import { Sparkles, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ModelSelector } from "./ModelSelector";

export function ChatHeader({
  online,
  model,
  onModelChange,
  onClear,
  onClose,
  canClear,
}: {
  online: boolean;
  model: string;
  onModelChange: (id: string) => void;
  onClear: () => void;
  onClose: () => void;
  canClear: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-2 border-b border-border px-3.5 py-3">
      <div className="flex min-w-0 items-center gap-2">
        <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-white">
          <Sparkles className="h-4 w-4" />
          <span
            className={cn(
              "absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-background",
              online ? "bg-success" : "bg-muted-foreground"
            )}
            aria-hidden
          />
        </div>
        <div className="min-w-0">
          <p className="truncate font-display text-sm font-semibold leading-tight">
            Portfolio Assistant
          </p>
          <p className="truncate text-[11px] text-muted-foreground">
            {online ? "Online · local AI" : "Assistant offline"}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <ModelSelector value={model} onChange={onModelChange} />
        <button
          type="button"
          onClick={onClear}
          disabled={!canClear}
          aria-label="Clear conversation"
          title="Clear conversation"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Trash2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close chat"
          title="Close"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
