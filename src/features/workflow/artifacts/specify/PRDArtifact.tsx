// @ts-nocheck
/**
 * PRD Artifact Component
 * Editable Product Requirements Document for the Specify phase
 *
 * TODO: Fix TypeScript errors when re-enabling workflow
 */

import { Plus, X } from "lucide-react";
import { useWorkflowStore } from "../../store";
import type {
  FunctionalRequirement,
  WidgetSetting,
  CalciteComponentType,
  SettingType,
  RequirementPriority,
} from "../../types";

const priorityOptions: RequirementPriority[] = ["High", "Medium", "Low"];
const settingTypeOptions: SettingType[] = [
  "text",
  "number",
  "boolean",
  "layer-selector",
  "field-selector",
];
const calciteComponents: CalciteComponentType[] = [
  "Card",
  "Panel",
  "List",
  "Table",
  "Button",
  "Modal",
  "Tabs",
];

interface PRDArtifactProps {
  editable?: boolean;
}

export function PRDArtifact({ editable = true }: PRDArtifactProps) {
  const widgetPRD = useWorkflowStore((state) => state.widgetPRD);
  const updatePRD = useWorkflowStore((state) => state.updatePRD);

  // Check if PRD has any content
  const isEmpty =
    widgetPRD.functionalRequirements.length === 0 &&
    !widgetPRD.settingsConfig.hasSettings &&
    widgetPRD.uiRequirements.preferredComponents.length === 0;

  if (isEmpty && !editable) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center space-y-2">
          <p className="font-mono text-sm text-gray-500">
            Chat to define your requirements
          </p>
          <p className="font-mono text-xs text-gray-600">
            The AI will help you specify features, settings, and UI
          </p>
        </div>
      </div>
    );
  }

  // Handlers for requirements
  const addRequirement = () => {
    updatePRD({
      functionalRequirements: [
        ...widgetPRD.functionalRequirements,
        { description: "", priority: "Medium" },
      ],
    });
  };

  const updateRequirement = (
    index: number,
    updates: Partial<FunctionalRequirement>
  ) => {
    const updated = [...widgetPRD.functionalRequirements];
    updated[index] = { ...updated[index], ...updates };
    updatePRD({ functionalRequirements: updated });
  };

  const removeRequirement = (index: number) => {
    updatePRD({
      functionalRequirements: widgetPRD.functionalRequirements.filter(
        (_, i) => i !== index
      ),
    });
  };

  // Handlers for settings
  const addSetting = () => {
    updatePRD({
      settingsConfig: {
        ...widgetPRD.settingsConfig,
        hasSettings: true,
        settings: [
          ...widgetPRD.settingsConfig.settings,
          { name: "", type: "text", defaultValue: "" },
        ],
      },
    });
  };

  const updateSetting = (index: number, updates: Partial<WidgetSetting>) => {
    const updated = [...widgetPRD.settingsConfig.settings];
    updated[index] = { ...updated[index], ...updates };
    updatePRD({
      settingsConfig: { ...widgetPRD.settingsConfig, settings: updated },
    });
  };

  const removeSetting = (index: number) => {
    const settings = widgetPRD.settingsConfig.settings.filter(
      (_, i) => i !== index
    );
    updatePRD({
      settingsConfig: {
        ...widgetPRD.settingsConfig,
        hasSettings: settings.length > 0,
        settings,
      },
    });
  };

  // Handlers for UI components
  const toggleComponent = (component: CalciteComponentType) => {
    const current = widgetPRD.uiRequirements.preferredComponents;
    const updated = current.includes(component)
      ? current.filter((c) => c !== component)
      : [...current, component];
    updatePRD({
      uiRequirements: {
        ...widgetPRD.uiRequirements,
        preferredComponents: updated,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Functional Requirements */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="wizard-section-title">Functional Requirements</h4>
          {editable && (
            <button
              type="button"
              onClick={addRequirement}
              className="flex items-center gap-1 rounded-lg border border-wizard-border px-2 py-1 font-mono text-xs text-gray-400 transition hover:border-fiesta-turquoise/50 hover:text-fiesta-turquoise"
            >
              <Plus className="h-3 w-3" />
              Add
            </button>
          )}
        </div>

        {widgetPRD.functionalRequirements.length === 0 ? (
          <p className="font-mono text-xs text-gray-500">
            No requirements defined yet
          </p>
        ) : (
          <div className="space-y-3">
            {widgetPRD.functionalRequirements.map((req, index) => (
              <div
                key={index}
                className="flex gap-2 rounded-lg border border-wizard-border bg-geodark-secondary/40 p-3"
              >
                {editable ? (
                  <>
                    <input
                      type="text"
                      value={req.description}
                      onChange={(e) =>
                        updateRequirement(index, { description: e.target.value })
                      }
                      placeholder="Requirement description"
                      className="flex-1 bg-transparent font-mono text-xs text-gray-300 placeholder:text-gray-600 focus:outline-none"
                    />
                    <select
                      value={req.priority}
                      onChange={(e) =>
                        updateRequirement(index, {
                          priority: e.target.value as RequirementPriority,
                        })
                      }
                      className="rounded border border-wizard-border bg-geodark px-2 py-1 font-mono text-xs text-gray-300"
                    >
                      {priorityOptions.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => removeRequirement(index)}
                      className="text-gray-500 hover:text-fiesta-pink"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <p className="flex-1 font-mono text-xs text-gray-300">
                      {req.description}
                    </p>
                    <span
                      className={`rounded px-2 py-0.5 font-mono text-xs ${
                        req.priority === "High"
                          ? "bg-fiesta-pink/20 text-fiesta-pink"
                          : req.priority === "Medium"
                            ? "bg-fiesta-orange/20 text-fiesta-orange"
                            : "bg-gray-700 text-gray-400"
                      }`}
                    >
                      {req.priority}
                    </span>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Settings Configuration */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="wizard-section-title">Settings Configuration</h4>
          {editable && (
            <button
              type="button"
              onClick={addSetting}
              className="flex items-center gap-1 rounded-lg border border-wizard-border px-2 py-1 font-mono text-xs text-gray-400 transition hover:border-fiesta-turquoise/50 hover:text-fiesta-turquoise"
            >
              <Plus className="h-3 w-3" />
              Add Setting
            </button>
          )}
        </div>

        {widgetPRD.settingsConfig.settings.length === 0 ? (
          <p className="font-mono text-xs text-gray-500">
            No settings configured
          </p>
        ) : (
          <div className="space-y-3">
            {widgetPRD.settingsConfig.settings.map((setting, index) => (
              <div
                key={index}
                className="grid gap-2 rounded-lg border border-wizard-border bg-geodark-secondary/40 p-3 sm:grid-cols-3"
              >
                {editable ? (
                  <>
                    <input
                      type="text"
                      value={setting.name}
                      onChange={(e) =>
                        updateSetting(index, { name: e.target.value })
                      }
                      placeholder="Setting name"
                      className="bg-transparent font-mono text-xs text-gray-300 placeholder:text-gray-600 focus:outline-none"
                    />
                    <select
                      value={setting.type}
                      onChange={(e) =>
                        updateSetting(index, {
                          type: e.target.value as SettingType,
                        })
                      }
                      className="rounded border border-wizard-border bg-geodark px-2 py-1 font-mono text-xs text-gray-300"
                    >
                      {settingTypeOptions.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={setting.defaultValue}
                        onChange={(e) =>
                          updateSetting(index, { defaultValue: e.target.value })
                        }
                        placeholder="Default"
                        className="flex-1 bg-transparent font-mono text-xs text-gray-300 placeholder:text-gray-600 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => removeSetting(index)}
                        className="text-gray-500 hover:text-fiesta-pink"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="font-mono text-xs text-gray-300">
                      {setting.name}
                    </span>
                    <span className="font-mono text-xs text-gray-500">
                      {setting.type}
                    </span>
                    <span className="font-mono text-xs text-gray-500">
                      default: {setting.defaultValue || "-"}
                    </span>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Data Bindings */}
      <section className="space-y-4">
        <h4 className="wizard-section-title">Data Bindings</h4>
        <div className="space-y-2">
          {editable ? (
            <>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={widgetPRD.dataBindings.requiresLayerSelection}
                  onChange={(e) =>
                    updatePRD({
                      dataBindings: {
                        ...widgetPRD.dataBindings,
                        requiresLayerSelection: e.target.checked,
                      },
                    })
                  }
                  className="h-3 w-3 rounded border-wizard-border bg-geodark text-fiesta-turquoise"
                />
                <span className="font-mono text-xs text-gray-300">
                  Requires layer selection
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={widgetPRD.dataBindings.requiresFieldSelection}
                  onChange={(e) =>
                    updatePRD({
                      dataBindings: {
                        ...widgetPRD.dataBindings,
                        requiresFieldSelection: e.target.checked,
                      },
                    })
                  }
                  className="h-3 w-3 rounded border-wizard-border bg-geodark text-fiesta-turquoise"
                />
                <span className="font-mono text-xs text-gray-300">
                  Requires field selection
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={widgetPRD.dataBindings.supportsMultipleSources}
                  onChange={(e) =>
                    updatePRD({
                      dataBindings: {
                        ...widgetPRD.dataBindings,
                        supportsMultipleSources: e.target.checked,
                      },
                    })
                  }
                  className="h-3 w-3 rounded border-wizard-border bg-geodark text-fiesta-turquoise"
                />
                <span className="font-mono text-xs text-gray-300">
                  Supports multiple data sources
                </span>
              </label>
            </>
          ) : (
            <div className="font-mono text-xs text-gray-300 space-y-1">
              <p>
                Layer selection:{" "}
                {widgetPRD.dataBindings.requiresLayerSelection ? "Yes" : "No"}
              </p>
              <p>
                Field selection:{" "}
                {widgetPRD.dataBindings.requiresFieldSelection ? "Yes" : "No"}
              </p>
              <p>
                Multiple sources:{" "}
                {widgetPRD.dataBindings.supportsMultipleSources ? "Yes" : "No"}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* UI Components */}
      <section className="space-y-4">
        <h4 className="wizard-section-title">Preferred UI Components</h4>
        <div className="flex flex-wrap gap-2">
          {calciteComponents.map((component) => {
            const isSelected =
              widgetPRD.uiRequirements.preferredComponents.includes(component);
            return editable ? (
              <button
                key={component}
                type="button"
                onClick={() => toggleComponent(component)}
                className={`rounded-lg border px-3 py-1.5 font-mono text-xs transition ${
                  isSelected
                    ? "border-fiesta-turquoise bg-fiesta-turquoise/20 text-fiesta-turquoise"
                    : "border-wizard-border text-gray-400 hover:border-fiesta-turquoise/50"
                }`}
              >
                {component}
              </button>
            ) : isSelected ? (
              <span
                key={component}
                className="rounded-lg border border-fiesta-turquoise/50 bg-fiesta-turquoise/10 px-3 py-1.5 font-mono text-xs text-fiesta-turquoise"
              >
                {component}
              </span>
            ) : null;
          })}
        </div>
      </section>
    </div>
  );
}

export default PRDArtifact;
