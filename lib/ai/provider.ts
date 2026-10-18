import { createOllama } from "ollama-ai-provider-v2";
import { OLLAMA_API_KEY, OLLAMA_BASE_URL } from "./config";

/**
 * One shared provider instance so every part of the app (chat streaming,
 * query embedding, the offline embeddings script) talks to the same Ollama
 * server. Change OLLAMA_BASE_URL in .env.local to point this at a remote /
 * tunnelled Ollama instance instead of localhost.
 */
export const ollama = createOllama({
  baseURL: OLLAMA_BASE_URL,
  headers: OLLAMA_API_KEY
    ? { Authorization: `Bearer ${OLLAMA_API_KEY}` }
    : undefined,
});
