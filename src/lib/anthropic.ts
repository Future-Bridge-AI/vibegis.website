import Anthropic from "@anthropic-ai/sdk";

import {
  ANALYST_SYSTEM_PROMPT,
  ARCHITECT_STRUCTURED_SYSTEM_PROMPT,
  ARCHITECT_SYSTEM_PROMPT,
  DEVELOPER_SYSTEM_PROMPT,
  PM_STRUCTURED_SYSTEM_PROMPT,
  PM_SYSTEM_PROMPT,
  buildAnalystUserPrompt,
  buildArchitectUserPrompt,
  buildDeveloperUserPrompt,
  buildPMUserPrompt,
  buildStructuredArchitectUserPrompt,
  buildStructuredPMUserPrompt,
} from "@/core/agents";

// Re-export types from core
export type { AgentMessage, AgentResponse } from "@/core/types";

/**
 * Anthropic Claude API Client
 * Handles all AI agent interactions for BMAD workflow
 */

const anthropic = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY || "",
  dangerouslyAllowBrowser: true,
});

if (!import.meta.env.VITE_ANTHROPIC_API_KEY) {
  console.warn(
    "Anthropic API key not set. " +
      "Please set VITE_ANTHROPIC_API_KEY in your .env file"
  );
}

interface AgentResponse {
  content: string;
  usage?: {
    input_tokens: number;
    output_tokens: number;
  };
}

/**
 * Helper to extract text content from API response
 */
const extractTextContent = (
  response: Anthropic.Messages.Message
): AgentResponse => {
  const content = response.content[0];
  if (!content || content.type !== "text") {
    throw new Error("Unexpected response type from Anthropic API");
  }

  return {
    content: content.text,
    usage: response.usage,
  };
};

/**
 * Analyst Agent - Analyzes widget idea and asks GIS-specific questions
 */
export async function analyzeWidgetIdea(
  widgetIdea: string,
  context?: string
): Promise<AgentResponse> {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    system: ANALYST_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: buildAnalystUserPrompt(widgetIdea, context),
      },
    ],
  });

  return extractTextContent(response);
}

/**
 * PM Agent - Generates Product Requirements Document (markdown)
 */
export async function generatePRD(
  widgetIdea: string,
  analysis: string
): Promise<AgentResponse> {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2048,
    system: PM_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: buildPMUserPrompt(widgetIdea, analysis),
      },
    ],
  });

  return extractTextContent(response);
}

/**
 * PM Agent - Generates structured PRD for form pre-filling
 */
export async function generateStructuredPRD(
  widgetBrief: Parameters<typeof buildStructuredPMUserPrompt>[0],
  analysisResponse?: string
): Promise<AgentResponse> {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2048,
    system: PM_STRUCTURED_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: buildStructuredPMUserPrompt(widgetBrief, analysisResponse),
      },
    ],
  });

  return extractTextContent(response);
}

/**
 * Architect Agent - Defines technical architecture (markdown)
 */
export async function generateArchitecture(prd: string): Promise<AgentResponse> {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2048,
    system: ARCHITECT_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: buildArchitectUserPrompt(prd),
      },
    ],
  });

  return extractTextContent(response);
}

/**
 * Architect Agent - Generates structured architecture for form pre-filling
 */
export async function generateStructuredArchitecture(
  widgetBrief: Parameters<typeof buildStructuredArchitectUserPrompt>[0],
  widgetPRD: Parameters<typeof buildStructuredArchitectUserPrompt>[1]
): Promise<AgentResponse> {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2048,
    system: ARCHITECT_STRUCTURED_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: buildStructuredArchitectUserPrompt(widgetBrief, widgetPRD),
      },
    ],
  });

  return extractTextContent(response);
}

/**
 * Developer Agent - Generates production-ready widget code
 */
export async function generateWidgetCode(
  architecture: string,
  prd: string
): Promise<AgentResponse> {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: DEVELOPER_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: buildDeveloperUserPrompt(architecture, prd),
      },
    ],
  });

  return extractTextContent(response);
}

export default anthropic;
