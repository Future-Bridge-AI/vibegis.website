/**
 * Chat Input Component
 * Text input for chat messages with Blueprint styling
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
              className="rounded-md border border-border bg-white px-3 py-1.5 font-mono text-xs text-ink-light transition hover:border-accent-blue hover:text-accent-blue disabled:cursor-not-allowed disabled:opacity-50"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-end gap-2 rounded-lg border border-border bg-white p-2 focus-within:border-accent-blue focus-within:ring-1 focus-within:ring-accent-blue/20 transition">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled || isStreaming}
            rows={1}
            className={cn(
              "flex-1 resize-none bg-transparent px-2 py-1.5 font-mono text-sm text-ink",
              "placeholder:text-ink-muted focus:outline-none",
              "disabled:cursor-not-allowed disabled:opacity-50"
            )}
          />
          <button
            type="submit"
            disabled={disabled || isStreaming || !message.trim()}
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition",
              "bg-accent-blue text-white",
              "hover:bg-accent-blue-dark",
              "disabled:cursor-not-allowed disabled:opacity-50"
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
          <div className="absolute -bottom-6 left-0 flex items-center gap-2 text-xs text-ink-faint">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>AI is thinking...</span>
          </div>
        )}
      </form>
    </div>
  );
}

export default ChatInput;
