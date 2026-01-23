/**
 * OpenRouter AI Provider
 * Provides access to multiple AI models through a unified API
 * https://openrouter.ai/docs
 */

import type { AIRequest, AIResponse, IAIProvider, AIModel } from "./types";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1";

interface OpenRouterMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface OpenRouterRequest {
  model: string;
  messages: OpenRouterMessage[];
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  stream?: boolean;
}

interface OpenRouterChoice {
  message: {
    role: string;
    content: string;
  };
  finish_reason: string;
}

interface OpenRouterUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

interface OpenRouterResponse {
  id: string;
  model: string;
  choices: OpenRouterChoice[];
  usage?: OpenRouterUsage;
}

interface OpenRouterModelData {
  id: string;
  name: string;
  context_length: number;
  pricing?: {
    prompt: string;
    completion: string;
  };
}

interface OpenRouterModelsResponse {
  data: OpenRouterModelData[];
}

interface OpenRouterError {
  error?: {
    message: string;
    code?: string;
  };
}

/**
 * OpenRouter Provider Implementation
 */
export class OpenRouterProvider implements IAIProvider {
  private apiKey: string;
  private model: string;
  private siteUrl: string;
  private siteName: string;

  constructor(
    apiKey: string,
    model: string = "anthropic/claude-sonnet-4",
    siteUrl: string = "https://vibegis.com",
    siteName: string = "VibeGIS Widget Generator"
  ) {
    this.apiKey = apiKey;
    this.model = model;
    this.siteUrl = siteUrl;
    this.siteName = siteName;
  }

  /**
   * Send a chat completion request to OpenRouter
   */
  async chat(request: AIRequest): Promise<AIResponse> {
    const messages: OpenRouterMessage[] = [
      { role: "system", content: request.systemPrompt },
      { role: "user", content: request.userPrompt },
    ];

    const body: OpenRouterRequest = {
      model: this.model,
      messages,
      max_tokens: request.maxTokens ?? 2048,
    };

    const response = await fetch(`${OPENROUTER_API_URL}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": this.siteUrl,
        "X-Title": this.siteName,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = (await response.json()) as OpenRouterError;
      const errorMessage =
        errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`;
      throw new Error(`OpenRouter API error: ${errorMessage}`);
    }

    const data = (await response.json()) as OpenRouterResponse;

    if (!data.choices || data.choices.length === 0) {
      throw new Error("No response from OpenRouter API");
    }

    const choice = data.choices[0];
    if (!choice.message?.content) {
      throw new Error("Empty response from OpenRouter API");
    }

    return {
      content: choice.message.content,
      model: data.model,
      usage: data.usage
        ? {
            promptTokens: data.usage.prompt_tokens,
            completionTokens: data.usage.completion_tokens,
            totalTokens: data.usage.total_tokens,
          }
        : undefined,
    };
  }

  /**
   * Validate the API key by making a test request
   */
  async validateKey(): Promise<boolean> {
    try {
      // Use the models endpoint to validate the key
      const response = await fetch(`${OPENROUTER_API_URL}/models`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      });

      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * List available models from OpenRouter
   */
  async listModels(): Promise<AIModel[]> {
    const response = await fetch(`${OPENROUTER_API_URL}/models`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch models: ${response.statusText}`);
    }

    const data = (await response.json()) as OpenRouterModelsResponse;

    return data.data.map((model) => ({
      id: model.id,
      name: model.name,
      provider: model.id.split("/")[0] || "unknown",
      contextLength: model.context_length,
      pricing: model.pricing
        ? {
            prompt: parseFloat(model.pricing.prompt) * 1000000,
            completion: parseFloat(model.pricing.completion) * 1000000,
          }
        : undefined,
    }));
  }

  /**
   * Update the model to use
   */
  setModel(model: string): void {
    this.model = model;
  }

  /**
   * Get the current model
   */
  getModel(): string {
    return this.model;
  }
}

/**
 * Create an OpenRouter provider instance
 */
export function createOpenRouterProvider(
  apiKey: string,
  model?: string
): OpenRouterProvider {
  return new OpenRouterProvider(apiKey, model);
}
