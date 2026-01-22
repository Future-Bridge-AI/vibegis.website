# VibeGIS Analyze Phase

Standalone Analyze phase for capturing the widget concept.

## Purpose

Gather the initial widget brief including:
- Widget name and display label
- Description and purpose
- Target users
- Map interaction type
- Data source type
- Key features

## Instructions

1. Check for existing session in `.vibegis/session.json`
2. If exists, load the current widget brief
3. Walk through each field:
   - Widget name (kebab-case folder name)
   - Display label (human-readable)
   - Description (what it does)
   - Purpose (problem it solves)
   - Target users (multi-select)
   - Map interaction type (single select)
   - Data source type (single select)
   - Key features (freeform text)
4. After gathering info, analyze the concept and provide 3-5 clarifying questions
5. Save the brief to `.vibegis/session.json`

## Output

Updates `.vibegis/session.json` with:
- `state.widgetBrief` - The captured widget brief
- `state.currentPhase` - Set to "ANALYZE"
- `aiResponses.analysis` - AI analysis questions

## Example Interaction

```
Let's capture your widget concept.

Widget name (folder name, kebab-case): incident-tracker
Display label: Incident Tracker
Description: Displays and manages field incidents on a map
Purpose: Enable field workers to report and track incidents in real-time
Target users: Field Workers, Managers/Executives
Map interaction: Click to select features
Data source: Feature Layer
Key features: View incidents, Add new incidents, Update status, Filter by type

Based on your concept, I have some clarifying questions:
1. Should incidents support attachments (photos, documents)?
2. What attributes should be displayed in the incident popup?
...
```
