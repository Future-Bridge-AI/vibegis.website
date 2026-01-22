# VibeGIS Widget Wizard

Interactive CLI workflow for creating ArcGIS Experience Builder widgets using the BMAD methodology.

## Session Management

Session state is persisted in `.vibegis/session.json`. The session tracks:
- Current workflow phase
- Widget brief (name, description, target users, etc.)
- PRD (requirements, settings, UI preferences)
- Architecture (components, integrations, dependencies)
- AI analysis responses

## Workflow Phases

Guide the user through all 4 BMAD phases:

### Phase 1: Analyze
Capture the widget concept:
1. Ask for widget name (folder name, kebab-case)
2. Ask for display label
3. Ask for description and purpose
4. Ask for target users (GIS Analysts, Field Workers, Public/Citizens, Managers/Executives, Developers)
5. Ask for map interaction type (Click to select, Draw geometry, View only, Hover to highlight)
6. Ask for data source type (Feature Layer, Web Map, CSV/GeoJSON, No data source)
7. Ask for key features

After gathering info, use your AI capabilities to analyze the widget concept and ask 3-5 clarifying GIS-specific questions.

### Phase 2: Specify
Define requirements:
1. Present suggested functional requirements based on map interaction type
2. Allow user to add/modify requirements with priorities (High, Medium, Low)
3. Ask if widget needs configurable settings
4. If yes, gather setting definitions (name, type, default value)
5. Ask about data binding requirements (layer selection, field selection, multiple sources)
6. Ask about preferred Calcite components (Card, Panel, List, Table, Button, Modal, Tabs)

Use AI to generate a structured PRD that fills in the requirements.

### Phase 3: Architect
Plan the technical structure:
1. Suggest main component name (PascalCase)
2. Ask about state management approach (Local state, Zustand, Redux)
3. Allow defining sub-components
4. Configure Jimu integration (JimuMapView, DataSourceComponent, messaging)
5. Select message types if using messaging
6. Confirm required Jimu modules
7. Select additional ArcGIS modules (FeatureLayer, GraphicsLayer, Query, etc.)

Use AI to generate a structured architecture.

### Phase 4: Generate
Create the widget files:
1. Show generation summary
2. Ask for generation mode: Template (fast, predictable) or AI (production-ready code)
3. Generate files
4. Display generated code
5. Output files to specified directory (default: current directory)

## Session Commands

During the wizard, the user can say:
- "status" - Show current session state
- "reset" - Clear session and start over
- "back" - Go to previous phase
- "skip" - Skip current question (use defaults)

## Output

After generating, write files to the output directory:
```
<output-dir>/<widget-name>/
├── manifest.json
├── config.ts
├── runtime/widget.tsx
├── setting/setting.tsx (if has settings)
└── translations/default.ts
```

## Session File Location

Save session state to `.vibegis/session.json` in the current working directory. Create the directory if it doesn't exist.

## Instructions

1. Check if `.vibegis/session.json` exists to resume a previous session
2. If resuming, show current state and ask to continue or reset
3. Guide user through each phase interactively
4. Save state after each significant input
5. Use AI analysis to enhance each phase
6. Generate files at the end using the core generator

Start by checking for an existing session and greeting the user.
