/**
 * Core Output - Barrel Export
 *
 * Note: toFiles.ts uses Node.js modules and should only be imported in CLI contexts.
 * The browser build will use toZipBlob.ts.
 */
export * from "./toZipBlob";

// Re-export types from toFiles for type checking
// The actual implementation requires Node.js
export type { FileWriteResult, OutputResult } from "./toFiles";
