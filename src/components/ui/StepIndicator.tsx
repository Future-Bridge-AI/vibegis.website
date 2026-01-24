import type { LucideIcon } from "lucide-react";
import { Check } from "lucide-react";

import { WorkflowPhase } from "@/features/workflow/types";
import { cn } from "@/lib/utils";

type StepDefinition = {
  phase: WorkflowPhase;
  label: string;
  description: string;
  Icon: LucideIcon;
  spec?: string;
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
          const stepNumber = String(index + 1).padStart(2, '0');

          return (
            <div
              key={step.phase}
              className={cn(
                "relative rounded-lg border bg-white px-4 py-4 transition-all duration-200",
                isCurrent && "border-accent-blue shadow-card ring-2 ring-accent-blue/10",
                isCompleted && "border-emerald-300 bg-emerald-50/50",
                !isCurrent && !isCompleted && "border-border"
              )}
            >
              {/* Spec label */}
              {step.spec && (
                <span className="absolute -top-2 left-3 bg-paper px-1 font-mono text-[10px] text-ink-faint">
                  {step.spec}
                </span>
              )}

              <div className="flex items-center gap-3">
                {/* Step Number / Icon */}
                <span
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-md border text-sm font-medium",
                    isCurrent && "border-accent-blue bg-accent-blue text-white",
                    isCompleted && "border-emerald-400 bg-emerald-500 text-white",
                    !isCurrent && !isCompleted && "border-border bg-paper text-ink-faint"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span className="font-mono">{stepNumber}</span>
                  )}
                </span>

                {/* Step Info */}
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "text-sm font-semibold",
                    isCurrent && "text-ink",
                    isCompleted && "text-emerald-700",
                    !isCurrent && !isCompleted && "text-ink-light"
                  )}>
                    {step.label}
                  </p>
                  <p className="font-mono text-xs text-ink-faint truncate">
                    {step.description}
                  </p>
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
