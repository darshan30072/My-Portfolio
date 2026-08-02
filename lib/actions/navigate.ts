"use client";

import { SITE } from "@/lib/constants";
import type { ActionId } from "@/lib/ai/actions";

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
}

export function scrollToSection(id: string) {
  document
    .getElementById(id)
    ?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
}

export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
}

export function downloadResume() {
  const link = document.createElement("a");
  link.href = SITE.resume;
  link.download = "";
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function openExternal(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export type ActionResult = { message: string } | null;

/** Executes a single validated action id, returning a short toast message if relevant. */
export async function runPortfolioAction(id: ActionId): Promise<ActionResult> {
  switch (id) {
    case "scroll:top":
      scrollToTop();
      return null;
    case "scroll:about":
      scrollToSection("about");
      return null;
    case "scroll:projects":
      scrollToSection("projects");
      return null;
    case "scroll:experience":
      scrollToSection("experience");
      return null;
    case "scroll:skills":
      scrollToSection("skills");
      return null;
    case "scroll:contact":
      scrollToSection("contact");
      return null;
    case "resume:download":
      downloadResume();
      return { message: "Resume download started" };
    case "contact:copyEmail": {
      const ok = await copyToClipboard(SITE.email);
      return { message: ok ? "Email copied to clipboard" : "Couldn't copy — copy it manually" };
    }
    case "contact:copyPhone": {
      const ok = await copyToClipboard(SITE.phone);
      return { message: ok ? "Phone number copied to clipboard" : "Couldn't copy — copy it manually" };
    }
    case "link:github":
      openExternal(SITE.social.github);
      return null;
    case "link:linkedin":
      openExternal(SITE.social.linkedin);
      return null;
    default:
      return null;
  }
}
