import fs from "node:fs";
import path from "node:path";
import { embed } from "ai";
import { ollama } from "./provider";
import { loadKnowledgeChunks } from "./knowledge/loadChunks";
import { cosineSimilarity } from "./embeddings/similarity";
import { EMBEDDING_MODEL, RETRIEVAL_MIN_SCORE, RETRIEVAL_TOP_K } from "./config";
import type { EmbeddingsFile, KnowledgeChunk } from "./knowledge/types";

const EMBEDDINGS_PATH = path.join(
  process.cwd(),
  "data",
  "knowledge",
  "embeddings.json"
);

export type RetrievedChunk = KnowledgeChunk & { score: number };

function loadEmbeddingsFile(): EmbeddingsFile | null {
  try {
    if (!fs.existsSync(EMBEDDINGS_PATH)) return null;
    const raw = fs.readFileSync(EMBEDDINGS_PATH, "utf-8");
    return JSON.parse(raw) as EmbeddingsFile;
  } catch (err) {
    console.error("[retriever] Failed to read embeddings.json:", err);
    return null;
  }
}

/**
 * Naive keyword-overlap scorer used when embeddings.json hasn't been
 * generated yet (or the embedding call fails). Keeps the assistant usable
 * out of the box instead of hard-failing before `npm run kb:embed` has run.
 */
function keywordSearch(query: string, chunks: KnowledgeChunk[]): RetrievedChunk[] {
  const queryTokens = query
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 2);

  if (queryTokens.length === 0) {
    return chunks.slice(0, RETRIEVAL_TOP_K).map((c) => ({ ...c, score: 0 }));
  }

  return chunks
    .map((chunk) => {
      const haystack = chunk.text.toLowerCase();
      const score =
        queryTokens.filter((t) => haystack.includes(t)).length /
        queryTokens.length;
      return { ...chunk, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, RETRIEVAL_TOP_K);
}

/**
 * Vector search over precomputed chunk embeddings. Falls back to keyword
 * search if embeddings.json is missing, stale (model mismatch), or Ollama's
 * embedding endpoint is unreachable — retrieval should never hard-fail.
 */
export async function retrieveRelevantChunks(
  query: string
): Promise<{ chunks: RetrievedChunk[]; usedVectorSearch: boolean }> {
  const allChunks = loadKnowledgeChunks();
  const embeddingsFile = loadEmbeddingsFile();

  if (!embeddingsFile || embeddingsFile.model !== EMBEDDING_MODEL) {
    return { chunks: keywordSearch(query, allChunks), usedVectorSearch: false };
  }

  try {
    const { embedding: queryEmbedding } = await embed({
      model: ollama.embedding(EMBEDDING_MODEL),
      value: query,
    });

    const scored = embeddingsFile.chunks
      .map((chunk) => ({
        ...chunk,
        score: cosineSimilarity(queryEmbedding, chunk.embedding),
      }))
      .sort((a, b) => b.score - a.score);

    const top = scored
      .filter((c) => c.score >= RETRIEVAL_MIN_SCORE)
      .slice(0, RETRIEVAL_TOP_K);

    // If nothing clears the similarity bar, fall back rather than feeding
    // the model near-random context.
    if (top.length === 0) {
      return { chunks: keywordSearch(query, allChunks), usedVectorSearch: false };
    }

    return {
      chunks: top.map(({ embedding: _embedding, ...rest }) => rest),
      usedVectorSearch: true,
    };
  } catch (err) {
    console.error("[retriever] Vector search failed, falling back to keyword search:", err);
    return { chunks: keywordSearch(query, allChunks), usedVectorSearch: false };
  }
}
