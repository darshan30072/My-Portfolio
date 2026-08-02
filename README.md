# Darshan Tandel — Portfolio

Premium, minimal developer portfolio built with Next.js 15, TypeScript, Tailwind CSS, and Framer Motion.

## Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + CSS variables
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Theme**: next-themes (dark default + light toggle)
- **UI primitives**: Radix Slot + class-variance-authority

## Getting Started

```bash
cd portfolio
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
app/
  layout.tsx          # Fonts, metadata, providers, shell
  page.tsx            # Section composition
  globals.css         # Design tokens + utilities
  providers.tsx       # Theme provider
  robots.ts / sitemap.ts

components/
  layout/             # Navbar, ScrollProgress, BackToTop, ThemeToggle
  sections/           # Hero, Projects, Experience, About, Skills, Contact
  motion/             # Reveal, Stagger, Magnetic
  ui/                 # Button, Badge

lib/
  constants.ts        # All content (easy to edit)
  utils.ts             # cn() helper
  ai/                  # RAG pipeline: config, provider, retriever, prompts, actions
  actions/             # Client-side scroll/download/copy/open-link helpers
  security/            # Rate limiting + request validation

components/ai/         # Floating AI Portfolio Assistant widget
hooks/                 # useOllamaHealth, usePortfolioActions
data/knowledge/        # Markdown knowledge base the assistant answers from
scripts/                # npm run kb:embed — generates data/knowledge/embeddings.json
```

See **[SETUP-CHATBOT.md](./SETUP-CHATBOT.md)** for the AI assistant's setup, architecture, and how to edit its knowledge base.

## Customization

1. **Content** — Edit `lib/constants.ts` (projects, experience, skills, social links).
2. **Colors** — CSS variables in `app/globals.css` (`:root` and `.light`).
3. **Resume** — `public/resume.pdf` is included (replace with your designed version anytime).
4. **Project images** — Add WebP files under `public/images/projects/` and uncomment the `<Image>` blocks in `Projects.tsx`.
5. **GitHub / site URL** — Update `SITE` in `lib/constants.ts`.
6. **Contact form** — Already wired to `POST /api/contact`. See below.

## Contact form (Resend)

The form posts to `app/api/contact/route.ts`.

1. Copy env example:
   ```bash
   cp .env.example .env.local
   ```
2. Create a free [Resend](https://resend.com) account → API key.
3. Fill in `.env.local`:
   ```
   RESEND_API_KEY=re_xxxx
   CONTACT_TO_EMAIL=tandeldarshan57@gmail.com
   CONTACT_FROM_EMAIL=Portfolio <onboarding@resend.dev>
   ```
4. Restart `npm run dev`.

Without `RESEND_API_KEY`, messages are validated and logged to the server console (useful for local testing). After you verify a domain in Resend, switch `CONTACT_FROM_EMAIL` to something like `Portfolio <hello@yourdomain.com>`.

On Vercel, add the same variables under Project Settings → Environment Variables.

## AI Portfolio Assistant

A RAG-powered chat widget (bottom-right) that answers recruiter questions from `data/knowledge/*.md`,
runs on your own local Ollama models, and can navigate the page (scroll to a section, download the
resume, copy contact info). Full setup — installing Ollama, pulling models, generating embeddings,
env vars — is in **[SETUP-CHATBOT.md](./SETUP-CHATBOT.md)**.

## Design Highlights

- Dark theme by default with vibrant blue/violet accents
- EN ↔ HI typewriter in the hero (unique signature)
- Sticky navbar with active section indicator + scroll progress bar
- Magnetic CTAs, scroll reveals, reduced-motion support
- Glassmorphism only on hero profile card and contact panel
- Fully responsive, keyboard accessible, SEO-ready

## Deploy

```bash
npm run build
```

Deploy to Vercel for best performance (Image Optimization, Edge Network) — **except the AI
assistant**, which depends on a locally-running Ollama server and won't work on Vercel or other
serverless hosting. Run `next build && next start` on a machine (VPS or your own computer) that
also runs `ollama serve`, or point `OLLAMA_BASE_URL` at a tunnelled Ollama instance. See
[SETUP-CHATBOT.md](./SETUP-CHATBOT.md).
