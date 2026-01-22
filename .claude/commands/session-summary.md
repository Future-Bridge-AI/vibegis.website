---
name: session-summary
description: Capture session completion status, decisions, and lessons learned
---

# Purpose
Document what was accomplished in this development session, capture important decisions, identify gotchas, and note outstanding work.

## Instructions

When invoked, analyze the current session and generate a comprehensive summary:

### 1. Review Session Activity
- Examine recent git commits (if any)
- Review files that were created or modified
- Check the conversation transcript for key activities
- Identify major tasks that were worked on

### 2. Categorize Work Completed
List everything accomplished in this session:
- Features implemented
- Bugs fixed
- Refactoring done
- Documentation written
- Configuration changes
- Dependencies added/updated

### 3. Identify Outstanding Work
Document what remains to be done:
- Incomplete tasks from this session
- Known issues discovered but not fixed
- TODOs added to code
- Planned next steps
- Blockers encountered

### 4. Capture Decisions Made
Record important technical or architectural decisions:
- Technology choices (and why)
- Design patterns selected
- Trade-offs accepted
- Approaches rejected (and why)
- Standards or conventions established

### 5. Document Gotchas & Lessons Learned
Capture things that caused problems or would help future work:
- Unexpected issues encountered
- Solutions that worked (or didn't)
- Windows-specific considerations
- Environment setup challenges
- Integration quirks
- Performance considerations
- Security considerations

### 6. Generate Structured Output
Create a markdown document with the following structure:

\`\`\`markdown
# Session Summary - [Date]

## Session Context
- **Duration**: [Approximate time]
- **Focus Area**: [Main area of work]
- **Branch**: [Git branch if applicable]

## Completed Work
### Features & Functionality
- [Item 1]
- [Item 2]

### Bug Fixes
- [Item 1]

### Documentation & Configuration
- [Item 1]

## Outstanding Work
### High Priority
- [ ] [Task with context on why it's important]

### Medium Priority
- [ ] [Task]

### Low Priority / Future Considerations
- [ ] [Task]

## Decisions Made
### [Decision Category/Area]
**Decision**: [What was decided]
**Rationale**: [Why this decision was made]
**Trade-offs**: [What was gained/lost]
**Alternatives Considered**: [Other options and why they weren't chosen]

## Gotchas & Lessons Learned
### [Issue/Area]
**Problem**: [What went wrong or was unexpected]
**Solution**: [How it was resolved]
**Prevention**: [How to avoid this in future]
**Notes**: [Additional context]

## Code Artifacts
- Files created: [List]
- Files modified: [List]
- Key functions/classes: [List with brief description]

## Testing Status
- [ ] Unit tests written
- [ ] Integration tests written
- [ ] Manual testing completed
- [ ] Edge cases considered

## Next Session Recommendations
1. [First thing to tackle]
2. [Second priority]
3. [Context for getting started]

## Quick Reference
- **Key Files**: [Files to reference when resuming]
- **Key Concepts**: [Important concepts/patterns used]
- **Dependencies**: [New dependencies or important existing ones]
\`\`\`

### 7. Save the Summary
Write the summary to: \`docs/session-summaries/YYYY-MM-DD-session-summary.md\`

If the docs/session-summaries directory doesn't exist, create it.

### 8. Confirm Completion
After saving, provide:
- Path to the saved summary
- Brief 3-4 sentence overview
- Top 2-3 action items for next session

## Guidelines

- **Be Specific**: Use concrete examples, file names, function names
- **Be Honest**: Document failures and challenges, not just successes
- **Be Forward-Looking**: Make it easy for future you to pick up where you left off
- **Be Concise**: Important details, but avoid unnecessary verbosity
- **Use Checkboxes**: For outstanding tasks so they're actionable
- **Link Context**: Reference specific files, lines, or commits when relevant

## Example Usage

User invokes: \`/session-summary\`

You should:
1. Review the session transcript
2. Check git status and recent commits
3. Identify all work done
4. Generate the structured summary
5. Save to docs/session-summaries/
6. Confirm with brief overview

## Output Format

Your final response should be:

\`\`\`
✅ Session summary saved to: docs/session-summaries/[filename]

📋 Quick Overview:
[2-3 sentences summarizing the session]

🎯 Top Priorities for Next Session:
1. [First priority]
2. [Second priority]
3. [Third priority]

💡 Key Takeaway:
[One important lesson or decision from this session]/