/**
 * Generate Phase CopilotKit Actions
 * Actions for generating widget code during the Generate phase
 */

import { useCopilotAction, useCopilotReadable } from "@copilotkit/react-core";
import { useWorkflowStore } from "../../store";

export function useGenerateActions() {
  const widgetBrief = useWorkflowStore((state) => state.widgetBrief);
  const widgetPRD = useWorkflowStore((state) => state.widgetPRD);
  const widgetArchitecture = useWorkflowStore((state) => state.widgetArchitecture);
  const generatedCode = useWorkflowStore((state) => state.generatedCode);
  const setGeneratedCode = useWorkflowStore((state) => state.setGeneratedCode);
  const setArtifactStatus = useWorkflowStore((state) => state.setArtifactStatus);

  // Make current state readable to AI
  useCopilotReadable({
    description: "Widget brief from Analyze phase",
    value: widgetBrief,
  });

  useCopilotReadable({
    description: "PRD from Specify phase",
    value: widgetPRD,
  });

  useCopilotReadable({
    description: "Architecture from Architect phase",
    value: widgetArchitecture,
  });

  useCopilotReadable({
    description: "Currently generated code (if any)",
    value: generatedCode ? "Code has been generated" : "No code generated yet",
  });

  // Action to generate the widget code
  useCopilotAction({
    name: "generateCode",
    description: "Generate the complete widget code based on the architecture",
    parameters: [
      {
        name: "code",
        type: "string",
        description: "The complete widget.tsx code",
        required: true,
      },
    ],
    handler: async (args) => {
      setArtifactStatus("generate", "building");
      setGeneratedCode(args.code);
      setArtifactStatus("generate", "complete");

      return "Widget code generated successfully";
    },
  });

  // Action to generate a specific file
  useCopilotAction({
    name: "generateFile",
    description: "Generate a specific widget file",
    parameters: [
      {
        name: "fileName",
        type: "string",
        description: "File name: manifest.json, config.ts, widget.tsx, setting.tsx, translations/default.ts",
        required: true,
      },
      {
        name: "content",
        type: "string",
        description: "The file content",
        required: true,
      },
    ],
    handler: async (args) => {
      setArtifactStatus("generate", "building");

      // For now, we just set the main code - in future we'd track multiple files
      if (args.fileName === "widget.tsx") {
        setGeneratedCode(args.content);
      }

      return `Generated ${args.fileName}`;
    },
  });

  // Action to show the generated manifest
  useCopilotAction({
    name: "showManifest",
    description: "Generate and display the manifest.json content",
    parameters: [],
    handler: async () => {
      const manifest = {
        name: widgetBrief.name || "my-widget",
        label: widgetBrief.displayLabel || "My Widget",
        version: "1.0.0",
        description: widgetBrief.description,
        author: "VibeGIS Generator",
        copyright: "",
        license: "Apache-2.0",
        jipiVersion: "1.19.0",
        properties: {
          hasConfig: widgetPRD.settingsConfig.hasSettings,
        },
        translatedLocales: ["en"],
        defaultLocale: "en",
      };

      return `\`\`\`json\n${JSON.stringify(manifest, null, 2)}\n\`\`\``;
    },
  });

  // Action to review architecture before generating
  useCopilotAction({
    name: "reviewBeforeGenerate",
    description: "Review the complete configuration before generating code",
    parameters: [],
    handler: async () => {
      const review = {
        brief: {
          name: widgetBrief.name,
          label: widgetBrief.displayLabel,
          targetUsers: widgetBrief.targetUsers,
          mapInteraction: widgetBrief.mapInteraction,
          dataSource: widgetBrief.dataSource,
        },
        prd: {
          requirementsCount: widgetPRD.functionalRequirements.length,
          settingsCount: widgetPRD.settingsConfig.settings.length,
          uiComponents: widgetPRD.uiRequirements.preferredComponents,
        },
        architecture: {
          mainComponent: widgetArchitecture.mainComponentName,
          stateManagement: widgetArchitecture.stateManagement,
          subComponentsCount: widgetArchitecture.subComponents.length,
          usesMapView: widgetArchitecture.jimuIntegration.usesJimuMapView,
          usesDataSource: widgetArchitecture.jimuIntegration.usesDataSourceComponent,
          arcgisModules: widgetArchitecture.dependencies.additionalArcgisModules,
        },
      };

      return `Configuration Review:\n\`\`\`json\n${JSON.stringify(review, null, 2)}\n\`\`\`\n\nReady to generate code?`;
    },
  });
}
