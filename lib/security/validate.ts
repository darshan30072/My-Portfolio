import { z } from "zod";
import { MAX_MESSAGE_LENGTH } from "@/lib/ai/config";

const textPartSchema = z.object({
  type: z.literal("text"),
  text: z.string().max(MAX_MESSAGE_LENGTH),
});

// The AI SDK's UIMessage can carry other part types (files, tool calls,
// reasoning, ...). This app only ever sends text parts from the client, but
// we accept-and-ignore unknown part shapes rather than rejecting the whole
// request, so the schema doesn't break if the SDK adds new part types.
const messagePartSchema = z.union([textPartSchema, z.object({ type: z.string() }).passthrough()]);

const uiMessageSchema = z.object({
  id: z.string().optional(),
  role: z.enum(["system", "user", "assistant"]),
  parts: z.array(messagePartSchema).min(1),
});

export const chatRequestSchema = z.object({
  messages: z.array(uiMessageSchema).min(1).max(200),
  model: z.string().optional(),
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;
