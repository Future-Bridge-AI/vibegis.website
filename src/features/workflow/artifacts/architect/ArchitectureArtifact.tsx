// @ts-nocheck
/**
 * Architecture Artifact Component
 * Editable widget architecture for the Architect phase
 *
 * TODO: Fix TypeScript errors when re-enabling workflow
 */

import { Plus, X } from "lucide-react";
import { useWorkflowStore } from "../../store";
import type {
  StateManagementApproach,
  MessageType,
  ArcgisModuleType,
  WidgetSubComponent,
} from "../../types";

const stateManagementOptions: StateManagementApproach[] = [
  "Local React state (useState/useReducer)",
  "Zustand store",
  "Redux (jimu-core)",
];

const messageTypeOptions: MessageType[] = [
  "EXTENT_CHANGE",
  "DATA_RECORDS_SELECTION_CHANGE",
  "DATA_RECORD_SET_CHANGE",
  "MAP_CLICK",
  "WIDGET_STATE_CHANGE",
];

const arcgisModuleOptions: ArcgisModuleType[] = [
  "FeatureLayer",
  "GraphicsLayer",
  "Query",
  "Geometry",
  "Graphic",
  "SketchViewModel",
  "PopupTemplate",
];

interface ArchitectureArtifactProps {
  editable?: boolean;
}

