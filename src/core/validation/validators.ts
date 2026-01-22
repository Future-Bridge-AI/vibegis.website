/**
 * Workflow State Validators
 * Validates workflow state for each phase
 */

import type {
  WidgetArchitecture,
  WidgetBrief,
  WidgetPRD,
  WorkflowState,
} from "../types";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validate WidgetBrief (Analyze phase)
 */
export const validateBrief = (brief: WidgetBrief): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required fields
  if (!brief.name || brief.name.trim() === "") {
    errors.push("Widget name is required");
  } else if (!/^[a-z][a-z0-9-]*$/.test(brief.name)) {
    errors.push(
      "Widget name must start with lowercase letter and contain only lowercase letters, numbers, and hyphens"
    );
  }

  if (!brief.displayLabel || brief.displayLabel.trim() === "") {
    errors.push("Display label is required");
  }

  if (!brief.description || brief.description.trim() === "") {
    warnings.push("Description is recommended for better code generation");
  }

  if (!brief.purpose || brief.purpose.trim() === "") {
    warnings.push("Purpose helps the AI understand widget intent");
  }

  if (brief.targetUsers.length === 0) {
    warnings.push("Specifying target users improves requirements generation");
  }

  if (!brief.mapInteraction) {
    warnings.push("Map interaction type helps determine Jimu integrations");
  }

  if (!brief.dataSource) {
    warnings.push("Data source type helps determine data binding requirements");
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
};

/**
 * Validate WidgetPRD (Specify phase)
 */
export const validatePRD = (prd: WidgetPRD): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Functional requirements
  if (prd.functionalRequirements.length === 0) {
    errors.push("At least one functional requirement is needed");
  } else {
    prd.functionalRequirements.forEach((req, index) => {
      if (!req.description || req.description.trim() === "") {
        errors.push(`Requirement ${index + 1} has no description`);
      }
    });

    const highPriority = prd.functionalRequirements.filter(
      (r) => r.priority === "High"
    );
    if (highPriority.length === 0) {
      warnings.push("No high-priority requirements defined");
    }
  }

  // Settings validation
  if (prd.settingsConfig.hasSettings) {
    if (prd.settingsConfig.settings.length === 0) {
      warnings.push("Settings enabled but no settings defined");
    } else {
      prd.settingsConfig.settings.forEach((setting, index) => {
        if (!setting.name || setting.name.trim() === "") {
          errors.push(`Setting ${index + 1} has no name`);
        } else if (!/^[a-zA-Z][a-zA-Z0-9]*$/.test(setting.name)) {
          errors.push(
            `Setting "${setting.name}" must be a valid identifier (camelCase recommended)`
          );
        }
      });
    }
  }

  // UI requirements
  if (prd.uiRequirements.preferredComponents.length === 0) {
    warnings.push("No Calcite components selected");
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
};

/**
 * Validate WidgetArchitecture (Architect phase)
 */
export const validateArchitecture = (
  arch: WidgetArchitecture
): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Main component name
  if (!arch.mainComponentName || arch.mainComponentName.trim() === "") {
    errors.push("Main component name is required");
  } else if (!/^[A-Z][a-zA-Z0-9]*$/.test(arch.mainComponentName)) {
    errors.push("Main component name must be PascalCase");
  }

  // Sub-components validation
  arch.subComponents.forEach((comp, index) => {
    if (!comp.name || comp.name.trim() === "") {
      errors.push(`Sub-component ${index + 1} has no name`);
    } else if (!/^[A-Z][a-zA-Z0-9]*$/.test(comp.name)) {
      warnings.push(`Sub-component "${comp.name}" should be PascalCase`);
    }
    if (!comp.purpose || comp.purpose.trim() === "") {
      warnings.push(`Sub-component "${comp.name}" has no purpose defined`);
    }
  });

  // Jimu integration consistency
  if (
    (arch.jimuIntegration.publishesMessages ||
      arch.jimuIntegration.subscribesMessages) &&
    arch.jimuIntegration.messageTypes.length === 0
  ) {
    errors.push(
      "Message types must be specified when publishing or subscribing to messages"
    );
  }

  // Dependencies validation
  if (arch.dependencies.requiredJimuModules.length === 0) {
    errors.push("At least jimu-core must be in required modules");
  } else if (!arch.dependencies.requiredJimuModules.includes("jimu-core")) {
    errors.push("jimu-core is a required module");
  }

  if (
    arch.jimuIntegration.usesJimuMapView &&
    !arch.dependencies.requiredJimuModules.includes("jimu-arcgis")
  ) {
    warnings.push("JimuMapView requires jimu-arcgis module");
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
};

/**
 * Validate entire workflow state
 */
export const validateWorkflowState = (
  state: WorkflowState
): ValidationResult => {
  const briefResult = validateBrief(state.widgetBrief);
  const prdResult = validatePRD(state.widgetPRD);
  const archResult = validateArchitecture(state.widgetArchitecture);

  return {
    valid: briefResult.valid && prdResult.valid && archResult.valid,
    errors: [
      ...briefResult.errors.map((e) => `[Brief] ${e}`),
      ...prdResult.errors.map((e) => `[PRD] ${e}`),
      ...archResult.errors.map((e) => `[Architecture] ${e}`),
    ],
    warnings: [
      ...briefResult.warnings.map((w) => `[Brief] ${w}`),
      ...prdResult.warnings.map((w) => `[PRD] ${w}`),
      ...archResult.warnings.map((w) => `[Architecture] ${w}`),
    ],
  };
};

/**
 * Check if a phase is complete enough to proceed
 */
export const isPhaseComplete = (
  phase: "analyze" | "specify" | "architect" | "generate",
  state: WorkflowState
): boolean => {
  switch (phase) {
    case "analyze":
      return validateBrief(state.widgetBrief).valid;
    case "specify":
      return (
        validateBrief(state.widgetBrief).valid &&
        validatePRD(state.widgetPRD).valid
      );
    case "architect":
      return (
        validateBrief(state.widgetBrief).valid &&
        validatePRD(state.widgetPRD).valid &&
        validateArchitecture(state.widgetArchitecture).valid
      );
    case "generate":
      return validateWorkflowState(state).valid;
    default:
      return false;
  }
};
