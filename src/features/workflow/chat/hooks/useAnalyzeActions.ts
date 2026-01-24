/**
 * Analyze Phase CopilotKit Actions
 * Actions for updating the widget brief during the Analyze phase
 */

import { useCopilotAction, useCopilotReadable } from "@copilotkit/react-core";
import { useWorkflowStore } from "../../store";
import type { TargetUserType, MapInteractionType, DataSourceType } from "../../types";

export function useAnalyzeActions() {
  const widgetBrief = useWorkflowStore((state) => state.widgetBrief);
  const updateBrief = useWorkflowStore((state) => state.updateBrief);
  const setArtifactStatus = useWorkflowStore((state) => state.setArtifactStatus);

  // Make widget brief readable to the AI
  useCopilotReadable({
    description: "Current widget brief being developed",
    value: widgetBrief,
  });

  // Action to update widget brief fields
  useCopilotAction({
    name: "updateBrief",
    description: "Update one or more fields in the widget brief",
    parameters: [
      {
        name: "name",
        type: "string",
        description: "Widget technical name (kebab-case, e.g., 'incident-summary')",
        required: false,
      },
      {
        name: "displayLabel",
        type: "string",
        description: "Human-readable widget label",
        required: false,
      },
      {
        name: "description",
        type: "string",
        description: "What the widget does",
        required: false,
      },
      {
        name: "purpose",
        type: "string",
        description: "What problem the widget solves",
        required: false,
      },
      {
        name: "targetUsers",
        type: "string[]",
        description: "Target user types: GIS Analysts, Field Workers, Public/Citizens, Managers/Executives, Developers",
        required: false,
      },
      {
        name: "mapInteraction",
        type: "string",
        description: "How users interact with the map: Click to select features, Draw geometry, View only (no interaction), Hover to highlight",
        required: false,
      },
      {
        name: "dataSource",
        type: "string",
        description: "Primary data source type: Feature Layer, Web Map, CSV/GeoJSON, No data source",
        required: false,
      },
      {
        name: "keyFeatures",
        type: "string",
        description: "Main capabilities and workflow steps",
        required: false,
      },
    ],
    handler: async (args) => {
      setArtifactStatus("analyze", "building");

      const updates: Partial<typeof widgetBrief> = {};

      if (args.name) updates.name = args.name;
      if (args.displayLabel) updates.displayLabel = args.displayLabel;
      if (args.description) updates.description = args.description;
      if (args.purpose) updates.purpose = args.purpose;
      if (args.targetUsers) updates.targetUsers = args.targetUsers as TargetUserType[];
      if (args.mapInteraction) updates.mapInteraction = args.mapInteraction as MapInteractionType;
      if (args.dataSource) updates.dataSource = args.dataSource as DataSourceType;
      if (args.keyFeatures) updates.keyFeatures = args.keyFeatures;

      updateBrief(updates);

      // Check if brief is complete
      const updatedBrief = { ...widgetBrief, ...updates };
      const isComplete =
        updatedBrief.name &&
        updatedBrief.description &&
        updatedBrief.purpose &&
        updatedBrief.targetUsers.length > 0;

      setArtifactStatus("analyze", isComplete ? "complete" : "building");

      return `Updated widget brief: ${Object.keys(updates).join(", ")}`;
    },
  });

  // Action for AI to ask clarifying questions with options
  useCopilotAction({
    name: "askClarifyingQuestion",
    description: "Ask a clarifying question about the widget with suggested options",
    parameters: [
      {
        name: "question",
        type: "string",
        description: "The question to ask",
        required: true,
      },
      {
        name: "options",
        type: "string[]",
        description: "Suggested answer options (2-4 options)",
        required: false,
      },
    ],
    handler: async (args) => {
      // This action is mainly for structured questions
      // The render prop would display a card with options
      return `Question: ${args.question}`;
    },
  });
}
