#!/usr/bin/env node
/**
 * Reads every data/knowledge/*.md file, splits it into chunks the same way
 * lib/ai/knowledge/loadChunks.ts does, embeds each chunk with your local
 * Ollama embedding model, and writes data/knowledge/embeddings.json.
 *
 * Run this whenever you edit a knowledge base file:
 *   npm run kb:embed
 *
 * Requires Ollama running locally with the embedding model pulled, e.g.:
 *   ollama pull nomic-embed-text
 *
 * NOTE: the chunking rules here (split on "## " headings) intentionally
 * mirror lib/ai/knowledge/loadChunks.ts — if you change one, change both.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const KNOWLEDGE_DIR = path.join(ROOT, "data", "knowledge");
const OUTPUT_PATH = path.join(KNOWLEDGE_DIR, "embeddings.json");

function loadEnvLocal() {
  const envPath = path.join(ROOT, ".env.local");
  if (!fs.existsSync(envPath)) return;

  for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    if (!(key in process.env)) process.env[key] = value;
  }
}
loadEnvLocal();

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL ?? "http://127.0.0.1:11434/api";
const EMBEDDING_MODEL = process.env.OLLAMA_EMBED_MODEL ?? "nomic-embed-text";

function slugify(heading) {
  return heading
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function chunkMarkdown(source, raw) {
  const lines = raw.split("\n");
  let docTitle = source;
  const sections = [];
  let current = null;

  for (const line of lines) {
    const h1 = line.match(/^#\s+(.*)/);
    const h2 = line.match(/^##\s+(.*)/);

    if (h1 && !current) {
      docTitle = h1[1].trim();
      continue;
    }
    if (h2) {
      if (current) sections.push(current);
      current = { heading: h2[1].trim(), body: [] };
      continue;
    }
    if (current) current.body.push(line);
  }
  if (current) sections.push(current);

  return sections
    .map((section) => {
      const body = section.body.join("\n").trim();
      if (!body) return null;
      return {
        id: `${source}#${slugify(section.heading)}`,
        source,
        heading: section.heading,
        text: `# ${docTitle}\n## ${section.heading}\n${body}`,
      };
    })
    .filter(Boolean);
}

async function embed(text) {
  const res = await fetch(`${OLLAMA_BASE_URL}/embeddings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: EMBEDDING_MODEL, prompt: text }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Ollama returned ${res.status} for embedding request: ${body}`);
  }

  const data = await res.json();
  if (!Array.isArray(data.embedding)) {
    throw new Error("Ollama response did not include an embedding array.");
  }
  return data.embedding;
}

async function main() {
  console.log(`Reading knowledge base from ${path.relative(ROOT, KNOWLEDGE_DIR)}...`);

  if (!fs.existsSync(KNOWLEDGE_DIR)) {
    console.error(`No such directory: ${KNOWLEDGE_DIR}`);
    process.exit(1);
  }

  const files = fs
    .readdirSync(KNOWLEDGE_DIR)
    .filter((f) => f.endsWith(".md"))
    .sort();

  if (files.length === 0) {
    console.error("No .md files found in data/knowledge — nothing to embed.");
    process.exit(1);
  }

  const chunks = files.flatMap((file) =>
    chunkMarkdown(file, fs.readFileSync(path.join(KNOWLEDGE_DIR, file), "utf-8"))
  );

  console.log(`Found ${chunks.length} chunks across ${files.length} files.`);
  console.log(`Embedding with model "${EMBEDDING_MODEL}" via ${OLLAMA_BASE_URL} ...\n`);

  const embedded = [];
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    process.stdout.write(`  [${i + 1}/${chunks.length}] ${chunk.id} ... `);
    try {
      const embedding = await embed(chunk.text);
      embedded.push({ ...chunk, embedding });
      console.log("ok");
    } catch (err) {
      console.log("FAILED");
      console.error(`\nCould not reach Ollama's embedding endpoint.\n${err.message}\n`);
      console.error("Checklist:");
      console.error("  1. Is Ollama running?               ollama serve");
      console.error(`  2. Is the embedding model pulled?     ollama pull ${EMBEDDING_MODEL}`);
      console.error(`  3. Is OLLAMA_BASE_URL correct?        currently "${OLLAMA_BASE_URL}"`);
      process.exit(1);
    }
  }

  const output = {
    model: EMBEDDING_MODEL,
    generatedAt: new Date().toISOString(),
    chunks: embedded,
  };

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2));
  console.log(`\nWrote ${embedded.length} embeddings to ${path.relative(ROOT, OUTPUT_PATH)}`);
}

main();
