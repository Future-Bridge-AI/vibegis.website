---
name: session-end
description: Complete session wrap-up with git commit/push and comprehensive documentation
---

# Purpose
Safely conclude a development session by committing changes, pushing to GitHub, generating documentation, and preparing for the next session.

## Execution Workflow

### Step 1: Pre-Flight Checks

\`\`\`bash
# Check git status
git status

# Check for uncommitted changes
git diff --stat
git diff --cached --stat

# Check current branch
BRANCH=\$(git branch --show-current)
echo "Current branch: \$BRANCH"

# Check if branch has upstream
git rev-parse --abbrev-ref --symbolic-full-name @{u} 2>/dev/null
\`\`\`

**Analyze:**
- Number of modified files
- Number of untracked files
- Whether branch is pushed to remote
- Any merge conflicts

### Step 2: Handle Uncommitted Changes

**If uncommitted changes exist:**

Ask user: "You have uncommitted changes. How would you like to proceed?"

**Options:**
1. **Review and commit** - Show changes and create commit
2. **Stash changes** - Save for later (git stash)
3. **Discard changes** - Dangerous, require confirmation
4. **Cancel** - Don't end session yet

**Option 1: Review and Commit**

\`\`\`bash
# Show what changed
echo "📝 Files modified:"
git status --short

echo ""
echo "📊 Change summary:"
git diff --stat

echo ""
echo "🔍 Detailed changes:"
git diff --color
\`\`\`

**Generate Smart Commit Message:**

Analyze the changes and suggest a commit message following conventional commits:

\`\`\`
Format: <type>(<scope>): <description>

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation only
- style: Formatting, missing semicolons, etc
- refactor: Code restructuring
- test: Adding tests
- chore: Maintenance tasks

Example: "feat(auth): add JWT token validation"
Example: "fix(api): resolve null pointer in user endpoint"
Example: "docs: update README with installation steps"
\`\`\`

**Suggested commit message based on changes:**
\`[Generated message based on file changes]\`

Ask user: "Use this commit message or provide your own?"

\`\`\`bash
# Stage all changes
git add -A

# Commit with message
git commit -m "user-provided or suggested message"

# Show commit
git log -1 --stat
\`\`\`

### Step 3: Push to Remote

\`\`\`bash
# Check if branch has upstream
if ! git rev-parse --abbrev-ref --symbolic-full-name @{u} 2>/dev/null; then
  echo "⚠️ Branch not tracked on remote"
  echo "Would you like to push and set upstream? (y/n)"
  # If yes:
  BRANCH=\$(git branch --show-current)
  git push -u origin \$BRANCH
else
  # Branch has upstream, normal push
  git push
fi
\`\`\`

**After push:**
\`\`\`bash
# Verify push succeeded
git status

# Show remote status
git log origin/\$(git branch --show-current)..HEAD 2>/dev/null
\`\`\`

**If push fails:**
- Check if branch is behind remote: \`git pull --rebase\`
- Check authentication: \`gh auth status\`
- Provide error message and suggested fixes

### Step 4: Generate Session Documentation

Execute comprehensive session analysis (similar to /session-summary but enhanced):

#### 4.1 Gather Session Metrics

\`\`\`bash
# Commits in this session (approximate based on time)
git log --since="4 hours ago" --oneline

# Files changed
git diff --stat HEAD~1..HEAD 2>/dev/null || git diff --stat

# Lines added/removed
git diff --stat HEAD~1..HEAD --shortstat 2>/dev/null

# Current time
date +"%Y-%m-%d %H:%M"
\`\`\`

#### 4.2 Generate Session Summary Document

\`\`\`markdown
# Session Summary - [Date] [Time]

## Session Overview
- **Duration**: [Approximate duration based on commits]
- **Branch**: [branch-name]
- **Commits**: [number of commits]
- **Files Modified**: [count]
- **Lines Changed**: +[added] -[removed]

## Git Activity

### Commits This Session
\`\`\`
[List of commits with messages]
\`\`\`

### Files Changed
\`\`\`
[git diff --stat output]
\`\`\`

## Work Completed

### Features Implemented
[Analyze commit messages and file changes to identify:]
- [Feature 1] - [files involved]
- [Feature 2] - [files involved]

### Bugs Fixed
[From commit messages with "fix:" prefix:]
- [Bug 1] - [description]
- [Bug 2] - [description]

### Code Improvements
[From "refactor:" or "style:" commits:]
- [Improvement 1]
- [Improvement 2]

### Documentation Updates
[From "docs:" commits or .md file changes:]
- [Update 1]
- [Update 2]

### Configuration Changes
[Any config file changes:]
- [Change 1]
- [Change 2]

## Outstanding Work

### TODO Comments Added
[Scan for new TODO comments in changed files:]
\`\`\`bash
git diff HEAD~1..HEAD | grep -i "todo\|fixme\|hack"
\`\`\`

### Known Issues
[From conversation or comments:]
- [ ] [Issue 1]
- [ ] [Issue 2]

### Next Session Priorities
[Based on incomplete work or logical next steps:]
1. [Priority 1]
2. [Priority 2]
3. [Priority 3]

## Technical Decisions

### Decisions Made
[Extract from conversation or commit messages:]

**Decision**: [What was decided]
**Context**: [Why this decision was needed]
**Alternatives**: [What else was considered]
**Impact**: [Effects of this decision]

## Gotchas & Lessons Learned

### Challenges Encountered
[From conversation history:]

**Issue**: [What went wrong]
**Solution**: [How it was resolved]
**Prevention**: [How to avoid in future]
**Time Lost**: [Approximate impact]

### What Worked Well
- [Success 1]
- [Success 2]

### What to Avoid
- [Pitfall 1]
- [Pitfall 2]

## Code Quality Metrics

### Testing
- [ ] Unit tests written for new code
- [ ] Integration tests updated
- [ ] Manual testing completed
- [ ] Edge cases considered

### Documentation
- [ ] Code comments added
- [ ] README updated if needed
- [ ] API docs updated if needed
- [ ] CHANGELOG updated

### Review Checklist
- [ ] Code follows project style guide
- [ ] No console.log / debug statements left
- [ ] Error handling implemented
- [ ] Security considerations addressed
- [ ] Performance impact considered

## Environment & Dependencies

### New Dependencies Added
[From package.json or requirements.txt changes:]
- [Dependency 1] - [version] - [purpose]

### Configuration Changes
[Any .env, config files, or settings modified:]
- [Change 1]

### Environment Notes
[Any Windows-specific or environment-specific notes:]
- [Note 1]

## Repository Status

### Branch Information
- **Current Branch**: [name]
- **Upstream**: [remote/branch]
- **Status**: [up to date / ahead / behind]
- **Last Push**: [commit hash and message]

### Repository Health
- **Merge Conflicts**: [none / list]
- **Untracked Files**: [count or list]
- **Git Status**: [clean / uncommitted changes]

## Quick Reference for Next Session

### Key Files Modified
1. [file 1] - [purpose/changes]
2. [file 2] - [purpose/changes]
3. [file 3] - [purpose/changes]

### Important Functions/Classes
- \`[function_name]\` in [file] - [what it does]
- \`[class_name]\` in [file] - [what it does]

### Context to Remember
- [Important context point 1]
- [Important context point 2]

### Useful Commands
\`\`\`bash
# [Command 1 with description]
[actual command]

# [Command 2 with description]
[actual command]
\`\`\`

## AI Assistant Notes

### Effective Prompts Used
[Save prompts that worked well:]
- "[Prompt that led to good results]"

### Ineffective Approaches
[Approaches that didn't work:]
- "[Approach to avoid]" - [Why it didn't work]

### Tool Usage
- Commands used: [list custom commands used]
- Agents invoked: [list any sub-agents used]
- Hooks triggered: [note any hook interactions]

## Session Statistics

### Productivity Metrics
- **Commits**: [count]
- **Files Modified**: [count]
- **Lines Added**: [count]
- **Lines Removed**: [count]
- **Functions Added**: [approximate count]
- **Tests Added**: [count]

### Time Distribution (Approximate)
- Planning & Analysis: [estimated time]
- Implementation: [estimated time]
- Debugging: [estimated time]
- Documentation: [estimated time]
- Git Operations: [estimated time]

## Ready for Next Session

✅ **Checklist:**
- [x] Changes committed
- [x] Changes pushed to remote
- [x] Documentation updated
- [x] Session summary created
- [x] Next steps identified
- [ ] Any blockers for next session? [List if any]

## Next Session Quick Start

\`\`\`bash
# Resume work quickly:
git pull
git checkout [current-branch]

# Start with these priorities:
# 1. [Priority 1]
# 2. [Priority 2]

# Key files to review:
# - [file 1]
# - [file 2]
\`\`\`

---
**Session End Time**: [timestamp]
**Branch**: [branch-name]
**Last Commit**: [commit hash]
\`\`\`

#### 4.3 Save Documentation

\`\`\`bash
# Create session summaries directory if needed
mkdir -p docs/session-summaries

# Generate filename
TIMESTAMP=\$(date +"%Y-%m-%d-%H%M")
FILENAME="docs/session-summaries/\${TIMESTAMP}-session-summary.md"

# Save the summary
# [Write the generated markdown above to the file]

echo "📄 Session summary saved to: \$FILENAME"
\`\`\`

### Step 5: Optional Git Tag

Ask user: "Would you like to tag this session in git?"

If yes:
\`\`\`bash
TAG_NAME="session-\$(date +"%Y-%m-%d-%H%M")"
git tag -a "\$TAG_NAME" -m "Session: [brief summary of work]"
git push origin "\$TAG_NAME"
echo "✅ Tagged as: \$TAG_NAME"
\`\`\`

### Step 6: GitHub Integration (Optional)

Ask user: "Any GitHub operations needed?"

**Options:**
1. **Create Pull Request** (if on feature branch)
   \`\`\`bash
   gh pr create --title "[Generated title]" --body "[Generated description]"
   \`\`\`

2. **View Open Issues**
   \`\`\`bash
   gh issue list --assignee @me
   \`\`\`

3. **Check PR Status**
   \`\`\`bash
   gh pr list --author @me
   \`\`\`

### Step 7: Cleanup & Verification

\`\`\`bash
# Final git status check
git status

# Verify push
git log origin/\$(git branch --show-current)..HEAD

# Check remote
git remote -v

# Branch status
git branch -vv
\`\`\`

### Step 8: Final Report

Generate clean exit report:

\`\`\`
✅ Session Ended Successfully

📊 Session Summary:
   • Commits: [X]
   • Files: [X modified]
   • Changes: +[X] -[X] lines
   • Branch: [branch-name]
   • Push Status: ✅ Up to date with remote

📄 Documentation:
   • Session summary: docs/session-summaries/[filename]
   • Git tag: [tag-name] (if created)

🎯 Next Session:
   Top 3 priorities:
   1. [Priority 1]
   2. [Priority 2]
   3. [Priority 3]

💡 Key Takeaway:
   [Most important learning or achievement from this session]

⚠️ Blockers (if any):
   [List any issues that need resolution]

🚀 Ready to Resume:
   git pull && git checkout [branch-name]

Have a great rest of your day! 👋
\`\`\`

## Error Handling

### If Git Push Fails

\`\`\`bash
# Check if behind remote
git fetch origin
git status

# Suggest:
echo "⚠️ Push failed. Your branch may be behind remote."
echo "Try: git pull --rebase"
echo "Then: git push"
\`\`\`

### If Merge Conflicts Detected

\`\`\`
🚨 Cannot end session: Merge conflicts detected

Conflicts in:
[List conflicted files]

Resolution steps:
1. Resolve conflicts in each file
2. git add [resolved-files]
3. git commit
4. Run /session-end again
\`\`\`

### If GitHub CLI Not Authenticated

\`\`\`
⚠️ GitHub CLI not authenticated

Some features unavailable:
- PR creation
- Issue linking
- Remote verification

Authenticate with: gh auth login
Or continue without GitHub integration? (y/n)
\`\`\`

## Guidelines

- **Never force push** without explicit user confirmation
- **Always verify** push succeeded before claiming success
- **Preserve work** - If any doubt, stash don't discard
- **Be thorough** - Better to over-document than under-document
- **Be helpful** - Provide clear next steps
- **Be safe** - Multiple confirmation for destructive operations

## Safety Checks

Before any destructive operation:
- Confirm with user
- Show what will be affected
- Provide undo instructions
- Never auto-proceed on errors