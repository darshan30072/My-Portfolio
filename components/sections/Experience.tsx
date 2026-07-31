"use client";

import { EXPERIENCE } from "@/lib/constants";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";

export function Experience() {
  return (
    <section id="experience" className="section-padding border-b border-border">
      <div className="container-narrow">
        <Reveal>
          <div className="mb-12 md:mb-14">
            <p className="mb-2 font-mono text-xs uppercase tracking-widest text-primary">
              Experience
            </p>
            <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
              Where I&apos;ve worked
            </h2>
          </div>
        </Reveal>

        <div className="relative">
          {/* Vertical line */}
          <div
            className="absolute left-[7px] top-2 hidden h-[calc(100%-16px)] w-px bg-border md:left-[11px] md:block"
            aria-hidden="true"
          />

          <ul className="space-y-0">
            {EXPERIENCE.map((job, index) => (
              <Reveal key={job.id} delay={index * 0.08}>
                <li className="relative grid gap-4 border-t border-border py-8 first:border-t-0 first:pt-0 md:grid-cols-[180px_1fr] md:gap-10 md:py-10">
                  {/* Dot on timeline */}
                  <div
                    className={cn(
                      "absolute left-0 top-[2.15rem] hidden h-2.5 w-2.5 rounded-full border-2 border-primary bg-background md:left-1 md:block",
                      index === 0 && "bg-primary"
                    )}
                    aria-hidden="true"
                  />

                  <div className="md:pl-8">
                    <time className="font-mono text-xs text-muted-foreground md:text-sm">
                      {job.period}
                    </time>
                  </div>

                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground md:text-xl">
                      {job.role}
                    </h3>
                    <p className="mt-1 text-sm text-primary">{job.company}</p>

                    {job.progression && (
                      <div className="mt-3 flex flex-wrap items-center gap-1.5">
                        {job.progression.map((step, i) => (
                          <span key={step} className="flex items-center gap-1.5">
                            <span
                              className={cn(
                                "rounded-full border px-2.5 py-0.5 font-mono text-[11px]",
                                i === job.progression!.length - 1
                                  ? "border-primary/40 bg-primary/10 text-primary"
                                  : "border-border bg-muted text-muted-foreground"
                              )}
                            >
                              {step}
                            </span>
                            {i < job.progression!.length - 1 && (
                              <span className="text-muted-foreground/50 text-xs">→</span>
                            )}
                          </span>
                        ))}
                      </div>
                    )}

                    <ul className="mt-4 space-y-2.5">
                      {job.bullets.map((bullet) => (
                        <li
                          key={bullet.slice(0, 40)}
                          className="relative pl-4 text-sm leading-relaxed text-muted-foreground before:absolute before:left-0 before:text-muted-foreground/60 before:content-['—']"
                        >
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
