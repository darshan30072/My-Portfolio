# AI Portfolio Assistant — Setup Guide

A RAG-powered chat widget that answers recruiter questions about Darshan using only his real
portfolio data. Production chat uses Google's Gemini Flash API, so it works on Vercel without a
local model server.

## 1. Configure Gemini

Create a Gemini API key in Google AI Studio and add it to your local environment and Vercel:

```bash
GEMINI_API_KEY=your_google_ai_studio_key
```

In Vercel, add `GEMINI_API_KEY` under **Project Settings → Environment Variables** for Production,
then redeploy. The key is used only by the server route and is never sent to the browser.

The default model is `gemini-2.5-flash`. To override it, add:

```bash
GEMINI_MODEL=gemini-2.5-flash
```

## 2. Local setup

Install dependencies and run the app:

```bash
npm install
npm run dev
```

The model label in the chat header is fixed to `Gemini Flash`; there is no Ollama selector in the
production UI.

## 3. Optional local Ollama embeddings

Chat retrieval uses keyword search by default, so production does not require Ollama. For local
experimentation, vector retrieval can be enabled with `USE_OLLAMA_EMBEDDINGS=true` and Ollama
running at the configured `OLLAMA_BASE_URL`:

```bash
ollama pull nomic-embed-text
ollama serve
npm run kb:embed
```

Do not enable this option in Vercel unless the deployment can reach a real remote Ollama server.

## 4. Updating what the assistant knows

Everything the assistant can talk about lives in `data/knowledge/*.md` — plain markdown, split
into chunks on `## ` headings. To change what it knows, edit the relevant file and redeploy.
Keyword retrieval reads the markdown files directly, so no embedding regeneration is needed for
the default Gemini deployment.

## 5. How it works (architecture)

```
User question
   │
   ▼
POST /api/chat  ──►  rate limit + validate (lib/security/)
   │
   ▼
Keyword retrieval over data/knowledge/*.md
   │
   ▼
Build system prompt: persona + strict "answer only from this context" rules
  + the retrieved chunks + the action-token grammar (lib/ai/prompts.ts)
   │
   ▼
streamText() to Gemini Flash via @ai-sdk/google → streamed back to the browser
   │
   ▼
Client strips any [[action:...]] tokens from the reply and executes them
```

Everything is server-rendered/streamed through the Next.js Route Handler at `app/api/chat/route.ts`.

## 6. Legacy Ollama notes

The Ollama provider and embedding script remain available for local development, but they are not
part of the default live chat path. Ollama model selection is no longer exposed in the UI.

<!--
Legacy setup retained for reference:

1. Install Ollama: [ollama.com/download](https://ollama.com/download)

2. Pull the models you want available:
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

5. Run the app:
   ```bash
   npm run dev
   ```
   Open the site, click the floating button bottom-right, and try one of the suggested
   questions.

## Legacy updating notes

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

## Legacy architecture

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

## Legacy scope notes

This is deliberately a focused first version: streaming chat, real RAG, portfolio navigation
actions, model switching, conversation memory (multi-turn), markdown + syntax-highlighted code,
rate limiting, and graceful offline handling. Voice input/output, chat export, message
reactions, and the other "bonus" ideas from the original brief aren't built yet — the
architecture (separate `components/ai/`, `lib/ai/`, `hooks/`) leaves room to add them without
restructuring anything.
-->
