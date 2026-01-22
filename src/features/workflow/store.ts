import { create } from "zustand";

import {
  type WidgetArchitecture,
  type WidgetBrief,
  type WidgetPRD,
  WorkflowPhase,
  type WorkflowState,
  createInitialWorkflowState,
} from "@/core/types";

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

  // Reset
  reset: () => void;
};

const initialWorkflowState = createInitialWorkflowState();

const initialAIState: AILoadingState & AIResponses & ErrorState = {
  isAnalyzing: false,
  isSpecifying: false,
  isArchitecting: false,
  isGenerating: false,
  aiAnalysis: "",
  aiPRD: "",
  aiArchitecture: "",
  aiCode: "",
  error: null,
};

type WorkflowStore = WorkflowState &
  AILoadingState &
  AIResponses &
  ErrorState &
  WorkflowActions;

export const useWorkflowStore = create<WorkflowStore>((set) => ({
  // Initial workflow state
  ...initialWorkflowState,

  // Initial AI state
  ...initialAIState,

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

  // Reset to initial state
  reset: () =>
    set({
      ...initialWorkflowState,
      ...initialAIState,
    }),
}));
