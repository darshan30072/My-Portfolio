/**
 * Central configuration for the portfolio AI assistant.
 * Every tunable lives here so the rest of the codebase never reads
 * `process.env` directly — one file to check when something needs to change.
 */

/** Base URL of the Ollama server's native API (note the trailing `/api`). */
export const OLLAMA_BASE_URL =
  process.env.OLLAMA_BASE_URL ?? "http://127.0.0.1:11434/api";

/** Optional bearer token, only needed if Ollama sits behind an auth-enabled tunnel/proxy. */
export const OLLAMA_API_KEY = process.env.OLLAMA_API_KEY;

/** Ollama reserves this much context as GPU/CPU memory regardless of use — keep it small. */
export const CONTEXT_WINDOW = 4096;

/** Model used to embed both the knowledge base and incoming questions. */
export const EMBEDDING_MODEL =
  process.env.OLLAMA_EMBED_MODEL ?? "nomic-embed-text";

export type ChatModelOption = {
  /** Exact Ollama model tag, e.g. "gemma3:4b". */
  id: string;
  /** Short label shown in the model switcher UI. */
  label: string;
  /** One-line description shown under the label. */
  description: string;
};

/**
 * Chat models offered in the UI dropdown. All must be text/chat models that
 * are already pulled locally (`ollama pull <id>`) — the app does not pull
 * models on your behalf. Keep this list in sync with what you actually have.
 */
export const CHAT_MODELS: ChatModelOption[] = [
   {
    id: "gemma3:1b",
    label: "Gemma 3 (1B)",
    description: "Fastest — fits fully on a 4GB GPU",
  },
  {
    id: "gemma3:4b",
    label: "Gemma 3 (4B)",
    description: "Fastest — good default for quick answers",
  },
  {
    id: "llama3.2:latest",
    label: "Llama 3.2",
    description: "Balanced speed and quality",
  },
  {
    id: "qwen2.5:latest",
    label: "Qwen 2.5",
    description: "Strong reasoning, still fairly fast",
  },
  {
    id: "gpt-oss:20b",
    label: "GPT-OSS (20B)",
    description: "Largest, most capable — slower on modest hardware",
  },
];

export const DEFAULT_CHAT_MODEL =
  process.env.OLLAMA_DEFAULT_MODEL ?? CHAT_MODELS[0].id;

/** Guard against a client sending a model id that was never pulled/offered. */
export function isAllowedModel(id: unknown): id is string {
  return typeof id === "string" && CHAT_MODELS.some((m) => m.id === id);
}

/** How many knowledge chunks to feed the model per question. */
export const RETRIEVAL_TOP_K = 5;

/** Chunks below this similarity score are dropped even if they're in the top K. */
export const RETRIEVAL_MIN_SCORE = 0.35;

/** Only the last N messages are sent to the model, to bound context + prompt-injection surface. */
export const MAX_HISTORY_MESSAGES = 12;

/** Hard cap on a single message's length (characters) accepted by the API route. */
export const MAX_MESSAGE_LENGTH = 2000;

/** Simple in-memory rate limit — fine for a single self-hosted instance. */
export const RATE_LIMIT_MAX_REQUESTS = 20;
export const RATE_LIMIT_WINDOW_MS = 60_000;
