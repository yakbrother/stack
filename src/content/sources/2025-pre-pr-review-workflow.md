---
title: "Pre-PR Review Workflow"
summary: "Systematic checklist before opening a PR — diff scope, test coverage gaps, accessibility audit, interactive test creation, lint/format/run."
tags: [code-review, pr-review, testing, accessibility, ai-coding]
related:
  - "Pre-PR review workflow"
  - "AI Code Correction Ruleset"
  - "AI Agent Guidelines"
draft: false
created: 2026-05-05
updated: 2026-05-05
sourceAuthor: "Tim Eaton"
sourceDate: 2025-10-01
---

A workflow doc I hand to AI assistants when reviewing a branch before it ships. The AI runs the steps interactively — it analyzes the diff, identifies test gaps, asks before creating tests, and confirms each test before moving on.

## Summary

Five steps, in order:

1. **PR status check** — does a PR exist for this branch? If not, ask whether to create one. Summarize scope.
2. **Test coverage analysis** — what new functionality lacks tests, what changed functionality has stale tests, what edge cases and integration points are exposed.
3. **Accessibility review** — only if UI changed: WCAG 2.2 conformance, semantic HTML, ARIA, keyboard nav, contrast, focus management.
4. **Interactive test creation** — ask before doing it. For each test: create, run, review with the user, confirm, move to the next.
5. **Final checks** — confirm tests created or explicitly skipped, verify they pass, remind about lint/format/commit message quality, suggest the full test suite.

The interactive cadence is the distinctive piece. Most "AI auto-generates tests" workflows produce a wall of tests the human has to wade through. This one writes one, runs it, asks "does this exercise the right thing?", waits, then writes the next. Slower per-test, faster overall because the human catches drift early.

## Test coverage priorities

The doc orders test coverage by criticality:

1. **Critical-path functionality** — features users depend on.
2. **Edge cases** — boundary conditions, unusual inputs.
3. **Error handling** — how the code responds to failures.
4. **Regression prevention** — tests for previously-fixed bugs.
5. **Integration points** — how components interact.

This ordering matters when the diff is large and the budget for new tests is small: don't burn it on getter/setter coverage when the auth boundary is untested.

## Accessibility checklist (if UI changed)

- All interactive elements keyboard-accessible.
- Visible focus indicators.
- Screen-reader announcements appropriate.
- Color is not the sole information channel.
- Text contrast meets WCAG AA (4.5:1 normal, 3:1 large).
- Form inputs have associated labels (placeholder is not a label).
- Error messages clear and accessible.

This is the same a11y substrate that runs through [the European Accessibility Act](/entities/european-accessibility-act/) and the [yakbrother Fluid Design System v3.2](/sources/2026-04-yakbrother-fluid-design-system-v3-2/). The PR review is where compliance gets checked at every commit, not just at audit time.

## Best practices the doc names

- Be specific about file paths and test locations.
- Cover happy path *and* error scenarios.
- Test behavior and contracts, not implementation details.
- Prioritize tests that prevent regressions and protect critical functionality.
- Test public interfaces, not internals.
- Keep tests maintainable and readable.

The "behavior over implementation" rule is the one that pays back the most over time — tests bound to implementation rot when you refactor, while tests bound to public contracts survive.

## Workflow trigger

The doc names the use case: "Bug fixes, feature additions, refactoring — any code changes that need review before merging." Not for prototype branches or scratch work; for things heading to a shared default branch.

## Relevance to this wiki

This source sits next to the [AI Code Correction Ruleset](/sources/2025-11-ai-correction-rules/) — together they're "audit before merge" (review checklist) and "review with the author present" (interactive workflow). The actionable runnable form lives at the [pre-PR review workflow pattern page](/patterns/pre-pr-review-workflow/), which compresses this five-step doc into a copy-pasteable checklist.

## Source

My own working doc, originally written for use with Claude Code's `/review` command and Cursor's chat. Use case: paste the doc into the conversation, then say "review this branch."
