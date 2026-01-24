/**
 * CopilotKit Provider
 * Wraps the application with CopilotKit context configured for OpenRouter
 */

import { CopilotKit } from "@copilotkit/react-core";
import { type ReactNode, useMemo } from "react";
import { useWorkflowStore } from "../store";

interface CopilotProviderProps {
  children: ReactNode;
}

/**
 * Custom headers provider for CopilotKit
 * Passes the OpenRouter API key and model from store
 */
function useOpenRouterHeaders() {
  const apiKey = useWorkflowStore((state) => state.aiApiKey);
  const model = useWorkflowStore((state) => state.aiModel);

  return useMemo(
    () => ({
      "x-openrouter-key": apiKey,
      "x-openrouter-model": model,
    }),
    [apiKey, model]
  );
}

/**
 * CopilotProvider component
 * Provides CopilotKit context to children with OpenRouter configuration
 *
 * Note: Always wraps children in CopilotKit so hooks like useCopilotChat()
 * don't error. The API calls will fail gracefully without a valid key.
 */
export function CopilotProvider({ children }: CopilotProviderProps) {
  const headers = useOpenRouterHeaders();

  return (
    <CopilotKit
      runtimeUrl="/api/copilot"
      headers={headers}
      showDevConsole={import.meta.env.DEV}
    >
      {children}
    </CopilotKit>
  );
}

export default CopilotProvider;
