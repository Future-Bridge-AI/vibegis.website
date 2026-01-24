/**
 * Chat Input Component
 * Text input for chat messages with GeoPunk styling
 */

import { Send, Loader2 } from "lucide-react";
import { useState, useRef, useEffect, type FormEvent, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  isStreaming?: boolean;
  placeholder?: string;
  suggestions?: string[];
}

export function ChatInput({
  onSend,
  disabled = false,
  isStreaming = false,
  placeholder = "Type your message...",
  suggestions = [],
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
    }
  }, [message]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled && !isStreaming) {
      onSend(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (!disabled && !isStreaming) {
      onSend(suggestion);
    }
  };

  return (
    <div className="space-y-3">
      {/* Suggestions */}
      {suggestions.length > 0 && !isStreaming && (
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSuggestionClick(suggestion)}
              disabled={disabled}
              className="rounded-full border border-wizard-border bg-geodark-secondary/60 px-3 py-1.5 font-mono text-xs text-gray-400 transition hover:border-fiesta-turquoise/50 hover:text-fiesta-turquoise disabled:cursor-not-allowed disabled:opacity-50"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-end gap-2 rounded-2xl border border-wizard-border bg-geodark-secondary/60 p-2 focus-within:border-fiesta-turquoise/50 transition">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled || isStreaming}
            rows={1}
            className={cn(
              "flex-1 resize-none bg-transparent px-2 py-1 font-mono text-sm text-gray-200",
              "placeholder:text-gray-600 focus:outline-none",
              "disabled:cursor-not-allowed disabled:opacity-50"
            )}
          />
          <button
            type="submit"
            disabled={disabled || isStreaming || !message.trim()}
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition",
              "bg-fiesta-turquoise text-geodark",
              "hover:bg-fiesta-turquoise/90 hover:shadow-wizard-glow",
              "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:shadow-none"
            )}
          >
            {isStreaming ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Streaming indicator */}
        {isStreaming && (
          <div className="absolute -bottom-6 left-0 flex items-center gap-2 text-xs text-gray-500">
            <span className="animate-pulse">AI is thinking...</span>
          </div>
        )}
      </form>
    </div>
  );
}

export default ChatInput;
