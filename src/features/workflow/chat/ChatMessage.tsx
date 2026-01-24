/**
 * Chat Message Component
 * Renders individual chat messages with Blueprint styling
 */

import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatMessage as ChatMessageType } from "../types";

interface ChatMessageProps {
  message: ChatMessageType;
  generativeUI?: React.ReactNode;
}

export function ChatMessage({ message, generativeUI }: ChatMessageProps) {
  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";

  return (
    <div
      className={cn(
        "flex gap-3 animate-fade-in-up",
        isUser && "flex-row-reverse"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-md border",
          isUser
            ? "border-accent-red/30 bg-accent-red-light text-accent-red"
            : "border-accent-blue/30 bg-accent-blue-light text-accent-blue"
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      {/* Message Content */}
      <div
        className={cn(
          "flex max-w-[80%] flex-col gap-2",
          isUser && "items-end"
        )}
      >
        <div
          className={cn(
            "rounded-lg px-4 py-3 font-mono text-sm",
            isUser
              ? "bg-accent-red-light/50 text-ink border border-accent-red/20"
              : "bg-white text-ink border border-border"
          )}
        >
          {/* Text content */}
          {message.content && (
            <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
          )}

          {/* Generative UI */}
          {isAssistant && generativeUI && (
            <div className="mt-3 border-t border-border pt-3">
              {generativeUI}
            </div>
          )}
        </div>

        {/* Timestamp */}
        <span className="text-[10px] text-ink-faint font-mono">
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
}

export default ChatMessage;
