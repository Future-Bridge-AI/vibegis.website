/** @jsx jsx */
import {
  jsx,
  type AllWidgetProps,
  DataSourceComponent,
  type DataSource,
  type FeatureLayerDataSource,
  DataSourceStatus,
  MessageManager,
  ExtentChangeMessage,
  DataRecordSetChangeMessage,
  DataRecordsSelectionChangeMessage,
  getAppStore,
  appActions,
  type IMState
} from 'jimu-core'
import { JimuMapViewComponent, type JimuMapView } from 'jimu-arcgis'
import { useState, useEffect, useCallback, useRef } from 'react'
import { type IMConfig } from '../config'
import defaultMessages from '../translations/default'

import Point from '@arcgis/core/geometry/Point'
import Graphic from '@arcgis/core/Graphic'
import Query from '@arcgis/core/rest/support/Query'

// Types
interface WeatherData {
  temperature: number | null
  humidity: number | null
  windSpeed: number | null
  conditions: string | null
  location: { x: number; y: number } | null
}

interface WeatherAlert {
  id: string
  type: string
  severity: 'severe' | 'warning' | 'watch' | 'advisory'
  message: string
}

type AlertSeverity = WeatherAlert['severity']

// Severity configuration
const SEVERITY_CONFIG: Record<AlertSeverity, { color: string; label: string; priority: number }> = {
  severe: { color: '#dc2626', label: 'Severe', priority: 1 },
  warning: { color: '#f97316', label: 'Warning', priority: 2 },
  watch: { color: '#eab308', label: 'Watch', priority: 3 },
  advisory: { color: '#3b82f6', label: 'Advisory', priority: 4 }
}

// Sub-component: AlertBadge
interface AlertBadgeProps {
  severity: AlertSeverity
}

const AlertBadge = ({ severity }: AlertBadgeProps): JSX.Element => {
  const config = SEVERITY_CONFIG[severity]
  return (
    <span
      style={{
        backgroundColor: config.color,
        color: 'white',
        padding: '2px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: 'bold',
        textTransform: 'uppercase'
      }}
    >
      {config.label}
    </span>
  )
}

// Sub-component: WeatherCard
interface WeatherCardProps {
  weather: WeatherData
  units: 'Celsius' | 'Fahrenheit'
  showHumidity: boolean
  showWindSpeed: boolean
  isLoading: boolean
}

const WeatherCard = ({
  weather,
  units,
  showHumidity,
  showWindSpeed,
  isLoading
}: WeatherCardProps): JSX.Element => {
  const formatTemperature = (temp: number | null): string => {
    if (temp === null) return '--'
    const symbol = units === 'Celsius' ? 'C' : 'F'
    return `${Math.round(temp)}°${symbol}`
  }

  if (isLoading) {
    return (
      <calcite-card style={{ marginBottom: '12px' }}>
        <div style={{ padding: '16px', textAlign: 'center' }}>
          <calcite-loader label="Loading weather data..." />
        </div>
      </calcite-card>
    )
  }

  if (!weather.location) {
    return (
      <calcite-card style={{ marginBottom: '12px' }}>
        <div style={{ padding: '16px', textAlign: 'center', color: '#6b7280' }}>
          Click on the map to view weather data
        </div>
      </calcite-card>
    )
  }

  return (
    <calcite-card style={{ marginBottom: '12px' }}>
      <div slot="title" style={{ fontSize: '18px', fontWeight: 'bold' }}>
        Current Weather
      </div>
      <div style={{ padding: '8px 0' }}>
        <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '8px' }}>
          {formatTemperature(weather.temperature)}
        </div>
        {weather.conditions && (
          <div style={{ fontSize: '16px', color: '#4b5563', marginBottom: '12px' }}>
            {weather.conditions}
          </div>
        )}
        <div style={{ display: 'flex', gap: '16px', fontSize: '14px' }}>
          {showHumidity && weather.humidity !== null && (
            <div>
              <span style={{ color: '#6b7280' }}>Humidity: </span>
              <span style={{ fontWeight: '500' }}>{weather.humidity}%</span>
            </div>
          )}
          {showWindSpeed && weather.windSpeed !== null && (
            <div>
              <span style={{ color: '#6b7280' }}>Wind: </span>
              <span style={{ fontWeight: '500' }}>{weather.windSpeed} mph</span>
            </div>
          )}
        </div>
      </div>
    </calcite-card>
  )
}

// Sub-component: AlertList
interface AlertListProps {
  alerts: WeatherAlert[]
  isLoading: boolean
}

