"use client";

import { useCallback, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { AnimatePresence } from "framer-motion";
import { ChatButton } from "./ChatButton";
import { ChatWindow } from "./ChatWindow";
import { Toast } from "./Toast";
import { useOllamaHealth } from "@/hooks/useOllamaHealth";
import { usePortfolioActions } from "@/hooks/usePortfolioActions";
import { DEFAULT_CHAT_MODEL } from "@/lib/ai/config";

// Stable across renders — per-message model selection is passed via
// sendMessage's request `body` instead of recreating the transport.
const transport = new DefaultChatTransport({ api: "/api/chat" });

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [model, setModel] = useState(DEFAULT_CHAT_MODEL);
  const [input, setInput] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const noticeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Only poll Ollama's health once the widget has actually been opened.
  const health = useOllamaHealth(isOpen);

  const { messages, sendMessage, status, error, regenerate, stop, clearError, setMessages } =
    useChat({ transport });

  const showNotice = useCallback((message: string) => {
    setNotice(message);
    if (noticeTimer.current) clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(null), 2500);
  }, []);

  // Executes any [[action:...]] tokens (scroll, download, copy, open link)
  // the assistant appends to a finished reply.
  usePortfolioActions(messages, status, showNotice);

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    void sendMessage({ text: trimmed }, { body: { model } });
  }

  function handleSubmit() {
    send(input);
    setInput("");
  }

  function handleClear() {
    setMessages([]);
    clearError();
  }

  function handleRetry() {
    void regenerate({ body: { model } });
  }

  return (
    <>
      <ChatButton
        isOpen={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        invite={messages.length === 0}
      />

      <AnimatePresence>
        {isOpen && (
          <ChatWindow
            messages={messages}
            status={status}
            hasError={Boolean(error)}
            online={health.online}
            model={model}
            onModelChange={setModel}
            inputValue={input}
            onInputChange={setInput}
            onSubmit={handleSubmit}
            onStop={stop}
            onClear={handleClear}
            onRetry={handleRetry}
            onDismissError={clearError}
            onClose={() => setIsOpen(false)}
            onSuggestedSelect={send}
          />
        )}
      </AnimatePresence>

      <Toast message={notice} />
    </>
  );
}
