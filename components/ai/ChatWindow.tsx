"use client";

import { motion } from "framer-motion";
import type { UIMessage } from "ai";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { ErrorBanner } from "./ErrorBanner";
import { OfflineNotice } from "./OfflineNotice";

type Status = "submitted" | "streaming" | "ready" | "error";

export function ChatWindow({
  messages,
  status,
  hasError,
  online,
  model,
  onModelChange,
  inputValue,
  onInputChange,
  onSubmit,
  onStop,
  onClear,
  onRetry,
  onDismissError,
  onClose,
  onSuggestedSelect,
}: {
  messages: UIMessage[];
  status: Status;
  hasError: boolean;
  online: boolean;
  model: string;
  onModelChange: (id: string) => void;
  inputValue: string;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
  onStop: () => void;
  onClear: () => void;
  onRetry: () => void;
  onDismissError: () => void;
  onClose: () => void;
  onSuggestedSelect: (prompt: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 12 }}
      transition={{ type: "spring", stiffness: 380, damping: 30 }}
      role="dialog"
      aria-modal="false"
      aria-label="Portfolio AI assistant"
      className="glass fixed inset-x-3 bottom-24 z-[60] flex h-[min(34rem,calc(100vh-8rem))] flex-col overflow-hidden rounded-2xl shadow-2xl sm:inset-x-auto sm:bottom-24 sm:right-6 sm:w-[23rem]"
    >
      <ChatHeader
        online={online}
        model={model}
        onModelChange={onModelChange}
        onClear={onClear}
        onClose={onClose}
        canClear={messages.length > 0}
      />

      {!online && <OfflineNotice />}

      <MessageList messages={messages} status={status} onSuggestedSelect={onSuggestedSelect} />

      {hasError && <ErrorBanner onRetry={onRetry} onDismiss={onDismissError} />}

      <MessageInput
        value={inputValue}
        onChange={onInputChange}
        onSubmit={onSubmit}
        onStop={onStop}
        isStreaming={status === "submitted" || status === "streaming"}
        disabled={status === "submitted" || status === "streaming"}
      />
    </motion.div>
  );
}
