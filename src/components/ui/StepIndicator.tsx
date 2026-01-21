import type { LucideIcon } from "lucide-react";

import { WorkflowPhase } from "@/features/workflow/types";

type StepDefinition = {
  phase: WorkflowPhase;
  label: string;
  description: string;
  Icon: LucideIcon;
};

type StepIndicatorProps = {
  steps: StepDefinition[];
  currentPhase: WorkflowPhase;
};

const StepIndicator = ({ steps, currentPhase }: StepIndicatorProps) => {
  const currentIndex = steps.findIndex((step) => step.phase === currentPhase);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-4">
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div
              key={step.phase}
              className={`rounded-2xl border px-4 py-5 transition duration-200 ${
                isCurrent
                  ? "border-fiesta-turquoise/60 bg-geodark-secondary/80 shadow-lg shadow-fiesta-turquoise/10"
                  : isCompleted
                    ? "border-emerald-400/50 bg-geodark-secondary/50"
                    : "border-wizard-border bg-geodark"
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-full border text-base ${
                    isCurrent
                      ? "border-fiesta-turquoise/60 bg-fiesta-turquoise/10 text-fiesta-turquoise"
                      : isCompleted
                        ? "border-emerald-400/60 bg-emerald-500/10 text-emerald-200"
                        : "border-wizard-border bg-geodark-secondary text-gray-500"
                  }`}
                >
                  <step.Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-sans text-sm font-bold text-gray-100">
                    {step.label}
                  </p>
                  <p className="font-mono text-xs text-gray-500">{step.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;
