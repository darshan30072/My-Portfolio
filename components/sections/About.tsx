"use client";

import { EDUCATION, CERTIFICATIONS } from "@/lib/constants";
import { Reveal } from "@/components/motion/Reveal";
import { Badge } from "@/components/ui/badge";

const FOCUS_AREAS = [
  {
    title: "Frontend Engineering",
    desc: "React.js, Next.js, TypeScript, Tailwind",
  },
  {
    title: "Full-Stack Systems",
    desc: "PHP, WordPress, ASP.NET Core, MySQL",
  },
  {
    title: "AI & Automation",
    desc: "Local LLMs, RAG fundamentals, data pipelines",
  },
];

export function About() {
  return (
    <section id="about" className="section-padding border-b border-border">
      <div className="container-narrow">
        <Reveal>
          <div className="mb-12 md:mb-14">
            <p className="mb-2 font-mono text-xs uppercase tracking-widest text-primary">
              About
            </p>
            <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
              Frontend-first, full-stack in practice
            </h2>
          </div>
        </Reveal>

        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <Reveal>
            <div className="space-y-4 text-[15px] leading-relaxed text-muted-foreground md:text-base">
              <p>
                <strong className="font-semibold text-foreground">
                  I&apos;m a frontend developer
                </strong>{" "}
                with professional experience building scalable React.js and
                Next.js applications, alongside full-stack development using
                PHP, MySQL, WordPress custom plugins and themes, and ASP.NET
                Core.
              </p>
              <p>
                At Wappzo Infotech I progressed from intern to Associate
                Software Engineer, architecting REST APIs, multilingual systems,
                and authentication workflows — including a from-scratch
                English/Hindi translation engine (the same one powering the
                animation in the hero).
              </p>
              <p>
                I&apos;m currently expanding into{" "}
                <strong className="font-semibold text-foreground">
                  AI, Retrieval-Augmented Generation, and LLM integration
                </strong>
                , with hands-on experience running local models and building
                automated data pipelines.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="space-y-3">
              {FOCUS_AREAS.map((item) => (
                <div
                  key={item.title}
                  className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/30"
                >
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  <div>
                    <div className="text-sm font-semibold text-foreground">
                      {item.title}
                    </div>
                    <div className="mt-0.5 text-xs text-muted-foreground">
                      {item.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Education */}
        <div className="mt-16 grid gap-4 sm:grid-cols-2">
          {EDUCATION.map((edu, i) => (
            <Reveal key={edu.degree} delay={i * 0.08}>
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="font-display text-base font-semibold text-foreground">
                  {edu.degree}
                </h3>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {edu.school}
                </p>
                <p className="mt-2 font-mono text-xs text-muted-foreground/80">
                  {edu.period}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Certifications */}
        {CERTIFICATIONS.length > 0 && (
          <Reveal delay={0.1}>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Badge variant="default">Certification</Badge>
              {CERTIFICATIONS.map((cert) => (
                <span
                  key={cert.title}
                  className="text-sm text-muted-foreground"
                >
                  {cert.title} — {cert.issuer}
                </span>
              ))}
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
