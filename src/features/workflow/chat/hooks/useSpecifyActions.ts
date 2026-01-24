/**
 * Specify Phase CopilotKit Actions
 * Actions for building the PRD during the Specify phase
 */

import { useCopilotAction, useCopilotReadable } from "@copilotkit/react-core";
import { useWorkflowStore } from "../../store";
import type {
  RequirementPriority,
  SettingType,
  CalciteComponentType,
} from "../../types";

export function useSpecifyActions() {
  const widgetBrief = useWorkflowStore((state) => state.widgetBrief);
  const widgetPRD = useWorkflowStore((state) => state.widgetPRD);
  const updatePRD = useWorkflowStore((state) => state.updatePRD);
  const setArtifactStatus = useWorkflowStore((state) => state.setArtifactStatus);

  // Make current state readable to AI
  useCopilotReadable({
    description: "Widget brief from Analyze phase",
    value: widgetBrief,
  });

  useCopilotReadable({
    description: "Current PRD being developed",
    value: widgetPRD,
  });

  // Action to add a functional requirement
  useCopilotAction({
    name: "addRequirement",
    description: "Add a functional requirement to the PRD",
    parameters: [
      {
        name: "description",
        type: "string",
        description: "The requirement description",
        required: true,
      },
      {
        name: "priority",
        type: "string",
        description: "Priority level: High, Medium, or Low",
        required: true,
      },
    ],
    handler: async (args) => {
      setArtifactStatus("specify", "building");

      updatePRD({
        functionalRequirements: [
          ...widgetPRD.functionalRequirements,
          {
            description: args.description,
            priority: args.priority as RequirementPriority,
          },
        ],
      });

      return `Added requirement: ${args.description} (${args.priority})`;
    },
  });

  // Action to add multiple requirements at once
  useCopilotAction({
    name: "addRequirements",
    description: "Add multiple functional requirements at once",
    parameters: [
      {
        name: "requirements",
        type: "object[]",
        description: "Array of requirements with description and priority",
        required: true,
      },
    ],
    handler: async (args) => {
      setArtifactStatus("specify", "building");

      const newReqs = args.requirements.map((req: { description: string; priority: string }) => ({
        description: req.description,
        priority: req.priority as RequirementPriority,
      }));

      updatePRD({
        functionalRequirements: [...widgetPRD.functionalRequirements, ...newReqs],
      });

      return `Added ${newReqs.length} requirements`;
    },
  });

  // Action to add a widget setting
  useCopilotAction({
    name: "addSetting",
    description: "Add a configuration setting to the widget",
    parameters: [
      {
        name: "name",
        type: "string",
        description: "Setting name (camelCase)",
        required: true,
      },
      {
        name: "type",
        type: "string",
        description: "Setting type: text, number, boolean, layer-selector, field-selector",
        required: true,
      },
      {
        name: "defaultValue",
        type: "string",
        description: "Default value for the setting",
        required: false,
      },
    ],
    handler: async (args) => {
      setArtifactStatus("specify", "building");

      updatePRD({
        settingsConfig: {
          hasSettings: true,
          settings: [
            ...widgetPRD.settingsConfig.settings,
            {
              name: args.name,
              type: args.type as SettingType,
              defaultValue: args.defaultValue || "",
            },
          ],
        },
      });

      return `Added setting: ${args.name} (${args.type})`;
    },
  });

  // Action to configure data bindings
  useCopilotAction({
    name: "configureDataBindings",
    description: "Configure data binding requirements",
    parameters: [
      {
        name: "requiresLayerSelection",
        type: "boolean",
        description: "Whether the widget needs layer selection",
        required: false,
      },
      {
        name: "requiresFieldSelection",
        type: "boolean",
        description: "Whether the widget needs field selection",
        required: false,
      },
      {
        name: "supportsMultipleSources",
        type: "boolean",
        description: "Whether the widget supports multiple data sources",
        required: false,
      },
    ],
    handler: async (args) => {
      setArtifactStatus("specify", "building");

      updatePRD({
        dataBindings: {
          requiresLayerSelection: args.requiresLayerSelection ?? widgetPRD.dataBindings.requiresLayerSelection,
          requiresFieldSelection: args.requiresFieldSelection ?? widgetPRD.dataBindings.requiresFieldSelection,
          supportsMultipleSources: args.supportsMultipleSources ?? widgetPRD.dataBindings.supportsMultipleSources,
        },
      });

      return "Updated data binding configuration";
    },
  });

  // Action to set preferred UI components
  useCopilotAction({
    name: "setUIComponents",
    description: "Set the preferred Calcite UI components",
    parameters: [
      {
        name: "components",
        type: "string[]",
        description: "Calcite components: Card, Panel, List, Table, Button, Modal, Tabs",
        required: true,
      },
      {
        name: "customStyling",
        type: "boolean",
        description: "Whether custom styling is needed",
        required: false,
      },
    ],
    handler: async (args) => {
      setArtifactStatus("specify", "building");

      updatePRD({
        uiRequirements: {
          preferredComponents: args.components as CalciteComponentType[],
          customStyling: args.customStyling ?? false,
        },
      });

      return `Set UI components: ${args.components.join(", ")}`;
    },
  });

  // Action to mark PRD as complete
  useCopilotAction({
    name: "completePRD",
    description: "Mark the PRD as complete and ready for architecture phase",
    parameters: [],
    handler: async () => {
      setArtifactStatus("specify", "complete");
      return "PRD marked as complete. Ready for Architecture phase.";
    },
  });
}
