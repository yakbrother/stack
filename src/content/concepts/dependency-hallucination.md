---
title: "Dependency hallucination"
summary: "AI assistants invent plausible-sounding package names that don't exist — or do exist, planted by squatters expecting exactly this. The most distinctive AI-specific supply-chain risk."
tags: [ai-coding, security, supply-chain]
related:
  - "AI Code Correction Ruleset"
  - "AI code review checklist"
  - "AI Agent Guidelines"
draft: false
created: 2026-05-05
updated: 2026-05-05
---

## What it is

When an AI coding assistant generates code that imports a package, it sometimes invents a package that doesn't exist. The name is plausible — `react-toolkit`, `lodash-utils`, `axios-helpers` — and the API the assistant calls "from" the package looks reasonable. The package is fictional. The import line is a hallucination.

Two failure modes follow:

1. **Build break** — the import fails at install time. Annoying, but visible.
2. **Slopsquat** — a malicious actor publishes a real package with the hallucinated name, anticipating that assistants will keep suggesting it. The build now succeeds and the project has just imported attacker-controlled code.

The second mode is the dangerous one. Industry researchers have demonstrated working slopsquat attacks across npm, PyPI, and PHP's Packagist; the threat is not theoretical.

## Why it matters

Every other "AI code is risky" pattern (missing input validation, swallowed exceptions, off-by-one errors) has a non-AI equivalent that human developers also produce. Human developers don't typically *fabricate package names*. This one is novel.

The base rates make it worse:

- A meaningful percentage of model-suggested package names don't exist on the registry.
- Models trained on public data have memorized npm/PyPI namespaces, so their "plausible package name" generator is unusually accurate at producing names that *feel* right.
- Squatters watch model outputs closely. The window between hallucination and registered-malicious-package can be hours.
- `npm install` (and equivalents) execute arbitrary code via post-install scripts on first install. There is no read-only "preview the package" step in the default workflow.

## How it works

The mechanic is plain: the model has learned that React projects often import from packages with names like `react-X`, that Lodash users sometimes reach for utility extensions, that axios is often paired with helpers. When generating code, it samples from this distribution. Whether the specific name it produces happens to be a real published package is a coin flip the model can't check.

The squatter side is just as plain: monitor public AI conversations, GitHub issues, and Stack Overflow answers for "I tried `npm install foo-helper` and it failed." Publish `foo-helper` immediately. Wait for the next person.

## In practice

Three defensive layers, in order of cost:

### Layer 1 — Verify before installing (cheap)

For every new import in AI-generated code:

- Look up the package on its official registry: [npmjs.com](https://www.npmjs.com/), [pypi.org](https://pypi.org/), [packagist.org](https://packagist.org/), etc.
- Check **download count**. Real popular packages have millions of weekly downloads; a "well-known" package with 12 weekly downloads is a fake.
- Check **last published**. Established packages have years of history; a "well-known utility" with one publish from last week is a fake.
- Check the **maintainer** matches what you expect. A `lodash-utils` published by `random-username-2025` is a fake.

This catches most slopsquats. Takes 30 seconds per new dependency.

### Layer 2 — Lock and audit (medium cost)

- Use a lockfile (`package-lock.json`, `pnpm-lock.yaml`, `composer.lock`, `Pipfile.lock`) and review it on every PR. New entries should match new explicit imports.
- Run `npm audit` / `pip audit` / `composer audit` in CI. These check installed packages against known-vulnerability databases.
- Pin to specific versions for production builds; the latest version of a once-good package can be a hijacked release.

### Layer 3 — Sandbox installation (highest cost, highest security)

- Install dependencies in a sandboxed environment (containerized CI, isolated dev environment) before the main project sees them.
- Use [Snyk](https://snyk.io), [Socket](https://socket.dev), or similar tools that statically analyze a package's code for known-bad patterns (network exfiltration, credential reading, post-install scripts) before allowing install.
- For high-stakes projects: maintain an internal registry mirror with explicitly-vetted packages.

Most projects stop at layer 2. Layers 1 and 2 together catch ~95% of slopsquat attempts.

## Variants

- **Function-name hallucination** — the package is real, but the AI invented a method name that doesn't exist on it. Less dangerous (build breaks at runtime), but eats time. Same defensive surface (verify against official docs, run the type checker).
- **Version hallucination** — the package and method exist, but in a different version than the AI assumes. The AI's training cutoff predates the version's API change. Defense: check the package's actual current API in its current docs, not the AI's recollection.
- **Cross-ecosystem confusion** — the AI suggests a Python package by its npm name (or vice versa). Subtype of the function-name case.

## Open questions

- **How long is the squat window?** Anecdotally, hours. A serious empirical study would help — minutes vs. days drives different defensive postures.
- **Can registries pre-emptively defend?** npm's typosquat detection has improved, but slopsquats aren't typos — they're plausible names that just happen not to exist yet. Different defensive surface.
- **Will model providers add a "verify against registry" tool?** If a coding-assistant model could call out to a live registry check before suggesting an import, this whole category collapses. Until then, the human is the verifier.

## Source

Identified explicitly as an AI-specific risk in the [AI Code Correction Ruleset](/sources/2025-11-ai-correction-rules/) under "Dependency & Supply Chain Security." The phrase **"slopsquat"** comes from security research circles, popularized in 2024–2025 as the threat model became public. The defensive layers above are my distillation; specific tools (Snyk, Socket) are widely used in the security industry but I'm not endorsing any particular vendor — pick what fits your stack.