const AlertList = ({ alerts, isLoading }: AlertListProps): JSX.Element => {
  const sortedAlerts = [...alerts].sort((a, b) => {
    return SEVERITY_CONFIG[a.severity].priority - SEVERITY_CONFIG[b.severity].priority
  })

  if (isLoading) {
    return (
      <div style={{ marginTop: '12px' }}>
        <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
          Weather Alerts
        </div>
        <calcite-loader label="Loading alerts..." scale="s" />
      </div>
    )
  }

  return (
    <div style={{ marginTop: '12px' }}>
      <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
        Weather Alerts {alerts.length > 0 && `(${alerts.length})`}
      </div>
      {sortedAlerts.length === 0 ? (
        <calcite-notice open icon="check-circle" kind="success" scale="s">
          <div slot="message">No active weather alerts</div>
        </calcite-notice>
      ) : (
        <calcite-list>
          {sortedAlerts.map((alert) => (
            <calcite-list-item key={alert.id} label={alert.type} description={alert.message}>
              <AlertBadge severity={alert.severity} slot="actions-start" />
            </calcite-list-item>
          ))}
        </calcite-list>
      )}
    </div>
  )
}

// Sub-component: LocationSearch
interface LocationSearchProps {
  onSearch: (searchText: string) => void
  isSearching: boolean
}

