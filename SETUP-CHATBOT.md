# AI Portfolio Assistant — Setup Guide

A RAG-powered chat widget that answers recruiter questions about Darshan using only his real
portfolio data, running entirely on local Ollama models — no OpenAI/Anthropic API key, no
per-message cost.

## 1. Why this needs Ollama running locally

Ollama has no hosted/serverless mode — it's a server process that loads model weights into
memory on whatever machine runs it. That means **this feature only works while Ollama is
running somewhere reachable by the Next.js server.** Two ways to run it:

- **Everything on one machine (simplest).** Run `ollama serve` and `npm run start` (or `npm run
  dev`) on the same computer — your laptop, or a VPS. `OLLAMA_BASE_URL` stays at the default
  `http://127.0.0.1:11434/api`.
- **Ollama elsewhere, site elsewhere.** Run Ollama on a machine you control, expose it through a
  tunnel (Cloudflare Tunnel, Tailscale, ngrok, etc.), and point `OLLAMA_BASE_URL` in `.env.local`
  at that URL. Add `OLLAMA_API_KEY` if your tunnel requires a bearer token.

**Vercel and other serverless hosts will not work** for this feature specifically — there's
nowhere for Ollama to run. The rest of the site (static pages, `/api/contact`) is unaffected and
can still deploy anywhere; only the chat widget depends on Ollama being reachable. The widget is
built to fail gracefully: if it can't reach Ollama, it shows an "assistant offline" notice
instead of breaking, so this never takes down the rest of the site for a recruiter visiting.

## 2. One-time setup

1. **Install Ollama**: [ollama.com/download](https://ollama.com/download)

2. **Pull the models** you want available (at least one chat model + the embedding model):
   ```bash
   ollama pull gemma3:4b        # fast default
   ollama pull llama3.2:latest
   ollama pull qwen2.5:latest
   ollama pull gpt-oss:20b      # optional — large, needs a decent GPU/RAM
   ollama pull nomic-embed-text # required — powers retrieval
   ```
   Only pull the chat models you actually want in the dropdown. If you skip one, remove it from
   `CHAT_MODELS` in `lib/ai/config.ts` so the UI doesn't offer a model you don't have.

3. **Environment variables**:
   ```bash
   cp .env.example .env.local
   ```
   Defaults work as-is for a single-machine setup. Adjust `OLLAMA_BASE_URL` /
   `OLLAMA_DEFAULT_MODEL` / `OLLAMA_EMBED_MODEL` if yours differ.

4. **Generate the knowledge base embeddings** (Ollama must be running first):
   ```bash
   ollama serve        # in one terminal, if not already running
   npm run kb:embed     # in another terminal
   ```
   This reads every file in `data/knowledge/`, embeds each section with `nomic-embed-text`, and
   writes `data/knowledge/embeddings.json`. It takes a few seconds. **The chat widget still
   works even if you skip this step** — it falls back to a plain keyword search — but real
   vector search gives noticeably better answers, so don't skip it for the live site.

5. **Run the app**:
   ```bash
   npm run dev
   ```
   Open the site, click the floating button bottom-right, and try one of the suggested
   questions.

## 3. Updating what the assistant knows

Everything the assistant can talk about lives in `data/knowledge/*.md` — plain markdown, split
into chunks on `## ` headings. To change what it knows:

1. Edit the relevant file (or add a new `.md` file — any file in that folder is picked up
   automatically, no code changes needed).
2. Re-run `npm run kb:embed` so the new/changed text gets embedded.
3. Restart the dev server (or redeploy).

Keep each `##` section focused on one topic — that's the unit that gets retrieved, so a section
that mixes three unrelated facts will retrieve worse than three focused sections.

**Known limitation:** this knowledge base is a separate set of files from `lib/constants.ts`
(which drives the visible page sections), written in prose rather than the structured data the
UI uses. If you change a fact in `lib/constants.ts` (say, a new job), update the matching
`data/knowledge/*.md` file too and re-run `kb:embed` — they don't sync automatically.

## 4. How it works (architecture)

```
User question
   │
   ▼
POST /api/chat  ──►  rate limit + validate (lib/security/)
   │
   ▼
Embed the question with nomic-embed-text (lib/ai/retriever.ts)
   │
   ▼
Cosine-similarity search over data/knowledge/embeddings.json
  → top 5 chunks above a similarity threshold
  → falls back to keyword search if embeddings.json is missing/stale/unreachable
   │
   ▼
Build system prompt: persona + strict "answer only from this context" rules
  + the retrieved chunks + the action-token grammar (lib/ai/prompts.ts)
   │
   ▼
streamText() to the selected Ollama model (lib/ai/provider.ts) → streamed
back to the browser via the Vercel AI SDK (useChat)
   │
   ▼
Client strips any [[action:...]] tokens from the reply and executes them
(scroll to a section, download the resume, copy contact info, open a link)
```

Everything is server-rendered/streamed through the Next.js Route Handler at
`app/api/chat/route.ts` — no API keys or model calls ever happen in the browser.

## 5. Notes on scope

This is deliberately a focused first version: streaming chat, real RAG, portfolio navigation
actions, model switching, conversation memory (multi-turn), markdown + syntax-highlighted code,
rate limiting, and graceful offline handling. Voice input/output, chat export, message
reactions, and the other "bonus" ideas from the original brief aren't built yet — the
architecture (separate `components/ai/`, `lib/ai/`, `hooks/`) leaves room to add them without
restructuring anything.
