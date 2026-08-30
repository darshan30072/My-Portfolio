"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Download, MapPin } from "lucide-react";
import { HERO_ROLES, HERO_STATS, SITE } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/motion/Magnetic";

function TypewriterRole() {
  const shouldReduceMotion = useReducedMotion();
  const [text, setText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  const tick = useCallback(() => {
    const full = HERO_ROLES[phraseIndex];

    if (!deleting) {
      if (text.length < full.length) {
        setText(full.slice(0, text.length + 1));
      } else {
        setTimeout(() => setDeleting(true), 1400);
        return;
      }
    } else {
      if (text.length > 0) {
        setText(full.slice(0, text.length - 1));
      } else {
        setDeleting(false);
        setPhraseIndex((i) => (i + 1) % HERO_ROLES.length);
        return;
      }
    }
  }, [text, deleting, phraseIndex]);

  useEffect(() => {
    if (shouldReduceMotion) {
      setText(HERO_ROLES[0]);
      return;
    }
    const id = setTimeout(tick, deleting ? 32 : 52);
    return () => clearTimeout(id);
  }, [tick, deleting, shouldReduceMotion]);

  return (
    <div
      className="flex min-h-[1.6em] items-center font-mono text-lg text-primary md:text-xl"
      aria-live="polite"
    >
      <span>{text}</span>
      {!shouldReduceMotion && (
        <span className="ml-0.5 inline-block h-[1.1em] w-0.5 animate-pulse bg-primary" />
      )}
    </div>
  );
}

export function Hero() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="hero" className="relative overflow-hidden border-b border-border">
      {/* Background effects
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute -bottom-40 -left-20 h-[360px] w-[360px] rounded-full bg-secondary/10 blur-[100px]" />
        {!shouldReduceMotion && (
          <>
            <div className="absolute right-[15%] top-[20%] h-24 w-24 animate-float rounded-full bg-primary/5 blur-2xl" />
            <div
              className="absolute bottom-[25%] left-[10%] h-32 w-32 animate-float rounded-full bg-secondary/5 blur-2xl"
              style={{ animationDelay: "2s" }}
            />
          </>
        )}
      </div> */}

      <div className="container-narrow relative grid items-center gap-12 py-20 md:gap-16 md:py-28 lg:grid-cols-[1.35fr_0.65fr] lg:py-32">
        {/* Left content */}
        <div>
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mb-5 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-primary"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-50" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
            </span>
            <MapPin className="h-3 w-3" />
            {SITE.location} · Open to Work
          </motion.div>

          <motion.h1
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-[3.5rem] lg:leading-[1.08]"
          >
            Hey, I&apos;m{" "}
            <span className="gradient-text">Darshan Tandel</span>
          </motion.h1>

          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="mt-4"
          >
            <TypewriterRole />
          </motion.div>

          <motion.p
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24 }}
            className="mt-6 max-w-[52ch] text-base leading-relaxed text-muted-foreground md:text-[17px]"
          >
            I build production software across full-stack development, DevOps, and AI —
            from React.js and Next.js applications to containerized CI/CD systems
            and local RAG solutions.
          </motion.p>

          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.32 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Magnetic>
              <Button asChild size="lg" variant="gradient">
                <Link href="#projects">
                  View Projects
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </Magnetic>
            <Magnetic strength={0.25}>
              <Button asChild size="lg" variant="outline">
                <Link href="#contact">Get in Touch</Link>
              </Button>
            </Magnetic>
            <Magnetic strength={0.25}>
              <Button asChild size="lg" variant="ghost">
                <a href={SITE.resume} download>
                  <Download className="h-4 w-4" />
                  Resume
                </a>
              </Button>
            </Magnetic>
          </motion.div>
        </div>

        {/* Right card */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto w-full max-w-[320px] lg:mx-0 lg:max-w-none"
        >
          <div className="glass relative overflow-hidden rounded-2xl p-6 text-center shadow-2xl shadow-black/20">
            {/* Soft gradient ring behind avatar */}
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-primary/10 to-transparent" />

            <div className="relative mx-auto mb-5 flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-[3px] border-border bg-gradient-to-br from-primary to-secondary shadow-lg">
              <Image
                src="/images/DT.jpg"
                alt="Darshan Tandel"
                width={112}
                height={112}
                className="h-full w-full object-cover"
                priority
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = "none";
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = "flex";
                }}
              />
              <span
                className="absolute inset-0 hidden items-center justify-center font-display text-3xl font-bold text-[#14171c]"
                aria-hidden="true"
              >
                DT
              </span>
            </div>

            <h2 className="font-display text-lg font-semibold text-foreground">
              Darshan Tandel
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Software Engineer
            </p>

            <div className="mt-5 grid grid-cols-2 gap-2.5 text-left">
              {HERO_STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl bg-muted/60 px-3 py-2.5"
                >
                  <div className="font-mono text-sm font-semibold text-primary">
                    {stat.value}
                  </div>
                  <div className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
