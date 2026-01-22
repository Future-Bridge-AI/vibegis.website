import { analyzeWidgetIdea } from "@/lib/anthropic";

import { useWorkflowStore } from "../store";
import type {
  DataSourceType,
  MapInteractionType,
  TargetUserType,
} from "../types";

const targetUsers: TargetUserType[] = [
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

const AnalyzePhase = () => {
  const widgetBrief = useWorkflowStore((state) => state.widgetBrief);
  const updateBrief = useWorkflowStore((state) => state.updateBrief);
  const isAnalyzing = useWorkflowStore((state) => state.isAnalyzing);
  const setAnalyzing = useWorkflowStore((state) => state.setAnalyzing);
  const aiAnalysis = useWorkflowStore((state) => state.aiAnalysis);
  const setAIAnalysis = useWorkflowStore((state) => state.setAIAnalysis);
  const error = useWorkflowStore((state) => state.error);
  const setError = useWorkflowStore((state) => state.setError);

  const toggleTargetUser = (user: TargetUserType) => {
    const nextUsers = widgetBrief.targetUsers.includes(user)
      ? widgetBrief.targetUsers.filter((item) => item !== user)
      : [...widgetBrief.targetUsers, user];

    updateBrief({ targetUsers: nextUsers });
  };

  const handleAskAI = async () => {
    // Build widget idea from current brief
    const widgetIdea = `
Widget: ${widgetBrief.displayLabel || widgetBrief.name || "Unnamed Widget"}
Description: ${widgetBrief.description || "No description provided"}
Purpose: ${widgetBrief.purpose || "No purpose specified"}
Target Users: ${widgetBrief.targetUsers.length > 0 ? widgetBrief.targetUsers.join(", ") : "Not specified"}
Map Interaction: ${widgetBrief.mapInteraction || "Not specified"}
Data Source: ${widgetBrief.dataSource || "Not specified"}
Key Features: ${widgetBrief.keyFeatures || "Not specified"}
    `.trim();

    setAnalyzing(true);
    setError(null);

    try {
      const response = await analyzeWidgetIdea(widgetIdea);
      setAIAnalysis(response.content);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to analyze widget idea";
      setError(errorMessage);
    } finally {
      setAnalyzing(false);
    }
  };

  const canAskAI =
    widgetBrief.name.trim() !== "" || widgetBrief.displayLabel.trim() !== "";

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="wizard-section-title">Analyze Phase</p>
        <h2 className="font-sans text-2xl font-bold text-gray-100">
          Widget Brief
        </h2>
        <p className="font-mono text-sm text-gray-400">
          Capture the widget concept, audience, and data inputs before designing
          features.
        </p>
      </div>

      <form className="space-y-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-2">
            <label
              className="font-mono text-sm font-semibold text-gray-300"
              htmlFor="widget-name"
            >
              Widget Name
            </label>
            <input
              id="widget-name"
              type="text"
              value={widgetBrief.name}
              onChange={(event) => updateBrief({ name: event.target.value })}
              placeholder="e.g. incident-summary"
              className="wizard-input w-full"
            />
          </div>
          <div className="space-y-2">
            <label
              className="font-mono text-sm font-semibold text-gray-300"
              htmlFor="display-label"
            >
              Display Label
            </label>
            <input
              id="display-label"
              type="text"
              value={widgetBrief.displayLabel}
              onChange={(event) =>
                updateBrief({ displayLabel: event.target.value })
              }
              placeholder="e.g. Incident Summary"
              className="wizard-input w-full"
            />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-2">
            <label
              className="font-mono text-sm font-semibold text-gray-300"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              value={widgetBrief.description}
              onChange={(event) =>
                updateBrief({ description: event.target.value })
              }
              placeholder="Explain what the widget does."
              className="wizard-input w-full resize-none"
            />
          </div>
          <div className="space-y-2">
            <label
              className="font-mono text-sm font-semibold text-gray-300"
              htmlFor="purpose"
            >
              Purpose
            </label>
            <textarea
              id="purpose"
              rows={4}
              value={widgetBrief.purpose}
              onChange={(event) => updateBrief({ purpose: event.target.value })}
              placeholder="Describe the problem it solves."
              className="wizard-input w-full resize-none"
            />
          </div>
        </div>

        <div className="border-t border-wizard-border/80 pt-6">
          <div className="space-y-4">
            <p className="font-mono text-sm font-semibold text-gray-300">
              Target Users
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {targetUsers.map((user) => (
                <label
                  key={user}
                  className="flex items-center gap-3 rounded-xl border border-wizard-border bg-geodark-secondary/60 px-4 py-3 font-mono text-sm text-gray-300"
                >
                  <input
                    type="checkbox"
                    checked={widgetBrief.targetUsers.includes(user)}
                    onChange={() => toggleTargetUser(user)}
                    className="h-4 w-4 rounded border-wizard-border bg-geodark text-fiesta-turquoise focus:ring-fiesta-turquoise/60"
                  />
                  <span>{user}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-6 border-t border-wizard-border/80 pt-6 lg:grid-cols-2">
          <div className="space-y-4">
            <p className="font-mono text-sm font-semibold text-gray-300">
              Map Interaction Type
            </p>
            <div className="space-y-3">
              {mapInteractionOptions.map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-3 rounded-xl border border-wizard-border bg-geodark-secondary/60 px-4 py-3 font-mono text-sm text-gray-300"
                >
                  <input
                    type="radio"
                    name="map-interaction"
                    value={option}
                    checked={widgetBrief.mapInteraction === option}
                    onChange={() => updateBrief({ mapInteraction: option })}
                    className="h-4 w-4 border-wizard-border bg-geodark text-fiesta-turquoise focus:ring-fiesta-turquoise/60"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <p className="font-mono text-sm font-semibold text-gray-300">
              Data Source Type
            </p>
            <div className="space-y-3">
              {dataSourceOptions.map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-3 rounded-xl border border-wizard-border bg-geodark-secondary/60 px-4 py-3 font-mono text-sm text-gray-300"
                >
                  <input
                    type="radio"
                    name="data-source"
                    value={option}
                    checked={widgetBrief.dataSource === option}
                    onChange={() => updateBrief({ dataSource: option })}
                    className="h-4 w-4 border-wizard-border bg-geodark text-fiesta-turquoise focus:ring-fiesta-turquoise/60"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-wizard-border/80 pt-6">
          <div className="space-y-2">
            <label
              className="font-mono text-sm font-semibold text-gray-300"
              htmlFor="key-features"
            >
              Key Features
            </label>
            <textarea
              id="key-features"
              rows={4}
              value={widgetBrief.keyFeatures}
              onChange={(event) =>
                updateBrief({ keyFeatures: event.target.value })
              }
              placeholder="List the main capabilities and workflow steps."
              className="wizard-input w-full resize-none"
            />
          </div>
        </div>
      </form>

      {/* AI Analysis Section */}
      <div className="border-t border-wizard-border/80 pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="font-mono text-sm font-semibold text-gray-300">
                AI Analysis
              </h3>
              <p className="font-mono text-xs text-gray-500">
                Get AI-powered clarifying questions to refine your widget
                concept.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAskAI}
              disabled={!canAskAI || isAnalyzing}
              className="rounded-full bg-fiesta-turquoise px-6 py-3 font-mono text-sm font-bold text-geodark shadow-lg shadow-fiesta-turquoise/30 transition hover:bg-fiesta-turquoise/90 hover:shadow-wizard-glow disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
            >
              {isAnalyzing ? "Analyzing..." : "Ask AI"}
            </button>
          </div>

          {error && (
            <div className="rounded-xl border border-fiesta-pink/40 bg-fiesta-pink/10 px-4 py-3">
              <p className="font-mono text-sm text-fiesta-pink">{error}</p>
            </div>
          )}

          {aiAnalysis && (
            <div className="rounded-2xl border border-wizard-border bg-geodark-secondary/60 p-4">
              <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-fiesta-turquoise">
                AI Questions & Insights
              </p>
              <div className="prose prose-invert prose-sm max-w-none">
                <pre className="whitespace-pre-wrap font-mono text-sm text-gray-300">
                  {aiAnalysis}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyzePhase;
