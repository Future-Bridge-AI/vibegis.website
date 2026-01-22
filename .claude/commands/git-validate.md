---
name: git-validate
description: Verify git and GitHub configuration, authentication, and branch status before starting work
---

# Purpose
Validate that git and GitHub are properly configured and ready for development work. This command ensures you're on the correct branch, authenticated, and ready to commit.

## Instructions

Execute the following validation workflow and report status:

### 1. Check Git Installation & Configuration

\`\`\`bash
# Verify git is installed
git --version

# Check git user configuration
git config user.name
git config user.email

# Check default branch setting
git config init.defaultBranch
\`\`\`

**Validate:**
- ✅ Git version is present
- ✅ user.name is configured
- ✅ user.email is configured
- ⚠️ Warn if email doesn't match expected domain (if applicable)

### 2. Check Repository Status

\`\`\`bash
# Verify we're in a git repository
git rev-parse --git-dir

# Check current branch
git branch --show-current

# Check remote configuration
git remote -v

# Check if branch has upstream tracking
git rev-parse --abbrev-ref --symbolic-full-name @{u}

# Check working tree status
git status --porcelain

# Check for uncommitted changes
git diff --stat
git diff --cached --stat
\`\`\`

**Validate:**
- ✅ Inside a git repository
- ✅ Current branch is known
- ✅ Remote is configured (typically 'origin')
- ✅ Branch has upstream tracking
- ⚠️ Warn if working tree has uncommitted changes
- ⚠️ Warn if branch is behind remote

### 3. Check GitHub CLI Authentication

\`\`\`bash
# Check if GitHub CLI is installed
gh --version

# Check authentication status
gh auth status

# List available repositories (confirms access)
gh repo view --json name,owner,url
\`\`\`

**Validate:**
- ✅ GitHub CLI is installed
- ✅ Authenticated to GitHub
- ✅ Can access the current repository
- ⚠️ Warn if not authenticated

### 4. Validate Branch Strategy

\`\`\`bash
# Get current branch
CURRENT_BRANCH=\$(git branch --show-current)

# Check if on main/master/develop
echo "Current branch: \$CURRENT_BRANCH"

# List recent branches
git branch -a --sort=-committerdate | head -10

# Check if branch is up to date with remote
git fetch origin
git status -sb
\`\`\`

**Validate:**
- ⚠️ Warn if on main/master (should typically work on feature branches)
- ✅ Confirm branch name matches expected pattern (e.g., feature/*, bugfix/*)
- ⚠️ Warn if branch is behind remote
- ⚠️ Warn if branch hasn't been pushed to remote

### 5. Check for Common Issues

\`\`\`bash
# Check for large uncommitted files
git ls-files -z | xargs -0 du -sh | sort -rh | head -5

# Check for untracked files
git ls-files --others --exclude-standard

# Check .gitignore exists
test -f .gitignore && echo ".gitignore exists" || echo ".gitignore missing"

# Check for merge conflicts
git diff --name-only --diff-filter=U
\`\`\`

**Validate:**
- ⚠️ Warn about large files (>10MB)
- 📋 List untracked files (for awareness)
- ⚠️ Warn if .gitignore is missing
- 🚨 ERROR if merge conflicts exist

## Output Format

Generate a structured status report:

\`\`\`markdown
# Git/GitHub Validation Report

## ✅ Configuration Status
- **Git Version**: [version]
- **User**: [name] <[email]>
- **Default Branch**: [branch name]

## 📍 Repository Status
- **Location**: [repository path]
- **Current Branch**: [branch name]
- **Remote**: [remote url]
- **Tracking**: [upstream branch]
- **Status**: [clean | uncommitted changes | behind remote]

## 🔐 GitHub Authentication
- **GitHub CLI**: [version | not installed]
- **Auth Status**: [authenticated | not authenticated]
- **Scopes**: [available scopes]
- **Logged in as**: [username]

## ⚠️ Warnings
[List any warnings found]

## 🚨 Errors
[List any errors that must be fixed]

## ✅ Ready to Start
[Yes/No - based on validation]

## 🔧 Recommended Actions
[List any actions needed before starting work]
\`\`\`

## Response Format

After validation, respond with:

**If everything is valid:**
\`\`\`
✅ Git/GitHub Ready

📍 Branch: [branch-name]
🔐 Authenticated: [github-username]
📦 Repository: [repo-name]
✨ Working tree: [clean | X files changed]

You're ready to start development!
\`\`\`

**If issues found:**
\`\`\`
⚠️ Git/GitHub Issues Detected

🚨 Critical Issues:
- [Issue 1]
- [Issue 2]

⚠️ Warnings:
- [Warning 1]
- [Warning 2]

🔧 Recommended Actions:
1. [Action to fix issue 1]
2. [Action to fix issue 2]

Run these commands:
[Specific commands to fix issues]
\`\`\`

## Error Handling

If commands fail, provide helpful diagnostics:

### Git not configured:
\`\`\`bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
\`\`\`

### Not in a git repository:
\`\`\`
❌ Not in a git repository
💡 Initialize with: git init
\`\`\`

### GitHub CLI not authenticated:
\`\`\`bash
gh auth login
\`\`\`

### Branch behind remote:
\`\`\`bash
git pull origin [branch-name]
\`\`\`

### Uncommitted changes:
\`\`\`
⚠️ You have uncommitted changes
💡 Commit or stash before switching branches:
   git add .
   git commit -m "description"
   # OR
   git stash save "work in progress"
\`\`\`

## Additional Checks (Optional)

Ask user if they want to:
- [ ] Create a new feature branch for this session
- [ ] Pull latest changes from main/develop
- [ ] View recent commits
- [ ] Check for open pull requests

## Guidelines

- **Be thorough but fast**: All checks should complete in <5 seconds
- **Be helpful**: Provide fix commands for any issues
- **Be clear**: Use emojis and formatting for quick scanning
- **Be actionable**: Every warning should have a solution
- **Be safe**: Never auto-fix critical issues, only suggest