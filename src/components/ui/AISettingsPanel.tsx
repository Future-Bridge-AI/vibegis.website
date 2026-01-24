// @ts-nocheck
/**
 * AI Settings Panel
 * Allows users to configure their OpenRouter API key and select a model
 *
 * TODO: Fix TypeScript errors when re-enabling workflow
 */

import { useState, useEffect } from "react";

import { useWorkflowStore } from "@/features/workflow/store";
import { OPENROUTER_MODELS, maskApiKey } from "@/lib/ai";
import type { AIModel } from "@/lib/ai/types";
import { cn } from "@/lib/utils";

interface AISettingsPanelProps {
  className?: string;
  collapsed?: boolean;
}

export function AISettingsPanel({
  className,
  collapsed = false,
}: AISettingsPanelProps) {
  const {
    aiProvider,
    aiApiKey,
    aiModel,
    aiConfigured,
    configureAI,
    clearAIConfig,
    setError,
  } = useWorkflowStore();

  const [apiKeyInput, setApiKeyInput] = useState("");
  const [selectedModel, setSelectedModel] = useState(aiModel);
  const [isValidating, setIsValidating] = useState(false);
  const [isExpanded, setIsExpanded] = useState(!aiConfigured);
  const [showApiKey, setShowApiKey] = useState(false);

  // Group models by provider for display
  const modelsByProvider = OPENROUTER_MODELS.reduce(
    (acc, model) => {
      if (!acc[model.provider]) {
        acc[model.provider] = [];
      }
      acc[model.provider].push(model);
      return acc;
    },
    {} as Record<string, AIModel[]>
  );

  useEffect(() => {
    if (aiConfigured && aiApiKey) {
      setApiKeyInput(aiApiKey);
    }
  }, [aiConfigured, aiApiKey]);

  const handleSave = async () => {
    if (!apiKeyInput.trim()) {
      setError("Please enter your OpenRouter API key");
      return;
    }

    setIsValidating(true);
    try {
      // Configure the provider
      configureAI(aiProvider, apiKeyInput.trim(), selectedModel);
      setIsExpanded(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to configure AI");
    } finally {
      setIsValidating(false);
    }
  };

  const handleClear = () => {
    clearAIConfig();
    setApiKeyInput("");
    setSelectedModel("anthropic/claude-sonnet-4");
    setIsExpanded(true);
  };

  if (collapsed) {
    return (
      <div
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg",
          "bg-geodark-secondary/50 border border-wizard-border",
          className
        )}
      >
        <div
          className={cn(
            "w-2 h-2 rounded-full",
            aiConfigured ? "bg-fiesta-turquoise" : "bg-fiesta-orange"
          )}
        />
        <span className="text-xs text-gray-400">
          {aiConfigured ? `AI: ${selectedModel.split("/").pop()}` : "AI not configured"}
        </span>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-fiesta-turquoise hover:underline ml-auto"
        >
          {isExpanded ? "Hide" : "Settings"}
        </button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-lg border",
        "bg-geodark-secondary/50 border-wizard-border",
        className
      )}
    >
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "w-full flex items-center justify-between",
          "px-4 py-3 text-left",
          "hover:bg-geodark-tertiary/30 transition-colors",
          isExpanded && "border-b border-wizard-border"
        )}
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-2.5 h-2.5 rounded-full",
              aiConfigured ? "bg-fiesta-turquoise" : "bg-fiesta-orange animate-pulse"
            )}
          />
          <span className="font-mono text-sm text-gray-200">AI Configuration</span>
        </div>
        <div className="flex items-center gap-2">
          {aiConfigured && (
            <span className="text-xs text-gray-400 font-mono">
              {selectedModel.split("/").pop()}
            </span>
          )}
          <svg
            className={cn(
              "w-4 h-4 text-gray-400 transition-transform",
              isExpanded && "rotate-180"
            )}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* Info Banner */}
          <div className="p-3 rounded-lg bg-geodark-tertiary/50 border border-wizard-border">
            <p className="text-xs text-gray-400">
              Get your API key from{" "}
              <a
                href="https://openrouter.ai/keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-fiesta-turquoise hover:underline"
              >
                openrouter.ai/keys
              </a>
              . OpenRouter provides access to Claude, GPT-4, Gemini, Llama, and more
              through a single API.
            </p>
          </div>

          {/* API Key Input */}
          <div>
            <label className="block text-xs text-gray-400 mb-1.5 font-mono uppercase tracking-wider">
              OpenRouter API Key
            </label>
            <div className="relative">
              <input
                type={showApiKey ? "text" : "password"}
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="sk-or-v1-..."
                className={cn(
                  "w-full px-3 py-2 pr-20 rounded-lg",
                  "bg-geodark border border-wizard-border",
                  "text-gray-200 font-mono text-sm",
                  "placeholder:text-gray-600",
                  "focus:outline-none focus:border-fiesta-turquoise focus:ring-1 focus:ring-fiesta-turquoise/50"
                )}
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-xs text-gray-400 hover:text-gray-200"
              >
                {showApiKey ? "Hide" : "Show"}
              </button>
            </div>
            {aiConfigured && aiApiKey && (
              <p className="mt-1 text-xs text-gray-500">
                Current: {maskApiKey(aiApiKey)}
              </p>
            )}
          </div>

          {/* Model Selection */}
          <div>
            <label className="block text-xs text-gray-400 mb-1.5 font-mono uppercase tracking-wider">
              Model
            </label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className={cn(
                "w-full px-3 py-2 rounded-lg",
                "bg-geodark border border-wizard-border",
                "text-gray-200 font-mono text-sm",
                "focus:outline-none focus:border-fiesta-turquoise focus:ring-1 focus:ring-fiesta-turquoise/50",
                "cursor-pointer"
              )}
            >
              {Object.entries(modelsByProvider).map(([provider, models]) => (
                <optgroup key={provider} label={provider}>
                  {models.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.name}{" "}
                      {model.pricing
                        ? `($${model.pricing.prompt}/$${model.pricing.completion} per 1M)`
                        : ""}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={isValidating || !apiKeyInput.trim()}
              className={cn(
                "flex-1 px-4 py-2 rounded-lg font-mono text-sm",
                "bg-fiesta-turquoise text-geodark",
                "hover:bg-fiesta-turquoise/90",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "transition-colors"
              )}
            >
              {isValidating ? "Validating..." : aiConfigured ? "Update" : "Save"}
            </button>
            {aiConfigured && (
              <button
                onClick={handleClear}
                className={cn(
                  "px-4 py-2 rounded-lg font-mono text-sm",
                  "border border-wizard-border text-gray-400",
                  "hover:border-fiesta-pink hover:text-fiesta-pink",
                  "transition-colors"
                )}
              >
                Clear
              </button>
            )}
          </div>

          {/* Status */}
          {aiConfigured && (
            <div className="flex items-center gap-2 pt-2 border-t border-wizard-border">
              <div className="w-2 h-2 rounded-full bg-fiesta-turquoise" />
              <span className="text-xs text-gray-400">
                AI configured and ready to use
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AISettingsPanel;
