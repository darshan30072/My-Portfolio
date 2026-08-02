export type KnowledgeChunk = {
  /** Stable id: "<file>#<heading-slug>", used to line up chunks with embeddings.json */
  id: string;
  /** Source filename, e.g. "projects.md" — shown nowhere, useful for debugging. */
  source: string;
  /** The "## Heading" this chunk was split on. */
  heading: string;
  /** Full chunk text (heading + body) that gets embedded and sent to the model. */
  text: string;
};

export type EmbeddedChunk = KnowledgeChunk & {
  embedding: number[];
};

export type EmbeddingsFile = {
  model: string;
  generatedAt: string;
  chunks: EmbeddedChunk[];
};
