export enum WorkflowPhase {
  Analyze = "ANALYZE",
  Specify = "SPECIFY",
  Architect = "ARCHITECT",
  Generate = "GENERATE",
}

export type TargetUserType =
  | "GIS Analysts"
  | "Field Workers"
  | "Public/Citizens"
  | "Managers/Executives"
  | "Developers";

export type MapInteractionType =
  | "Click to select features"
  | "Draw geometry"
  | "View only (no interaction)"
  | "Hover to highlight";

export type DataSourceType =
  | "Feature Layer"
  | "Web Map"
  | "CSV/GeoJSON"
  | "No data source";

export type RequirementPriority = "High" | "Medium" | "Low";

export type SettingType =
  | "text"
  | "number"
  | "boolean"
  | "layer-selector"
  | "field-selector";

export type CalciteComponentType =
  | "Card"
  | "Panel"
  | "List"
  | "Table"
  | "Button"
  | "Modal"
  | "Tabs";

export type StateManagementApproach =
  | "Local React state (useState/useReducer)"
  | "Zustand store"
  | "Redux (jimu-core)";

export type MessageType =
  | "EXTENT_CHANGE"
  | "DATA_RECORDS_SELECTION_CHANGE"
  | "DATA_RECORD_SET_CHANGE"
  | "MAP_CLICK"
  | "WIDGET_STATE_CHANGE";

export type ArcgisModuleType =
  | "FeatureLayer"
  | "GraphicsLayer"
  | "Query"
  | "Geometry"
  | "Graphic"
  | "SketchViewModel"
  | "PopupTemplate";

export interface WidgetBrief {
  name: string;
  displayLabel: string;
  description: string;
  purpose: string;
  targetUsers: TargetUserType[];
  mapInteraction: MapInteractionType | "";
  dataSource: DataSourceType | "";
  keyFeatures: string;
}

export type FunctionalRequirement = {
  description: string;
  priority: RequirementPriority;
};

export type WidgetSetting = {
  name: string;
  type: SettingType;
  defaultValue: string;
};

export type SettingsConfiguration = {
  hasSettings: boolean;
  settings: WidgetSetting[];
};

export type DataBindingRequirements = {
  requiresLayerSelection: boolean;
  requiresFieldSelection: boolean;
  supportsMultipleSources: boolean;
};

export type UiRequirements = {
  preferredComponents: CalciteComponentType[];
  customStyling: boolean;
};

export interface WidgetPRD {
  functionalRequirements: FunctionalRequirement[];
  settingsConfig: SettingsConfiguration;
  dataBindings: DataBindingRequirements;
  uiRequirements: UiRequirements;
}

export type WidgetSubComponent = {
  name: string;
  purpose: string;
};

export type JimuIntegration = {
  usesJimuMapView: boolean;
  usesDataSourceComponent: boolean;
  publishesMessages: boolean;
  subscribesMessages: boolean;
  messageTypes: MessageType[];
};

export type WidgetDependencies = {
  requiredJimuModules: string[];
  additionalArcgisModules: ArcgisModuleType[];
};

export interface WidgetArchitecture {
  mainComponentName: string;
  stateManagement: StateManagementApproach;
  subComponents: WidgetSubComponent[];
  jimuIntegration: JimuIntegration;
  dependencies: WidgetDependencies;
}

export interface WorkflowState {
  currentPhase: WorkflowPhase;
  widgetBrief: WidgetBrief;
  widgetPRD: WidgetPRD;
  widgetArchitecture: WidgetArchitecture;
  generatedCode: string;
}
