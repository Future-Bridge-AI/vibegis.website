/**
 * Chat Panel Component
 * Main chat interface for conversational workflow
 */

// @ts-nocheck
/**
 * Chat Panel Component
 * Main chat interface for conversational workflow
 *
 * TODO: Fix TypeScript errors when re-enabling workflow
 */

import { useRef, useEffect, type ReactNode } from "react";
import { useCopilotChat } from "@copilotkit/react-core";
import { useWorkflowStore } from "../store";
import { WorkflowPhase } from "../types";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";

// Define our own message type to avoid CopilotKit version issues
interface ChatMessageType {
  id: string;
  role: string;
  content: string;
}

interface ChatPanelProps {
  systemPrompt?: string;
  suggestions?: string[];
  renderGenerativeUI?: (message: ChatMessageType) => ReactNode;
}

/**
 * Map WorkflowPhase to lowercase phase key
 */
function getPhaseKey(phase: WorkflowPhase): "analyze" | "specify" | "architect" | "generate" {
  switch (phase) {
    case WorkflowPhase.Analyze:
      return "analyze";
    case WorkflowPhase.Specify:
      return "specify";
    case WorkflowPhase.Architect:
      return "architect";
    case WorkflowPhase.Generate:
      return "generate";
  }
}

export function ChatPanel({
  suggestions = [],
  renderGenerativeUI,
}: ChatPanelProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentPhase = useWorkflowStore((state) => state.currentPhase);
  const aiConfigured = useWorkflowStore((state) => state.aiConfigured);
  const phaseKey = getPhaseKey(currentPhase);

  // CopilotKit chat hook
  const {
    visibleMessages = [],
    appendMessage,
    isLoading = false,
  } = useCopilotChat();

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [visibleMessages]);

  const handleSendMessage = (content: string) => {
    appendMessage({
      id: crypto.randomUUID(),
      role: "user",
      content,
    } as Parameters<typeof appendMessage>[0]);
  };

  // Filter messages to show only user and assistant messages
  // Cast to our internal type to avoid CopilotKit version issues
  const displayMessages = (visibleMessages as unknown as ChatMessageType[]).filter(
    (msg) => msg.role === "user" || msg.role === "assistant"
  );

  return (
    <div className="flex h-full flex-col">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {/* Welcome message when no messages */}
        {displayMessages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="space-y-4 max-w-md">
              <div className="flex justify-center">
                <div className="h-16 w-16 rounded-full bg-fiesta-turquoise/10 flex items-center justify-center">
                  <span className="text-3xl">🗺️</span>
                </div>
              </div>
              <h3 className="font-sans text-xl font-bold text-gray-200">
                {phaseKey === "analyze" && "Let's Define Your Widget"}
                {phaseKey === "specify" && "Time to Specify Requirements"}
                {phaseKey === "architect" && "Design the Architecture"}
                {phaseKey === "generate" && "Ready to Generate Code"}
              </h3>
              <p className="font-mono text-sm text-gray-400">
                {phaseKey === "analyze" &&
                  "Tell me about the ArcGIS ExB widget you want to build. What problem should it solve?"}
                {phaseKey === "specify" &&
                  "Let's define the functional requirements, settings, and data bindings for your widget."}
                {phaseKey === "architect" &&
                  "I'll help you design the component structure and state management approach."}
                {phaseKey === "generate" &&
                  "Review the architecture and let me know when you're ready to generate the code."}
              </p>
            </div>
          </div>
        )}

        {/* Message List */}
        <div className="space-y-4">
          {displayMessages.map((message) => (
            <ChatMessage
              key={message.id}
              message={{
                id: message.id,
                role: message.role as "user" | "assistant",
                content: message.content,
                timestamp: Date.now(),
              }}
              generativeUI={
                message.role === "assistant" && renderGenerativeUI
                  ? renderGenerativeUI(message)
                  : undefined
              }
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-wizard-border/50 bg-geodark-secondary/30 p-4">
        {!aiConfigured ? (
          <div className="rounded-xl border border-fiesta-orange/40 bg-fiesta-orange/10 px-4 py-3 text-center">
            <p className="font-mono text-sm text-fiesta-orange">
              Configure your AI settings above to start chatting
            </p>
          </div>
        ) : (
          <ChatInput
            onSend={handleSendMessage}
            isStreaming={isLoading}
            suggestions={displayMessages.length === 0 ? suggestions : []}
            placeholder={`Ask about your ${phaseKey} phase...`}
          />
        )}
      </div>
    </div>
  );
}

export default ChatPanel;
