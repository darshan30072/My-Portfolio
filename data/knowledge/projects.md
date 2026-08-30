# Projects

## FOP Admin — Food Ordering Platform Admin Dashboard
A production food ordering admin dashboard built with Next.js and TypeScript. The project uses
an automated GitHub Actions CI/CD pipeline with self-hosted Linux runners, Docker Compose for
the multi-service stack, Cloudflare Tunnel for zero-exposed-port access, Nginx for reverse
proxy routing, SSL/TLS certificates, UFW firewall hardening, MongoDB, and Cloudinary.
- Designed and debugged CI/CD workflows, including npm cache errors, cross-platform lockfile
  conflicts, and VM clock drift authentication failures.
- Containerized Node.js/Express, Next.js, and MongoDB services with Docker Compose.
- Migrated reverse proxy routing to native Nginx for seamless zero-downtime routing.
Tags: Next.js, TypeScript, Docker, GitHub Actions, Nginx, Cloudflare Tunnel, MongoDB, Cloudinary.
Live URL: https://fop-admin.darshantech.online

## My Portfolio — AI-Powered Personal Website
An AI-powered personal website with a production RAG pipeline using Markdown chunking, local
vector embeddings, cosine similarity, and self-hosted Ollama LLMs.
- Engineered a streaming chat UI with Next.js and Vercel AI SDK.
- Implemented closed action-token navigation, rate limiting, and sanitized rendering.
- Automated CI/CD deployment to Vercel using GitHub Actions with lint-gated builds and
  branch-based production/preview releases.
- Uses a Cloudflare-managed subdomain with automatic SSL.
Tags: Next.js, TypeScript, RAG, Ollama, Vercel AI SDK.
Live URL: https://my-portfolio.darshantech.online

## Pushtimarg Web Application
A scalable WordPress platform featuring 13+ custom plugins and a custom theme, with an
English/Hindi translation system, LMS module, polling system, OAuth integrations, and REST APIs.
Tags: WordPress, PHP, MySQL, JavaScript, REST APIs.
Live URL: https://pushtimarg.wappzo.com
