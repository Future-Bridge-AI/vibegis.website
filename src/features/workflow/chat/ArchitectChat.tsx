/**
 * Architect Phase Chat
 * Chat panel with Architect-specific actions and prompts
 */

import { ChatPanel } from "./ChatPanel";
import { usePhasePrompts, useArchitectActions } from "./hooks";
import { WorkflowPhase } from "../types";

export function ArchitectChat() {
  const { systemPrompt, suggestions } = usePhasePrompts(WorkflowPhase.Architect);

  // Register Architect phase actions with CopilotKit
  useArchitectActions();

  return (
    <ChatPanel
      systemPrompt={systemPrompt}
      suggestions={suggestions}
    />
  );
}

export default ArchitectChat;
