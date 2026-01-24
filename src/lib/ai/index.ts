/**
 * AI Provider Module
 * Unified interface for AI providers (OpenRouter, Anthropic, OpenAI)
 */

export * from "./types";
export * from "./openrouter";

import {
  ANALYST_SYSTEM_PROMPT,
  ARCHITECT_STRUCTURED_SYSTEM_PROMPT,
  DEVELOPER_SYSTEM_PROMPT,
  PM_STRUCTURED_SYSTEM_PROMPT,
  buildAnalystUserPrompt,
  buildStructuredArchitectUserPrompt,
  buildStructuredPMUserPrompt,
} from "@/core/agents";

import type { AIConfig, IAIProvider, AIResponse } from "./types";
import { AI_SETTINGS_STORAGE_KEY, DEFAULT_MODELS } from "./types";
import { OpenRouterProvider } from "./openrouter";

/**
 * Singleton provider instance
 */
let currentProvider: IAIProvider | null = null;
let currentConfig: AIConfig | null = null;

/**
 * Create a provider based on configuration
 */
export function createProvider(config: AIConfig): IAIProvider {
  switch (config.provider) {
    case "openrouter":
      return new OpenRouterProvider(config.apiKey, config.model);
    case "anthropic":
      // For now, route Anthropic through OpenRouter too
      // This could be changed to use the direct Anthropic SDK if needed
      return new OpenRouterProvider(
        config.apiKey,
        `anthropic/${config.model}`,
        "https://vibegis.com",
        "VibeGIS Widget Generator"
      );
    case "openai":
      // Route OpenAI through OpenRouter
      return new OpenRouterProvider(
        config.apiKey,
        `openai/${config.model}`,
        "https://vibegis.com",
        "VibeGIS Widget Generator"
      );
    default:
      throw new Error(`Unknown provider: ${config.provider}`);
  }
}

/**
 * Initialize the AI provider with the given configuration
 */
export function initializeProvider(config: AIConfig): void {
  currentProvider = createProvider(config);
  currentConfig = config;
  // Persist to localStorage
  saveAISettings(config);
}

/**
 * Get the current provider instance
 */
export function getProvider(): IAIProvider | null {
  return currentProvider;
}

/**
 * Get the current configuration
 */
export function getConfig(): AIConfig | null {
  return currentConfig;
}

/**
 * Check if a provider is configured and ready
 */
export function isProviderReady(): boolean {
  return currentProvider !== null && currentConfig !== null && !!currentConfig.apiKey;
}

/**
 * Save AI settings to localStorage
 */
export function saveAISettings(config: AIConfig): void {
  try {
    // Don't store the full API key in localStorage for security
    // Store a masked version and the full key in sessionStorage
    const safeConfig = {
      ...config,
      apiKey: maskApiKey(config.apiKey),
    };
    localStorage.setItem(AI_SETTINGS_STORAGE_KEY, JSON.stringify(safeConfig));
    // Store full key in sessionStorage (cleared on browser close)
    sessionStorage.setItem(`${AI_SETTINGS_STORAGE_KEY}_key`, config.apiKey);
  } catch {
    console.warn("Failed to save AI settings to storage");
  }
}

/**
 * Load AI settings from localStorage
 */
export function loadAISettings(): AIConfig | null {
  try {
    const stored = localStorage.getItem(AI_SETTINGS_STORAGE_KEY);
    if (!stored) return null;

    const config = JSON.parse(stored) as AIConfig;
    // Retrieve full key from sessionStorage
    const fullKey = sessionStorage.getItem(`${AI_SETTINGS_STORAGE_KEY}_key`);
    if (fullKey) {
      config.apiKey = fullKey;
    }
    return config;
  } catch {
    return null;
  }
}

/**
 * Clear AI settings
 */
export function clearAISettings(): void {
  currentProvider = null;
  currentConfig = null;
  localStorage.removeItem(AI_SETTINGS_STORAGE_KEY);
  sessionStorage.removeItem(`${AI_SETTINGS_STORAGE_KEY}_key`);
}

/**
 * Mask API key for display
 */
export function maskApiKey(apiKey: string): string {
  if (!apiKey || apiKey.length < 8) return "****";
  return `${apiKey.slice(0, 4)}...${apiKey.slice(-4)}`;
}

/**
 * Get default model for a provider
 */
export function getDefaultModel(provider: AIConfig["provider"]): string {
  return DEFAULT_MODELS[provider];
}

// ============================================================================
// Agent Functions (using the provider abstraction)
// ============================================================================

/**
 * Ensure provider is initialized
 */
function ensureProvider(): IAIProvider {
  if (!currentProvider) {
    throw new Error(
      "AI provider not initialized. Please configure your API key in settings."
    );
  }
  return currentProvider;
}

/**
 * Analyst Agent - Analyzes widget idea and asks GIS-specific questions
 */
export async function analyzeWidgetIdea(
  widgetIdea: string,
  context?: string
): Promise<AIResponse> {
  const provider = ensureProvider();
  return provider.chat({
    systemPrompt: ANALYST_SYSTEM_PROMPT,
    userPrompt: buildAnalystUserPrompt(widgetIdea, context),
    maxTokens: 1024,
  });
}

/**
 * PM Agent - Generates structured PRD for form pre-filling
 */
export async function generateStructuredPRD(
  widgetBrief: Parameters<typeof buildStructuredPMUserPrompt>[0],
  analysisResponse?: string
): Promise<AIResponse> {
  const provider = ensureProvider();
  return provider.chat({
    systemPrompt: PM_STRUCTURED_SYSTEM_PROMPT,
    userPrompt: buildStructuredPMUserPrompt(widgetBrief, analysisResponse),
    maxTokens: 2048,
  });
}

/**
 * Architect Agent - Generates structured architecture for form pre-filling
 */
export async function generateStructuredArchitecture(
  widgetBrief: Parameters<typeof buildStructuredArchitectUserPrompt>[0],
  widgetPRD: Parameters<typeof buildStructuredArchitectUserPrompt>[1]
): Promise<AIResponse> {
  const provider = ensureProvider();
  return provider.chat({
    systemPrompt: ARCHITECT_STRUCTURED_SYSTEM_PROMPT,
    userPrompt: buildStructuredArchitectUserPrompt(widgetBrief, widgetPRD),
    maxTokens: 2048,
  });
}

/**
 * Developer Agent - Generates production-ready widget code
 */
export async function generateWidgetCode(
  architecture: string,
  prd: string
): Promise<AIResponse> {
  const provider = ensureProvider();
  return provider.chat({
    systemPrompt: DEVELOPER_SYSTEM_PROMPT,
    userPrompt: `Generate widget code based on:\n\nArchitecture:\n${architecture}\n\nPRD:\n${prd}`,
    maxTokens: 4096,
  });
}

/**
 * Initialize provider from stored settings on module load
 */
export function autoInitializeFromStorage(): boolean {
  const settings = loadAISettings();
  if (settings && settings.apiKey && !settings.apiKey.includes("...")) {
    try {
      initializeProvider(settings);
      return true;
    } catch {
      return false;
    }
  }
  return false;
}

// Try to auto-initialize on module load
autoInitializeFromStorage();
