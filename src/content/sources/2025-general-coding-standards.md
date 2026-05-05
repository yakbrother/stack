---
title: "General Coding Rules"
summary: "General-purpose AI coding guardrails adapted from PatrickJS/awesome-cursorrules — verify before claiming, change file-by-file, no apologies, accessibility throughout."
tags: [ai-coding, code-quality, accessibility]
related:
  - "AI Agent Guidelines"
  - "AI Code Correction Ruleset"
  - "Modern PHP Coding Standards v1.0"
draft: false
created: 2026-05-05
updated: 2026-05-05
sourceAuthor: "Tim Eaton (adapted from PatrickJS/awesome-cursorrules)"
sourceDate: 2025-10-01
---

A short, language-agnostic ruleset adapted from [PatrickJS/awesome-cursorrules](https://github.com/PatrickJS/awesome-cursorrules). Sits next to the language-specific rules ([Modern PHP Coding Standards v1.0](/sources/2025-09-modern-php-coding-standards-v1/), etc.) as the universal floor — things that apply regardless of stack.

## Summary

Three groups: **core principles**, **code changes & documentation**, **code quality & project management**. Mostly negative ("don't…") because the failure mode being targeted is verbose, over-eager AI behavior — the rules push back against fluff and assumption.

## Core principles

- **Verify information before presenting it.** No assumptions, no speculation without evidence.
- **Make changes file by file.** Surface them one at a time so the human can spot mistakes before the next one lands.
- **Never use apologies.**
- **Always think of accessibility (WCAG 2.2 compliance).**
- Don't add commentary about your understanding to comments or docs.

## Code changes & documentation

The strongest section. Constraints on AI output style:

- Don't suggest whitespace-only changes.
- Don't summarize changes after making them.
- Don't use emojis in code or PR messages.
- Don't invent changes beyond what was asked.
- Don't ask for confirmation of context already provided.
- Don't remove unrelated code or functionality. Preserve existing structures.
- Provide all edits for a single file in one chunk, not as multi-step instructions.
- Don't ask the user to verify implementations visible in the provided context.
- Don't suggest updates when no actual modifications are needed.
- Always link to real files, not generated context.
- Don't show or discuss the current implementation unless asked.
- Check the context-generated file for current contents.

This is the antidote to over-narration: the AI does the work and stops talking. The wiki you're reading enforces the same voice — the [voice memory](https://github.com/yakbrother) preference about first-person prose comes from the same place.

## Code quality

- Descriptive, explicit variable names over short ambiguous ones.
- Adhere to the existing project style for consistency.
- Consider performance when suggesting changes.
- Consider security implications.
- Suggest or include unit tests for new or modified code.
- Robust error handling and logging where necessary.
- Modular design for maintainability.
- Verify compatibility with the project's specified language/framework versions.
- Replace hardcoded values with named constants.
- Handle edge cases.
- Include assertions where they help validate assumptions.

## Project management

- **Never change directories or switch git repositories without explicit permission.**
- Verify you're in the correct project directory before making file changes.
- If a request could apply to multiple projects, ask which.
- Use the current working directory as context unless told otherwise.
- When uncertain about the target repo, ask — don't guess.

This last block is operational, not stylistic. AI tools that read the working directory context (Cursor, Claude Code, Aider) need explicit grounding to avoid editing the wrong project when many are open at once.

## Relevance to this wiki

This is the floor underneath the [AI Agent Guidelines](/sources/2025-ai-agent-guidelines/) and [AI Code Correction Ruleset](/sources/2025-11-ai-correction-rules/) — the always-applicable rules. Where the AGENTS.md doc adds personality and workflow, and the correction rules add a review checklist, this one adds the universal don'ts that don't depend on language or framework.

## Source

Adapted from [PatrickJS/awesome-cursorrules](https://github.com/PatrickJS/awesome-cursorrules) — a curated registry of `.cursorrules` files for the Cursor editor. Many of the same rules generalize directly to Claude Code, Aider, and any agent reading a project-root rule file.

## Note

The ruleset is short by design (~50 lines of rules total). Pattern: lean rule files compose better. A 50-line floor + a 200-line agent contract + a 400-line review checklist gives the AI enough to work with at every layer (always-on rules → on-call rules → audit rules), without burying the agent in 1000+ lines of context where everything is "important."
