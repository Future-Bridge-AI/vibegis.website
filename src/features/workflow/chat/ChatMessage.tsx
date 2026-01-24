/**
 * Chat Message Component
 * Renders individual chat messages with appropriate styling
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
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          isUser
            ? "bg-fiesta-pink/20 text-fiesta-pink"
            : "bg-fiesta-turquoise/20 text-fiesta-turquoise"
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
            "rounded-2xl px-4 py-3 font-mono text-sm",
            isUser
              ? "bg-fiesta-pink/10 text-gray-200 border border-fiesta-pink/20"
              : "bg-geodark-tertiary text-gray-300 border border-wizard-border"
          )}
        >
          {/* Text content */}
          {message.content && (
            <div className="whitespace-pre-wrap">{message.content}</div>
          )}

          {/* Generative UI */}
          {isAssistant && generativeUI && (
            <div className="mt-3 border-t border-wizard-border/50 pt-3">
              {generativeUI}
            </div>
          )}
        </div>

        {/* Timestamp */}
        <span className="text-xs text-gray-600 font-mono">
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
