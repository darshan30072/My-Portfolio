"use client";

import { useState } from "react";
import {
  Mail,
  Phone,
  Linkedin,
  Github,
  Copy,
  Check,
  Download,
  Send,
} from "lucide-react";
import { SITE } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/Reveal";
import { Magnetic } from "@/components/motion/Magnetic";
import { cn } from "@/lib/utils";
import { CurrentYear } from "../layout/CurrentYear";

export function Contact() {
  const [copied, setCopied] = useState(false);
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [errorMsg, setErrorMsg] = useState("");

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(SITE.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy email:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });

      const data = (await res.json()) as { error?: string; ok?: boolean };

      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setStatus("sent");
      setFormState({ name: "", email: "", message: "" });
      setTimeout(() => setStatus("idle"), 4000);
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please email me directly instead.");
    }
  };

  return (
    <section id="contact" className="section-padding">
      <div className="container-narrow">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-2 font-mono text-xs uppercase tracking-widest text-primary">
              Contact
            </p>
            <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl lg:text-[2.75rem]">
              Let&apos;s build something
            </h2>
            <p className="mt-4 text-muted-foreground">
              Open to frontend, full-stack, and AI-adjacent roles. The fastest
              way to reach me is email or a call/WhatsApp.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
          {/* Quick links */}
          <Reveal delay={0.08}>
            <div className="space-y-4">
              <div className="glass rounded-2xl p-6">
                <h3 className="mb-4 font-display text-sm font-semibold text-foreground">
                  Reach me directly
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={copyEmail}
                    className="flex w-full items-center gap-3 rounded-xl border border-border bg-muted/40 px-4 py-3 text-left transition-colors hover:border-primary/40 hover:bg-primary/5"
                    suppressHydrationWarning
                  >
                    <Mail className="h-4 w-4 shrink-0 text-primary" />
                    <span className="flex-1 truncate text-sm text-foreground">
                      {SITE.email}
                    </span>
                    {copied ? (
                      <Check className="h-4 w-4 text-success" />
                    ) : (
                      <Copy className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>

                  <a
                    href={`tel:${SITE.phone.replace(/\s/g, "")}`}
                    className="flex items-center gap-3 rounded-xl border border-border bg-muted/40 px-4 py-3 transition-colors hover:border-primary/40 hover:bg-primary/5"
                  >
                    <Phone className="h-4 w-4 shrink-0 text-primary" />
                    <span className="text-sm text-foreground">{SITE.phone}</span>
                  </a>

                  <a
                    href={SITE.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-xl border border-border bg-muted/40 px-4 py-3 transition-colors hover:border-primary/40 hover:bg-primary/5"
                  >
                    <Linkedin className="h-4 w-4 shrink-0 text-primary" />
                    <span className="text-sm text-foreground">LinkedIn</span>
                  </a>

                  <a
                    href={SITE.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-xl border border-border bg-muted/40 px-4 py-3 transition-colors hover:border-primary/40 hover:bg-primary/5"
                  >
                    <Github className="h-4 w-4 shrink-0 text-primary" />
                    <span className="text-sm text-foreground">GitHub</span>
                  </a>
                </div>

                <Magnetic className="mt-5 block">
                  <Button asChild variant="outline" className="w-full">
                    <a href={SITE.resume} download>
                      <Download className="h-4 w-4" />
                      Download Resume
                    </a>
                  </Button>
                </Magnetic>
              </div>
            </div>
          </Reveal>

          {/* Form */}
          <Reveal delay={0.12}>
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-border bg-card p-6 md:p-8"
            >
              <h3 className="mb-5 font-display text-sm font-semibold text-foreground">
                Send a message
              </h3>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-1.5 block text-xs font-medium text-muted-foreground"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    required
                    value={formState.name}
                    onChange={(e) =>
                      setFormState((s) => ({ ...s, name: e.target.value }))
                    }
                    className={cn(
                      "w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground",
                      "placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    )}
                    placeholder="Your name"
                    suppressHydrationWarning
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-xs font-medium text-muted-foreground"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formState.email}
                    onChange={(e) =>
                      setFormState((s) => ({ ...s, email: e.target.value }))
                    }
                    className={cn(
                      "w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground",
                      "placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    )}
                    placeholder="you@company.com"
                    suppressHydrationWarning
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="mb-1.5 block text-xs font-medium text-muted-foreground"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    value={formState.message}
                    onChange={(e) =>
                      setFormState((s) => ({ ...s, message: e.target.value }))
                    }
                    className={cn(
                      "w-full resize-none rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground",
                      "placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    )}
                    placeholder="Tell me about the role or project..."
                    suppressHydrationWarning
                  />
                </div>

                {status === "error" && errorMsg && (
                  <p
                    role="alert"
                    className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400"
                  >
                    {errorMsg}
                  </p>
                )}

                <Button
                  type="submit"
                  variant="gradient"
                  className="w-full"
                  disabled={status === "sending" || status === "sent"}
                  suppressHydrationWarning
                >
                  {status === "sending" ? (
                    "Sending..."
                  ) : status === "sent" ? (
                    <>
                      <Check className="h-4 w-4" /> Message sent
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" /> Send Message
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Reveal>
        </div>

        {/* Footer */}
        <Reveal>
          <div className="mt-20 flex flex-col items-center justify-center gap-4 border-t border-border pt-8 text-center text-xs text-muted-foreground sm:flex-row sm:text-left">
            <span className="max-w-md">
              © <CurrentYear /> {SITE.name} · {SITE.location}
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
