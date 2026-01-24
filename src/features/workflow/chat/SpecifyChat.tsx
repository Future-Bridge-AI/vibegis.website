/**
 * Specify Phase Chat
 * Chat panel with Specify-specific actions and prompts
 */

import { ChatPanel } from "./ChatPanel";
import { usePhasePrompts, useSpecifyActions } from "./hooks";
import { WorkflowPhase } from "../types";

export function SpecifyChat() {
  const { systemPrompt, suggestions } = usePhasePrompts(WorkflowPhase.Specify);

  // Register Specify phase actions with CopilotKit
  useSpecifyActions();

  return (
    <ChatPanel
      systemPrompt={systemPrompt}
      suggestions={suggestions}
    />
  );
}

export default SpecifyChat;
