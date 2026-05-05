---
title: "Pre-PR review workflow"
summary: "A five-step branch-review checklist before opening a PR — diff scope, test gaps, accessibility audit, interactive test creation, lint/format/run."
tags: [code-review, pr-review, testing, accessibility]
related:
  - "Pre-PR Review Workflow"
  - "AI code review checklist"
  - "AI Code Correction Ruleset"
draft: false
created: 2026-05-05
updated: 2026-05-05
---

## Problem

You've just finished a branch and are about to open a PR. Or — more often — an AI assistant has just generated a substantial diff and it's marked itself "done." Either way, hitting "Open PR" without a structured review costs you in a few predictable ways: missing tests get noticed by reviewers (slows down review), accessibility regressions slip into shared branches (compound over time), scope creep ships unnoticed (rolls back as a separate PR).

A five-minute structured pass closes most of those gaps before review even starts.

## Solution

Run the steps in order. Each is fast on its own; the order matters because earlier steps inform later ones.

### 1. Scope check

Run:

```sh
git status
git diff main...HEAD --stat
```

Skim the file list. Three questions:

- **Are these the files I expected?** Unexpected files (config files, lockfiles, files in unrelated modules) signal scope creep.
- **Is the line count proportional to the change?** A "fix typo" PR with 800 line changes is almost always wrong.
- **Is there an obvious off-by-one in the file list?** Forgotten test file, forgotten migration, etc.

If anything's surprising, investigate before continuing.

### 2. Test coverage

For each material change, ask:

- **New functionality** → does it have unit tests?
- **Modified functionality** → are existing tests still valid, or are they testing the old behavior?
- **Edge cases** → empty input, boundary values, error paths. AI-generated code particularly tends to skip these — see [the AI code review checklist](/synthesis/ai-code-review-checklist/).
- **Integration points** → are the seams between modules covered?

Don't write all the tests at once. Write **one**, run it, confirm it exercises the right thing, then move to the next. Slower per-test, faster overall — drift is caught early.

### 3. Accessibility (if UI changed)

Skip this step if the diff is backend-only. Otherwise:

- All interactive elements reachable by keyboard (`Tab` through them).
- Focus indicators visible (don't rely on browser defaults if you've reset outlines).
- Heading hierarchy intact — no skipped levels (h1 → h3 with no h2).
- Color is not the only signal (icons + labels alongside red/green).
- Form fields have associated `<label>` elements; placeholder text is not a label.
- Contrast meets WCAG AA — 4.5:1 for body text, 3:1 for large text and UI.
- Reduced-motion respected if you added animations — see [motion opt-in](/patterns/motion-opt-in/).

The [European Accessibility Act](/entities/european-accessibility-act/) is binding from 28 June 2025 for digital products sold to EU consumers — this checklist is the operational version of that obligation.

### 4. Tools pass

Run, in order:

- **Linter** (`eslint`, `prettier`, `phpcs`, `ruff`) — should be zero errors.
- **Type checker** (`tsc --noEmit`, `mypy`, `phpstan`) — should be zero errors.
- **Test suite** — at minimum the tests adjacent to the diff; ideally the full suite.
- **Security scan** if dependencies changed — `npm audit`, `pip audit`, `composer audit`. For AI-generated diffs, also verify new dependencies aren't [hallucinated](/concepts/dependency-hallucination/).

If any of these reports something, fix it before opening the PR. Don't expect the reviewer to do it.

### 5. Commit message and PR description

A small ritual that pays back disproportionately:

- **Commit messages** — conventional commits (`feat:`, `fix:`, `docs:`, `refactor:`). Under 72 characters for the subject. Body explains *why*, not *what* (the diff shows *what*).
- **PR description** — what the change does, why it's needed, how it was tested. Screenshots for UI changes. Links to the issue or design.
- **Don't squash everything into one commit** if the diff has logically separate steps. Reviewers read commit-by-commit when the messages are good.

## When to use

Every shared-branch PR. Not for personal scratch branches or experiment-and-discard work.

The workflow is especially load-bearing for:

- **AI-generated diffs** — see the [AI code review checklist](/synthesis/ai-code-review-checklist/) for the deeper version of step 2 + step 4.
- **Diffs touching auth, payments, or data persistence** — security review is part of step 4.
- **UI diffs** — step 3 catches accessibility regressions that compound silently.

## When to skip

- **Hotfix at 3am** — get the fix in, run the workflow before the follow-up PR.
- **Trivial doc changes** — typo fixes, README updates. Steps 1 and 5 still apply; the rest don't.
- **Generated-code commits** (lockfile bumps, snapshot updates) — step 1 (scope check) is sufficient.

## Trade-offs

- **5–15 minutes per PR.** Real cost. Pays back when reviewers don't have to find what you should have caught.
- **Encourages smaller PRs.** Once you've felt the friction of reviewing 800 lines yourself, you'll cap your branches at ~200.
- **Slows AI-assisted workflows.** That's the point. The workflow is a deliberate brake on the "ship faster with AI" failure mode where unchecked diffs compound.

## Source

Adapted from the [Pre-PR Review Workflow source](/sources/2025-pre-pr-review-workflow/) — my own working doc that I paste into Claude Code or Cursor to trigger an interactive review pass. The pattern compresses the source's five steps into a copy-pasteable checklist that humans can run unaided.
