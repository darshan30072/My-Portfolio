# AI Portfolio Assistant Setup

The chatbot uses local Ollama models for generation and, when an embeddings file is available,
vector retrieval.

## Local development

1. Install Ollama from [ollama.com/download](https://ollama.com/download).
2. Pull the models configured in `lib/ai/config.ts`, plus the embedding model:

	```bash
	ollama pull gemma3:1b
	ollama pull gemma3:4b
	ollama pull llama3.2:latest
	ollama pull qwen2.5:latest
	ollama pull gpt-oss:20b
	ollama pull nomic-embed-text
	```

3. Keep `OLLAMA_BASE_URL=http://127.0.0.1:11434/api` in `.env.local` when Ollama and Next.js
	are running on the same machine. Set `OLLAMA_DEFAULT_MODEL` to a model pulled in Ollama.
4. Start Ollama and Next.js:

	```bash
	ollama serve
	npm run dev
	```

To enable vector retrieval, run `npm run kb:embed` while Ollama is running. If embeddings are
missing or Ollama's embedding endpoint is unavailable, the retriever falls back to keyword search.

## Hosting on Vercel

Ollama does not run inside Vercel's serverless functions. For a live Vercel chatbot, run Ollama on
an always-on server that Vercel can reach over HTTPS. Configure `OLLAMA_BASE_URL` in the Vercel
project to the server's Ollama API root, including `/api`, and set `OLLAMA_API_KEY` if the secured
endpoint requires bearer-token authentication. The health check uses the same token. Never expose
an unauthenticated Ollama API to the public internet. After configuring the variables, redeploy.

To update what the assistant knows, edit `data/knowledge/*.md` and regenerate embeddings with
`npm run kb:embed`. These files are separate from `lib/constants.ts`, so keep both in sync when
portfolio facts change.
