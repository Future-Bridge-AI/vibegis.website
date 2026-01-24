/**
 * Artifact Panel Component
 * Right-side panel displaying phase-specific artifacts
 */

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { ArtifactStatus } from "../types";

interface ArtifactPanelProps {
  title: string;
  description: string;
  status: ArtifactStatus;
  children: ReactNode;
  onEdit?: () => void;
}

export function ArtifactPanel({
  title,
  description,
  status,
  children,
  onEdit,
}: ArtifactPanelProps) {
  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-wizard-border/50 bg-geodark-secondary/30 px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-sans text-lg font-bold text-gray-100">
              {title}
            </h3>
            <p className="font-mono text-xs text-gray-500">{description}</p>
          </div>
          <div className="flex items-center gap-2">
            {/* Status Badge */}
            <span
              className={cn(
                "rounded-full px-2 py-1 font-mono text-xs",
                status === "empty" && "bg-gray-700/50 text-gray-500",
                status === "building" &&
                  "bg-fiesta-orange/20 text-fiesta-orange animate-pulse",
                status === "complete" &&
                  "bg-fiesta-turquoise/20 text-fiesta-turquoise",
                status === "editing" && "bg-fiesta-pink/20 text-fiesta-pink"
              )}
            >
              {status === "empty" && "Empty"}
              {status === "building" && "Building..."}
              {status === "complete" && "Complete"}
              {status === "editing" && "Editing"}
            </span>

            {/* Edit Button */}
            {status === "complete" && onEdit && (
              <button
                onClick={onEdit}
                className="rounded-lg border border-wizard-border px-2 py-1 font-mono text-xs text-gray-400 transition hover:border-fiesta-turquoise/50 hover:text-fiesta-turquoise"
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">{children}</div>
    </div>
  );
}

export default ArtifactPanel;
