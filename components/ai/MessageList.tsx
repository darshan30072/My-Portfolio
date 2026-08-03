"use client";

import { useLayoutEffect, useRef } from "react";
import type { UIMessage } from "ai";
import { ChatMessage } from "./ChatMessage";
import { SuggestedPrompts } from "./SuggestedPrompts";
import { TypingIndicator } from "./TypingIndicator";

type Status = "submitted" | "streaming" | "ready" | "error";

export function MessageList({
  messages,
  status,
  onSuggestedSelect,
}: {
  messages: UIMessage[];
  status: Status;
  onSuggestedSelect: (prompt: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const stickToBottom = useRef(true);

  function handleScroll() {
    const el = containerRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    stickToBottom.current = distanceFromBottom < 80;
  }

  useLayoutEffect(() => {
    if (!stickToBottom.current) return;

    const container = containerRef.current;
    const target = bottomRef.current;

    if (!container || !target) return;

    target.scrollIntoView({ behavior: "auto", block: "end" });
  }, [messages, status]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-3.5 py-3 [scrollbar-gutter:stable]">
        <SuggestedPrompts onSelect={onSuggestedSelect} />
      </div>
    );
  }

  // Show the retrieval/thinking indicator only while waiting for the first
  // token — once text starts streaming, the partial message is the feedback.
  const isWaitingForFirstToken =
    status === "submitted" ||
    (status === "streaming" &&
      messages[messages.length - 1]?.role !== "assistant");

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 space-y-3 overflow-y-auto overflow-x-hidden px-3.5 py-3 [scrollbar-gutter:stable]"
    >
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
      {isWaitingForFirstToken && (
        <TypingIndicator label="Searching portfolio knowledge base…" />
      )}
      <div ref={bottomRef} />
    </div>
  );
}
