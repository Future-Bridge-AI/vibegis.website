/**
 * ZIP Blob Output
 * Browser-compatible ZIP generation using JSZip
 */

import JSZip from "jszip";

import type { TemplateMap } from "../generator";

/**
 * Package generated files into a ZIP blob for browser download
 */
export const toZipBlob = async (
  files: TemplateMap,
  widgetName?: string
): Promise<Blob> => {
  const zip = new JSZip();
  const folderName = widgetName || "widget";
  const widgetFolder = zip.folder(folderName);

  if (!widgetFolder) {
    throw new Error("Unable to create widget folder in zip.");
  }

  Object.entries(files).forEach(([path, content]) => {
    widgetFolder.file(path, content);
  });

  return zip.generateAsync({ type: "blob" });
};

/**
 * Package generated files into a base64 string
 * Useful for API responses or data URIs
 */
export const toZipBase64 = async (
  files: TemplateMap,
  widgetName?: string
): Promise<string> => {
  const zip = new JSZip();
  const folderName = widgetName || "widget";
  const widgetFolder = zip.folder(folderName);

  if (!widgetFolder) {
    throw new Error("Unable to create widget folder in zip.");
  }

  Object.entries(files).forEach(([path, content]) => {
    widgetFolder.file(path, content);
  });

  return zip.generateAsync({ type: "base64" });
};

/**
 * Trigger browser download of the ZIP blob
 */
export const downloadZip = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename.endsWith(".zip") ? filename : `${filename}.zip`;
  anchor.click();
  URL.revokeObjectURL(url);
};
