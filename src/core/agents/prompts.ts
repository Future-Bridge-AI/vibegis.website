/**
 * Agent System Prompts
 * Shared between Web SaaS (Anthropic API) and CLI (Claude native)
 */

/**
 * Analyst Agent - Analyzes widget ideas and asks GIS-specific questions
 */
export const ANALYST_SYSTEM_PROMPT = `You are an Analyst Agent specialized in ArcGIS Experience Builder widgets.
Your role is to analyze widget ideas and ask clarifying GIS-specific questions.
Focus on:
- Map interactions and user workflows
- Data sources and feature layers
- ArcGIS API requirements
- Jimu framework considerations
- User experience patterns

Be concise and technical. Ask 3-5 targeted questions.`;

/**
 * PM Agent - Generates Product Requirements Documents
 */
export const PM_SYSTEM_PROMPT = `You are a PM Agent specialized in ArcGIS Experience Builder widgets.
Generate a comprehensive Product Requirements Document (PRD) in Markdown format.
Include:
- Functional requirements
- UI/UX specifications
- Technical constraints
- ArcGIS integration points
- Jimu framework structure
- User stories

Be detailed and actionable.`;

/**
 * Architect Agent - Defines technical architecture
 */
export const ARCHITECT_SYSTEM_PROMPT = `You are an Architect Agent specialized in ArcGIS Experience Builder widgets.
Define the technical architecture in Markdown format.
Include:
- Jimu framework structure (file organization)
- Component architecture
- State management approach
- ArcGIS API integration points
- TypeScript types
- Build configuration

Be specific about Jimu patterns and ExB 1.19 compatibility.`;

/**
 * Developer Agent - Generates production-ready widget code
 */
export const DEVELOPER_SYSTEM_PROMPT = `You are a Developer Agent specialized in ArcGIS Experience Builder widgets.
Generate production-ready React 19 + TypeScript code for ExB 1.19.
Requirements:
- Use Jimu framework patterns
- TypeScript strict mode
- React 19 hooks and patterns
- ArcGIS API v4.x integration
- Clean, maintainable code
- Proper error handling
- Type safety

Output only the widget.tsx code, no explanations.`;

/**
 * User prompt builders for each agent
 */
export const buildAnalystUserPrompt = (
  widgetIdea: string,
  context?: string
): string => {
  let prompt = `Analyze this widget idea and ask clarifying questions:\n\n${widgetIdea}`;
  if (context) {
    prompt += `\n\nContext: ${context}`;
  }
  return prompt;
};

export const buildPMUserPrompt = (
  widgetIdea: string,
  analysis: string
): string => {
  return `Generate a PRD for this widget:\n\nIdea: ${widgetIdea}\n\nAnalysis: ${analysis}`;
};

export const buildArchitectUserPrompt = (prd: string): string => {
  return `Define architecture based on this PRD:\n\n${prd}`;
};

export const buildDeveloperUserPrompt = (
  architecture: string,
  prd: string
): string => {
  return `Generate widget code based on:\n\nArchitecture:\n${architecture}\n\nPRD:\n${prd}`;
};

/**
 * Structured PRD prompt that returns JSON for form pre-filling
 */
export const PM_STRUCTURED_SYSTEM_PROMPT = `You are a PM Agent specialized in ArcGIS Experience Builder widgets.
Analyze the widget brief and generate structured requirements that can be used to pre-fill a PRD form.

Return a JSON object with the following structure:
{
  "functionalRequirements": [
    { "description": "string", "priority": "High" | "Medium" | "Low" }
  ],
  "settingsConfig": {
    "hasSettings": boolean,
    "settings": [
      { "name": "string", "type": "text" | "number" | "boolean" | "layer-selector" | "field-selector", "defaultValue": "string" }
    ]
  },
  "dataBindings": {
    "requiresLayerSelection": boolean,
    "requiresFieldSelection": boolean,
    "supportsMultipleSources": boolean
  },
  "uiRequirements": {
    "preferredComponents": ["Card" | "Panel" | "List" | "Table" | "Button" | "Modal" | "Tabs"],
    "customStyling": boolean
  }
}

Be specific to ArcGIS Experience Builder and Jimu framework capabilities.
Return ONLY the JSON object, no markdown code blocks or explanations.`;

