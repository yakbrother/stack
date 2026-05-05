---
title: "Derived color tokens"
summary: "One brand token. Derive hover, active, disabled, and subtle backgrounds from it with relative color syntax and color-mix(). Change one variable, repaint the system."
tags: [css, color, design-system, fluid-design, baseline-2026]
related:
  - "yakbrother Fluid Design System v3.2"
  - "OKLCH color"
  - "Cascade layers"
draft: false
created: 2026-05-05
updated: 2026-05-05
---

## Problem

Design systems usually ship a long list of color tokens: `--brand`, `--brand-hover`, `--brand-active`, `--brand-disabled`, `--brand-bg-soft`, `--brand-bg-medium`, plus the same family for every other accent. The list is hand-tuned per palette, drifts as the design evolves, and stops working as soon as someone wants a second brand color (white-label, theme-pack, dark-only accent). Copy-pasting the tuning is tedious and error-prone.

## Solution

Define **one** brand token. Derive every state from it with relative color syntax and `color-mix()`:

```css
:root {
  /* Single source of truth */
  --brand: oklch(60% 0.18 250);

  /* Interaction states — relative color syntax */
  --brand-hover:    oklch(from var(--brand) calc(l - 0.08) c h);
  --brand-active:   oklch(from var(--brand) calc(l - 0.15) c h);
  --brand-disabled: oklch(from var(--brand) l calc(c * 0.3) h);

  /* Subtle surfaces — color-mix() */
  --brand-bg-soft:   color-mix(in oklch, var(--brand) 8%, var(--color-surface));
  --brand-bg-medium: color-mix(in oklch, var(--brand) 15%, var(--color-surface));
  --brand-border:    color-mix(in oklch, var(--brand) 30%, var(--color-surface));
}
```

Change `--brand` and the entire interaction palette repaints. Add a second brand for theme-packs and you only define one token, not seven.

## Why it works

The two CSS features doing the work:

- **Relative color syntax** (`oklch(from var(--brand) …)`) lets you transform a source color: `from <color> <new-l> <new-c> <new-h>`. The keywords `l`, `c`, `h` reference the source's components, so `calc(l - 0.08)` produces "the same color, 8% darker."
- **`color-mix(in oklch, A P%, B)`** blends two colors in the OKLCH color space. Mixing in a perceptually uniform space means the same percentages produce visually proportional results across hues.

The combination gives you a complete palette from one input. See [OKLCH color](/concepts/oklch-color/) for why OKLCH is the right space for this — HSL produces noticeably different darkening behavior across hues.

## Diagram

```
                  --brand
                     │
    ┌────────┬───────┼────────┬─────────┐
    │        │       │        │         │
    ▼        ▼       ▼        ▼         ▼
  hover   active  disabled  bg-soft   border
  (L−.08) (L−.15) (C×0.3)  (mix 8%)  (mix 30%)
```

Every state is a deterministic function of the source. Reproducible, themeable, and readable from the variable definitions alone.

## When to use

- **Brand and accent colors.** Anywhere you have a primary color and want consistent interaction states.
- **Multi-tenant theming.** Each tenant ships one `--brand`; the rest is shared CSS.
- **Dark-mode flips.** Combine with `light-dark()` for surfaces; the derivations re-evaluate per theme automatically.

## When to avoid

- **Hand-tuned palettes.** A designer who has obsessed over each step of a 10-stop palette will be unhappy with formulaic derivation. Keep the tuned palette for those cases; use derivation for the long tail.
- **Fixed contrast targets.** `calc(l - 0.08)` is a relative move, not a contrast guarantee. If you need "exactly 4.5:1 against white," compute the L value explicitly or use a perceptual contrast tool.
- **Older browsers.** Relative color syntax has been Baseline since 2024 but enterprise targets may lag. Ship sRGB fallbacks for critical states; see [OKLCH color](/concepts/oklch-color/) for the `@supports` strategy.

## Trade-offs

- **Less designer control per token.** The trade-off for "change one, change all" is that you can't independently tune the disabled state without breaking the formula. For most products this is the right trade.
- **Implicit coupling.** Future maintainers may not realize that `--brand-hover` derives from `--brand` and try to override it with a literal value. A short comment at the token block helps: `/* All --brand-* states derive from --brand. Edit the formula, not the value. */`
- **Computed-value debugging is harder.** DevTools shows `oklch(from var(--brand) calc(l - 0.08) c h)`, not the resolved color. The Computed pane resolves it; just be aware.

## Examples

**Buttons, full state machine from one token:**

```css
.button {
  background: var(--brand);
  color: oklch(from var(--brand) calc((l - 0.6) * -infinity) 0 0); /* contrast-aware text */
}
.button:hover    { background: var(--brand-hover); }
.button:active   { background: var(--brand-active); }
.button:disabled { background: var(--brand-disabled); cursor: not-allowed; }
```

**Theme-pack:**

```css
[data-theme-pack="ocean"] { --brand: oklch(60% 0.15 220); }
[data-theme-pack="sunset"] { --brand: oklch(70% 0.18 40); }
[data-theme-pack="forest"] { --brand: oklch(55% 0.13 150); }
```

Each pack overrides one token; the entire interaction palette follows.

## Source

Adapted from the [yakbrother Fluid Design System v3.2](/sources/2026-04-yakbrother-fluid-design-system-v3-2/) (CC BY-SA 4.0). Recommended further reading: [Color themes with Baseline CSS features](https://web.dev/articles/baseline-in-action-color-theme) on web.dev.
