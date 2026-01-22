---
name: quality-check
description: Run comprehensive quality checks
---

# Purpose
Full quality validation workflow.

## Steps
1. Delegate to code-reviewer agent
2. Delegate to security-scanner agent
3. Run test suite (delegate to test-runner)
4. Check documentation coverage
5. Verify formatting

## Output
Comprehensive quality report with pass/fail for each check.