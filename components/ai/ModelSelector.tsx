"use client";

import { ChevronDown } from "lucide-react";
import { CHAT_MODELS } from "@/lib/ai/config";

export function ModelSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (modelId: string) => void;
}) {
  return (
    <div className="relative">
      <label htmlFor="portfolio-chat-model" className="sr-only">
        AI model
      </label>
      <select
        id="portfolio-chat-model"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="appearance-none rounded-lg border border-border bg-card py-1 pl-2.5 pr-6 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        title="Switch AI model"
      >
        {CHAT_MODELS.map((modelOption) => (
          <option key={modelOption.id} value={modelOption.id}>
            {modelOption.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}
