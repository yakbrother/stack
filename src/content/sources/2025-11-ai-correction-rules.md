---
title: "AI Code Correction Ruleset"
summary: "A 396-line checklist for reviewing AI-generated code — security flaws, hallucinated dependencies, swallowed errors, missing edge cases. Run as a second pass."
tags: [ai-coding, code-review, security, code-quality, testing]
related:
  - "AI Agent Guidelines"
  - "AI code review checklist"
  - "Dependency hallucination"
  - "Pre-PR review workflow"
draft: false
created: 2026-05-05
updated: 2026-05-05
sourceAuthor: "Tim Eaton"
sourceDate: 2025-11-01
sourceFile: "/downloads/ai-rules/ai-correction-rules.md"
sourceFileLabel: "ai-correction-rules.md"
---

A meaty review checklist I keep around for catching common mistakes in AI-generated code. The doc's premise is that AI excels at the happy path and consistently overlooks failure modes, edge cases, and security boundaries. The intended workflow: open the AI-generated code in a fresh context window or hand it to a different agent, then walk this list top-to-bottom.

## Summary

The ruleset is organized into 14 sections — critical safety, security (CRITICAL PRIORITY), common mistakes, error handling, completeness, API/integration, state management, performance, testing, docs, framework specifics, AI hallucinations, review workflow, and tools. Security is flagged as critical because the cited industry research is alarming.

## Key statistics the doc cites

- **40%** of AI-generated code contains security vulnerabilities (IEEE study).
- **27.25%** of GitHub Copilot suggestions included vulnerabilities in testing.
- **80%** of AI-assisted tasks produced less secure code than human-written (Stanford).
- **3.5×** — developers were that much more likely to *think* AI code was secure when it wasn't.
- **24 million** secrets exposed on GitHub in one year, with the rate **40% higher** in repos using AI tools.
- **Training-data lag** — models are typically trained on data 1–5+ years old, so they don't know about recently-discovered CVEs and may suggest libraries with known vulnerabilities patched after their cutoff.

## Top categories the checklist covers

### Security (highest priority)
- **SQL injection** — verify prepared statements, never string concatenation.
- **XSS** — confirm output escaping at every interpolation site.
- **Command injection** — validate any system call.
- **Path traversal** — ensure file paths can't escape intended directories.
- **Hardcoded secrets** — API keys, tokens, passwords; AI training data contains many.
- **Auth checks** — at every layer, never client-side only.
- **Dependency hallucination** — AI invents plausible-sounding packages. See [the dependency-hallucination concept page](/concepts/dependency-hallucination/) for the dedicated treatment.
- **Outdated libraries with known CVEs** — model training cutoff problem.
- **Insecure randomness** in crypto operations — `crypto.randomBytes`, not `Math.random()`.

### Error handling and edge cases
The doc names this an "AI weakness" explicitly: models excel at the happy path and consistently overlook error states. The checklist drills into try/catch coverage, specific-vs-generic exception types, error logging detail, empty input handling, boundary values, special characters, timezones, floating-point precision, internationalization, and platform-specific code.

### AI-specific hallucinations
Three sub-categories:
- **Invented code elements** — functions/methods that don't exist, made-up configuration options, mixed incompatible patterns (e.g., React class components with hooks syntax).
- **Context misinterpretation** — code that works in isolation but breaks the existing architecture. Watch for unrequested features, references to file paths that don't exist.
- **Training data artifacts** — outdated libraries, insecure patterns replicated from public training data, deprecated APIs presented as current.

### Code completeness
- Unfinished functions (generation truncated mid-stream).
- Missing imports / wrong import paths.
- Missing return statements, callback completion gaps.
- Incomplete conditional branches.

## Red flags that warrant extra scrutiny

The doc flags these for slow review:

- Code handling user input or external data.
- Authentication / authorization logic.
- Database queries or persistence.
- File system operations.
- External API calls.
- Cryptographic operations.
- Financial calculations.
- `eval()` or any dynamic execution.
- Complex async/promise chains.
- Regular expressions (ReDoS risk).
- Generated code blocks longer than 100 lines.
- AI-suggested libraries you've never heard of.
- Code that "just works" without any modifications needed (suspicious).

## AI-generated file management

The doc prescribes a directory + gitignore convention:

- Commit AI-generated **summaries, analyses, decision logs** to `documentation/ai_generated/` — these are useful project context.
- Do **not** commit `CLAUDE.md`, `.claude/`, `.warp/`, `.cursor/`, `.aider/` — these are tool-specific temp state.

A sample `.gitignore` block sits at the bottom of the doc.

## Recommended automated tools

- **Security**: Gitleaks, Semgrep, Snyk, CodeQL, Aikido Security.
- **Code quality**: SonarQube, CodeClimate, ESLint, Pylint.
- **Dependencies**: Dependabot, Renovate, npm audit.
- **Testing**: Jest, Pytest, Cypress, Playwright.
- **Performance**: Lighthouse, WebPageTest, profilers.

## Philosophy

> AI is a productivity tool, not a replacement for engineering judgement. The goal is not to distrust all AI-generated code, but to apply appropriate scrutiny and validation. Treat AI code like code from an eager junior developer — it might work, but needs review.

The doc closes on three recurring themes: **defense in depth** (multiple validation layers), **shift left** (catch issues at dev time), and **continuous improvement** (track common AI errors per project, adjust prompts and add automated checks).

## Relevance to this wiki

This source seeds the AI-agents pillar's defensive surface. Pages derived from it: the [AI code review checklist](/synthesis/ai-code-review-checklist/) synthesis (merging this with the [AI Agent Guidelines](/sources/2025-ai-agent-guidelines/) into one actionable list), and the [dependency hallucination](/concepts/dependency-hallucination/) concept (the most distinctive AI-specific failure mode).

## Source notes

This is my own working ruleset, last updated based on research from November 2025 covering studies from IEEE, Stanford, GitHub, and security firms analyzing AI code-generation tools. Iterates over time as the field evolves.
