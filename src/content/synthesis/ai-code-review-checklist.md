---
title: "AI code review checklist"
summary: "How to review AI-generated code so it doesn't ship vulnerabilities — a single actionable list distilled from two longer rule files."
tags: [ai-coding, code-review, security, code-quality]
related:
  - "AI Code Correction Ruleset"
  - "AI Agent Guidelines"
  - "Dependency hallucination"
  - "Pre-PR review workflow"
question: "How do I review AI-generated code so it doesn't ship vulnerabilities?"
confidence: high
draft: false
created: 2026-05-05
updated: 2026-05-05
---

## Question

How do I review AI-generated code so it doesn't ship vulnerabilities?

## Answer

Treat AI-generated code like code from an eager junior developer — it might work, but needs a second pass. Run this checklist before the diff ships. Optimised for ~5 minutes per ~200 lines.

### 1. Read the original prompt first

Before looking at the code, re-read what was actually asked for. AI commonly slips in unrequested features, refactors adjacent code, or pivots to a similar-but-different problem. Catch scope drift early.

### 2. Walk through the security boundary

Most production damage comes from input/output handling at the system edge. Six things, in order:

- **SQL** — every database call is a prepared statement; no string concatenation with user data.
- **XSS** — every user-data interpolation is escaped (`htmlspecialchars`, framework auto-escape, etc.).
- **Hardcoded secrets** — no API keys, tokens, passwords, database credentials in source. Scan the diff with [Gitleaks](https://github.com/gitleaks/gitleaks) before committing.
- **Auth checks** — every protected endpoint has explicit authorization. Don't trust client-side checks.
- **Path traversal** — any file operation has its path validated against the allowed root.
- **Command injection** — no `exec`/`system`/`spawn` with unvalidated input.

If any of these is wrong, **stop reviewing and fix it first.** Don't move on.

### 3. Verify the dependencies actually exist

This is the single most distinctive AI failure mode: models invent plausible-sounding packages that don't exist (or worse, exist as malware planted by squatters). For every new import in the diff:

- Confirm the package is on the official registry (npm, PyPI, Packagist).
- Check the spelling carefully — `lodash-utils`, `requests-async`, `react-toolkit` are common hallucinations.
- Look at recent download counts and last-publish date — abandoned packages and freshly-published lookalikes are red flags.

The [dependency hallucination](/concepts/dependency-hallucination/) page has the deeper treatment.

### 4. Check the error handling

AI excels at the happy path and consistently overlooks failures. Look for:

- **Try/catch coverage** around any I/O, parsing, or external call.
- **Specific exception types** caught, not generic `Exception`/`Error` (which silently swallows programming bugs).
- **Error messages with context** for debugging — but no leaked stack traces, internal paths, or user data.
- **Resource cleanup** in `finally`/`using`/`with` blocks.
- **Async coverage** — every `await` is inside a try/catch or has a `.catch` handler.

### 5. Walk the edge cases

Not exhaustive — just five quick poke-tests:

- What happens with an **empty input**? (`""`, `[]`, `null`, `undefined`)
- What happens at the **boundary**? (zero, max, negative, overflow)
- What happens with **special characters**? (quotes, newlines, unicode, emoji)
- What happens with a **very large input**? (1MB string, 100k-element array)
- What happens with **malformed data**? (invalid JSON, corrupted file, unexpected schema)

For UI code, also: empty state, loading state, error state, no permission, slow network.

### 6. Check the framework specifics

Skim for the AI traps in your stack:

- **React** — keys on lists are stable and unique (not array index); hooks at top level (no conditional hook calls); `useEffect` cleanup; deps array correct.
- **TypeScript** — no `as any`, no `@ts-ignore`; strict null checks; discriminated unions narrow correctly.
- **PHP** — `declare(strict_types=1);` present; types on every property/parameter/return; prepared statements; `password_hash`. See [Modern PHP Coding Standards v1.0](/sources/2025-09-modern-php-coding-standards-v1/).
- **Database** — indexes on filtered columns; transaction boundaries cover related operations; migrations reversible.

### 7. Run the tools

Don't just eyeball. Run:

- **Linter** — `eslint`, `prettier`, `phpcs`, `ruff`. Should be zero errors.
- **Type checker** — `tsc --noEmit`, `mypy`, `phpstan` (level 8+). Should be zero errors.
- **Test suite** — at minimum the tests adjacent to the diff.
- **Security scan** — Gitleaks for secrets, Semgrep for code patterns, `npm audit` / `pip audit` / `composer audit` for dependencies.

If a tool isn't wired into CI yet, run it locally during the review — it's faster than reading every line for the same patterns.

### 8. Sanity-check the diff size

If the AI generated >200 lines for a "small" change, something is off — likely scope creep, refactoring of untouched code, or a duplicated feature. Read every change with explicit "is this related to the prompt?" framing.

## Evidence

The checklist is distilled from two of my own rule files: the [AI Code Correction Ruleset](/sources/2025-11-ai-correction-rules/) (the long-form 396-line version) and the [AI Agent Guidelines](/sources/2025-ai-agent-guidelines/) (the agent contract).

The "treat AI code like a junior developer" framing comes from the correction ruleset's closing philosophy.

The statistics underwriting the checklist:

- **40%** of AI-generated code contains security vulnerabilities (IEEE study, 2024).
- **27.25%** of GitHub Copilot suggestions contained vulnerabilities in NYU testing.
- **80%** of AI-assisted tasks produced less secure code than human-written (Stanford, 2023).
- **3.5×** — developers thought their AI-generated code was secure when it wasn't.
- **24M** secrets exposed on GitHub in one year, 40% higher in repos using AI tools.

These numbers are why this checklist exists at all. Code review is always valuable; for AI-generated code it's load-bearing.

## Confidence

**High.** The checklist follows directly from two rulesets I've been iterating on for a year, validated by industry research and by enough painful PR reviews that the false-negatives are well-mapped.

The one place I'd flag medium confidence: the "5 minutes per 200 lines" budget. That's my pace; yours will differ. If a diff feels rushed, slow down — security flaws caught at review cost minutes, the same flaws caught after deploy cost days.

## Open threads

- **Automating step 3 (dependency verification)** — there should be a CLI tool that scans new imports in a diff and verifies them against the official registry, downloads count, and last-publish date. I haven't found one I trust. Candidate names get squatted faster than they ship.
- **AI-on-AI review** — handing the diff to a *different* model in a fresh context is a useful adversarial pass, but the failure modes are correlated (both might miss the same hallucinated import). Don't substitute it for human review; layer it on top.
- **Per-language framework lists** — the framework-specifics section in step 6 should be its own per-language synthesis page. Future work.
