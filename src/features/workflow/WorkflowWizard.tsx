/**
 * WorkflowWizard - Chat-driven BMAD Workflow
 * Split-panel layout: Chat (left) + Artifact (right)
 */

import { Boxes, Code, FileText, Search, Download } from "lucide-react";

import StepIndicator from "@/components/ui/StepIndicator";
import { useWorkflowStore } from "./store";
import { WorkflowPhase } from "./types";
import { CopilotProvider } from "./providers/CopilotProvider";
import { AIConfigPanel } from "./AIConfigPanel";

// Chat components
import { AnalyzeChat, SpecifyChat, ArchitectChat, GenerateChat } from "./chat";

// Artifact components
import {
  ArtifactPanel,
  BriefArtifact,
  PRDArtifact,
  ArchitectureArtifact,
  CodeArtifact,
} from "./artifacts";

// Code generation
import { packageWidget } from "@/lib/generator";

const workflowSteps = [
  {
    phase: WorkflowPhase.Analyze,
    label: "Analyze",
    description: "Capture the widget goal, audience, and data sources.",
    Icon: Search,
  },
  {
    phase: WorkflowPhase.Specify,
    label: "Specify",
    description: "Define detailed requirements and configuration options.",
    Icon: FileText,
  },
  {
    phase: WorkflowPhase.Architect,
    label: "Architect",
    description: "Plan the component structure and state management.",
    Icon: Boxes,
  },
  {
    phase: WorkflowPhase.Generate,
    label: "Generate",
    description: "Produce the widget code and implementation assets.",
    Icon: Code,
  },
];

const artifactConfig = {
  [WorkflowPhase.Analyze]: {
    title: "Widget Brief",
    description: "Core concept and requirements",
  },
  [WorkflowPhase.Specify]: {
    title: "Product Requirements",
    description: "Functional specs and settings",
  },
  [WorkflowPhase.Architect]: {
    title: "Architecture",
    description: "Component structure and integrations",
  },
  [WorkflowPhase.Generate]: {
    title: "Generated Code",
    description: "Production-ready widget bundle",
  },
};

function WorkflowContent() {
  const currentPhase = useWorkflowStore((state) => state.currentPhase);
  const setPhase = useWorkflowStore((state) => state.setPhase);
  const chatState = useWorkflowStore((state) => state.chatState);
  const widgetBrief = useWorkflowStore((state) => state.widgetBrief);
  const widgetPRD = useWorkflowStore((state) => state.widgetPRD);
  const widgetArchitecture = useWorkflowStore((state) => state.widgetArchitecture);
  const generatedCode = useWorkflowStore((state) => state.generatedCode);

  const currentIndex = workflowSteps.findIndex(
    (step) => step.phase === currentPhase
  );

  const phaseKey = currentPhase.toLowerCase() as keyof typeof chatState;
  const artifactStatus = chatState[phaseKey]?.artifactStatus ?? "empty";

  const handleBack = () => {
    if (currentIndex > 0) {
      setPhase(workflowSteps[currentIndex - 1].phase);
    }
  };

  const handleNext = () => {
    if (currentIndex < workflowSteps.length - 1) {
      setPhase(workflowSteps[currentIndex + 1].phase);
    }
  };

  const handleDownload = async () => {
    if (!generatedCode) return;

    try {
      const blob = await packageWidget({
        brief: widgetBrief,
        prd: widgetPRD,
        architecture: widgetArchitecture,
        code: generatedCode,
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${widgetBrief.name || "widget"}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download widget:", error);
    }
  };

  const config = artifactConfig[currentPhase];

  return (
    <main className="min-h-screen bg-geodark text-gray-100">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-8">
        {/* Header */}
        <header className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-fiesta-turquoise">
            BMAD Workflow
          </p>
          <div className="flex items-start justify-between gap-6">
            <div className="space-y-2">
              <h1 className="font-sans text-3xl font-black tracking-tight">
                ArcGIS ExB Widget Generator
              </h1>
              <p className="max-w-xl font-mono text-sm text-gray-400">
                Chat with AI to design and generate production-ready Experience
                Builder widgets.
              </p>
            </div>
            <div className="w-80 shrink-0">
              <AIConfigPanel />
            </div>
          </div>
        </header>

        {/* Step Indicator */}
        <StepIndicator steps={workflowSteps} currentPhase={currentPhase} />

        {/* Split Panel Layout */}
        <div className="grid h-[600px] grid-cols-2 gap-4 rounded-3xl border border-wizard-border bg-geodark-secondary/40 shadow-wizard-card overflow-hidden">
          {/* Left: Chat Panel */}
          <div className="flex flex-col border-r border-wizard-border/50">
            {currentPhase === WorkflowPhase.Analyze && <AnalyzeChat />}
            {currentPhase === WorkflowPhase.Specify && <SpecifyChat />}
            {currentPhase === WorkflowPhase.Architect && <ArchitectChat />}
            {currentPhase === WorkflowPhase.Generate && <GenerateChat />}
          </div>

          {/* Right: Artifact Panel */}
          <div className="flex flex-col">
            <ArtifactPanel
              title={config.title}
              description={config.description}
              status={artifactStatus}
            >
              {currentPhase === WorkflowPhase.Analyze && <BriefArtifact />}
              {currentPhase === WorkflowPhase.Specify && <PRDArtifact />}
              {currentPhase === WorkflowPhase.Architect && <ArchitectureArtifact />}
              {currentPhase === WorkflowPhase.Generate && (
                <CodeArtifact onDownload={handleDownload} />
              )}
            </ArtifactPanel>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentIndex === 0}
            className="rounded-full border border-wizard-border px-6 py-3 font-mono text-sm font-semibold text-gray-300 transition hover:border-fiesta-turquoise/50 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            Back
          </button>
          <div className="flex items-center gap-3">
            {currentIndex === workflowSteps.length - 1 ? (
              <button
                type="button"
                onClick={handleDownload}
                disabled={!generatedCode}
                className="flex items-center gap-2 rounded-full bg-fiesta-turquoise px-6 py-3 font-mono text-sm font-bold text-geodark shadow-lg shadow-fiesta-turquoise/30 transition hover:bg-fiesta-turquoise/90 hover:shadow-wizard-glow disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Download className="h-4 w-4" />
                Download Widget
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="rounded-full bg-fiesta-turquoise px-6 py-3 font-mono text-sm font-bold text-geodark transition hover:bg-fiesta-turquoise/90 hover:shadow-wizard-glow"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

const WorkflowWizard = () => {
  return (
    <CopilotProvider>
      <WorkflowContent />
    </CopilotProvider>
  );
};

export default WorkflowWizard;
