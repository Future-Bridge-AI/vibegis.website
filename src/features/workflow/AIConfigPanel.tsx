/**
 * AI Configuration Panel
 * Collapsible panel for configuring AI provider settings
 */

import { useState } from "react";
import { ChevronDown, ChevronUp, Key, Bot, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWorkflowStore } from "./store";
import type { AIProvider } from "@/lib/ai/types";

const providers: { id: AIProvider; label: string; models: string[] }[] = [
  {
    id: "openrouter",
    label: "OpenRouter",
    models: [
      "anthropic/claude-sonnet-4",
      "anthropic/claude-3.5-sonnet",
      "openai/gpt-4o",
      "google/gemini-2.0-flash-exp",
    ],
  },
];

export function AIConfigPanel() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState("");

  const aiProvider = useWorkflowStore((state) => state.aiProvider);
  const aiModel = useWorkflowStore((state) => state.aiModel);
  const aiConfigured = useWorkflowStore((state) => state.aiConfigured);
  const configureAI = useWorkflowStore((state) => state.configureAI);
  const clearAIConfig = useWorkflowStore((state) => state.clearAIConfig);

  const selectedProvider = providers.find((p) => p.id === aiProvider) ?? providers[0];

  const handleConfigure = () => {
    if (apiKeyInput.trim()) {
      configureAI(aiProvider, apiKeyInput.trim(), aiModel);
      setApiKeyInput("");
      setIsExpanded(false);
    }
  };

  const handleClear = () => {
    clearAIConfig();
    setApiKeyInput("");
  };

  return (
    <div className="rounded-2xl border border-wizard-border bg-geodark-secondary/40">
      {/* Header - Always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between px-4 py-3"
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg",
              aiConfigured
                ? "bg-fiesta-turquoise/20 text-fiesta-turquoise"
                : "bg-fiesta-orange/20 text-fiesta-orange"
            )}
          >
            {aiConfigured ? <Check className="h-4 w-4" /> : <Key className="h-4 w-4" />}
          </div>
          <div className="text-left">
            <p className="font-mono text-sm font-semibold text-gray-200">
              {aiConfigured ? "AI Connected" : "Configure AI"}
            </p>
            <p className="font-mono text-xs text-gray-500">
              {aiConfigured
                ? `${selectedProvider.label} • ${aiModel.split("/").pop()}`
                : "Add your API key to enable AI features"}
            </p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-gray-500" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-500" />
        )}
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-wizard-border/50 px-4 py-4 space-y-4">
          {aiConfigured ? (
            <>
              {/* Connected State */}
              <div className="flex items-center justify-between rounded-lg border border-fiesta-turquoise/30 bg-fiesta-turquoise/10 px-3 py-2">
                <div className="flex items-center gap-2">
                  <Bot className="h-4 w-4 text-fiesta-turquoise" />
                  <span className="font-mono text-xs text-fiesta-turquoise">
                    Ready to chat
                  </span>
                </div>
                <button
                  onClick={handleClear}
                  className="flex items-center gap-1 rounded px-2 py-1 font-mono text-xs text-gray-400 transition hover:text-fiesta-pink"
                >
                  <X className="h-3 w-3" />
                  Disconnect
                </button>
              </div>

              {/* Model Selector */}
              <div className="space-y-2">
                <label className="font-mono text-xs font-semibold text-gray-400">
                  Model
                </label>
                <select
                  value={aiModel}
                  onChange={(e) => configureAI(aiProvider, "", e.target.value)}
                  className="wizard-input w-full text-sm"
                >
                  {selectedProvider.models.map((model) => (
                    <option key={model} value={model}>
                      {model}
                    </option>
                  ))}
                </select>
              </div>
            </>
          ) : (
            <>
              {/* API Key Input */}
              <div className="space-y-2">
                <label className="font-mono text-xs font-semibold text-gray-400">
                  OpenRouter API Key
                </label>
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="sk-or-..."
                  className="wizard-input w-full text-sm"
                />
                <p className="font-mono text-xs text-gray-600">
                  Get your key at{" "}
                  <a
                    href="https://openrouter.ai/keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-fiesta-turquoise hover:underline"
                  >
                    openrouter.ai/keys
                  </a>
                </p>
              </div>

              {/* Model Selector */}
              <div className="space-y-2">
                <label className="font-mono text-xs font-semibold text-gray-400">
                  Model
                </label>
                <select
                  value={aiModel}
                  onChange={(e) =>
                    useWorkflowStore.setState({ aiModel: e.target.value })
                  }
                  className="wizard-input w-full text-sm"
                >
                  {selectedProvider.models.map((model) => (
                    <option key={model} value={model}>
                      {model}
                    </option>
                  ))}
                </select>
              </div>

              {/* Connect Button */}
              <button
                onClick={handleConfigure}
                disabled={!apiKeyInput.trim()}
                className="w-full rounded-xl bg-fiesta-turquoise py-2.5 font-mono text-sm font-bold text-geodark transition hover:bg-fiesta-turquoise/90 hover:shadow-wizard-glow disabled:cursor-not-allowed disabled:opacity-50"
              >
                Connect
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default AIConfigPanel;
