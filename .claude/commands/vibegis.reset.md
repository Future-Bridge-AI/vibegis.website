# VibeGIS Reset

Clear the current session and start fresh.

## Purpose

Delete the session file to start a new widget project.

## Instructions

1. Check if `.vibegis/session.json` exists
2. If not, report no session to reset
3. If exists:
   - Show current widget name/label
   - Confirm deletion
   - Delete `.vibegis/session.json`
   - Report success

## Confirmation

Always confirm before deleting:

```
Current session: incident-tracker (Incident Tracker)
Phase: ARCHITECT

Are you sure you want to reset? This will delete all session data.
(yes/no):
```

## Output

```
Session reset. Run /vibegis.wizard to start a new project.
```

## No Session

```
No active session to reset.
```
