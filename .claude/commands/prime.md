---
name: prime
description: Initialize development session with complete project context and validation
---

# Purpose
Prepare for a productive development session by validating environment, loading project context, and ensuring everything is ready to code.

## Execution Workflow

### Step 1: Git/GitHub Validation
First, validate git and GitHub configuration:

\`\`\`
Execute /git-validate command
\`\`\`

**If validation fails:**
- Stop and report issues
- Provide fix commands
- Wait for user to resolve before continuing

**If validation succeeds:**
- Continue to project analysis

### Step 2: Project Context Analysis

#### 2.1 Load Project Documentation
\`\`\`bash
# Check for key documentation files
ls -la README.md 2>/dev/null
ls -la CLAUDE.md 2>/dev/null
ls -la docs/ 2>/dev/null
ls -la .claude/ 2>/dev/null
\`\`\`

Read and summarize:
- README.md - Project overview
- CLAUDE.md - AI-specific context
- docs/architecture.md - System design (if exists)
- docs/session-summaries/ - Recent session notes (if exist)

#### 2.2 Analyze Project Structure
\`\`\`bash
# Get directory tree (reasonable depth)
tree -L 3 -I 'node_modules|.git|__pycache__|*.pyc'
# Or on Windows:
# dir /s /b | findstr /v "node_modules .git __pycache__"
\`\`\`

Identify:
- Project type (Python, JavaScript, full-stack, etc.)
- Key directories (src, tests, docs, config)
- Build/config files (package.json, pyproject.toml, etc.)
- Test framework setup

#### 2.3 Check Dependencies
\`\`\`bash
# For Python projects
if [ -f "pyproject.toml" ]; then
  cat pyproject.toml
fi
if [ -f "requirements.txt" ]; then
  cat requirements.txt
fi

# For Node projects
if [ -f "package.json" ]; then
  cat package.json
fi

# Check if dependencies are installed
if [ -f "package.json" ]; then
  test -d node_modules && echo "✅ Dependencies installed" || echo "⚠️ Run npm install"
fi

if [ -f "pyproject.toml" ]; then
  # Check if in virtual environment
  python -c "import sys; print('✅ Virtual env active' if hasattr(sys, 'real_prefix') or sys.base_prefix != sys.prefix else '⚠️ Activate virtual environment')"
fi
\`\`\`

#### 2.4 Recent Development Activity
\`\`\`bash
# Recent commits (context of recent work)
git log -10 --oneline --graph

# Recent branches (what's being worked on)
git branch --sort=-committerdate | head -5

# Check for open issues/PRs
gh issue list --limit 5
gh pr list --limit 5
\`\`\`

### Step 3: Environment Check

\`\`\`bash
# Check required tools
command -v python && python --version
command -v node && node --version
command -v npm && npm --version
command -v docker && docker --version

# Check environment variables (sanitized)
echo "Environment variables set:"
env | grep -i "API\|KEY\|TOKEN\|SECRET" | sed 's/=.*/=***/'
\`\`\`

### Step 4: Load Claude Code Configuration

\`\`\`bash
# Check Claude Code setup
ls -la .claude/
cat .claude/settings.json 2>/dev/null
cat .claude/settings.local.json 2>/dev/null

# List available commands
ls .claude/commands/ 2>/dev/null

# List available agents
ls .claude/agents/ 2>/dev/null
\`\`\`

### Step 5: Check for Session Summaries

\`\`\`bash
# Load last session summary if exists
ls -t docs/session-summaries/*.md 2>/dev/null | head -1
\`\`\`

If found, read the most recent session summary to understand:
- What was last worked on
- Outstanding tasks
- Decisions made
- Gotchas to avoid

### Step 6: Generate Session Briefing

Create a comprehensive briefing document:

\`\`\`markdown
# Development Session Briefing
**Date**: [current date/time]
**Branch**: [current branch]
**Last Commit**: [last commit message]

## ✅ Environment Status
- Git/GitHub: [status]
- Dependencies: [status]
- Tools: [status]

## 📁 Project Overview
**Type**: [project type]
**Tech Stack**: [key technologies]
**Purpose**: [brief description from README]

## 📊 Project Structure
\`\`\`
[key directories and their purposes]
\`\`\`

## 📝 Recent Activity
**Last 3 Commits**:
1. [commit 1]
2. [commit 2]
3. [commit 3]

**Open Items**:
- PRs: [count]
- Issues: [count]

## 🎯 Last Session Context
[Summary from most recent session-summary.md if available]

**Outstanding Tasks**:
- [ ] [task 1]
- [ ] [task 2]

**Key Decisions**:
- [decision 1]

**Gotchas to Avoid**:
- [gotcha 1]

## 🔧 Available Tools
**Custom Commands**: [list]
**Agents**: [list]
**Hooks**: [list if active]

## 🚀 Ready to Code
[Yes/No with any blockers]

## 💡 Suggested Next Steps
1. [suggestion based on outstanding work]
2. [suggestion based on project state]
3. [suggestion for quick wins]
\`\`\`

## Output Format

Present the briefing in a scannable format:

\`\`\`
🚀 Development Session Initialized

✅ Git/GitHub: Ready ([branch-name])
✅ Environment: Configured
✅ Dependencies: Installed

📁 Project: [project-name]
🏗️  Type: [project-type]
⚡ Tech: [main technologies]

📊 Recent Work:
   [last commit summary]

🎯 Outstanding Tasks:
   1. [task from last session]
   2. [task from last session]

💡 Quick Wins Available:
   • [suggestion 1]
   • [suggestion 2]

🔧 Custom Tools Available:
   • /session-summary - End session documentation
   • /git-validate - Re-check git status
   [... other commands]

Ready to start coding! What would you like to work on?
\`\`\`

## Guidelines

- **Run all checks quickly** - Total time <10 seconds
- **Be informative but concise** - Highlight what matters
- **Surface blockers immediately** - Don't hide critical issues
- **Provide context** - Help get back into the flow quickly
- **Be actionable** - Always suggest next steps
- **Cache results** - Don't re-run expensive operations unnecessarily

## Error Handling

If any critical check fails:
1. Stop the workflow
2. Report the specific failure
3. Provide fix commands
4. Ask if user wants to continue anyway

Non-critical warnings:
- Report but continue
- Add to "⚠️ Warnings" section
- Provide optional fix suggestions