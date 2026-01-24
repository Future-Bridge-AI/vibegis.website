/**
 * Architect Phase CopilotKit Actions
 * Actions for designing widget architecture during the Architect phase
 */

import { useCopilotAction, useCopilotReadable } from "@copilotkit/react-core";
import { useWorkflowStore } from "../../store";
import type {
  StateManagementApproach,
  MessageType,
  ArcgisModuleType,
} from "../../types";

export function useArchitectActions() {
  const widgetBrief = useWorkflowStore((state) => state.widgetBrief);
  const widgetPRD = useWorkflowStore((state) => state.widgetPRD);
  const widgetArchitecture = useWorkflowStore((state) => state.widgetArchitecture);
  const updateArchitecture = useWorkflowStore((state) => state.updateArchitecture);
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
    description: "Current architecture being designed",
    value: widgetArchitecture,
  });

  // Action to set main component configuration
  useCopilotAction({
    name: "setMainComponent",
    description: "Configure the main widget component",
    parameters: [
      {
        name: "name",
        type: "string",
        description: "Main component name (PascalCase, e.g., IncidentSummaryWidget)",
        required: true,
      },
      {
        name: "stateManagement",
        type: "string",
        description: "State management approach: Local React state (useState/useReducer), Zustand store, Redux (jimu-core)",
        required: true,
      },
    ],
    handler: async (args) => {
      setArtifactStatus("architect", "building");

      updateArchitecture({
        mainComponentName: args.name,
        stateManagement: args.stateManagement as StateManagementApproach,
      });

      return `Set main component: ${args.name} with ${args.stateManagement}`;
    },
  });

  // Action to add a sub-component
  useCopilotAction({
    name: "addSubComponent",
    description: "Add a sub-component to the widget architecture",
    parameters: [
      {
        name: "name",
        type: "string",
        description: "Component name (PascalCase)",
        required: true,
      },
      {
        name: "purpose",
        type: "string",
        description: "What this component does",
        required: true,
      },
    ],
    handler: async (args) => {
      setArtifactStatus("architect", "building");

      updateArchitecture({
        subComponents: [
          ...widgetArchitecture.subComponents,
          { name: args.name, purpose: args.purpose },
        ],
      });

      return `Added sub-component: ${args.name}`;
    },
  });

  // Action to add multiple sub-components
  useCopilotAction({
    name: "addSubComponents",
    description: "Add multiple sub-components at once",
    parameters: [
      {
        name: "components",
        type: "object[]",
        description: "Array of components with name and purpose",
        required: true,
      },
    ],
    handler: async (args) => {
      setArtifactStatus("architect", "building");

      const newComponents = args.components.map((c: { name: string; purpose: string }) => ({
        name: c.name,
        purpose: c.purpose,
      }));

      updateArchitecture({
        subComponents: [...widgetArchitecture.subComponents, ...newComponents],
      });

      return `Added ${newComponents.length} sub-components`;
    },
  });

  // Action to configure Jimu integration
  useCopilotAction({
    name: "configureJimuIntegration",
    description: "Configure Jimu framework integration settings",
    parameters: [
      {
        name: "usesJimuMapView",
        type: "boolean",
        description: "Uses JimuMapViewComponent for map interaction",
        required: false,
      },
      {
        name: "usesDataSourceComponent",
        type: "boolean",
        description: "Uses DataSourceComponent for data binding",
        required: false,
      },
      {
        name: "publishesMessages",
        type: "boolean",
        description: "Publishes messages to other widgets",
        required: false,
      },
      {
        name: "subscribesMessages",
        type: "boolean",
        description: "Subscribes to messages from other widgets",
        required: false,
      },
      {
        name: "messageTypes",
        type: "string[]",
        description: "Message types: EXTENT_CHANGE, DATA_RECORDS_SELECTION_CHANGE, DATA_RECORD_SET_CHANGE, MAP_CLICK, WIDGET_STATE_CHANGE",
        required: false,
      },
    ],
    handler: async (args) => {
      setArtifactStatus("architect", "building");

      updateArchitecture({
        jimuIntegration: {
          usesJimuMapView: args.usesJimuMapView ?? widgetArchitecture.jimuIntegration.usesJimuMapView,
          usesDataSourceComponent: args.usesDataSourceComponent ?? widgetArchitecture.jimuIntegration.usesDataSourceComponent,
          publishesMessages: args.publishesMessages ?? widgetArchitecture.jimuIntegration.publishesMessages,
          subscribesMessages: args.subscribesMessages ?? widgetArchitecture.jimuIntegration.subscribesMessages,
          messageTypes: (args.messageTypes as MessageType[]) ?? widgetArchitecture.jimuIntegration.messageTypes,
        },
      });

      return "Updated Jimu integration configuration";
    },
  });

  // Action to set ArcGIS module dependencies
  useCopilotAction({
    name: "setArcGISModules",
    description: "Set the required ArcGIS API modules",
    parameters: [
      {
        name: "modules",
        type: "string[]",
        description: "ArcGIS modules: FeatureLayer, GraphicsLayer, Query, Geometry, Graphic, SketchViewModel, PopupTemplate",
        required: true,
      },
    ],
    handler: async (args) => {
      setArtifactStatus("architect", "building");

      updateArchitecture({
        dependencies: {
          ...widgetArchitecture.dependencies,
          additionalArcgisModules: args.modules as ArcgisModuleType[],
        },
      });

      return `Set ArcGIS modules: ${args.modules.join(", ")}`;
    },
  });

  // Action to set the complete architecture at once
  useCopilotAction({
    name: "setArchitecture",
    description: "Set the complete widget architecture configuration",
    parameters: [
      {
        name: "mainComponentName",
        type: "string",
        description: "Main component name",
        required: true,
      },
      {
        name: "stateManagement",
        type: "string",
        description: "State management approach",
        required: true,
      },
      {
        name: "subComponents",
        type: "object[]",
        description: "Array of sub-components with name and purpose",
        required: false,
      },
      {
        name: "usesJimuMapView",
        type: "boolean",
        required: false,
      },
      {
        name: "usesDataSourceComponent",
        type: "boolean",
        required: false,
      },
      {
        name: "arcgisModules",
        type: "string[]",
        required: false,
      },
    ],
    handler: async (args) => {
      setArtifactStatus("architect", "building");

      updateArchitecture({
        mainComponentName: args.mainComponentName,
        stateManagement: args.stateManagement as StateManagementApproach,
        subComponents: args.subComponents?.map((c: { name: string; purpose: string }) => ({
          name: c.name,
          purpose: c.purpose,
        })) ?? [],
        jimuIntegration: {
          ...widgetArchitecture.jimuIntegration,
          usesJimuMapView: args.usesJimuMapView ?? false,
          usesDataSourceComponent: args.usesDataSourceComponent ?? false,
        },
        dependencies: {
          ...widgetArchitecture.dependencies,
          additionalArcgisModules: (args.arcgisModules as ArcgisModuleType[]) ?? [],
        },
      });

      setArtifactStatus("architect", "complete");
      return "Architecture configuration complete";
    },
  });

  // Action to mark architecture as complete
  useCopilotAction({
    name: "completeArchitecture",
    description: "Mark the architecture as complete and ready for code generation",
    parameters: [],
    handler: async () => {
      setArtifactStatus("architect", "complete");
      return "Architecture marked as complete. Ready for Generate phase.";
    },
  });
}
