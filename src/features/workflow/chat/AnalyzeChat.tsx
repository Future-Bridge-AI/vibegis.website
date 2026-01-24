/**
 * Analyze Phase Chat
 * Chat panel with Analyze-specific actions and prompts
 */

import { ChatPanel } from "./ChatPanel";
import { usePhasePrompts, useAnalyzeActions } from "./hooks";
import { WorkflowPhase } from "../types";

export function AnalyzeChat() {
  const { systemPrompt, suggestions } = usePhasePrompts(WorkflowPhase.Analyze);

  // Register Analyze phase actions with CopilotKit
  useAnalyzeActions();

  return (
    <ChatPanel
      systemPrompt={systemPrompt}
      suggestions={suggestions}
    />
  );
}

export default AnalyzeChat;