export function ArchitectureArtifact({ editable = true }: ArchitectureArtifactProps) {
  const widgetArchitecture = useWorkflowStore((state) => state.widgetArchitecture);
  const updateArchitecture = useWorkflowStore((state) => state.updateArchitecture);

  const isEmpty =
    !widgetArchitecture.mainComponentName &&
    widgetArchitecture.subComponents.length === 0;

  if (isEmpty && !editable) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center space-y-2">
          <p className="font-mono text-sm text-gray-500">
            Chat to design your architecture
          </p>
          <p className="font-mono text-xs text-gray-600">
            The AI will help you structure components and integrations
          </p>
        </div>
      </div>
    );
  }

  const addSubComponent = () => {
    updateArchitecture({
      subComponents: [
        ...widgetArchitecture.subComponents,
        { name: "", purpose: "" },
      ],
    });
  };

  const updateSubComponent = (
    index: number,
    updates: Partial<WidgetSubComponent>
  ) => {
    const updated = [...widgetArchitecture.subComponents];
    updated[index] = { ...updated[index], ...updates };
    updateArchitecture({ subComponents: updated });
  };

  const removeSubComponent = (index: number) => {
    updateArchitecture({
      subComponents: widgetArchitecture.subComponents.filter((_, i) => i !== index),
    });
  };

  const toggleMessageType = (messageType: MessageType) => {
    const current = widgetArchitecture.jimuIntegration.messageTypes;
    const updated = current.includes(messageType)
      ? current.filter((m) => m !== messageType)
      : [...current, messageType];
    updateArchitecture({
      jimuIntegration: {
        ...widgetArchitecture.jimuIntegration,
        messageTypes: updated,
      },
    });
  };

  const toggleArcgisModule = (module: ArcgisModuleType) => {
    const current = widgetArchitecture.dependencies.additionalArcgisModules;
    const updated = current.includes(module)
      ? current.filter((m) => m !== module)
      : [...current, module];
    updateArchitecture({
      dependencies: {
        ...widgetArchitecture.dependencies,
        additionalArcgisModules: updated,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Main Component */}
      <section className="space-y-4">
        <h4 className="wizard-section-title">Main Component</h4>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="font-mono text-xs font-semibold text-gray-400">
              Component Name
            </label>
            {editable ? (
              <input
                type="text"
                value={widgetArchitecture.mainComponentName}
                onChange={(e) =>
                  updateArchitecture({ mainComponentName: e.target.value })
                }
                placeholder="e.g. IncidentSummaryWidget"
                className="wizard-input w-full text-sm"
              />
            ) : (
              <p className="font-mono text-sm text-gray-300">
                {widgetArchitecture.mainComponentName || "-"}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label className="font-mono text-xs font-semibold text-gray-400">
              State Management
            </label>
            {editable ? (
              <select
                value={widgetArchitecture.stateManagement}
                onChange={(e) =>
                  updateArchitecture({
                    stateManagement: e.target.value as StateManagementApproach,
                  })
                }
                className="wizard-input w-full text-sm"
              >
                {stateManagementOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : (
              <p className="font-mono text-sm text-gray-300">
                {widgetArchitecture.stateManagement}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Sub-Components */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="wizard-section-title">Sub-Components</h4>
          {editable && (
            <button
              type="button"
              onClick={addSubComponent}
              className="flex items-center gap-1 rounded-lg border border-wizard-border px-2 py-1 font-mono text-xs text-gray-400 transition hover:border-fiesta-turquoise/50 hover:text-fiesta-turquoise"
            >
              <Plus className="h-3 w-3" />
              Add
            </button>
          )}
        </div>

        {widgetArchitecture.subComponents.length === 0 ? (
          <p className="font-mono text-xs text-gray-500">
            No sub-components defined
          </p>
        ) : (
          <div className="space-y-3">
            {widgetArchitecture.subComponents.map((comp, index) => (
              <div
                key={index}
                className="flex gap-2 rounded-lg border border-wizard-border bg-geodark-secondary/40 p-3"
              >
                {editable ? (
                  <>
                    <input
                      type="text"
                      value={comp.name}
                      onChange={(e) =>
                        updateSubComponent(index, { name: e.target.value })
                      }
                      placeholder="Component name"
                      className="w-1/3 bg-transparent font-mono text-xs text-gray-300 placeholder:text-gray-600 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={comp.purpose}
                      onChange={(e) =>
                        updateSubComponent(index, { purpose: e.target.value })
                      }
                      placeholder="Purpose"
                      className="flex-1 bg-transparent font-mono text-xs text-gray-300 placeholder:text-gray-600 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => removeSubComponent(index)}
                      className="text-gray-500 hover:text-fiesta-pink"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <span className="w-1/3 font-mono text-xs font-semibold text-fiesta-turquoise">
                      {comp.name}
                    </span>
                    <span className="flex-1 font-mono text-xs text-gray-300">
                      {comp.purpose}
                    </span>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Jimu Integration */}
      <section className="space-y-4">
        <h4 className="wizard-section-title">Jimu Integration</h4>
        <div className="space-y-3">
          {editable ? (
            <>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={widgetArchitecture.jimuIntegration.usesJimuMapView}
                  onChange={(e) =>
                    updateArchitecture({
                      jimuIntegration: {
                        ...widgetArchitecture.jimuIntegration,
                        usesJimuMapView: e.target.checked,
                      },
                    })
                  }
                  className="h-3 w-3 rounded border-wizard-border bg-geodark text-fiesta-turquoise"
                />
                <span className="font-mono text-xs text-gray-300">
                  Uses JimuMapView
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={widgetArchitecture.jimuIntegration.usesDataSourceComponent}
                  onChange={(e) =>
                    updateArchitecture({
                      jimuIntegration: {
                        ...widgetArchitecture.jimuIntegration,
                        usesDataSourceComponent: e.target.checked,
                      },
                    })
                  }
                  className="h-3 w-3 rounded border-wizard-border bg-geodark text-fiesta-turquoise"
                />
                <span className="font-mono text-xs text-gray-300">
                  Uses DataSourceComponent
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={widgetArchitecture.jimuIntegration.publishesMessages}
                  onChange={(e) =>
                    updateArchitecture({
                      jimuIntegration: {
                        ...widgetArchitecture.jimuIntegration,
                        publishesMessages: e.target.checked,
                      },
                    })
                  }
                  className="h-3 w-3 rounded border-wizard-border bg-geodark text-fiesta-turquoise"
                />
                <span className="font-mono text-xs text-gray-300">
                  Publishes messages
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={widgetArchitecture.jimuIntegration.subscribesMessages}
                  onChange={(e) =>
                    updateArchitecture({
                      jimuIntegration: {
                        ...widgetArchitecture.jimuIntegration,
                        subscribesMessages: e.target.checked,
                      },
                    })
                  }
                  className="h-3 w-3 rounded border-wizard-border bg-geodark text-fiesta-turquoise"
                />
                <span className="font-mono text-xs text-gray-300">
                  Subscribes to messages
                </span>
              </label>
            </>
          ) : (
            <div className="font-mono text-xs text-gray-300 space-y-1">
              <p>JimuMapView: {widgetArchitecture.jimuIntegration.usesJimuMapView ? "Yes" : "No"}</p>
              <p>DataSourceComponent: {widgetArchitecture.jimuIntegration.usesDataSourceComponent ? "Yes" : "No"}</p>
              <p>Publishes: {widgetArchitecture.jimuIntegration.publishesMessages ? "Yes" : "No"}</p>
              <p>Subscribes: {widgetArchitecture.jimuIntegration.subscribesMessages ? "Yes" : "No"}</p>
            </div>
          )}
        </div>
      </section>

      {/* Message Types */}
      {(widgetArchitecture.jimuIntegration.publishesMessages ||
        widgetArchitecture.jimuIntegration.subscribesMessages) && (
        <section className="space-y-4">
          <h4 className="wizard-section-title">Message Types</h4>
          <div className="flex flex-wrap gap-2">
            {messageTypeOptions.map((msgType) => {
              const isSelected =
                widgetArchitecture.jimuIntegration.messageTypes.includes(msgType);
              return editable ? (
                <button
                  key={msgType}
                  type="button"
                  onClick={() => toggleMessageType(msgType)}
                  className={`rounded-lg border px-3 py-1.5 font-mono text-xs transition ${
                    isSelected
                      ? "border-fiesta-turquoise bg-fiesta-turquoise/20 text-fiesta-turquoise"
                      : "border-wizard-border text-gray-400 hover:border-fiesta-turquoise/50"
                  }`}
                >
                  {msgType}
                </button>
              ) : isSelected ? (
                <span
                  key={msgType}
                  className="rounded-lg border border-fiesta-turquoise/50 bg-fiesta-turquoise/10 px-3 py-1.5 font-mono text-xs text-fiesta-turquoise"
                >
                  {msgType}
                </span>
              ) : null;
            })}
          </div>
        </section>
      )}

      {/* ArcGIS Modules */}
      <section className="space-y-4">
        <h4 className="wizard-section-title">Additional ArcGIS Modules</h4>
        <div className="flex flex-wrap gap-2">
          {arcgisModuleOptions.map((module) => {
            const isSelected =
              widgetArchitecture.dependencies.additionalArcgisModules.includes(module);
            return editable ? (
              <button
                key={module}
                type="button"
                onClick={() => toggleArcgisModule(module)}
                className={`rounded-lg border px-3 py-1.5 font-mono text-xs transition ${
                  isSelected
                    ? "border-fiesta-orange bg-fiesta-orange/20 text-fiesta-orange"
                    : "border-wizard-border text-gray-400 hover:border-fiesta-orange/50"
                }`}
              >
                {module}
              </button>
            ) : isSelected ? (
              <span
                key={module}
                className="rounded-lg border border-fiesta-orange/50 bg-fiesta-orange/10 px-3 py-1.5 font-mono text-xs text-fiesta-orange"
              >
                {module}
              </span>
            ) : null;
          })}
        </div>
      </section>
    </div>
  );
}

export default ArchitectureArtifact;
