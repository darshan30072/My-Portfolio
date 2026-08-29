import { SITE } from "@/lib/constants";

const PROMPTS = [
  "Tell me about yourself",
  "Why should we hire you?",
  "What technologies do you know?",
  "What AI projects have you built?",
  "Show contact information",
];

export function SuggestedPrompts({ onSelect }: { onSelect: (prompt: string) => void }) {
  return (
    <div className="flex h-full flex-col justify-end gap-4 px-1 pb-1">
      <div>
        <p className="font-display text-sm font-semibold text-foreground">
          Hi, I&apos;m {SITE.name}&apos;s portfolio assistant ðŸ‘‹
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Ask me about his experience, projects, skills, or resume â€” I only answer from his
          actual portfolio, so you can trust what you get.
        </p>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {PROMPTS.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => onSelect(prompt)}
            className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-foreground/90 transition-colors hover:border-primary/50 hover:bg-primary/5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}
