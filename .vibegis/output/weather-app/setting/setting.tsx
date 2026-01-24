/** @jsx jsx */
import { jsx } from 'jimu-core'
import { type AllWidgetSettingProps } from 'jimu-for-builder'
import {
  MapWidgetSelector,
  SettingSection,
  SettingRow
} from 'jimu-ui/advanced/setting-components'
import { DataSourceSelector } from 'jimu-ui/advanced/data-source-selector'
import { FieldSelector } from 'jimu-ui/advanced/field-selector'
import { TextInput, NumericInput, Switch, Select, Option, Label } from 'jimu-ui'
import { type IMConfig, defaultConfig } from '../config'
import { type DataSource, Immutable, type UseDataSource, DataSourceTypes } from 'jimu-core'

const Setting = (props: AllWidgetSettingProps<IMConfig>): JSX.Element => {
  const { config, onSettingChange, useDataSources, useMapWidgetIds, id } = props

  const currentConfig = config || Immutable(defaultConfig)

  // Update config helper
  const updateConfig = <K extends keyof IMConfig>(key: K, value: IMConfig[K]): void => {
    onSettingChange({
      id,
      config: currentConfig.set(key, value)
    })
  }

  // Handle data source change
  const handleDataSourceChange = (useDataSources: UseDataSource[]): void => {
    if (useDataSources && useDataSources.length > 0) {
      onSettingChange({
        id,
        useDataSources
      })
      updateConfig('dataSourceId', useDataSources[0].dataSourceId)
    }
  }

  // Handle map widget selection
  const handleMapWidgetChange = (useMapWidgetIds: string[]): void => {
    onSettingChange({
      id,
      useMapWidgetIds
    })
  }

  // Get the current data source for field selectors
  const currentDataSource = useDataSources?.[0]

  return (
    <div className="weather-viewer-settings" style={{ padding: '0' }}>
      {/* Map Connection */}
      <SettingSection title="Map Connection">
        <SettingRow label="Select Map Widget">
          <MapWidgetSelector
            useMapWidgetIds={useMapWidgetIds}
            onSelect={handleMapWidgetChange}
          />
        </SettingRow>
      </SettingSection>

      {/* Data Source */}
      <SettingSection title="Weather Data Source">
        <SettingRow flow="wrap" label="Feature Layer">
          <DataSourceSelector
            types={Immutable([DataSourceTypes.FeatureLayer])}
            useDataSources={useDataSources}
            onChange={handleDataSourceChange}
            widgetId={id}
            mustUseDataSource
          />
        </SettingRow>
      </SettingSection>

      {/* Field Mapping */}
      {currentDataSource && (
        <SettingSection title="Field Mapping">
          <SettingRow flow="wrap" label="Temperature Field *">
            <FieldSelector
              useDataSources={useDataSources}
              onChange={(allSelectedFields) => {
                if (allSelectedFields?.length > 0) {
                  updateConfig('temperatureField', allSelectedFields[0].jimuName)
                }
              }}
              selectedFields={
                currentConfig.temperatureField
                  ? Immutable([currentConfig.temperatureField])
                  : Immutable([])
              }
              isMultiple={false}
              types={Immutable(['number'])}
            />
          </SettingRow>

          <SettingRow flow="wrap" label="Humidity Field">
            <FieldSelector
              useDataSources={useDataSources}
              onChange={(allSelectedFields) => {
                updateConfig(
                  'humidityField',
                  allSelectedFields?.length > 0 ? allSelectedFields[0].jimuName : null
                )
              }}
              selectedFields={
                currentConfig.humidityField
                  ? Immutable([currentConfig.humidityField])
                  : Immutable([])
              }
              isMultiple={false}
              types={Immutable(['number'])}
            />
          </SettingRow>

          <SettingRow flow="wrap" label="Wind Speed Field">
            <FieldSelector
              useDataSources={useDataSources}
              onChange={(allSelectedFields) => {
                updateConfig(
                  'windSpeedField',
                  allSelectedFields?.length > 0 ? allSelectedFields[0].jimuName : null
                )
              }}
              selectedFields={
                currentConfig.windSpeedField
                  ? Immutable([currentConfig.windSpeedField])
                  : Immutable([])
              }
              isMultiple={false}
              types={Immutable(['number'])}
            />
          </SettingRow>

          <SettingRow flow="wrap" label="Conditions Field">
            <FieldSelector
              useDataSources={useDataSources}
              onChange={(allSelectedFields) => {
                updateConfig(
                  'conditionsField',
                  allSelectedFields?.length > 0 ? allSelectedFields[0].jimuName : null
                )
              }}
              selectedFields={
                currentConfig.conditionsField
                  ? Immutable([currentConfig.conditionsField])
                  : Immutable([])
              }
              isMultiple={false}
              types={Immutable(['string'])}
            />
          </SettingRow>

          <SettingRow flow="wrap" label="Alert Type Field">
            <FieldSelector
              useDataSources={useDataSources}
              onChange={(allSelectedFields) => {
                updateConfig(
                  'alertTypeField',
                  allSelectedFields?.length > 0 ? allSelectedFields[0].jimuName : null
                )
              }}
              selectedFields={
                currentConfig.alertTypeField
                  ? Immutable([currentConfig.alertTypeField])
                  : Immutable([])
              }
              isMultiple={false}
              types={Immutable(['string'])}
            />
          </SettingRow>

          <SettingRow flow="wrap" label="Alert Severity Field">
            <FieldSelector
              useDataSources={useDataSources}
              onChange={(allSelectedFields) => {
                updateConfig(
                  'alertSeverityField',
                  allSelectedFields?.length > 0 ? allSelectedFields[0].jimuName : null
                )
              }}
              selectedFields={
                currentConfig.alertSeverityField
                  ? Immutable([currentConfig.alertSeverityField])
                  : Immutable([])
              }
              isMultiple={false}
              types={Immutable(['string'])}
            />
          </SettingRow>
        </SettingSection>
      )}

      {/* Display Options */}
      <SettingSection title="Display Options">
        <SettingRow label="Temperature Units">
          <Select
            value={currentConfig.temperatureUnits}
            onChange={(e) => updateConfig('temperatureUnits', e.target.value as 'Celsius' | 'Fahrenheit')}
            size="sm"
            style={{ width: '120px' }}
          >
            <Option value="Fahrenheit">Fahrenheit</Option>
            <Option value="Celsius">Celsius</Option>
          </Select>
        </SettingRow>

        <SettingRow label="Show Humidity">
          <Switch
            checked={currentConfig.showHumidity}
            onChange={(e) => updateConfig('showHumidity', e.target.checked)}
          />
        </SettingRow>

        <SettingRow label="Show Wind Speed">
          <Switch
            checked={currentConfig.showWindSpeed}
            onChange={(e) => updateConfig('showWindSpeed', e.target.checked)}
          />
        </SettingRow>
      </SettingSection>

      {/* Refresh Settings */}
      <SettingSection title="Auto-Refresh">
        <SettingRow label="Refresh Interval (seconds)">
          <NumericInput
            value={currentConfig.refreshInterval}
            onChange={(value) => updateConfig('refreshInterval', value || 300)}
            min={30}
            max={3600}
            step={30}
            size="sm"
            style={{ width: '100px' }}
          />
        </SettingRow>
      </SettingSection>
    </div>
  )
}

export default Setting
