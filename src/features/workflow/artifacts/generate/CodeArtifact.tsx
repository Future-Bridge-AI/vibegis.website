/**
 * Code Artifact Component
 * Monaco editor display for generated widget code
 */

import { useState } from "react";
import { Download, Copy, Check, FileCode, FolderTree } from "lucide-react";
import Editor from "@monaco-editor/react";
import { useWorkflowStore } from "../../store";
import { cn } from "@/lib/utils";

interface CodeArtifactProps {
  onDownload?: () => void;
}

const generatedFiles = [
  { name: "manifest.json", language: "json" },
  { name: "config.ts", language: "typescript" },
  { name: "widget.tsx", language: "typescript" },
  { name: "setting.tsx", language: "typescript" },
  { name: "translations/default.ts", language: "typescript" },
];

export function CodeArtifact({ onDownload }: CodeArtifactProps) {
  const generatedCode = useWorkflowStore((state) => state.generatedCode);
  const widgetBrief = useWorkflowStore((state) => state.widgetBrief);
  const [activeFile, setActiveFile] = useState("widget.tsx");
  const [copied, setCopied] = useState(false);

  const isEmpty = !generatedCode;

  if (isEmpty) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-full bg-fiesta-turquoise/10 flex items-center justify-center">
              <FileCode className="h-8 w-8 text-fiesta-turquoise/50" />
            </div>
          </div>
          <div className="space-y-2">
            <p className="font-mono text-sm text-gray-500">
              No code generated yet
            </p>
            <p className="font-mono text-xs text-gray-600">
              Complete the previous phases and ask AI to generate your widget code
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex h-full flex-col">
      {/* File Tabs */}
      <div className="flex items-center gap-2 border-b border-wizard-border/50 px-2 py-2 overflow-x-auto">
        <FolderTree className="h-4 w-4 text-gray-500 shrink-0" />
        {generatedFiles.map((file) => (
          <button
            key={file.name}
            onClick={() => setActiveFile(file.name)}
            className={cn(
              "rounded-lg px-3 py-1.5 font-mono text-xs whitespace-nowrap transition",
              activeFile === file.name
                ? "bg-fiesta-turquoise/20 text-fiesta-turquoise"
                : "text-gray-400 hover:text-gray-300"
            )}
          >
            {file.name}
          </button>
        ))}
      </div>

      {/* Code Editor */}
      <div className="flex-1 min-h-0">
        <Editor
          height="100%"
          language="typescript"
          theme="vs-dark"
          value={generatedCode}
          options={{
            readOnly: true,
            minimap: { enabled: false },
            fontSize: 13,
            fontFamily: "'IBM Plex Mono', monospace",
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            wordWrap: "on",
            padding: { top: 16, bottom: 16 },
          }}
        />
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between border-t border-wizard-border/50 px-4 py-3">
        <div className="font-mono text-xs text-gray-500">
          {widgetBrief.name || "widget"}.zip
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 rounded-lg border border-wizard-border px-3 py-1.5 font-mono text-xs text-gray-400 transition hover:border-fiesta-turquoise/50 hover:text-fiesta-turquoise"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                Copy
              </>
            )}
          </button>
          {onDownload && (
            <button
              onClick={onDownload}
              className="flex items-center gap-2 rounded-lg bg-fiesta-turquoise px-4 py-1.5 font-mono text-xs font-bold text-geodark transition hover:bg-fiesta-turquoise/90 hover:shadow-wizard-glow"
            >
              <Download className="h-3 w-3" />
              Download ZIP
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CodeArtifact;
