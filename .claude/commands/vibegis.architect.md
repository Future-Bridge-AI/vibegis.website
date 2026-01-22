# VibeGIS Architect Phase

Standalone Architect phase for planning technical structure.

## Purpose

Define the widget's technical architecture:
- Component structure
- State management approach
- Jimu framework integration
- Dependencies

## Prerequisites

Requires a widget brief and PRD from previous phases. Check `.vibegis/session.json`.

## Instructions

1. Load session from `.vibegis/session.json`
2. If no PRD exists, prompt user to complete previous phases
3. Show brief and PRD summary
4. Suggest main component name (PascalCase from widget name)
5. Ask about state management (Local state, Zustand, Redux)
6. Allow defining sub-components (name + purpose)
7. Configure Jimu integration:
   - Uses JimuMapView (auto-set if map interaction selected)
   - Uses DataSourceComponent (auto-set if data source selected)
   - Publishes messages
   - Subscribes to messages
8. If messaging enabled, select message types
9. Show required Jimu modules (auto-calculated)
10. Select additional ArcGIS modules
11. Use AI to generate structured architecture
12. Save architecture to session

## State Management Options

- **Local React state (useState/useReducer)** - Simple widgets with local state
- **Zustand store** - Complex state shared between components
- **Redux (jimu-core)** - Integration with ExB's Redux store

## Message Types

- EXTENT_CHANGE
- DATA_RECORDS_SELECTION_CHANGE
- DATA_RECORD_SET_CHANGE
- MAP_CLICK
- WIDGET_STATE_CHANGE

## ArcGIS Modules

- FeatureLayer
- GraphicsLayer
- Query
- Geometry
- Graphic
- SketchViewModel
- PopupTemplate

## Output

Updates `.vibegis/session.json` with:
- `state.widgetArchitecture` - Component structure, integrations, dependencies
- `state.currentPhase` - Set to "ARCHITECT"
- `aiResponses.architecture` - AI-generated structured architecture
