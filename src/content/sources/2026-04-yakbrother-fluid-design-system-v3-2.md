---
title: "yakbrother Fluid Design System v3.2"
summary: "My design system for fluid, accessible, modern web interfaces — the seed source for the rest of this wiki."
tags: [design-system, css, fluid-design, accessibility, wcag, eaa, baseline-2026]
related:
  - "Fluid design"
  - "Cascade layers"
  - "OKLCH color"
  - "Fluid grid"
  - "Derived color tokens"
  - "Motion opt-in"
  - "European Accessibility Act"
draft: false
created: 2026-05-05
updated: 2026-05-05
sourceAuthor: "Tim Eaton"
sourceDate: 2026-04-27
---

My design system for building fluid, accessible, modern web interfaces. Released as `v3.2` on 27 April 2026 under CC BY-SA 4.0. This document is the seed source for the rest of this wiki — most of the design pages here begin here.

## Summary

The system is organized around three priorities, in order:

1. **Fluidity first** — content and context determine layout, not arbitrary pixel breakpoints.
2. **Visual hierarchy** — not all elements deserve equal attention. Use contrast, size, and spacing deliberately.
3. **Comfortable reading** — typography should disappear. Readers shouldn't think about presentation.

It is dual-purpose: a human-readable design philosophy *and* a machine-readable instruction set for AI coding assistants. A companion Claude Code skill (`yakbrother-fluid-design-system.skill`) packages the same rules with an aggressive description so assistants apply them whenever generating UI code, even when not explicitly asked.

## Conformance targets

- **WCAG 2.2 AA** — the recommended conformance level (4.5:1 / 3:1 contrast, full keyboard operability, target size ≥ 24×24 CSS px).
- **EN 301 549** — the European harmonized standard, currently referencing WCAG 2.1 AA, tracking 2.2.
- **European Accessibility Act (EAA)** — binding for digital products and services sold to EU consumers from 28 June 2025. Covers non-EU sellers too.
- **EU AI Act** — phased through August 2026, requires AI-generated content disclosure and high-risk-system documentation.
- **Baseline Widely Available CSS (2026)** — `oklch()`, `color-mix()`, `light-dark()`, relative color syntax, container queries, `text-wrap: balance`/`pretty`, `field-sizing`, `:user-valid`/`:user-invalid`, View Transitions, anchor positioning, `@scope`, `interpolate-size`.

## Key claims

- **Fixed pixel breakpoints are obsolete.** `clamp()` plus `auto-fit minmax(min(…), 1fr)` covers ~90% of layout work without media queries.
- **HSL is no longer the default for programmatic color.** OKLCH is perceptually uniform, so derived states (hover/active/disabled) maintain predictable contrast across hues. Combined with `oklch(from var(--brand) calc(l - 0.08) c h)` and `color-mix()`, the entire interaction palette comes from one brand token.
- **`light-dark()` plus `color-scheme: light dark` replaces most `@media (prefers-color-scheme: dark)` blocks.**
- **Motion should be opt-in via `@media (prefers-reduced-motion: no-preference)`.** This makes reduced motion the safer default rather than a special case.
- **Cascade layers (`@layer reset, theme, layout, components, utilities`) eliminate specificity wars.** Lower layers cannot override higher layers regardless of selector specificity.
- **Twelve absolute "NEVER" rules.** Fixed breakpoints, generic divs over semantic elements, missing alt text, keyboard-trapping focus, color-only signaling, pixel `line-height`, `!important`, ignoring `prefers-reduced-motion`, sub-24×24 targets, paste-blocking on password fields, `outline: none` without replacement, HSL for programmatic color.
- **Layout primitives**: `.fluid-grid` (default), `.fluid-flex`, `.repeating-grid`, `.stack`, plus container queries on grid items so components respond to *their own* width.

## Cited authors and tools

The system stands on the shoulders of work by:

- **Trys Mudford and James Gilyead** — [Utopia](https://utopia.fyi) (fluid type and space calculators).
- **Andy Bell and Heydon Pickering** — [Every Layout](https://every-layout.dev) and the cascade layers primer.
- **Heydon Pickering** — [Testing HTML with Modern CSS](https://htmhell.dev/adventcalendar/2023/12/).
- **Jeremy Keith** — [hanging-punctuation gotcha for form fields](https://adactio.com/journal/21027).
- **Geoff Graham** — [Modern CSS Layouts, No Framework Needed](https://www.smashingmagazine.com/2024/05/modern-css-layouts-no-framework-needed/).
- **Chris Coyier** — [Things That Break aspect-ratio](https://chriscoyier.net/2023/04/04/things-that-can-break-aspect-ratio-in-css/).

## Relevance to this wiki

This source seeds the **Design** pillar. Pages derived from it cover the philosophy (fluid design), the architecture (cascade layers), the color system (OKLCH and derived tokens), the layout primitive (fluid grid), the motion approach (opt-in via no-preference), and the legal scope (EAA). The accessibility, typography, advanced-CSS, testing, and examples references in the companion skill remain in `/tmp/` for follow-up ingests as separate sources.

## Pages created from this source

- [fluid design](/concepts/fluid-design/) — concept page on fluidity-first philosophy
- [cascade layers](/concepts/cascade-layers/) — concept page on `@layer` architecture
- [OKLCH color](/concepts/oklch-color/) — concept page on perceptual uniformity
- [fluid grid](/patterns/fluid-grid/) — pattern page on `auto-fit minmax(min(…), 1fr)`
- [derived color tokens](/patterns/derived-color-tokens/) — pattern page on relative color syntax + `color-mix()`
- [motion opt-in](/patterns/motion-opt-in/) — pattern page on `prefers-reduced-motion: no-preference`
- [European Accessibility Act](/entities/european-accessibility-act/) — entity page on EAA scope and conformance

## License

CC BY-SA 4.0. Use freely, attribute, share improvements.