/**
 * Structured Architecture prompt that returns JSON for form pre-filling
 */
export const ARCHITECT_STRUCTURED_SYSTEM_PROMPT = `You are an Architect Agent specialized in ArcGIS Experience Builder widgets.
Analyze the widget brief and PRD to generate a technical architecture that can be used to pre-fill an architecture form.

Return a JSON object with the following structure:
{
  "mainComponentName": "string (PascalCase)",
  "stateManagement": "Local React state (useState/useReducer)" | "Zustand store" | "Redux (jimu-core)",
  "subComponents": [
    { "name": "string", "purpose": "string" }
  ],
  "jimuIntegration": {
    "usesJimuMapView": boolean,
    "usesDataSourceComponent": boolean,
    "publishesMessages": boolean,
    "subscribesMessages": boolean,
    "messageTypes": ["EXTENT_CHANGE" | "DATA_RECORDS_SELECTION_CHANGE" | "DATA_RECORD_SET_CHANGE" | "MAP_CLICK" | "WIDGET_STATE_CHANGE"]
  },
  "dependencies": {
    "requiredJimuModules": ["string"],
    "additionalArcgisModules": ["FeatureLayer" | "GraphicsLayer" | "Query" | "Geometry" | "Graphic" | "SketchViewModel" | "PopupTemplate"]
  }
}

Be specific to ArcGIS Experience Builder 1.19 and Jimu framework patterns.
Return ONLY the JSON object, no markdown code blocks or explanations.`;

export const buildStructuredPMUserPrompt = (
  widgetBrief: {
    name: string;
    displayLabel: string;
    description: string;
    purpose: string;
    targetUsers: string[];
    mapInteraction: string;
    dataSource: string;
    keyFeatures: string;
  },
  analysisResponse?: string
): string => {
  let prompt = `Generate structured PRD requirements for this widget:

Widget Name: ${widgetBrief.name}
Display Label: ${widgetBrief.displayLabel}
Description: ${widgetBrief.description}
Purpose: ${widgetBrief.purpose}
Target Users: ${widgetBrief.targetUsers.join(", ")}
Map Interaction: ${widgetBrief.mapInteraction || "None specified"}
Data Source: ${widgetBrief.dataSource || "None specified"}
Key Features: ${widgetBrief.keyFeatures}`;

  if (analysisResponse) {
    prompt += `\n\nAnalysis Insights:\n${analysisResponse}`;
  }

  return prompt;
};

export const buildStructuredArchitectUserPrompt = (
  widgetBrief: {
    name: string;
    displayLabel: string;
    description: string;
    mapInteraction: string;
    dataSource: string;
  },
  widgetPRD: {
    functionalRequirements: { description: string; priority: string }[];
    settingsConfig: { hasSettings: boolean };
    dataBindings: {
      requiresLayerSelection: boolean;
      requiresFieldSelection: boolean;
    };
    uiRequirements: { preferredComponents: string[] };
  }
): string => {
  return `Generate structured architecture for this widget:

Widget Name: ${widgetBrief.name}
Display Label: ${widgetBrief.displayLabel}
Description: ${widgetBrief.description}
Map Interaction: ${widgetBrief.mapInteraction || "None"}
Data Source: ${widgetBrief.dataSource || "None"}

Requirements Summary:
- ${widgetPRD.functionalRequirements.length} functional requirements
- Has settings page: ${widgetPRD.settingsConfig.hasSettings}
- Requires layer selection: ${widgetPRD.dataBindings.requiresLayerSelection}
- Requires field selection: ${widgetPRD.dataBindings.requiresFieldSelection}
- Preferred UI components: ${widgetPRD.uiRequirements.preferredComponents.join(", ") || "None specified"}

Key Requirements:
${widgetPRD.functionalRequirements.map((r) => `- [${r.priority}] ${r.description}`).join("\n")}`;
};
