import type { UIMessage } from "ai";
import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { parseActions } from "@/lib/ai/actions";
import { MarkdownContent } from "./MarkdownContent";

export function ChatMessage({ message }: { message: UIMessage }) {
  const isUser = message.role === "user";

  const rawText = message.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("");

  // Strip [[action:...]] tokens from what's displayed, even mid-stream.
  const { cleanText } = parseActions(rawText);

  if (!cleanText && !isUser) return null;

  return (
    <div className={cn("flex items-start gap-2", isUser && "flex-row-reverse")}>
      <div
        className={cn(
          "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
          isUser ? "bg-secondary text-secondary-foreground" : "bg-gradient-to-br from-primary to-secondary text-white"
        )}
        aria-hidden
      >
        {isUser ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
      </div>

      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm",
          isUser
            ? "rounded-tr-sm bg-gradient-to-br from-primary to-secondary text-white"
            : "rounded-tl-sm border border-border bg-card text-card-foreground"
        )}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap leading-relaxed">{cleanText}</p>
        ) : (
          <MarkdownContent content={cleanText} />
        )}
      </div>
    </div>
  );
}
