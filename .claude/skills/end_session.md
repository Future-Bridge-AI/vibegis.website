# Skill: Auto Session End Detection

## Triggers
- User says "I'm done"
- User says "end session"
- User says "wrap up"
- User says "call it a day"
- User says "finish for today"
- User says "done for now"
- User types "/exit" (suggest session-end first)

## Purpose
Help users properly conclude development sessions with git operations and documentation.

## Instructions

When user indicates they're ending their session:

1. **Detect Intent**
   - User explicitly says they're done
   - User is about to exit Claude Code
   - Work appears to be at a stopping point

2. **Suggest Session End**
   \`\`\`
   It looks like you're wrapping up. Would you like me to:
   
   1. Commit and push your changes
   2. Generate session documentation
   3. Prepare for next session
   
   Run /session-end (or /eod) to execute the full workflow.
   
   Or just say 'exit' to quit without saving.
   \`\`\`

3. **If User Confirms**
   Execute: \`/session-end\`

4. **If User Declines**
   \`\`\`
   No problem. Your changes are still uncommitted.
   Remember to commit before your next session!
   
   Type /exit to quit.
   \`\`\`

## Behavior Rules

**Always suggest session-end when:**
- User has uncommitted changes
- User says they're done
- Logical stopping point reached

**Don't suggest if:**
- User just started
- In middle of active debugging
- User explicitly says "quick check"

## Example Interactions

**Example 1: User Done**
\`\`\`
User: "I'm done for today"
You: "Great work today! Would you like to run /session-end to commit your changes and generate documentation? It will:
     • Commit and push to git
     • Create session summary
     • Prepare for next session"
\`\`\`

**Example 2: User About to Exit**
\`\`\`
User: "/exit"
You: "Before you go - you have uncommitted changes. Would you like to run /session-end first? (y/n)"
\`\`\`

**Example 3: Work Complete**
\`\`\`
[User completes a feature]
You: "Nice work on [feature]! This looks like a good stopping point. 
     Run /session-end when you're ready to wrap up and push your changes."
\`\`\`
"@ | Out-File -FilePath .claude\skills\auto-session-end.md -Encoding utf8

Write-Host "✅ Auto session-end skill created!" -ForegroundColor Green
Complete Workflow Integration
Now create a workflow reference document:
powershell@"
# Development Session Workflow

Complete workflow for productive development sessions with Claude Code.

## Session Start

\`\`\`
claude-code
[Auto-prime skill triggers]
/prime
\`\`\`

**What happens:**
1. Git/GitHub validation
2. Project context loaded
3. Dependencies checked
4. Recent work reviewed
5. Ready to code

## During Session

**Available Commands:**
- \`/git-validate\` - Check git status anytime
- Your custom commands as needed

**Git Operations:**
- Commit frequently: Use conventional commits
- Push regularly: Don't wait until end of day
- Branch properly: Stay off main/master

## Session End

\`\`\`
/session-end
# or
/eod
\`\`\`

**What happens:**
1. Review uncommitted changes
2. Generate smart commit message
3. Commit changes
4. Push to GitHub
5. Create session documentation
6. Tag session (optional)
7. Prepare next session brief

## Complete Example Session

\`\`\`bash
# Morning - Start session
claude-code
/prime

# You: "Let's implement the user authentication feature"
# [Work happens]

# Afternoon - Quick check
/git-validate

# [More work]

# Evening - End session
/session-end
# Review changes, commit, push
# Documentation generated

# Exit
/exit
\`\`\`

## File Structure Created

\`\`\`
docs/
└── session-summaries/
    ├── 2026-01-21-1430-session-summary.md
    ├── 2026-01-21-1730-session-summary.md
    └── 2026-01-22-0900-session-summary.md
\`\`\`

## Git History

\`\`\`bash
# Clean, documented commits
git log --oneline
abc123 feat(auth): implement JWT token validation
def456 fix(api): resolve null pointer in user endpoint
ghi789 docs: update README with new API endpoints

# Tagged sessions
git tag -l
session-2026-01-21-1430
session-2026-01-21-1730
session-2026-01-22-0900
\`\`\`

## Benefits

✅ **Never lose work** - Automatic commit and push
✅ **Always documented** - Every session has notes
✅ **Easy to resume** - Context preserved
✅ **Team friendly** - Clear commit messages
✅ **Audit trail** - Complete session history