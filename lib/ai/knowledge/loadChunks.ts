import fs from "node:fs";
import path from "node:path";
import type { KnowledgeChunk } from "./types";

const KNOWLEDGE_DIR = path.join(process.cwd(), "data", "knowledge");

function slugify(heading: string) {
  return heading
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Splits a markdown file into chunks on "## " headings. The optional leading
 * "# Title" (H1) is treated as shared context and prepended to every chunk
 * so retrieval still knows which document a chunk came from.
 */
function chunkMarkdown(source: string, raw: string): KnowledgeChunk[] {
  const lines = raw.split("\n");
  let docTitle = source;

  const sections: { heading: string; body: string[] }[] = [];
  let current: { heading: string; body: string[] } | null = null;

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
      const text = `# ${docTitle}\n## ${section.heading}\n${body}`;
      return {
        id: `${source}#${slugify(section.heading)}`,
        source,
        heading: section.heading,
        text,
      } satisfies KnowledgeChunk;
    })
    .filter((c): c is KnowledgeChunk => c !== null);
}

let cache: KnowledgeChunk[] | null = null;

/** Reads every .md file in data/knowledge and returns all chunks, cached in memory. */
export function loadKnowledgeChunks(): KnowledgeChunk[] {
  if (cache) return cache;

  if (!fs.existsSync(KNOWLEDGE_DIR)) {
    cache = [];
    return cache;
  }

  const files = fs
    .readdirSync(KNOWLEDGE_DIR)
    .filter((f) => f.endsWith(".md"))
    .sort();

  cache = files.flatMap((file) => {
    const raw = fs.readFileSync(path.join(KNOWLEDGE_DIR, file), "utf-8");
    return chunkMarkdown(file, raw);
  });

  return cache;
}
