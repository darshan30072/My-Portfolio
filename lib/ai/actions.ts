/**
 * "Portfolio actions" let the assistant do things in the page — scroll to a
 * section, download the resume, copy contact info, open external links —
 * instead of just talking about them.
 *
 * Local models served through Ollama vary a lot in how reliably they support
 * structured tool-calling, so rather than depending on that, the system
 * prompt asks the model to emit a small closed vocabulary of plain-text
 * tokens like `[[action:scroll:projects]]` at the end of its reply. The
 * client strips these tokens out of the rendered markdown and executes the
 * matching DOM action. Unknown/malformed tokens are stripped but ignored.
 */

export type ActionId =
  | "scroll:top"
  | "scroll:about"
  | "scroll:projects"
  | "scroll:experience"
  | "scroll:skills"
  | "scroll:contact"
  | "resume:download"
  | "contact:copyEmail"
  | "contact:copyPhone"
  | "link:github"
  | "link:linkedin";

export type ActionDefinition = {
  id: ActionId;
  /** Shown to the model in the system prompt so it knows when to use it. */
  whenToUse: string;
};

export const ACTION_CATALOG: ActionDefinition[] = [
  { id: "scroll:top", whenToUse: "user asks to go back to the top of the page" },
  { id: "scroll:about", whenToUse: "user asks to see the About section" },
  { id: "scroll:projects", whenToUse: "user asks to see projects/portfolio work" },
  { id: "scroll:experience", whenToUse: "user asks to see work experience" },
  { id: "scroll:skills", whenToUse: "user asks to see the skills section" },
  { id: "scroll:contact", whenToUse: "user asks to see the contact section" },
  { id: "resume:download", whenToUse: "user asks to open, view, or download the resume" },
  { id: "contact:copyEmail", whenToUse: "user asks to copy the email address" },
  { id: "contact:copyPhone", whenToUse: "user asks to copy the phone number" },
  { id: "link:github", whenToUse: "user asks to open GitHub" },
  { id: "link:linkedin", whenToUse: "user asks to open LinkedIn" },
];

const VALID_IDS = new Set<string>(ACTION_CATALOG.map((a) => a.id));

// Matches [[action:scroll:projects]] etc. Anything that doesn't parse to a
// known id is still stripped from the visible text, just never executed.
const ACTION_TOKEN_RE = /\[\[action:([a-zA-Z]+:[a-zA-Z]+)\]\]/g;

const SECTION_INTENT_PATTERNS: Array<{ action: ActionId; regex: RegExp }> = [
  { action: "scroll:about", regex: /\b(about|bio|who you are|introduction|overview)\b/i },
  { action: "scroll:projects", regex: /\b(projects?|portfolio|work samples|case studies|featured work)\b/i },
  { action: "scroll:experience", regex: /\b(experience|work history|career|journey|resume)\b/i },
  { action: "scroll:skills", regex: /\b(skills?|technologies?|tech stack|toolset|expertise|tools?)\b/i },
  { action: "scroll:contact", regex: /\b(contact(?:\s+(?:information|details|info|section))?|get in touch|reach out|reach me|contact me)\b/i },
];

const SECTION_DETAIL_PATTERNS: Array<{ action: ActionId; regex: RegExp }> = [
  { action: "scroll:contact", regex: /(?:^|\n)\s*(?:[-*•]|\u2022|\d+\.)?\s*(email|phone|location|linkedin|github)\s*:/i },
  { action: "scroll:projects", regex: /(?:^|\n)\s*(?:[-*•]|\u2022|\d+\.)?\s*(project|portfolio|case study)\s*:/i },
  { action: "scroll:skills", regex: /(?:^|\n)\s*(?:[-*•]|\u2022|\d+\.)?\s*(skill|technology|tool|stack)\s*:/i },
];

export function parseActions(text: string): {
  cleanText: string;
  actions: ActionId[];
} {
  const found: ActionId[] = [];

  const cleanText = text
    .replace(ACTION_TOKEN_RE, (_match, id: string) => {
      if (VALID_IDS.has(id)) found.push(id as ActionId);
      return "";
    })
    .replace(/[ \t]+\n/g, "\n") // trim trailing spaces left behind on a line
    .replace(/\n{3,}/g, "\n\n") // collapse blank lines left behind
    .trim();

  for (const { action, regex } of SECTION_INTENT_PATTERNS) {
    if (regex.test(cleanText)) {
      found.push(action);
    }
  }

  for (const { action, regex } of SECTION_DETAIL_PATTERNS) {
    if (regex.test(cleanText)) {
      found.push(action);
    }
  }

  return { cleanText, actions: Array.from(new Set(found)) };
}
