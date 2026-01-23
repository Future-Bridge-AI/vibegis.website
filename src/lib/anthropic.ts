/**
 * @deprecated This module is deprecated. Use @/lib/ai instead.
 *
 * This file is kept for backward compatibility only.
 * All AI functionality has been moved to the provider-agnostic @/lib/ai module.
 *
 * Migration:
 * - import { analyzeWidgetIdea } from "@/lib/ai"
 * - import { generateStructuredPRD } from "@/lib/ai"
 * - import { generateStructuredArchitecture } from "@/lib/ai"
 * - import { generateWidgetCode } from "@/lib/ai"
 */

// Re-export everything from the new AI module for backward compatibility
export {
  analyzeWidgetIdea,
  generateStructuredPRD,
  generateStructuredArchitecture,
  generateWidgetCode,
} from "@/lib/ai";

export type { AIResponse as AgentResponse } from "@/lib/ai/types";
