import { create } from "zustand";

import {
  type WidgetArchitecture,
  type WidgetBrief,
  type WidgetPRD,
  WorkflowPhase,
  type WorkflowState,
  type ChatState,
  type ArtifactStatus,
  type ChatMessage,
  createInitialWorkflowState,
  createInitialChatState,
} from "@/core/types";
import type { AIConfig, AIProvider } from "@/lib/ai/types";
import {
  initializeProvider,
  loadAISettings,
  clearAISettings,
  isProviderReady,
} from "@/lib/ai";

/**
 * AI Loading States
 */
type AILoadingState = {
  isAnalyzing: boolean;
  isSpecifying: boolean;
  isArchitecting: boolean;
  isGenerating: boolean;
};

/**
 * AI Response Storage
 */
type AIResponses = {
  aiAnalysis: string;
  aiPRD: string;
  aiArchitecture: string;
  aiCode: string;
};

/**
 * Error State
 */
type ErrorState = {
  error: string | null;
};

/**
 * AI Settings State
 */
type AISettingsState = {
  aiProvider: AIProvider;
  aiModel: string;
  aiApiKey: string;
  aiConfigured: boolean;
};

/**
 * Chat State Wrapper
 */
type ChatStateWrapper = {
  chatState: ChatState;
};

/**
 * Workflow Actions
 */
type WorkflowActions = {
  // Phase navigation
  setPhase: (phase: WorkflowPhase) => void;

  // State updates
  updateBrief: (updates: Partial<WidgetBrief>) => void;
  updatePRD: (updates: Partial<WidgetPRD>) => void;
  updateArchitecture: (updates: Partial<WidgetArchitecture>) => void;
  setGeneratedCode: (code: string) => void;

  // AI state management
  setAnalyzing: (isAnalyzing: boolean) => void;
  setSpecifying: (isSpecifying: boolean) => void;
  setArchitecting: (isArchitecting: boolean) => void;
  setGenerating: (isGenerating: boolean) => void;

  // AI responses
  setAIAnalysis: (analysis: string) => void;
  setAIPRD: (prd: string) => void;
  setAIArchitecture: (architecture: string) => void;
  setAICode: (code: string) => void;

  // Error handling
  setError: (error: string | null) => void;
  clearError: () => void;

  // AI Settings
  configureAI: (provider: AIProvider, apiKey: string, model: string) => void;
  clearAIConfig: () => void;

  // Chat Actions
  addChatMessage: (
    phase: "analyze" | "specify" | "architect" | "generate",
    message: Omit<ChatMessage, "id" | "timestamp">
  ) => void;
  setChatStreaming: (
    phase: "analyze" | "specify" | "architect" | "generate",
    isStreaming: boolean
  ) => void;
  setArtifactStatus: (
    phase: "analyze" | "specify" | "architect" | "generate",
    status: ArtifactStatus
  ) => void;
  clearChatPhase: (phase: "analyze" | "specify" | "architect" | "generate") => void;

  // Reset
  reset: () => void;
};

const initialWorkflowState = createInitialWorkflowState();

// Load saved AI settings
const savedAISettings = loadAISettings();

const initialAIState: AILoadingState & AIResponses & ErrorState & AISettingsState = {
  isAnalyzing: false,
  isSpecifying: false,
  isArchitecting: false,
  isGenerating: false,
  aiAnalysis: "",
  aiPRD: "",
  aiArchitecture: "",
  aiCode: "",
  error: null,
  // AI Settings
  aiProvider: savedAISettings?.provider ?? "openrouter",
  aiModel: savedAISettings?.model ?? "anthropic/claude-sonnet-4",
  aiApiKey: savedAISettings?.apiKey ?? "",
  aiConfigured: isProviderReady(),
};

type WorkflowStore = WorkflowState &
  AILoadingState &
  AIResponses &
  ErrorState &
  AISettingsState &
  ChatStateWrapper &
  WorkflowActions;

const initialChatState = createInitialChatState();

export const useWorkflowStore = create<WorkflowStore>((set) => ({
  // Initial workflow state
  ...initialWorkflowState,

  // Initial AI state
  ...initialAIState,

  // Initial chat state
  chatState: initialChatState,

  // Phase navigation
  setPhase: (phase) => set({ currentPhase: phase }),

  // State updates
  updateBrief: (updates) =>
    set((state) => ({
      widgetBrief: {
        ...state.widgetBrief,
        ...updates,
      },
    })),

  updatePRD: (updates) =>
    set((state) => ({
      widgetPRD: {
        ...state.widgetPRD,
        ...updates,
      },
    })),

  updateArchitecture: (updates) =>
    set((state) => ({
      widgetArchitecture: {
        ...state.widgetArchitecture,
        ...updates,
      },
    })),

  setGeneratedCode: (code) => set({ generatedCode: code }),

  // AI loading state setters
  setAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
  setSpecifying: (isSpecifying) => set({ isSpecifying }),
  setArchitecting: (isArchitecting) => set({ isArchitecting }),
  setGenerating: (isGenerating) => set({ isGenerating }),

  // AI response setters
  setAIAnalysis: (aiAnalysis) => set({ aiAnalysis }),
  setAIPRD: (aiPRD) => set({ aiPRD }),
  setAIArchitecture: (aiArchitecture) => set({ aiArchitecture }),
  setAICode: (aiCode) => set({ aiCode }),

  // Error handling
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // AI Settings
  configureAI: (provider, apiKey, model) => {
    const config: AIConfig = { provider, apiKey, model };
    initializeProvider(config);
    set({
      aiProvider: provider,
      aiApiKey: apiKey,
      aiModel: model,
      aiConfigured: true,
      error: null,
    });
  },

  clearAIConfig: () => {
    clearAISettings();
    set({
      aiProvider: "openrouter",
      aiApiKey: "",
      aiModel: "anthropic/claude-sonnet-4",
      aiConfigured: false,
    });
  },

  // Chat Actions
  addChatMessage: (phase, message) =>
    set((state) => ({
      chatState: {
        ...state.chatState,
        [phase]: {
          ...state.chatState[phase],
          messages: [
            ...state.chatState[phase].messages,
            {
              ...message,
              id: crypto.randomUUID(),
              timestamp: Date.now(),
            },
          ],
        },
      },
    })),

  setChatStreaming: (phase, isStreaming) =>
    set((state) => ({
      chatState: {
        ...state.chatState,
        [phase]: {
          ...state.chatState[phase],
          isStreaming,
        },
      },
    })),

  setArtifactStatus: (phase, artifactStatus) =>
    set((state) => ({
      chatState: {
        ...state.chatState,
        [phase]: {
          ...state.chatState[phase],
          artifactStatus,
        },
      },
    })),

  clearChatPhase: (phase) =>
    set((state) => ({
      chatState: {
        ...state.chatState,
        [phase]: {
          messages: [],
          isStreaming: false,
          artifactStatus: "empty",
        },
      },
    })),

  // Reset to initial state
  reset: () =>
    set({
      ...initialWorkflowState,
      ...initialAIState,
      chatState: initialChatState,
    }),
}));
