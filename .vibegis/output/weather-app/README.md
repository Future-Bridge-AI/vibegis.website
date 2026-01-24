# Weather Viewer Widget

A custom ArcGIS Experience Builder widget that displays current weather conditions, forecasts, and weather alerts for map locations. Built using the BMAD methodology with VibeGIS.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Architecture](#architecture)
- [Data Requirements](#data-requirements)
- [Customization](#customization)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## Overview

The Weather Viewer widget provides an intuitive interface for managers and executives to monitor weather conditions across geographic areas. Users can click on the map or search for locations to view current weather data and active alerts pulled from a Feature Layer data source.

**Target Users:** Managers/Executives monitoring weather conditions for decision-making

**Key Capabilities:**
- Real-time weather display from Feature Layer
- Color-coded weather alerts sorted by severity
- Location search with ArcGIS World Geocoding
- Cross-widget communication via Jimu messaging
- Persistent location selection across sessions

---

## Features

### Core Features

| Feature | Description |
|---------|-------------|
| **Temperature Display** | Shows current temperature with configurable units (F/C) |
| **Weather Conditions** | Displays humidity, wind speed, and condition descriptions |
| **Alert Notifications** | Color-coded alerts (red=severe, orange=warning, yellow=watch, blue=advisory) |
| **Location Search** | Geocoding-powered search to find any location |
| **Map Click Selection** | Click anywhere on the map to get weather for that point |
| **Auto-Refresh** | Configurable automatic data refresh (default: 5 minutes) |

### Integration Features

| Feature | Description |
|---------|-------------|
| **Jimu State Persistence** | Selected location survives widget/page reload |
| **Message Publishing** | Publishes ExtentChange and DataRecordSet messages |
| **Field Mapping** | Flexible mapping of layer fields to weather attributes |
| **Map Widget Connection** | Connects to any Map widget in the Experience |

---

## Requirements

### Experience Builder Version
- ArcGIS Experience Builder **1.19.0** or higher

### Dependencies
- `jimu-core` - Core Jimu framework
- `jimu-arcgis` - ArcGIS integration components
- `jimu-ui` - UI components
- `@arcgis/core` - ArcGIS Maps SDK for JavaScript

### Data Requirements
- Feature Layer with weather data attributes (see [Data Requirements](#data-requirements))

---

## Installation

### Step 1: Download the Widget

Ensure you have the complete widget folder structure:

```
weather-app/
├── manifest.json
├── config.ts
├── runtime/
│   └── widget.tsx
├── setting/
│   └── setting.tsx
└── translations/
    └── default.ts
```

### Step 2: Copy to Experience Builder

Copy the entire `weather-app` folder to your Experience Builder extensions directory:

**For Developer Edition:**
```bash
# Navigate to your ExB installation
cd /path/to/ArcGISExperienceBuilder/client

# Copy widget to extensions folder
cp -r /path/to/weather-app ./your-extensions/widgets/
```

**For Windows:**
```powershell
# Copy widget folder
Copy-Item -Path ".\weather-app" -Destination "C:\ArcGISExperienceBuilder\client\your-extensions\widgets\" -Recurse
```

### Step 3: Restart Experience Builder

If Experience Builder is running, restart it to detect the new widget:

```bash
# In the client directory
npm start
```

### Step 4: Verify Installation

1. Open Experience Builder in your browser (typically `https://localhost:3001`)
2. Create a new Experience or open an existing one
3. Open the Widget panel
4. Search for "Weather Viewer" - it should appear in the widget list

---

## Configuration

### Adding the Widget to an Experience

1. **Add a Map Widget** (if not already present)
   - The Weather Viewer requires a connected Map widget

2. **Add the Weather Viewer Widget**
   - Drag "Weather Viewer" from the widget panel onto your layout

3. **Configure Settings**
   Open the widget settings panel and configure:

#### Map Connection
| Setting | Description |
|---------|-------------|
| Select Map Widget | Choose the Map widget to connect to for click events |

#### Data Source
| Setting | Description |
|---------|-------------|
| Feature Layer | Select the Feature Layer containing weather data |

#### Field Mapping
| Setting | Required | Description |
|---------|----------|-------------|
| Temperature Field | Yes | Numeric field containing temperature values |
| Humidity Field | No | Numeric field for humidity percentage |
| Wind Speed Field | No | Numeric field for wind speed |
| Conditions Field | No | Text field describing weather conditions |
| Alert Type Field | No | Text field for alert type/name |
| Alert Severity Field | No | Text field for severity (severe/warning/watch/advisory) |

#### Display Options
| Setting | Default | Description |
|---------|---------|-------------|
| Temperature Units | Fahrenheit | Choose Celsius or Fahrenheit |
| Show Humidity | On | Toggle humidity display |
| Show Wind Speed | On | Toggle wind speed display |

#### Auto-Refresh
| Setting | Default | Range | Description |
|---------|---------|-------|-------------|
| Refresh Interval | 300 | 30-3600 | Seconds between automatic data refreshes |

---

## Usage

### Viewing Weather Data

1. **Click on Map:** Click any location on the connected map to view weather data for that point
2. **Search Location:** Type a location name in the search bar and click Search
3. **View Alerts:** Scroll down to see any active weather alerts, sorted by severity

### Understanding the Display

```
┌─────────────────────────────────┐
│ [Search location...]    [Search]│
├─────────────────────────────────┤
│ Current Weather                 │
│ ┌─────────────────────────────┐ │
│ │        72°F                 │ │
│ │    Partly Cloudy            │ │
│ │ Humidity: 45%  Wind: 12 mph │ │
│ └─────────────────────────────┘ │
├─────────────────────────────────┤
│ Weather Alerts (2)              │
│ ┌─────────────────────────────┐ │
│ │ [SEVERE] Heat Advisory      │ │
│ │ Excessive heat expected...  │ │
│ ├─────────────────────────────┤ │
│ │ [WATCH] Flood Watch         │ │
│ │ Flash flooding possible...  │ │
│ └─────────────────────────────┘ │
│          Auto-refresh: 300s     │
└─────────────────────────────────┘
```

### Alert Severity Colors

| Severity | Color | Priority |
|----------|-------|----------|
| Severe | Red (#dc2626) | Highest |
| Warning | Orange (#f97316) | High |
| Watch | Yellow (#eab308) | Medium |
| Advisory | Blue (#3b82f6) | Low |

---

## Architecture

### File Structure

```
weather-app/
├── manifest.json           # Widget metadata, version, dependencies
├── config.ts               # TypeScript interfaces for configuration
├── runtime/
│   └── widget.tsx          # Main widget component
│       ├── WeatherViewer   # Main container component
│       ├── WeatherCard     # Temperature/conditions display
│       ├── AlertList       # Scrollable alert list
│       ├── LocationSearch  # Search input component
│       └── AlertBadge      # Severity badge component
├── setting/
│   └── setting.tsx         # Builder configuration panel
└── translations/
    └── default.ts          # i18n strings (English)
```

### Component Hierarchy

```
WeatherViewer (Main)
├── DataSourceComponent     # Jimu data source connection
├── JimuMapViewComponent    # Map widget connection
├── LocationSearch          # Search bar
├── WeatherCard             # Current weather display
│   └── (temperature, conditions, humidity, wind)
└── AlertList               # Alert notifications
    └── AlertBadge          # Per-alert severity indicator
```

### State Management

The widget uses a **hybrid state approach**:

| State Type | Storage | Purpose |
|------------|---------|---------|
| Selected Location | Jimu widgetState | Persists across sessions, URL-shareable |
| Weather Data | React useState | Transient, refreshes on each load |
| Alerts | React useState | Transient, refreshes with weather |
| Loading States | React useState | UI feedback during operations |

### Message Types Published

| Message | Trigger | Data |
|---------|---------|------|
| `ExtentChangeMessage` | Location selected | Map extent at clicked point |
| `DataRecordSetChangeMessage` | Weather data loaded | Feature records from query |

---

## Data Requirements

### Feature Layer Schema

Your weather Feature Layer should include these fields:

#### Required Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| Temperature | Number | Current temperature | `72` |

#### Recommended Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| Humidity | Number | Humidity percentage | `45` |
| WindSpeed | Number | Wind speed (mph/kph) | `12` |
| Conditions | String | Weather description | `"Partly Cloudy"` |

#### Alert Fields (Optional)

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| AlertType | String | Type of alert | `"Heat Advisory"` |
| AlertSeverity | String | Severity level | `"severe"`, `"warning"`, `"watch"`, `"advisory"` |
| Message | String | Alert description | `"Excessive heat expected..."` |

### Sample Feature Layer

You can create a test Feature Layer in ArcGIS Online with this schema:

```json
{
  "fields": [
    { "name": "OBJECTID", "type": "esriFieldTypeOID" },
    { "name": "Temperature", "type": "esriFieldTypeDouble" },
    { "name": "Humidity", "type": "esriFieldTypeInteger" },
    { "name": "WindSpeed", "type": "esriFieldTypeDouble" },
    { "name": "Conditions", "type": "esriFieldTypeString", "length": 100 },
    { "name": "AlertType", "type": "esriFieldTypeString", "length": 100 },
    { "name": "AlertSeverity", "type": "esriFieldTypeString", "length": 20 },
    { "name": "Message", "type": "esriFieldTypeString", "length": 500 }
  ],
  "geometryType": "esriGeometryPoint",
  "spatialReference": { "wkid": 4326 }
}
```

---

## Customization

### Styling

The widget uses inline styles for portability. To customize appearance:

1. **Edit `runtime/widget.tsx`**
2. **Modify the style objects** in each component

Example - Change the temperature font size:
```tsx
// In WeatherCard component
<div style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '8px' }}>
  {formatTemperature(weather.temperature)}
</div>
```

### Adding New Severity Levels

Edit the `SEVERITY_CONFIG` object in `runtime/widget.tsx`:

```tsx
const SEVERITY_CONFIG = {
  severe: { color: '#dc2626', label: 'Severe', priority: 1 },
  warning: { color: '#f97316', label: 'Warning', priority: 2 },
  watch: { color: '#eab308', label: 'Watch', priority: 3 },
  advisory: { color: '#3b82f6', label: 'Advisory', priority: 4 },
  // Add new severity:
  info: { color: '#10b981', label: 'Info', priority: 5 }
}
```

### Changing the Search Provider

The widget uses ArcGIS World Geocoding Service. To use a different geocoder, modify the `handleSearch` function:

```tsx
const handleSearch = useCallback(async (searchText: string) => {
  // Replace with your geocoding endpoint
  const response = await fetch(`YOUR_GEOCODER_URL?query=${encodeURIComponent(searchText)}`)
  // ...
}, [])
```

### Adding Localization

1. Create a new translation file: `translations/es.ts` (for Spanish)
2. Copy content from `default.ts` and translate strings
3. Update `manifest.json`:
   ```json
   "translatedLocales": ["en", "es"]
   ```

---

## Troubleshooting

### Widget Not Appearing in Builder

**Symptoms:** Widget doesn't show in the widget panel

**Solutions:**
1. Verify folder structure matches expected layout
2. Check `manifest.json` for JSON syntax errors
3. Restart Experience Builder
4. Check browser console for errors

### No Weather Data Displayed

**Symptoms:** "Click on the map to view weather data" persists after clicking

**Solutions:**
1. Verify Feature Layer is selected in settings
2. Check that Temperature Field is mapped
3. Ensure Feature Layer has data within 50 miles of clicked point
4. Open browser DevTools and check for query errors

### Map Click Not Working

**Symptoms:** Clicking map doesn't trigger weather lookup

**Solutions:**
1. Verify Map Widget is selected in settings
2. Ensure only one Map widget is connected
3. Check that JimuMapViewComponent is receiving the map widget ID

### Alerts Not Showing

**Symptoms:** Weather loads but alerts section is empty

**Solutions:**
1. Map both `Alert Type Field` and `Alert Severity Field` in settings
2. Verify severity values match: `severe`, `warning`, `watch`, or `advisory`
3. Check that alert data exists in the Feature Layer

### Auto-Refresh Not Working

**Symptoms:** Data doesn't update automatically

**Solutions:**
1. Verify Refresh Interval is set (minimum 30 seconds)
2. Ensure a location has been selected first
3. Check browser console for interval errors

---

## API Reference

### Config Interface

```typescript
interface Config {
  dataSourceId: string | null
  temperatureField: string | null
  humidityField: string | null
  windSpeedField: string | null
  conditionsField: string | null
  alertTypeField: string | null
  alertSeverityField: string | null
  refreshInterval: number          // seconds
  temperatureUnits: 'Celsius' | 'Fahrenheit'
  showHumidity: boolean
  showWindSpeed: boolean
}
```

### Published Messages

```typescript
// When location is selected
ExtentChangeMessage(widgetId: string, extent: Extent)

// When weather data is loaded
DataRecordSetChangeMessage(widgetId: string, records: DataRecord[])
```

---

## License

Apache-2.0

---

## Credits

Generated with [VibeGIS Widget Wizard](https://vibegis.com) using the BMAD methodology.

**BMAD Phases:**
1. **B**usiness - Captured widget concept and target users
2. **M**anage - Defined requirements and priorities
3. **A**rchitect - Planned technical structure
4. **D**evelop - Generated production-ready code
