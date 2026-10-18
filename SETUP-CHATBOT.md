# AI Portfolio Assistant — Setup Guide

A RAG-powered chat widget that answers recruiter questions about Darshan using his portfolio
data. Chat generation and vector retrieval use local Ollama models.

## Important: Vercel hosting

Ollama runs as a server on a machine you control. A Vercel deployment cannot reach Ollama on your
personal computer at `127.0.0.1`; that address refers to the Vercel instance itself. Local models
work when the Next.js server and Ollama run on the same machine. For the hosted site, Ollama must
run on an always-on server reachable through a secured URL, and `OLLAMA_BASE_URL` must point to
that server. Do not expose an unauthenticated Ollama API to the public internet.

## 1. Install and download models

Install [Ollama](https://ollama.com/download), then pull the models you want to use:

```bash
ollama pull gemma3:1b
ollama pull gemma3:4b
ollama pull llama3.2:latest
ollama pull qwen2.5:latest
ollama pull gpt-oss:20b
ollama pull nomic-embed-text
```

Only keep models in `CHAT_MODELS` in `lib/ai/config.ts` if they have been pulled on the Ollama
server.

## 2. Configure environment

Copy `.env.example` to `.env.local`. The defaults work when Next.js and Ollama run on the same
machine. Set `OLLAMA_BASE_URL` to the secured remote Ollama URL when they run on different
machines. Set `OLLAMA_API_KEY` if that endpoint requires bearer-token authentication.

`OLLAMA_DEFAULT_MODEL` must match one of the pulled chat model IDs. `OLLAMA_EMBED_MODEL` must
match the embedding model used by the knowledge-base file.

## 3. Generate embeddings and run locally

Start Ollama, generate the knowledge embeddings, then start Next.js:

```bash
ollama serve
npm run kb:embed
npm run dev
```

If the embeddings file is missing, stale, or the Ollama embedding endpoint is unavailable, the
retriever falls back to keyword search.

## 4. Update the assistant's knowledge

Knowledge content lives in `data/knowledge/*.md` and is split on `## ` headings. Edit the
relevant file and rerun `npm run kb:embed` to regenerate vector embeddings. The knowledge files
are separate from the structured page data in `lib/constants.ts`, so update both when facts
change.

## How it works

The chat route validates and rate-limits requests, retrieves relevant knowledge chunks, builds a
system prompt, and streams a reply from the selected Ollama model. All model calls happen on the
server; the browser never receives model credentials.
