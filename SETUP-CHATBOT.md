# AI Portfolio Assistant Setup

The portfolio chatbot uses Gemini Flash for generation. It runs through the Next.js API route,
so the Gemini key remains on the server and the Vercel deployment does not need an Ollama host.

## 1. Get a Gemini API key

Create an API key in [Google AI Studio](https://aistudio.google.com/app/apikey). Treat it like a
password. Do not add it to client-side code, commit it, or name it with a `NEXT_PUBLIC_` prefix.

For local development, put it in the ignored `.env.local` file:

```env
GEMINI_API_KEY=your_key_from_google_ai_studio
GEMINI_MODEL=gemini-2.5-flash
```

`GEMINI_MODEL` is optional; the app defaults to `gemini-2.5-flash`.

## 2. Add the key to Vercel

1. Open the Vercel dashboard and select the project that deploys this portfolio.
2. Go to **Settings → Environment Variables**.
3. Add a variable named exactly `GEMINI_API_KEY` and paste the key as its value.
4. Select **Production**. Also select Preview or Development if those deployments should use Gemini.
5. Save the variable. Do not include quotes or a `NEXT_PUBLIC_` prefix.

Vercel environment-variable changes apply to new deployments. Trigger a new production deployment
after saving: push a commit to the configured production branch, or redeploy the latest deployment.

## 3. Verify the deployment

Open the deployed site and send a short test prompt in the chatbot. A missing key returns an HTTP
503 response explaining that `GEMINI_API_KEY` is not configured. A streamed HTTP 200 alone does
not prove that Gemini answered: streaming can start before Gemini returns an error. If the widget
shows an error, inspect the failed function invocation under **Vercel → Project → Logs** and check
that the key is valid, enabled for the Production environment, and that the configured model is
available to your Google AI Studio account.

## Retrieval and Ollama

By default, retrieval searches the portfolio's `data/knowledge/*.md` files using keyword matching,
so production chat does not need Ollama. Ollama vector embeddings are optional for local use and
can be enabled with `USE_OLLAMA_EMBEDDINGS=true` only when the server can reach Ollama at
`OLLAMA_BASE_URL`.

To update what the assistant knows, edit the Markdown files in `data/knowledge/` and redeploy. The
knowledge files are separate from the structured page data in `lib/constants.ts`, so update both
when a portfolio fact changes.
