import test from "node:test";
import assert from "node:assert/strict";
import { parseActions } from "../lib/ai/actions";

test("infers a contact navigation action from contact-info replies", () => {
  const text = `Show contact information

- Email: tandeldarshan57@gmail.com
- Phone: +91 63567 18644
- Location: Valsad, Gujarat, India`;

  const result = parseActions(text);

  assert.deepEqual(result.actions, ["scroll:contact"]);
});

test("infers an about navigation action from profile-intro replies", () => {
  const text = "Tell me about the person and their background";

  const result = parseActions(text);

  assert.deepEqual(result.actions, ["scroll:about"]);
});

test("infers a projects navigation action from portfolio replies", () => {
  const text = "Show me the portfolio projects";

  const result = parseActions(text);

  assert.deepEqual(result.actions, ["scroll:projects"]);
});

test("infers an experience navigation action from career replies", () => {
  const text = "Show my work experience";

  const result = parseActions(text);

  assert.deepEqual(result.actions, ["scroll:experience"]);
});

test("infers a skills navigation action from stack replies", () => {
  const text = "Show the technologies and tools";

  const result = parseActions(text);

  assert.deepEqual(result.actions, ["scroll:skills"]);
});
