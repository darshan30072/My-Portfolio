export const SITE = {
  name: "Darshan Tandel",
  title: "Darshan Tandel — Frontend Developer & AI Engineer",
  description:
    "Frontend Developer building scalable React/Next.js applications, WordPress platforms, and local AI/RAG tools. Based in Valsad, Gujarat, India.",
  url: "https://darshantandel.dev", // update when deployed
  email: "tandeldarshan57@gmail.com",
  phone: "+91 63567 18644",
  location: "Valsad, Gujarat, India",
  openToWork: true,
  social: {
    linkedin: "https://www.linkedin.com/in/darshantandel002",
    github: "https://github.com/darshantandel", // update with real URL
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
  "Frontend Developer",
  "Full-Stack Engineer",
  "AI & RAG Explorer",
] as const;

export const HERO_STATS = [
  { value: "13+", label: "WordPress plugins shipped" },
  { value: "4", label: "Local LLMs integrated" },
  { value: "15+", label: "Interns mentored" },
  { value: "2", label: "Languages, EN/HI engine" },
] as const;

export const PROJECTS = [
  {
    id: "0",
    title: "Pushtimarg Web Application",
    kind: "Web Platform",
    featured: true,
    description:
      "A scalable WordPress platform built from 13+ custom plugins and a custom theme, featuring a from-scratch English/Hindi multilingual system, LMS with quizzes & progress tracking, OAuth (Google, Facebook, Microsoft), and REST API integrations.",
    tags: ["WordPress", "PHP", "MySQL", "REST APIs", "OAuth"],
    liveUrl: "https://pushtimarg.wappzo.com",
    githubUrl: null,
    image: "/images/projects/pushtimarg.webp",
    metrics: ["13+ plugins", "Custom theme", "EN/HI engine"],
  },
  {
    id: "1",
    title: "FOP Admin Dashboard",
    kind: "Dashboard",
    featured: false,
    description:
      "Solo-built restaurant operations dashboard — 14 components and 17 custom hooks in an MVVM pattern to manage, track, and report on food items, orders, and categories across 13 pages.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "REST APIs"],
    liveUrl: null,
    githubUrl: null,
    image: "/images/projects/fop.webp",
    metrics: ["14 components", "17 hooks", "13 pages"],
  },
  {
    id: "2",
    title: "Local AI Chatbot",
    kind: "AI Tool",
    featured: false,
    description:
      "Offline AI chatbot integrating Ollama with 4 swappable open-source LLMs (Llama 3.2, Mistral, Gemma, DeepSeek-R1). Persistent multi-turn history and real-time token streaming — zero API cost.",
    tags: ["Python", "Streamlit", "Ollama", "LLMs"],
    liveUrl: null,
    githubUrl: null,
    image: "/images/projects/ai-chatbot.webp",
    metrics: ["4 models", "Fully offline", "Streaming"],
  },
] as const;

export const EXPERIENCE = [
  {
    id: "wappzo",
    role: "Frontend Developer",
    company: "Wappzo Infotech Private Limited",
    period: "Nov 2024 – Dec 2025",
    progression: ["Intern", "Trainee", "Associate Software Engineer"],
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
    category: "Frontend & UI",
    items: [
      "JavaScript (ES6+)",
      "TypeScript",
      "React.js",
      "Next.js",
      "Tailwind CSS",
      "Bootstrap",
    ],
  },
  {
    category: "Backend & Databases",
    items: [
      "Node.js",
      "ASP.NET Core",
      "PHP",
      "WordPress",
      "REST API Design",
      "MySQL",
      "MongoDB",
    ],
  },
  {
    category: "Tools & AI",
    items: [
      "Git",
      "GitHub",
      "Local LLM (Ollama)",
      "RAG fundamentals",
    ],
  },
  {
    category: "Data & Automation",
    items: [
      "Python",
      "API data pipelines",
      "Data automation",
      "REST API integration",
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
    period: "Jun 2018 – Jul 2021",
  },
] as const;

export const CERTIFICATIONS = [
  {
    title: "AI Engineer Core Track: LLM Engineering, RAG, QLoRA & Agents",
    issuer: "Udemy",
  },
] as const;
