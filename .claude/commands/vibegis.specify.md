# VibeGIS Specify Phase

Standalone Specify phase for defining widget requirements.

## Purpose

Translate the widget brief into detailed requirements:
- Functional requirements with priorities
- Settings configuration
- Data binding requirements
- UI component preferences

## Prerequisites

Requires a widget brief from the Analyze phase. Check `.vibegis/session.json` for existing brief.

## Instructions

1. Load session from `.vibegis/session.json`
2. If no brief exists, prompt user to run `/vibegis.analyze` first
3. Show brief summary
4. Suggest functional requirements based on map interaction type
5. Allow adding/modifying requirements
6. Ask about settings configuration
7. Ask about data binding requirements
8. Ask about preferred Calcite components
9. Use AI to generate a structured PRD
10. Save PRD to session

## Suggested Requirements by Interaction Type

**Click to select features:**
- Allow users to click map features to view details (High)
- Show selected feature attributes in summary panel (Medium)
- Provide clear selection state on map (Medium)

**Draw geometry:**
- Enable drawing polygons or lines on map (High)
- Use drawn geometry to query intersecting features (High)
- Offer tools to clear or edit drawn geometry (Medium)

**Hover to highlight:**
- Highlight features on hover without selection (High)
- Display lightweight tooltip details (Medium)

**View only:**
- Present map layers in read-only view (High)
- Explain data sources and context (Low)

## Output

Updates `.vibegis/session.json` with:
- `state.widgetPRD` - Functional requirements, settings, data bindings, UI requirements
- `state.currentPhase` - Set to "SPECIFY"
- `aiResponses.prd` - AI-generated structured PRD
