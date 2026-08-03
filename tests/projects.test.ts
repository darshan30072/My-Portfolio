import test from "node:test";
import assert from "node:assert/strict";
import { splitProjects } from "../lib/projects";

test("preserves all featured projects instead of collapsing to one", () => {
  const projects = [
    { id: "a", featured: true },
    { id: "b", featured: false },
    { id: "c", featured: true },
  ];

  const result = splitProjects(projects);

  assert.deepEqual(result.featuredProjects.map((p) => p.id), ["a", "c"]);
  assert.deepEqual(result.otherProjects.map((p) => p.id), ["b"]);
});
