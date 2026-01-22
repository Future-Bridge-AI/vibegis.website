/**
 * File System Output
 * Node.js-compatible file writing for CLI usage
 *
 * NOTE: This module uses dynamic imports to avoid bundling Node.js
 * modules in the browser build. Only import this module in CLI contexts.
 */

import type { TemplateMap } from "../generator";

/**
 * File write result
 */
export interface FileWriteResult {
  success: boolean;
  path: string;
  error?: string;
}

/**
 * Output result for all files
 */
export interface OutputResult {
  outputDir: string;
  files: FileWriteResult[];
  errors: string[];
}

/**
 * Write generated files to disk
 * This function is designed for CLI usage and requires Node.js fs module
 *
 * @param files - Map of file paths to content
 * @param outputDir - Directory to write files to
 * @param widgetName - Optional widget folder name
 * @returns Promise with output results
 */
export const toFiles = async (
  files: TemplateMap,
  outputDir: string,
  widgetName?: string
): Promise<OutputResult> => {
  // Dynamic imports for Node.js modules
  const fs = await import("fs/promises");
  const path = await import("path");

  const results: FileWriteResult[] = [];
  const errors: string[] = [];

  const baseDir = widgetName
    ? path.join(outputDir, widgetName)
    : outputDir;

  // Create base directory
  try {
    await fs.mkdir(baseDir, { recursive: true });
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    errors.push(`Failed to create output directory: ${error}`);
    return { outputDir: baseDir, files: results, errors };
  }

  // Write each file
  for (const [filePath, content] of Object.entries(files)) {
    const fullPath = path.join(baseDir, filePath);
    const dir = path.dirname(fullPath);

    try {
      // Ensure subdirectory exists
      await fs.mkdir(dir, { recursive: true });

      // Write file
      await fs.writeFile(fullPath, content, "utf-8");

      results.push({
        success: true,
        path: fullPath,
      });
    } catch (err) {
      const error = err instanceof Error ? err.message : String(err);
      results.push({
        success: false,
        path: fullPath,
        error,
      });
      errors.push(`Failed to write ${filePath}: ${error}`);
    }
  }

  return { outputDir: baseDir, files: results, errors };
};

/**
 * Check if output directory exists and is writable
 */
export const checkOutputDir = async (
  outputDir: string
): Promise<{ exists: boolean; writable: boolean; error?: string }> => {
  const fs = await import("fs/promises");

  try {
    await fs.access(outputDir);
    // Try to write a test file
    const testFile = `${outputDir}/.vibegis-test`;
    await fs.writeFile(testFile, "");
    await fs.unlink(testFile);
    return { exists: true, writable: true };
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    if (error.includes("ENOENT")) {
      return { exists: false, writable: false, error: "Directory does not exist" };
    }
    return { exists: true, writable: false, error };
  }
};

/**
 * Format output results for CLI display
 */
export const formatOutputResults = (result: OutputResult): string => {
  const lines: string[] = [];

  lines.push(`Output directory: ${result.outputDir}`);
  lines.push("");

  if (result.files.length > 0) {
    lines.push("Generated files:");
    for (const file of result.files) {
      const status = file.success ? "+" : "x";
      const relativePath = file.path.replace(result.outputDir, "").replace(/^[/\\]/, "");
      lines.push(`  ${status} ${relativePath}${file.error ? ` (${file.error})` : ""}`);
    }
  }

  if (result.errors.length > 0) {
    lines.push("");
    lines.push("Errors:");
    for (const error of result.errors) {
      lines.push(`  - ${error}`);
    }
  }

  return lines.join("\n");
};
