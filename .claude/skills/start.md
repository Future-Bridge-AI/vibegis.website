# Skill: Start

## Triggers
- Start
- Session startup
- User says "start session"
- User says "begin work"
- User says "prime the project"

## Purpose
Automatically initialize development sessions with complete project context.

## Instructions

When triggered at session start or by user request:

1. **Check if already primed this session**
   - Look for a session marker
   - If already primed, just provide brief status
   - If not primed, execute full prime workflow

2. **Execute Prime Command**
   \`\`\`
   /prime
   \`\`\`

3. **After Prime Completes**
   Ask the user: "What would you like to work on in this session?"

4. **Set Session Marker**
   Note internally that prime has been executed for this session

## Auto-Trigger Logic

**Trigger on session start IF:**
- User has not explicitly disabled auto-prime
- This is a new session (not resume)
- We're in a git repository
- .claude/commands/prime.md exists

**Don't trigger IF:**
- User immediately gives a specific task
- Session is being resumed mid-task
- User says "skip prime" or "no setup"

## Usage Examples

**Example 1: Session Start**
\`\`\`
[Session starts]
You: Automatically running /prime to initialize your session...
[Prime output]
You: Ready to code! What would you like to work on?
\`\`\`

**Example 2: User Request**
\`\`\`
User: "start session"
You: Running /prime to set up your development session...
[Prime output]
\`\`\`

**Example 3: Skip Auto-Prime**
\`\`\`
User: "Skip prime, I just need to check something quickly"
You: Understood, skipping prime. What do you need to check?
\`\`\`

## Notes

- Prime should complete in <10 seconds
- If prime fails, report issues and ask how to proceed
- Cache prime results for the session to avoid redundant checks
- Always surface critical blockers before starting work