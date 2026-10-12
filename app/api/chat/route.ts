import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { GEMINI_API_KEY, GEMINI_MODEL, MAX_HISTORY_MESSAGES } from "@/lib/ai/config";
import { gemini } from "@/lib/ai/provider";
import { retrieveRelevantChunks } from "@/lib/ai/retriever";
import { buildSystemPrompt } from "@/lib/ai/prompts";
import { checkRateLimit, getClientKey } from "@/lib/security/rateLimit";
import { chatRequestSchema } from "@/lib/security/validate";

// Runs on the Node.js runtime (default) — retrieval reads the filesystem and
// the rate limiter uses in-process memory, neither of which work on Edge.

function lastUserMessageText(messages: UIMessage[]): string {
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  if (!lastUser) return "";
  return lastUser.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join(" ");
}

function getProviderErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);

  if (/api.?key|unauthenticated|invalid.?key|\b(401|403)\b/i.test(message)) {
    return "Gemini rejected its API key. The site owner should check GEMINI_API_KEY in Vercel's Production environment.";
  }
  if (/quota|rate.?limit|resource_exhausted|\b429\b/i.test(message)) {
    return "Gemini's API quota or rate limit was reached. The site owner should check Google AI Studio usage and billing.";
  }
  if (/model.{0,30}(not found|unsupported)|\b404\b/i.test(message)) {
    return "The configured Gemini model is unavailable. The site owner should check GEMINI_MODEL in Vercel.";
  }

  return "The AI service failed while generating a reply. Please retry later; if the issue continues, the site owner should check the Vercel Function Logs.";
}

export async function POST(request: Request) {
  const clientKey = getClientKey(request);
  const rateLimit = checkRateLimit(clientKey);

  if (!rateLimit.allowed) {
    return Response.json(
      { error: "Too many messages. Please wait a moment before trying again." },
      {
        status: 429,
        headers: { "Retry-After": Math.ceil(rateLimit.resetInMs / 1000).toString() },
      }
    );
  }

  let parsedBody: unknown;
  try {
    parsedBody = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = chatRequestSchema.safeParse(parsedBody);
  if (!parsed.success) {
    return Response.json(
      { error: "That request didn't look right — please try again." },
      { status: 400 }
    );
  }

  if (!GEMINI_API_KEY?.trim()) {
    return Response.json(
      {
        error:
          "The AI assistant is not configured. The site owner must add GEMINI_API_KEY to Vercel's Production environment and redeploy.",
      },
      { status: 503 }
    );
  }

  const { messages } = parsed.data;

  // Bound both the token cost and the prompt-injection surface of long histories.
  const trimmedMessages = messages.slice(-MAX_HISTORY_MESSAGES) as UIMessage[];

  const query = lastUserMessageText(trimmedMessages);
  const { chunks } = await retrieveRelevantChunks(query);
  const system = buildSystemPrompt(chunks);

  try {
    const result = streamText({
      model: gemini(GEMINI_MODEL),
      system,
      messages: await convertToModelMessages(trimmedMessages),
      abortSignal: request.signal,
      temperature: 0.4,
      onError({ error }) {
        console.error("[api/chat] streamText error:", error);
      },
    });
    return result.toUIMessageStreamResponse({
      onError: getProviderErrorMessage,
    });
  } catch (err) {
    console.error("[api/chat] Unexpected error:", err);
    return Response.json(
      { error: "The AI assistant is unreachable right now. Please try again shortly." },
      { status: 502 }
    );
  }
}
