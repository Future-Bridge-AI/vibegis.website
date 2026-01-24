import { type ImmutableObject } from 'jimu-core'

export interface Config {
  /** Data source ID for the weather feature layer */
  dataSourceId: string | null
  /** Field name for temperature values */
  temperatureField: string | null
  /** Field name for humidity values */
  humidityField: string | null
  /** Field name for wind speed values */
  windSpeedField: string | null
  /** Field name for weather conditions */
  conditionsField: string | null
  /** Field name for alert type */
  alertTypeField: string | null
  /** Field name for alert severity */
  alertSeverityField: string | null
  /** Auto-refresh interval in seconds */
  refreshInterval: number
  /** Temperature display units */
  temperatureUnits: 'Celsius' | 'Fahrenheit'
  /** Whether to show humidity in the display */
  showHumidity: boolean
  /** Whether to show wind speed in the display */
  showWindSpeed: boolean
}

export type IMConfig = ImmutableObject<Config>

export const defaultConfig: Config = {
  dataSourceId: null,
  temperatureField: null,
  humidityField: null,
  windSpeedField: null,
  conditionsField: null,
  alertTypeField: null,
  alertSeverityField: null,
  refreshInterval: 300,
  temperatureUnits: 'Fahrenheit',
  showHumidity: true,
  showWindSpeed: true
}
