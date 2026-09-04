export type Project = {
  id: string;
  title: string;
  kind: string;
  featured: boolean;
  description: string;
  tags: readonly string[];
  liveUrl?: string;
  githubUrl?: string;
  image: string;
  metrics?: readonly string[];
};

export const SITE = {
  name: "Darshan Tandel",
  title: "Darshan Tandel — Software Engineer",
  description:
    "Software Engineer with hands-on DevOps experience building CI/CD pipelines, containerized applications, full-stack systems, and AI/RAG solutions. Based in Valsad, Gujarat, India.",
  url: "https://my-portfolio.darshantech.online",
  email: "tandeldarshan57@gmail.com",
  phone: "+91 63567 18644",
  location: "Valsad, Gujarat, India",
  openToWork: true,
  social: {
    linkedin: "https://www.linkedin.com/in/darshantandel002",
    github: "https://github.com/darshan30072", // update with real URL
  },
  resume: "/resume.pdf",
} as const;

export const NAV_LINKS = [
  { href: "#hero", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#experience", label: "Experience" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
] as const;

export const HERO_ROLES = [
  "Software Engineer",
  "DevOps & CI/CD Engineer",
  "AI & RAG Engineer",
] as const;

export const HERO_STATS = [
  { value: "13+", label: "WordPress plugins shipped" },
  { value: "CI/CD", label: "Production pipelines" },
  { value: "15+", label: "Interns mentored" },
  { value: "RAG", label: "AI pipeline built" },
] as const;

export const PROJECTS: readonly Project[] = [
  {
    id: "0",
    title: "Pushtimarg Web Application",
    kind: "Web Platform",
    featured: false,
    description:
      "Scalable WordPress platform featuring 13+ custom plugins and a custom theme, with an English/Hindi translation system, LMS module, polling system, OAuth integrations, and REST APIs.",
    tags: ["WordPress", "PHP", "MySQL", "JavaScript", "REST APIs"],
    liveUrl: "https://pushtimarg.wappzo.com",
    image: "/images/projects/pushtimarg.webp",
    metrics: ["13+ plugins", "Custom theme", "EN/HI engine"],
  },
  {
    id: "1",
    title: "My Portfolio — AI-Powered Personal Website",
    kind: "AI & RAG Platform",
    featured: true,
    description:
      "AI-powered portfolio with a production RAG pipeline using Markdown chunking, local vector embeddings, cosine similarity, and self-hosted Ollama models, plus a streaming chat UI with Vercel AI SDK and secure portfolio navigation actions.",
    tags: ["Next.js", "TypeScript", "RAG", "Ollama", "Vercel AI SDK"],
    liveUrl: "https://my-portfolio.darshantech.online",
    githubUrl: "https://github.com/darshan30072/My-Portfolio.git",
    image: "/images/projects/ai-portfolio-assistant.gif",
    metrics: ["RAG pipeline", "Streaming chat", "Vercel CI/CD"],
  },
  {
    id: "2",
    title: "FOP Admin — Food Ordering Platform Admin Dashboard",
    kind: "Full-Stack Platform",
    featured: true,
    description:
      "Production food ordering admin dashboard with an automated GitHub Actions CI/CD pipeline, self-hosted Linux runners, Docker Compose, Cloudflare Tunnel, Nginx, SSL/TLS, UFW hardening, MongoDB, and Cloudinary.",
    tags: ["Next.js", "TypeScript", "Docker", "GitHub Actions", "Nginx", "Cloudflare", "MongoDB", "Cloudinary"],
    liveUrl: "https://fop-admin.darshantech.online",
    githubUrl: "https://github.com/darshan30072/fop-admin.git",
    image: "/images/projects/fop.webp",
    metrics: ["CI/CD pipeline", "Self-hosted runner", "Zero exposed ports"],
  },
] as const;

export const EXPERIENCE = [
  {
    id: "wappzo",
    role: "Frontend Developer",
    company: "Wappzo Infotech Private Limited",
    period: "Nov 2024 – Dec 2025",
    progression: ["Intern", "Trainee", "Associate Engineer"],
    bullets: [
      "Built 10+ reusable React.js components using Hooks and props-driven design, integrating with REST APIs; debugged data-format mismatches between frontend and backend.",
      "Translated UI requirements into responsive, cross-browser interfaces across 10+ pages using React.js, Next.js, and modern CSS (Flexbox, Grid, Tailwind, Bootstrap).",
      "Architected and shipped 13 custom WordPress plugins and a custom theme, including a from-scratch English/Hindi translation engine, course platform with quiz & progress endpoints, multilingual polling, and OAuth (Google, Facebook, Microsoft).",
      "Mentored 15+ onboarding interns through HTML, CSS, and JavaScript code reviews.",
    ],
  },
  {
    id: "prologiciel",
    role: ".NET Intern",
    company: "Prologiciel Consulting",
    period: "Jan 2024 – Apr 2024",
    progression: null,
    bullets: [
      "Built a full-stack task management app in ASP.NET Core (Razor Pages) and C#, implementing complete CRUD against SQL Server using parameterized ADO.NET queries to prevent SQL injection.",
    ],
  },
] as const;

export const SKILLS = [
  {
    category: "DevOps & Infrastructure",
    items: [
      "Docker",
      "Docker Compose",
      "GitHub Actions (CI/CD)",
      "Nginx",
      "Cloudflare Tunnel",
      "SSL/TLS (Let's Encrypt)",
      "UFW",
      "Linux (Ubuntu)",
      "Self-Hosted Runners",
      "systemd",
      "Git/GitOps",
      "Cloudinary",
      "S3",
    ],
  },
  {
    category: "Frontend & Backend",
    items: [
      "JavaScript (ES6+)",
      "TypeScript",
      "React.js",
      "Next.js",
      "Tailwind CSS",
      "Node.js",
      "ASP.NET Core",
      "PHP",
      "WordPress",
      "REST APIs",
      "MySQL",
      "MongoDB",
    ],
  },
  {
    category: "AI & LLM Engineering",
    items: [
      "Ollama",
      "Retrieval-Augmented Generation (RAG)",
      "Vercel AI SDK",
      "Vector Embeddings",
    ],
  },
  {
    category: "Tools & Automation",
    items: [
      "Git",
      "GitHub",
      "Python",
      "Data Automation",
      "API Data Pipelines",
    ],
  },
] as const;

export const EDUCATION = [
  {
    degree: "Bachelor of Engineering, Computer Science",
    school: "Mahatma Gandhi Institute of Technical Education & Research Center, Navsari",
    period: "Aug 2021 – May 2024",
  },
  {
    degree: "Diploma in Information Technology",
    school: "Dr. S. & S. S. Ghandhy College of Engg. & Tech., Surat",
    period: "Jun 2018 – May 2021",
  },
] as const;

export const CERTIFICATIONS = [
  {
    title: "AI Engineer Core Track: LLM Engineering, RAG, QLoRA & Agents",
    issuer: "Udemy",
  },
] as const;
