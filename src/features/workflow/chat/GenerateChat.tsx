/**
 * Generate Phase Chat
 * Chat panel with Generate-specific actions and prompts
 */

import { ChatPanel } from "./ChatPanel";
import { usePhasePrompts, useGenerateActions } from "./hooks";
import { WorkflowPhase } from "../types";

export function GenerateChat() {
  const { systemPrompt, suggestions } = usePhasePrompts(WorkflowPhase.Generate);

  // Register Generate phase actions with CopilotKit
  useGenerateActions();

  return (
    <ChatPanel
      systemPrompt={systemPrompt}
      suggestions={suggestions}
    />
  );
}

export default GenerateChat;
