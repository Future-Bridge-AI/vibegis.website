import JSZip from "jszip";

export const packageWidget = async (files: Record<string, string>) => {
  const zip = new JSZip();
  const widgetFolder = zip.folder("widget");

  if (!widgetFolder) {
    throw new Error("Unable to create widget folder in zip.");
  }

  Object.entries(files).forEach(([path, content]) => {
    widgetFolder.file(path, content);
  });

  return zip.generateAsync({ type: "blob" });
};
