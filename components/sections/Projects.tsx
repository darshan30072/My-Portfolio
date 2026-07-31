"use client";

import Image from "next/image";
import { ExternalLink, Github, ArrowUpRight } from "lucide-react";
import { PROJECTS } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { cn } from "@/lib/utils";

function  ProjectCard({
  project,
  featured = false,
}: {
  project: (typeof PROJECTS)[number];
  featured?: boolean;
}) {
  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300",
        "hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5",
        featured && "md:col-span-2 md:grid md:grid-cols-2 md:gap-0"
      )}
    >
      {/* Image area */}
      <div
        className={cn(
          "relative overflow-hidden bg-muted",
          featured ? "aspect-[16/10] md:aspect-auto md:min-h-[320px]" : "aspect-[16/10]"
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display text-4xl font-bold text-foreground/10 select-none">
            {project.title.charAt(0)}
          </span>
        </div>
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          sizes={featured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 33vw"}
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6 md:p-7">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <Badge variant="outline" className="mb-2 font-mono text-[10px] uppercase tracking-wider">
              {project.kind}
            </Badge>
            <h3 className="font-display text-xl font-semibold text-foreground transition-colors group-hover:text-primary">
              {project.title}
            </h3>
          </div>
          <div className="flex shrink-0 gap-1.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                aria-label={`Live demo of ${project.title}`}
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                aria-label={`GitHub repo for ${project.title}`}
              >
                <Github className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </div>

        <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground">
          {project.description}
        </p>

        {project.metrics && (
          <div className="mb-4 flex flex-wrap gap-2">
            {project.metrics.map((m) => (
              <span
                key={m}
                className="rounded-full bg-muted px-2.5 py-0.5 font-mono text-[11px] text-muted-foreground"
              >
                {m}
              </span>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <Badge key={tag} variant="default">
              {tag}
            </Badge>
          ))}
        </div>

        {(project.liveUrl || project.githubUrl) && (
          <div className="mt-5 flex gap-3 border-t border-border pt-4">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
              >
                Live Demo <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Source <Github className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

export function Projects() {
  const featured = PROJECTS.find((p) => p.featured);
  const others = PROJECTS.filter((p) => !p.featured);

  return (
    <section id="projects" className="section-padding border-b border-border">
      <div className="container-narrow">
        <Reveal>
          <div className="mb-12 md:mb-14">
            <p className="mb-2 font-mono text-xs uppercase tracking-widest text-primary">
              Projects
            </p>
            <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
              Things I&apos;ve built
            </h2>
          </div>
        </Reveal>

        <div className="grid gap-5 md:grid-cols-2">
          {featured && (
            <Reveal className="md:col-span-2">
              <ProjectCard project={featured} featured />
            </Reveal>
          )}

          <Stagger className="contents">
            {others.map((project) => (
              <StaggerItem key={project.id}>
                <ProjectCard project={project} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
