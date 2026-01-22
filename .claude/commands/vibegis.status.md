# VibeGIS Status

Show current session state.

## Purpose

Display the current workflow state from `.vibegis/session.json`.

## Instructions

1. Check if `.vibegis/session.json` exists
2. If not, report no active session
3. If exists, parse and display:
   - Session metadata (created, updated)
   - Current phase
   - Widget brief summary
   - PRD summary (if completed)
   - Architecture summary (if completed)
   - Validation status

## Output Format

```
VibeGIS Session Status
======================

Session: .vibegis/session.json
Created: 2024-01-15T10:30:00Z
Updated: 2024-01-15T11:45:00Z

Current Phase: SPECIFY

Widget Brief:
  Name: incident-tracker
  Label: Incident Tracker
  Target Users: Field Workers, Managers
  Map Interaction: Click to select features
  Data Source: Feature Layer
  ✓ Brief complete

PRD:
  Requirements: 5 (3 High, 2 Medium)
  Has Settings: Yes (3 settings)
  Calcite Components: Card, Panel, Button
  ✓ PRD complete

Architecture:
  ✗ Not started

Validation:
  ✓ Brief valid
  ✓ PRD valid
  ⚠ Architecture: jimu-core is a required module

Next: Run /vibegis.architect to continue
```

## No Session

```
VibeGIS Session Status
======================

No active session found.

Run /vibegis.wizard to start a new widget project
or /vibegis.analyze to begin the Analyze phase.
```
