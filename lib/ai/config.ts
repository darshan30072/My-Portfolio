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

/** Gemini model used for production chat requests. */
export const GEMINI_MODEL = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";

/** Server-only Gemini API key used by the Google AI SDK provider. */
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

/** Keep Ollama embeddings opt-in so production does not depend on localhost. */
export const USE_OLLAMA_EMBEDDINGS = process.env.USE_OLLAMA_EMBEDDINGS === "true";

export type ChatModelOption = {
  /** Exact provider model id, e.g. "gemini-2.5-flash". */
  id: string;
  /** Short label shown in the model switcher UI. */
  label: string;
  /** One-line description shown under the label. */
  description: string;
};

/**
 * Chat models offered in the UI. Keep this list in sync with the configured
 * cloud provider model.
 */
export const CHAT_MODELS: ChatModelOption[] = [
  {
    id: GEMINI_MODEL,
    label: "Gemini Flash",
    description: "Fast cloud model for production chat",
  },
];

export const DEFAULT_CHAT_MODEL = GEMINI_MODEL;

/** Guard against a client sending a model id that was never offered. */
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
