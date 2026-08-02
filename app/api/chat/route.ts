import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { ollama } from "@/lib/ai/provider";
import { CONTEXT_WINDOW } from "@/lib/ai/config";
import { retrieveRelevantChunks } from "@/lib/ai/retriever";
import { buildSystemPrompt } from "@/lib/ai/prompts";
import {
  DEFAULT_CHAT_MODEL,
  MAX_HISTORY_MESSAGES,
  isAllowedModel,
} from "@/lib/ai/config";
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

  const { messages, model: requestedModel } = parsed.data;
  const model = isAllowedModel(requestedModel) ? requestedModel : DEFAULT_CHAT_MODEL;

  // Bound both the token cost and the prompt-injection surface of long histories.
  const trimmedMessages = messages.slice(-MAX_HISTORY_MESSAGES) as UIMessage[];

  const query = lastUserMessageText(trimmedMessages);
  const { chunks } = await retrieveRelevantChunks(query);
  const system = buildSystemPrompt(chunks);

  try {
    const result = streamText({
  model: ollama(model),
  system,
  messages: await convertToModelMessages(trimmedMessages),
  abortSignal: request.signal,
  temperature: 0.4,
  providerOptions: {
    ollama: {
      options: { num_ctx: CONTEXT_WINDOW },
    },
  },
  onError({ error }) {
    console.error("[api/chat] streamText error:", error);
  },
});
    return result.toUIMessageStreamResponse({
      onError: () =>
        "The AI assistant is unreachable right now — make sure Ollama is running, or reach out to Darshan directly.",
    });
  } catch (err) {
    console.error("[api/chat] Unexpected error:", err);
    return Response.json(
      { error: "The AI assistant is unreachable right now. Please try again shortly." },
      { status: 502 }
    );
  }
}
