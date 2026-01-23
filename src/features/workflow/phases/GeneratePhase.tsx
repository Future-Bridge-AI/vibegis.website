import { useMemo, useState } from "react";

import Editor from "@monaco-editor/react";

import { generateWidgetCode } from "@/lib/ai";
import { generateWidget, packageWidget } from "@/lib/generator";

import { useWorkflowStore } from "../store";

const formatBytes = (size: number) => `${size} B`;

type GenerationMode = "template" | "ai";

const GeneratePhase = () => {
  const workflowState = useWorkflowStore((state) => state);
  const isGenerating = useWorkflowStore((state) => state.isGenerating);
  const setGenerating = useWorkflowStore((state) => state.setGenerating);
  const aiCode = useWorkflowStore((state) => state.aiCode);
  const setAICode = useWorkflowStore((state) => state.setAICode);
  const aiArchitecture = useWorkflowStore((state) => state.aiArchitecture);
  const aiPRD = useWorkflowStore((state) => state.aiPRD);
  const error = useWorkflowStore((state) => state.error);
  const setError = useWorkflowStore((state) => state.setError);
  const aiConfigured = useWorkflowStore((state) => state.aiConfigured);

  const [generatedFiles, setGeneratedFiles] = useState<Record<string, string>>(
    {}
  );
  const [activeFile, setActiveFile] = useState<string>("");
  const [generationMode, setGenerationMode] = useState<GenerationMode>("template");

  const filesToGenerate = useMemo(() => {
    const baseFiles = [
      "manifest.json",
      "config.ts",
      "runtime/widget.tsx",
      "translations/default.ts",
    ];

    if (workflowState.widgetPRD.settingsConfig.hasSettings) {
      baseFiles.push("setting/setting.tsx");
    }

    return baseFiles;
  }, [workflowState.widgetPRD.settingsConfig.hasSettings]);

  const integrations = useMemo(() => {
    const items: string[] = [];
    if (workflowState.widgetArchitecture.jimuIntegration.usesJimuMapView) {
      items.push("JimuMapView");
    }
    if (workflowState.widgetArchitecture.jimuIntegration.usesDataSourceComponent) {
      items.push("DataSourceComponent");
    }
    if (workflowState.widgetArchitecture.jimuIntegration.publishesMessages) {
      items.push("Publishes messages");
    }
    if (workflowState.widgetArchitecture.jimuIntegration.subscribesMessages) {
      items.push("Subscribes to messages");
    }
    return items;
  }, [workflowState.widgetArchitecture.jimuIntegration]);

  const handleGenerateTemplate = () => {
    setGenerating(true);
    setError(null);

    try {
      const files = generateWidget(workflowState);
      setGeneratedFiles(files);
      const firstFile = Object.keys(files)[0];
      setActiveFile(firstFile ?? "");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to generate widget";
      setError(errorMessage);
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerateAI = async () => {
    if (!aiConfigured) {
      setError("Please configure your AI settings first (OpenRouter API key)");
      return;
    }

    setGenerating(true);
    setError(null);

    try {
      // Build PRD summary if not available from AI
      const prdSummary =
        aiPRD ||
        `
Widget: ${workflowState.widgetBrief.displayLabel}
Purpose: ${workflowState.widgetBrief.purpose}
Requirements:
${workflowState.widgetPRD.functionalRequirements.map((r) => `- [${r.priority}] ${r.description}`).join("\n")}
      `.trim();

      // Build architecture summary if not available from AI
      const archSummary =
        aiArchitecture ||
        `
Main Component: ${workflowState.widgetArchitecture.mainComponentName}
State Management: ${workflowState.widgetArchitecture.stateManagement}
Uses JimuMapView: ${workflowState.widgetArchitecture.jimuIntegration.usesJimuMapView}
Uses DataSource: ${workflowState.widgetArchitecture.jimuIntegration.usesDataSourceComponent}
Required Modules: ${workflowState.widgetArchitecture.dependencies.requiredJimuModules.join(", ")}
      `.trim();

      const response = await generateWidgetCode(archSummary, prdSummary);
      setAICode(response.content);

      // Generate the other files using templates
      const templateFiles = generateWidget(workflowState);

      // Replace widget.tsx with AI-generated code
      const files = {
        ...templateFiles,
        "runtime/widget.tsx": response.content,
      };

      setGeneratedFiles(files);
      setActiveFile("runtime/widget.tsx");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to generate AI code";
      setError(errorMessage);
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerate = () => {
    if (generationMode === "ai") {
      handleGenerateAI();
    } else {
      handleGenerateTemplate();
    }
  };

  const handleDownload = async () => {
    if (Object.keys(generatedFiles).length === 0) {
      return;
    }
    const blob = await packageWidget(
      generatedFiles,
      workflowState.widgetBrief.name || "widget"
    );
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${workflowState.widgetBrief.name || "widget"}.zip`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = async (fileName: string) => {
    const content = generatedFiles[fileName];
    if (!content) {
      return;
    }
    await navigator.clipboard.writeText(content);
  };

  const tabs = Object.keys(generatedFiles);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="wizard-section-title">Generate Phase</p>
        <h2 className="font-sans text-2xl font-bold text-gray-100">
          Generate Widget
        </h2>
        <p className="font-mono text-sm text-gray-400">
          Review the generated files, then export the widget bundle for
          deployment.
        </p>
      </div>

      <div className="wizard-card">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">
              Generation Summary
            </p>
            <h3 className="mt-2 font-sans text-lg font-bold text-gray-100">
              {workflowState.widgetBrief.displayLabel || "Untitled Widget"}
            </h3>
            <p className="font-mono text-xs text-gray-500">
              Folder name: {workflowState.widgetBrief.name || "-"}
            </p>
            <p className="mt-3 font-mono text-sm text-gray-400">
              Files to generate: {filesToGenerate.length}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {integrations.length === 0 ? (
                <span className="font-mono text-xs text-gray-600">
                  No additional integrations selected.
                </span>
              ) : (
                integrations.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-fiesta-turquoise/40 px-3 py-1 font-mono text-xs text-fiesta-turquoise"
                  >
                    {item}
                  </span>
                ))
              )}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {/* Generation Mode Toggle */}
            <div className="flex items-center gap-2 rounded-full border border-wizard-border bg-geodark-secondary/60 p-1">
              <button
                type="button"
                onClick={() => setGenerationMode("template")}
                className={`rounded-full px-4 py-2 font-mono text-xs font-semibold transition ${
                  generationMode === "template"
                    ? "bg-fiesta-turquoise text-geodark"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Template
              </button>
              <button
                type="button"
                onClick={() => setGenerationMode("ai")}
                disabled={!aiConfigured}
                className={`rounded-full px-4 py-2 font-mono text-xs font-semibold transition ${
                  generationMode === "ai"
                    ? "bg-fiesta-turquoise text-geodark"
                    : !aiConfigured
                      ? "text-gray-600 cursor-not-allowed"
                      : "text-gray-400 hover:text-white"
                }`}
                title={!aiConfigured ? "Configure AI settings first" : undefined}
              >
                AI Code {!aiConfigured && "(Setup Required)"}
              </button>
            </div>
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="rounded-full bg-fiesta-turquoise px-6 py-3 font-mono text-sm font-bold text-geodark shadow-lg shadow-fiesta-turquoise/30 transition hover:bg-fiesta-turquoise/90 hover:shadow-wizard-glow disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
            >
              {isGenerating
                ? "Generating..."
                : generationMode === "ai"
                  ? "Generate with AI"
                  : "Generate Widget"}
            </button>
          </div>
        </div>
      </div>

      {/* Mode Description */}
      <div className="rounded-2xl border border-wizard-border bg-geodark-secondary/60 p-4">
        <p className="font-mono text-xs text-gray-400">
          {generationMode === "template" ? (
            <>
              <span className="font-semibold text-gray-300">
                Template Mode:
              </span>{" "}
              Generates widget files using predefined templates with token
              replacement. Fast and predictable output.
            </>
          ) : (
            <>
              <span className="font-semibold text-gray-300">AI Mode:</span>{" "}
              Uses Claude to generate production-ready widget.tsx code based on
              your PRD and architecture. Other files use templates.
            </>
          )}
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-fiesta-pink/40 bg-fiesta-pink/10 px-4 py-3">
          <p className="font-mono text-sm text-fiesta-pink">{error}</p>
        </div>
      )}

      {aiCode && generationMode === "ai" && (
        <div className="rounded-2xl border border-fiesta-turquoise/30 bg-fiesta-turquoise/5 p-4">
          <p className="font-mono text-xs text-fiesta-turquoise">
            AI-generated widget.tsx code applied
          </p>
        </div>
      )}

      {tabs.length > 0 && (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {tabs.map((fileName) => {
              const content = generatedFiles[fileName];
              const size = content
                ? new TextEncoder().encode(content).length
                : 0;
              const isActive = activeFile === fileName;

              return (
                <button
                  key={fileName}
                  type="button"
                  onClick={() => setActiveFile(fileName)}
                  className={`rounded-full border px-4 py-2 font-mono text-xs font-semibold transition ${
                    isActive
                      ? "border-fiesta-turquoise/60 bg-fiesta-turquoise/10 text-fiesta-turquoise"
                      : "border-wizard-border text-gray-400 hover:border-fiesta-turquoise/40"
                  }`}
                >
                  {fileName} ({formatBytes(size)})
                </button>
              );
            })}
          </div>

          <div className="overflow-hidden rounded-2xl border border-wizard-border bg-geodark/60">
            <div className="flex items-center justify-between border-b border-wizard-border px-4 py-2 font-mono text-xs text-gray-500">
              <span>{activeFile}</span>
              <button
                type="button"
                onClick={() => handleCopy(activeFile)}
                className="rounded-full border border-wizard-border px-3 py-1 font-mono text-xs font-semibold text-gray-300 transition hover:border-fiesta-turquoise/50 hover:text-white"
              >
                Copy to Clipboard
              </button>
            </div>
            <Editor
              height="420px"
              theme="vs-dark"
              language={activeFile.endsWith(".json") ? "json" : "typescript"}
              value={generatedFiles[activeFile]}
              options={{ readOnly: true, minimap: { enabled: false } }}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-[auto_1fr]">
            <button
              type="button"
              onClick={handleDownload}
              className="rounded-full border border-fiesta-turquoise/60 bg-fiesta-turquoise/10 px-6 py-3 font-mono text-sm font-semibold text-fiesta-turquoise transition hover:bg-fiesta-turquoise/20 hover:shadow-wizard-glow"
            >
              Download Widget ZIP
            </button>
            <details className="rounded-2xl border border-wizard-border bg-geodark-secondary/60 px-4 py-3 font-mono text-sm text-gray-400">
              <summary className="cursor-pointer font-mono text-sm font-semibold text-gray-300">
                Installation instructions
              </summary>
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-xs text-gray-500">
                <li>Extract to client/your-extensions/widgets/</li>
                <li>Run npm run build:prod</li>
                <li>Widget appears in the Custom section</li>
              </ol>
            </details>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeneratePhase;
