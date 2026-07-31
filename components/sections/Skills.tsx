"use client";

import { SKILLS } from "@/lib/constants";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import {
  Code2,
  Server,
  Wrench,
  Bot,
  Database,
  type LucideIcon,
} from "lucide-react";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  "Frontend & UI": Code2,
  "Backend & Databases": Server,
  "Tools & AI": Bot,
  "Data & Automation": Wrench,
};

export function Skills() {
  return (
    <section id="skills" className="section-padding border-b border-border">
      <div className="container-narrow">
        <Reveal>
          <div className="mb-12 md:mb-14">
            <p className="mb-2 font-mono text-xs uppercase tracking-widest text-primary">
              Skills
            </p>
            <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
              What I work with
            </h2>
          </div>
        </Reveal>

        <Stagger className="grid gap-4 sm:grid-cols-2">
          {SKILLS.map((group) => {
            const Icon = CATEGORY_ICONS[group.category] ?? Database;
            return (
              <StaggerItem key={group.category}>
                <div className="group h-full rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                      <Icon className="h-4 w-4" strokeWidth={1.75} />
                    </div>
                    <h3 className="font-mono text-xs font-medium uppercase tracking-wider text-primary">
                      {group.category}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-sm text-foreground transition-colors hover:border-primary/30 hover:bg-primary/5"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
