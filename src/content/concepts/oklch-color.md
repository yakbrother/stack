---
title: "OKLCH color"
summary: "OKLCH is perceptually uniform — adjusting hue keeps lightness and chroma visually consistent. HSL is no longer the recommended default for programmatic color."
tags: [css, color, design-system, fluid-design, baseline-2026]
related:
  - "yakbrother Fluid Design System v3.2"
  - "Derived color tokens"
  - "Fluid design"
draft: false
created: 2026-05-05
updated: 2026-05-05
---

## What it is

`oklch()` is a CSS color function that takes lightness, chroma, and hue values in the OKLab perceptual color space. It's been Baseline Widely Available since 2024. The shape is `oklch(L% C H)` — for example, `oklch(60% 0.18 250)` is a mid-lightness blue with moderate chroma.

```css
--brand: oklch(60% 0.18 250);
```

## Why it matters

HSL has a perceptual uniformity problem. `hsl(60 100% 50%)` (yellow) is visually much lighter than `hsl(240 100% 50%)` (blue), even though both report `50%` lightness. Programmatically derived palettes break: a `darken(--accent, 10%)` step shifts a yellow brand into "still bright yellow" while shifting a blue brand into "much darker blue."

OKLCH is **perceptually uniform** — equal `L` values look equally bright across hues. This unlocks:

- **Programmatic palettes** that stay readable across hues.
- **Hover/active/disabled states** with predictable contrast ratios.
- **Wide-gamut P3 displays** rendering accurately (OKLCH covers more colors than sRGB).
- **Theming from a single brand token** — change one variable, derive the rest.

## How it works

Three companion features turn OKLCH into a complete color system:

**1. Relative color syntax** — derive colors from existing colors:

```css
:root {
  --brand: oklch(60% 0.18 250);
  --brand-hover:    oklch(from var(--brand) calc(l - 0.08) c h);
  --brand-active:   oklch(from var(--brand) calc(l - 0.15) c h);
  --brand-disabled: oklch(from var(--brand) l calc(c * 0.3) h);
}
```

The `from` keyword binds the source color's components to local variables `l`, `c`, `h`, which you can then transform.

**2. `color-mix()`** — blend two colors in any color space:

```css
--brand-bg-soft:   color-mix(in oklch, var(--brand) 8%, var(--color-surface));
--brand-bg-medium: color-mix(in oklch, var(--brand) 15%, var(--color-surface));
```

Mixing in OKLCH preserves perceptual uniformity. The same percentages produce visually proportional results regardless of brand hue.

**3. `light-dark()`** — pair surfaces with `color-scheme: light dark`:

```css
:root {
  color-scheme: light dark;
  --color-surface: light-dark(white, oklch(15% 0 0));
  --color-text:    light-dark(oklch(20% 0 0), oklch(95% 0 0));
}
```

This replaces verbose `@media (prefers-color-scheme: dark)` blocks for simple cases.

## In practice

- **Define one `--brand` token.** Derive every state from it. When the brand changes, the entire interaction palette updates.
- **Mix subtle backgrounds with `color-mix()`** rather than inventing per-shade tokens. Avoids token sprawl.
- **Use `light-dark()` for the small set of values that genuinely flip with theme** — surfaces, text, borders. Keep `prefers-color-scheme` media queries for whole-block style changes.
- **Pick a chroma you can actually render.** Wide-gamut hues with `C > 0.2` may look more saturated on P3 monitors than sRGB; preview on both.

## Variants

- **`color(display-p3 …)`** for explicit wide-gamut targets, e.g., brand assets meant to pop on modern displays.
- **`oklab()`** — same color space, expressed in Cartesian coordinates instead of polar (lightness, a, b). Useful for color manipulation algorithms; less ergonomic for hand-tuned palettes.
- **`hsl()`** still has a place for *hand-picked* palettes where perceptual uniformity isn't required. Designers reading `hsl(0 80% 50%)` as "red" find it more memorable than `oklch(63% 0.22 25)`.

## Fallback strategy

For older browsers (rare in 2026 but real for some enterprise targets):

```css
.button {
  background: #4a6fa5;            /* sRGB fallback */
  background: oklch(60% 0.18 250); /* modern */
}

@supports (color: color-mix(in oklch, red, blue)) {
  .button { background: var(--brand); }
}
```

The `@supports` test for `color-mix()` is a good proxy — browsers that have `color-mix()` in OKLCH also have `oklch()` and relative color syntax.

## Open questions

- **Programmatic accent generation.** Given a single hue, what's the right algorithm to produce a 7-step palette that hits AA contrast at every step? Tools like [oklch.com](https://oklch.com) help interactively, but a deterministic build-time generator is still an open design problem.
- **`contrast-color()`** is on the horizon — it picks black or white text based on a background. Until it lands, the workaround is `oklch(from var(--brand) calc((l - 0.6) * -infinity) 0 0)`, which is clever but reads as a hack.

## Source

Adapted from the [yakbrother Fluid Design System v3.2](/sources/2026-04-yakbrother-fluid-design-system-v3-2/) (CC BY-SA 4.0). Recommended further reading: [CSS Color Module Level 5](https://www.w3.org/TR/css-color-5/), [oklch.com](https://oklch.com), and the [relative color syntax guide on MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Colors/Using_relative_colors).
