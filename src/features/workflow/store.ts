import { create } from "zustand";

import {
  type WidgetArchitecture,
  type WidgetBrief,
  type WidgetPRD,
  WorkflowPhase,
  type WorkflowState,
} from "./types";

type WorkflowActions = {
  setPhase: (phase: WorkflowPhase) => void;
  updateBrief: (updates: Partial<WidgetBrief>) => void;
  updatePRD: (updates: Partial<WidgetPRD>) => void;
  updateArchitecture: (updates: Partial<WidgetArchitecture>) => void;
  setGeneratedCode: (code: string) => void;
  reset: () => void;
};

const initialState: WorkflowState = {
  currentPhase: WorkflowPhase.Analyze,
  widgetBrief: {
    name: "",
    displayLabel: "",
    description: "",
    purpose: "",
    targetUsers: [],
    mapInteraction: "",
    dataSource: "",
    keyFeatures: "",
  },
  widgetPRD: {
    functionalRequirements: [],
    settingsConfig: {
      hasSettings: false,
      settings: [],
    },
    dataBindings: {
      requiresLayerSelection: false,
      requiresFieldSelection: false,
      supportsMultipleSources: false,
    },
    uiRequirements: {
      preferredComponents: [],
      customStyling: false,
    },
  },
  widgetArchitecture: {
    mainComponentName: "",
    stateManagement: "Local React state (useState/useReducer)",
    subComponents: [],
    jimuIntegration: {
      usesJimuMapView: false,
      usesDataSourceComponent: false,
      publishesMessages: false,
      subscribesMessages: false,
      messageTypes: [],
    },
    dependencies: {
      requiredJimuModules: [],
      additionalArcgisModules: [],
    },
  },
  generatedCode: "",
};

export const useWorkflowStore = create<WorkflowState & WorkflowActions>((set) => ({
  ...initialState,
  setPhase: (phase) => set({ currentPhase: phase }),
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
  reset: () => set(initialState),
}));
