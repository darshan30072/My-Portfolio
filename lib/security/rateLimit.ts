import { RATE_LIMIT_MAX_REQUESTS, RATE_LIMIT_WINDOW_MS } from "@/lib/ai/config";

/**
 * In-memory sliding-window limiter. This is intentionally simple: it's
 * correct for a single long-running Node process (e.g. `next start` on a
 * VPS or your own machine, which is how this project runs Ollama anyway).
 *
 * It will NOT work correctly on multi-instance serverless hosting (each
 * function instance has its own memory) — if you ever move this route to
 * Vercel serverless functions, swap this for a shared store like Upstash
 * Redis instead.
 */
const hits = new Map<string, number[]>();

export function checkRateLimit(key: string): {
  allowed: boolean;
  remaining: number;
  resetInMs: number;
} {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;

  const timestamps = (hits.get(key) ?? []).filter((t) => t > windowStart);

  if (timestamps.length >= RATE_LIMIT_MAX_REQUESTS) {
    const resetInMs = timestamps[0] + RATE_LIMIT_WINDOW_MS - now;
    hits.set(key, timestamps);
    return { allowed: false, remaining: 0, resetInMs: Math.max(resetInMs, 0) };
  }

  timestamps.push(now);
  hits.set(key, timestamps);

  return {
    allowed: true,
    remaining: RATE_LIMIT_MAX_REQUESTS - timestamps.length,
    resetInMs: RATE_LIMIT_WINDOW_MS,
  };
}

/** Best-effort client key from standard proxy headers, falling back to a shared bucket. */
export function getClientKey(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "anonymous";
}
