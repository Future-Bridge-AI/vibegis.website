import { Boxes, Code, FileText, Search } from "lucide-react";

import StepIndicator from "@/components/ui/StepIndicator";
import AnalyzePhase from "./phases/AnalyzePhase";
import ArchitectPhase from "./phases/ArchitectPhase";
import GeneratePhase from "./phases/GeneratePhase";
import SpecifyPhase from "./phases/SpecifyPhase";
import { useWorkflowStore } from "./store";
import { WorkflowPhase } from "./types";

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

const phaseContent: Record<WorkflowPhase, string> = {
  [WorkflowPhase.Analyze]:
    "Summarize the widget concept, intended users, and data inputs before designing features.",
  [WorkflowPhase.Specify]:
    "Translate the brief into functional requirements, settings, and data bindings.",
  [WorkflowPhase.Architect]:
    "Break the solution into files, components, and state responsibilities.",
  [WorkflowPhase.Generate]:
    "Finalize the architecture and generate the widget implementation bundle.",
};

const WorkflowWizard = () => {
  const currentPhase = useWorkflowStore((state) => state.currentPhase);
  const setPhase = useWorkflowStore((state) => state.setPhase);

  const currentIndex = workflowSteps.findIndex(
    (step) => step.phase === currentPhase,
  );

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

  return (
    <main className="min-h-screen bg-geodark text-gray-100">
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-16">
        <header className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-fiesta-turquoise">
            BMAD Workflow
          </p>
          <div className="space-y-2">
            <h1 className="font-sans text-4xl font-black tracking-tight">
              ArcGIS ExB Widget Generator
            </h1>
            <p className="max-w-2xl font-mono text-base text-gray-400">
              Move through the BMAD phases to shape the widget brief, define
              requirements, design the architecture, and generate production-ready
              code.
            </p>
          </div>
        </header>

        <StepIndicator steps={workflowSteps} currentPhase={currentPhase} />

        <div className="rounded-3xl border border-wizard-border bg-geodark-secondary/40 p-8 shadow-wizard-card">
          {currentPhase === WorkflowPhase.Analyze ? (
            <AnalyzePhase />
          ) : currentPhase === WorkflowPhase.Specify ? (
            <SpecifyPhase />
          ) : currentPhase === WorkflowPhase.Architect ? (
            <ArchitectPhase />
          ) : currentPhase === WorkflowPhase.Generate ? (
            <GeneratePhase />
          ) : (
            <div className="space-y-3">
              <p className="wizard-section-title">
                Current Phase
              </p>
              <h2 className="font-sans text-2xl font-bold">
                {workflowSteps[currentIndex].label}
              </h2>
              <p className="max-w-2xl font-mono text-sm text-gray-400">
                {phaseContent[currentPhase]}
              </p>
              <div className="mt-6 rounded-2xl border border-dashed border-wizard-border bg-geodark/60 px-6 py-8 font-mono text-sm text-gray-500">
                Placeholder content for the {workflowSteps[currentIndex].label} phase.
                Detailed inputs and outputs will appear here.
              </div>
            </div>
          )}
        </div>

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
                className="rounded-full bg-fiesta-turquoise px-6 py-3 font-mono text-sm font-bold text-geodark shadow-lg shadow-fiesta-turquoise/30 transition hover:bg-fiesta-turquoise/90 hover:shadow-wizard-glow"
              >
                Generate Widget
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
};

export default WorkflowWizard;
