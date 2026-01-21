# BMAD Workflow Methodology

BMAD (Business → Manage → Architect → Develop) is a structured methodology for creating ArcGIS Experience Builder widgets through a guided, AI-assisted workflow.

## Overview

The BMAD workflow breaks down widget creation into four distinct phases:

```
Analyze → Specify → Architect → Generate
```

Each phase builds upon the previous, ensuring comprehensive requirement capture and systematic code generation.

## Phases

### 1. Analyze Phase

**Purpose:** Capture the widget concept, audience, and data inputs before designing features.

**Inputs:**
- Widget name and display label
- Description and purpose
- Target users (GIS Analysts, Field Workers, Public, Managers, Developers)
- Map interaction type (Click, Draw, View Only, Hover)
- Data source type (Feature Layer, Web Map, CSV/GeoJSON, None)
- Key features and workflow steps

**Output:** Widget Brief document

### 2. Specify Phase

**Purpose:** Translate the brief into detailed functional requirements, settings, and UI expectations.

**Inputs:**
- Functional requirements with priority levels
- Settings configuration (configurable options and defaults)
- Data binding requirements
- UI component preferences (Calcite components)

**Output:** Widget PRD (Product Requirements Document)

### 3. Architect Phase

**Purpose:** Plan the technical implementation, component structure, and integration blueprint.

**Inputs:**
- Main component name
- State management approach (Local state, Zustand, Redux)
- Sub-components definition
- Jimu framework integrations
- ArcGIS module dependencies

**Output:** Widget Architecture specification

### 4. Generate Phase

**Purpose:** Generate production-ready widget code and deployment package.

**Outputs:**
- `manifest.json` - Widget metadata and dependencies
- `config.ts` - Configuration interface and defaults
- `runtime/widget.tsx` - Main widget component
- `setting/setting.tsx` - Settings panel (if configured)
- `translations/default.ts` - Localization strings

## Target Platform

Generated widgets target **ArcGIS Experience Builder 1.19+** with:
- Jimu framework patterns
- React 19 hooks
- ArcGIS API v4.x integration
- TypeScript strict mode

## File Output Structure

```
widget/
├── manifest.json
├── config.ts
├── runtime/
│   └── widget.tsx
├── setting/
│   └── setting.tsx (optional)
├── translations/
│   └── default.ts
└── icon.svg
```

## Integration Points

### Jimu Modules
- `jimu-core` - Core framework utilities
- `jimu-ui` - UI components
- `jimu-arcgis` - Map and layer integration

### ArcGIS Modules
- FeatureLayer, GraphicsLayer
- Query, Geometry, Graphic
- SketchViewModel, PopupTemplate

### Message Types
- EXTENT_CHANGE
- DATA_RECORDS_SELECTION_CHANGE
- DATA_RECORD_SET_CHANGE
- MAP_CLICK
- WIDGET_STATE_CHANGE
