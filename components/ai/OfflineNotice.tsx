import { WifiOff } from "lucide-react";
import { SITE } from "@/lib/constants";

export function OfflineNotice() {
  return (
    <div className="mx-3 mt-2 flex items-start gap-2 rounded-lg border border-border bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
      <WifiOff className="mt-0.5 h-3.5 w-3.5 shrink-0" />
      <p className="leading-relaxed">
        The AI assistant&apos;s local server looks offline right now, so replies may not come
        through. You can still browse the portfolio, or reach Darshan directly at{" "}
        <a href={`mailto:${SITE.email}`} className="text-primary underline underline-offset-2">
          {SITE.email}
        </a>
        .
      </p>
    </div>
  );
}
