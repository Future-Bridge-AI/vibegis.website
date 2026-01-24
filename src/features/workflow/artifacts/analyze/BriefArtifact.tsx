/**
 * Brief Artifact Component
 * Editable widget brief for the Analyze phase
 */

import { useWorkflowStore } from "../../store";
import type {
  TargetUserType,
  MapInteractionType,
  DataSourceType,
} from "../../types";

const targetUserOptions: TargetUserType[] = [
  "GIS Analysts",
  "Field Workers",
  "Public/Citizens",
  "Managers/Executives",
  "Developers",
];

const mapInteractionOptions: MapInteractionType[] = [
  "Click to select features",
  "Draw geometry",
  "View only (no interaction)",
  "Hover to highlight",
];

const dataSourceOptions: DataSourceType[] = [
  "Feature Layer",
  "Web Map",
  "CSV/GeoJSON",
  "No data source",
];

interface BriefArtifactProps {
  editable?: boolean;
}

export function BriefArtifact({ editable = true }: BriefArtifactProps) {
  const widgetBrief = useWorkflowStore((state) => state.widgetBrief);
  const updateBrief = useWorkflowStore((state) => state.updateBrief);

  const toggleTargetUser = (user: TargetUserType) => {
    const nextUsers = widgetBrief.targetUsers.includes(user)
      ? widgetBrief.targetUsers.filter((item) => item !== user)
      : [...widgetBrief.targetUsers, user];
    updateBrief({ targetUsers: nextUsers });
  };

  // Check if brief has any content
  const isEmpty =
    !widgetBrief.name &&
    !widgetBrief.displayLabel &&
    !widgetBrief.description &&
    !widgetBrief.purpose;

  if (isEmpty && !editable) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center space-y-2">
          <p className="font-mono text-sm text-gray-500">
            Start chatting to build your widget brief
          </p>
          <p className="font-mono text-xs text-gray-600">
            The AI will help you define your widget concept
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Widget Identity */}
      <section className="space-y-4">
        <h4 className="wizard-section-title">Widget Identity</h4>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="font-mono text-xs font-semibold text-gray-400">
              Widget Name
            </label>
            {editable ? (
              <input
                type="text"
                value={widgetBrief.name}
                onChange={(e) => updateBrief({ name: e.target.value })}
                placeholder="e.g. incident-summary"
                className="wizard-input w-full text-sm"
              />
            ) : (
              <p className="font-mono text-sm text-gray-300">
                {widgetBrief.name || "-"}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label className="font-mono text-xs font-semibold text-gray-400">
              Display Label
            </label>
            {editable ? (
              <input
                type="text"
                value={widgetBrief.displayLabel}
                onChange={(e) => updateBrief({ displayLabel: e.target.value })}
                placeholder="e.g. Incident Summary"
                className="wizard-input w-full text-sm"
              />
            ) : (
              <p className="font-mono text-sm text-gray-300">
                {widgetBrief.displayLabel || "-"}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Description & Purpose */}
      <section className="space-y-4">
        <h4 className="wizard-section-title">Description & Purpose</h4>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="font-mono text-xs font-semibold text-gray-400">
              Description
            </label>
            {editable ? (
              <textarea
                value={widgetBrief.description}
                onChange={(e) => updateBrief({ description: e.target.value })}
                placeholder="What does this widget do?"
                rows={3}
                className="wizard-input w-full text-sm resize-none"
              />
            ) : (
              <p className="font-mono text-sm text-gray-300 whitespace-pre-wrap">
                {widgetBrief.description || "-"}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label className="font-mono text-xs font-semibold text-gray-400">
              Purpose
            </label>
            {editable ? (
              <textarea
                value={widgetBrief.purpose}
                onChange={(e) => updateBrief({ purpose: e.target.value })}
                placeholder="What problem does it solve?"
                rows={3}
                className="wizard-input w-full text-sm resize-none"
              />
            ) : (
              <p className="font-mono text-sm text-gray-300 whitespace-pre-wrap">
                {widgetBrief.purpose || "-"}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Target Users */}
      <section className="space-y-4">
        <h4 className="wizard-section-title">Target Users</h4>
        <div className="flex flex-wrap gap-2">
          {targetUserOptions.map((user) => {
            const isSelected = widgetBrief.targetUsers.includes(user);
            return editable ? (
              <button
                key={user}
                type="button"
                onClick={() => toggleTargetUser(user)}
                className={`rounded-lg border px-3 py-1.5 font-mono text-xs transition ${
                  isSelected
                    ? "border-fiesta-turquoise bg-fiesta-turquoise/20 text-fiesta-turquoise"
                    : "border-wizard-border text-gray-400 hover:border-fiesta-turquoise/50"
                }`}
              >
                {user}
              </button>
            ) : isSelected ? (
              <span
                key={user}
                className="rounded-lg border border-fiesta-turquoise/50 bg-fiesta-turquoise/10 px-3 py-1.5 font-mono text-xs text-fiesta-turquoise"
              >
                {user}
              </span>
            ) : null;
          })}
        </div>
      </section>

      {/* Map Interaction */}
      <section className="space-y-4">
        <h4 className="wizard-section-title">Map Interaction</h4>
        {editable ? (
          <div className="grid gap-2 sm:grid-cols-2">
            {mapInteractionOptions.map((option) => (
              <label
                key={option}
                className="flex items-center gap-2 rounded-lg border border-wizard-border bg-geodark-secondary/40 px-3 py-2 cursor-pointer hover:border-fiesta-turquoise/30 transition"
              >
                <input
                  type="radio"
                  name="mapInteraction"
                  value={option}
                  checked={widgetBrief.mapInteraction === option}
                  onChange={() => updateBrief({ mapInteraction: option })}
                  className="h-3 w-3 border-wizard-border bg-geodark text-fiesta-turquoise focus:ring-fiesta-turquoise/60"
                />
                <span className="font-mono text-xs text-gray-300">{option}</span>
              </label>
            ))}
          </div>
        ) : (
          <p className="font-mono text-sm text-gray-300">
            {widgetBrief.mapInteraction || "-"}
          </p>
        )}
      </section>

      {/* Data Source */}
      <section className="space-y-4">
        <h4 className="wizard-section-title">Data Source</h4>
        {editable ? (
          <div className="grid gap-2 sm:grid-cols-2">
            {dataSourceOptions.map((option) => (
              <label
                key={option}
                className="flex items-center gap-2 rounded-lg border border-wizard-border bg-geodark-secondary/40 px-3 py-2 cursor-pointer hover:border-fiesta-turquoise/30 transition"
              >
                <input
                  type="radio"
                  name="dataSource"
                  value={option}
                  checked={widgetBrief.dataSource === option}
                  onChange={() => updateBrief({ dataSource: option })}
                  className="h-3 w-3 border-wizard-border bg-geodark text-fiesta-turquoise focus:ring-fiesta-turquoise/60"
                />
                <span className="font-mono text-xs text-gray-300">{option}</span>
              </label>
            ))}
          </div>
        ) : (
          <p className="font-mono text-sm text-gray-300">
            {widgetBrief.dataSource || "-"}
          </p>
        )}
      </section>

      {/* Key Features */}
      <section className="space-y-4">
        <h4 className="wizard-section-title">Key Features</h4>
        {editable ? (
          <textarea
            value={widgetBrief.keyFeatures}
            onChange={(e) => updateBrief({ keyFeatures: e.target.value })}
            placeholder="List the main capabilities and workflow steps"
            rows={4}
            className="wizard-input w-full text-sm resize-none"
          />
        ) : (
          <p className="font-mono text-sm text-gray-300 whitespace-pre-wrap">
            {widgetBrief.keyFeatures || "-"}
          </p>
        )}
      </section>
    </div>
  );
}

export default BriefArtifact;
