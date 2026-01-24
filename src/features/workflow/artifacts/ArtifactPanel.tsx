/**
 * Artifact Panel Component
 * Right-side panel displaying phase-specific artifacts
 * Blueprint design aesthetic
 */

import { type ReactNode } from "react";
import { FileText, Loader2, CheckCircle, PenLine } from "lucide-react";
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
      <div className="border-b border-border bg-white px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-paper">
              <FileText className="h-4 w-4 text-ink-faint" />
            </div>
            <div>
              <h3 className="font-semibold text-ink">
                {title}
              </h3>
              <p className="font-mono text-xs text-ink-faint">{description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Status Badge */}
            <span
              className={cn(
                "stamp",
                status === "empty" && "stamp-default",
                status === "building" && "stamp-blue animate-pulse",
                status === "complete" && "stamp-success",
                status === "editing" && "stamp-red"
              )}
            >
              {status === "empty" && "Empty"}
              {status === "building" && (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Building
                </>
              )}
              {status === "complete" && (
                <>
                  <CheckCircle className="h-3 w-3" />
                  Complete
                </>
              )}
              {status === "editing" && (
                <>
                  <PenLine className="h-3 w-3" />
                  Editing
                </>
              )}
            </span>

            {/* Edit Button */}
            {status === "complete" && onEdit && (
              <button
                onClick={onEdit}
                className="btn-ghost text-xs"
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
