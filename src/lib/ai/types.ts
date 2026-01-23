/**
 * AI Provider Abstraction Types
 * Enables switching between providers (OpenRouter, Anthropic, OpenAI, etc.)
 */

/**
 * Supported AI providers
 */
export type AIProvider = "openrouter" | "anthropic" | "openai";

/**
 * Model information returned by provider
 */
export interface AIModel {
  id: string;
  name: string;
  provider: string;
  contextLength: number;
  pricing?: {
    prompt: number; // per 1M tokens
    completion: number; // per 1M tokens
  };
}

/**
 * Popular models available on OpenRouter
 */
export const OPENROUTER_MODELS: AIModel[] = [
  {
    id: "anthropic/claude-sonnet-4",
    name: "Claude Sonnet 4",
    provider: "Anthropic",
    contextLength: 200000,
    pricing: { prompt: 3, completion: 15 },
  },
  {
    id: "anthropic/claude-3.5-sonnet",
    name: "Claude 3.5 Sonnet",
    provider: "Anthropic",
    contextLength: 200000,
    pricing: { prompt: 3, completion: 15 },
  },
  {
    id: "anthropic/claude-3-haiku",
    name: "Claude 3 Haiku",
    provider: "Anthropic",
    contextLength: 200000,
    pricing: { prompt: 0.25, completion: 1.25 },
  },
  {
    id: "openai/gpt-4o",
    name: "GPT-4o",
    provider: "OpenAI",
    contextLength: 128000,
    pricing: { prompt: 2.5, completion: 10 },
  },
  {
    id: "openai/gpt-4o-mini",
    name: "GPT-4o Mini",
    provider: "OpenAI",
    contextLength: 128000,
    pricing: { prompt: 0.15, completion: 0.6 },
  },
  {
    id: "google/gemini-2.0-flash-001",
    name: "Gemini 2.0 Flash",
    provider: "Google",
    contextLength: 1000000,
    pricing: { prompt: 0.1, completion: 0.4 },
  },
  {
    id: "google/gemini-pro-1.5",
    name: "Gemini Pro 1.5",
    provider: "Google",
    contextLength: 2000000,
    pricing: { prompt: 1.25, completion: 5 },
  },
  {
    id: "meta-llama/llama-3.3-70b-instruct",
    name: "Llama 3.3 70B",
    provider: "Meta",
    contextLength: 131072,
    pricing: { prompt: 0.4, completion: 0.4 },
  },
  {
    id: "mistralai/mistral-large-2411",
    name: "Mistral Large",
    provider: "Mistral",
    contextLength: 128000,
    pricing: { prompt: 2, completion: 6 },
  },
  {
    id: "deepseek/deepseek-chat",
    name: "DeepSeek V3",
    provider: "DeepSeek",
    contextLength: 64000,
    pricing: { prompt: 0.14, completion: 0.28 },
  },
];

/**
 * Request to send to AI provider
 */
export interface AIRequest {
  systemPrompt: string;
  userPrompt: string;
  maxTokens?: number;
}

/**
 * Response from AI provider
 */
export interface AIResponse {
  content: string;
  model: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

/**
 * AI provider configuration
 */
export interface AIConfig {
  provider: AIProvider;
  apiKey: string;
  model: string;
  baseUrl?: string;
}

/**
 * AI provider interface - all providers must implement this
 */
export interface IAIProvider {
  /**
   * Send a chat completion request
   */
  chat(request: AIRequest): Promise<AIResponse>;

  /**
   * Test if the API key is valid
   */
  validateKey(): Promise<boolean>;

  /**
   * Get available models (optional, may not be supported by all providers)
   */
  listModels?(): Promise<AIModel[]>;
}

/**
 * Default model for each provider
 */
export const DEFAULT_MODELS: Record<AIProvider, string> = {
  openrouter: "anthropic/claude-sonnet-4",
  anthropic: "claude-sonnet-4-20250514",
  openai: "gpt-4o",
};

/**
 * Storage key for AI settings
 */
export const AI_SETTINGS_STORAGE_KEY = "vibegis_ai_settings";
