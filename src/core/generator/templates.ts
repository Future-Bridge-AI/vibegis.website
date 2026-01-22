/**
 * Widget Code Templates
 * Token placeholders are replaced during generation
 */

export const manifestTemplate = `{
  "name": "{{WIDGET_NAME}}",
  "label": "{{WIDGET_LABEL}}",
  "type": "widget",
  "version": "1.0.0",
  "exbVersion": "1.19.0",
  "author": "BMAD Generator",
  "description": "{{WIDGET_DESCRIPTION}}",
  "dependency": [{{JIMU_DEPENDENCIES}}],
  "translatedLocales": ["default"],
  "properties": {
    "hasSettingPage": {{HAS_SETTINGS}}
  }
}`;

export const configTemplate = `import { type ImmutableObject } from "jimu-core";

export interface Config {
{{SETTINGS_INTERFACE}}
}

export type IMConfig = ImmutableObject<Config>;

export const defaultConfig: Config = {
{{SETTINGS_DEFAULTS}}
};
`;

export const widgetTemplate = `import { React } from "jimu-core";
import { type AllWidgetProps } from "jimu-core";
import { type IMConfig } from "../config";
{{JIMU_ARCGIS_IMPORT}}

const {{COMPONENT_NAME}} = (props: AllWidgetProps<IMConfig>) => {
  const { config, id } = props;

  return (
    <div
      className="widget-{{WIDGET_NAME}} jimu-widget p-3"
      style={{ width: "100%", height: "100%" }}
    >
      <h3 className="text-lg font-semibold mb-2">{{WIDGET_LABEL}}</h3>
      <p className="text-sm text-gray-600">{{WIDGET_DESCRIPTION}}</p>
      {{MAP_VIEW_PLACEHOLDER}}
      {{DATA_SOURCE_PLACEHOLDER}}
    </div>
  );
};

export default {{COMPONENT_NAME}};
`;

export const settingTemplate = `import { React } from "jimu-core";
import { type AllWidgetSettingProps } from "jimu-for-builder";
import { type Config } from "../config";

const Setting = (props: AllWidgetSettingProps<Config>) => {
  const { config, onConfigChange } = props;

  return (
    <div className="widget-setting p-3">
      <h4 className="mb-2">{{WIDGET_LABEL}} Settings</h4>
      {/* Setting controls will be generated here */}
      <pre className="text-xs">{JSON.stringify(config, null, 2)}</pre>
    </div>
  );
};

export default Setting;
`;

export const translationTemplate = `export default {
  _widgetLabel: "{{WIDGET_LABEL}}"
};
`;