const LocationSearch = ({ onSearch, isSearching }: LocationSearchProps): JSX.Element => {
  const [searchText, setSearchText] = useState('')

  const handleSearch = (): void => {
    if (searchText.trim()) {
      onSearch(searchText.trim())
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
      <calcite-input
        placeholder="Search location..."
        value={searchText}
        onCalciteInputInput={(e: CustomEvent) => setSearchText((e.target as HTMLInputElement).value)}
        onKeyDown={handleKeyDown}
        style={{ flex: 1 }}
        disabled={isSearching}
      />
      <calcite-button
        onClick={handleSearch}
        loading={isSearching}
        disabled={isSearching || !searchText.trim()}
        icon-start="search"
      >
        Search
      </calcite-button>
    </div>
  )
}

// Main Widget Component
const WeatherViewer = (props: AllWidgetProps<IMConfig>): JSX.Element => {
  const { config, id, useDataSources } = props

  // State
  const [weather, setWeather] = useState<WeatherData>({
    temperature: null,
    humidity: null,
    windSpeed: null,
    conditions: null,
    location: null
  })
  const [alerts, setAlerts] = useState<WeatherAlert[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [dataSource, setDataSource] = useState<FeatureLayerDataSource | null>(null)

  // Refs
  const jimuMapViewRef = useRef<JimuMapView | null>(null)
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const clickGraphicRef = useRef<Graphic | null>(null)

  // Get selected location from widget state (Jimu state persistence)
  const widgetState = getAppStore().getState().widgetsState?.[id]
  const savedLocation = widgetState?.selectedLocation as { x: number; y: number } | undefined

  // Restore saved location on mount
  useEffect(() => {
    if (savedLocation && dataSource) {
      fetchWeatherData(savedLocation.x, savedLocation.y)
    }
  }, [savedLocation, dataSource])

  // Auto-refresh setup
  useEffect(() => {
    if (config?.refreshInterval && weather.location) {
      refreshIntervalRef.current = setInterval(() => {
        if (weather.location) {
          fetchWeatherData(weather.location.x, weather.location.y)
        }
      }, config.refreshInterval * 1000)
    }

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current)
      }
    }
  }, [config?.refreshInterval, weather.location])

  // Fetch weather data from feature layer
  const fetchWeatherData = useCallback(
    async (x: number, y: number) => {
      if (!dataSource || !config) return

      setIsLoading(true)

      try {
        const layer = dataSource.layer
        const query = new Query({
          geometry: new Point({ x, y, spatialReference: { wkid: 4326 } }),
          distance: 50,
          units: 'miles',
          outFields: ['*'],
          returnGeometry: true
        })

        const result = await layer.queryFeatures(query)

        if (result.features.length > 0) {
          const feature = result.features[0]
          const attrs = feature.attributes

          const newWeather: WeatherData = {
            temperature: config.temperatureField ? attrs[config.temperatureField] : null,
            humidity: config.humidityField ? attrs[config.humidityField] : null,
            windSpeed: config.windSpeedField ? attrs[config.windSpeedField] : null,
            conditions: config.conditionsField ? attrs[config.conditionsField] : null,
            location: { x, y }
          }

          setWeather(newWeather)

          // Extract alerts if alert fields are configured
          if (config.alertTypeField && config.alertSeverityField) {
            const alertFeatures = result.features.filter(
              (f) => f.attributes[config.alertTypeField!] && f.attributes[config.alertSeverityField!]
            )

            const extractedAlerts: WeatherAlert[] = alertFeatures.map((f, idx) => ({
              id: `alert-${idx}`,
              type: f.attributes[config.alertTypeField!],
              severity: (f.attributes[config.alertSeverityField!]?.toLowerCase() || 'advisory') as AlertSeverity,
              message: f.attributes.message || f.attributes.description || ''
            }))

            setAlerts(extractedAlerts)
          }

          // Save location to widget state (Jimu persistence)
          getAppStore().dispatch(
            appActions.widgetStatePropChange(id, 'selectedLocation', { x, y })
          )

          // Publish messages to other widgets
          publishMessages(x, y, result.features)
        } else {
          setWeather((prev) => ({ ...prev, location: { x, y } }))
          setAlerts([])
        }
      } catch (error) {
        console.error('Error fetching weather data:', error)
      } finally {
        setIsLoading(false)
      }
    },
    [dataSource, config, id]
  )

  // Publish messages to other widgets
  const publishMessages = (x: number, y: number, features: __esri.Graphic[]): void => {
    const point = new Point({ x, y, spatialReference: { wkid: 4326 } })

    // Publish extent change message
    const extentMessage = new ExtentChangeMessage(id, point.extent)
    MessageManager.getInstance().publishMessage(extentMessage)

    // Publish data record set message if we have features
    if (features.length > 0 && dataSource) {
      const records = features.map((f) => dataSource.buildRecord(f))
      const recordSetMessage = new DataRecordSetChangeMessage(id, records)
      MessageManager.getInstance().publishMessage(recordSetMessage)
    }
  }

  // Handle map click
  const handleMapClick = useCallback(
    async (mapPoint: __esri.Point) => {
      const { x, y } = mapPoint

      // Add click indicator graphic
      if (jimuMapViewRef.current?.view) {
        const view = jimuMapViewRef.current.view

        // Remove previous graphic
        if (clickGraphicRef.current) {
          view.graphics.remove(clickGraphicRef.current)
        }

        // Add new click graphic
        const graphic = new Graphic({
          geometry: mapPoint,
          symbol: {
            type: 'simple-marker',
            color: [0, 120, 255, 0.8],
            outline: { color: [255, 255, 255], width: 2 },
            size: 12
          } as __esri.SimpleMarkerSymbolProperties
        })

        view.graphics.add(graphic)
        clickGraphicRef.current = graphic
      }

      await fetchWeatherData(x, y)
    },
    [fetchWeatherData]
  )

  // Handle JimuMapView ready
  const handleActiveViewChange = useCallback(
    (jmv: JimuMapView) => {
      jimuMapViewRef.current = jmv

      if (jmv?.view) {
        jmv.view.on('click', (event: __esri.ViewClickEvent) => {
          handleMapClick(event.mapPoint)
        })
      }
    },
    [handleMapClick]
  )

  // Handle location search
  const handleSearch = useCallback(
    async (searchText: string) => {
      setIsSearching(true)

      try {
        // Use ArcGIS World Geocoding Service
        const response = await fetch(
          `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?SingleLine=${encodeURIComponent(
            searchText
          )}&f=json&maxLocations=1`
        )
        const data = await response.json()

        if (data.candidates && data.candidates.length > 0) {
          const { x, y } = data.candidates[0].location

          // Zoom to location
          if (jimuMapViewRef.current?.view) {
            await jimuMapViewRef.current.view.goTo({
              center: [x, y],
              zoom: 10
            })
          }

          // Fetch weather for this location
          const point = new Point({ x, y, spatialReference: { wkid: 4326 } })
          await handleMapClick(point)
        }
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        setIsSearching(false)
      }
    },
    [handleMapClick]
  )

  // Handle data source creation
  const handleDataSourceCreated = (ds: DataSource): void => {
    if (ds.type === 'FEATURE_LAYER') {
      setDataSource(ds as FeatureLayerDataSource)
    }
  }

  return (
    <div
      className="weather-viewer-widget jimu-widget"
      style={{
        padding: '12px',
        height: '100%',
        overflow: 'auto',
        backgroundColor: '#ffffff'
      }}
    >
      {/* Data Source Connection */}
      {useDataSources?.map((useDs) => (
        <DataSourceComponent
          key={useDs.dataSourceId}
          useDataSource={useDs}
          onDataSourceCreated={handleDataSourceCreated}
        />
      ))}

      {/* Map View Connection */}
      <JimuMapViewComponent
        useMapWidgetId={props.useMapWidgetIds?.[0]}
        onActiveViewChange={handleActiveViewChange}
      />

      {/* Location Search */}
      <LocationSearch onSearch={handleSearch} isSearching={isSearching} />

      {/* Weather Display */}
      <WeatherCard
        weather={weather}
        units={config?.temperatureUnits || 'Fahrenheit'}
        showHumidity={config?.showHumidity ?? true}
        showWindSpeed={config?.showWindSpeed ?? true}
        isLoading={isLoading}
      />

      {/* Alerts List */}
      <AlertList alerts={alerts} isLoading={isLoading} />

      {/* Last Update Info */}
      {weather.location && (
        <div
          style={{
            marginTop: '12px',
            fontSize: '12px',
            color: '#9ca3af',
            textAlign: 'center'
          }}
        >
          Auto-refresh: {config?.refreshInterval || 300}s
        </div>
      )}
    </div>
  )
}

export default WeatherViewer
