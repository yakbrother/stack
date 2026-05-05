---
title: "Cascade layers"
summary: "@layer makes specificity predictable: lower layers can't override higher layers regardless of selector specificity."
tags: [css, design-system, fluid-design]
related:
  - "yakbrother Fluid Design System v3.2"
  - "Fluid design"
  - "Fluid grid"
draft: false
created: 2026-05-05
updated: 2026-05-05
---

## What it is

`@layer` is a CSS feature (Baseline 2022) that explicitly orders groups of rules. Rules in a later layer always beat rules in an earlier layer, regardless of selector specificity. Once you declare your layer order at the top of the stylesheet, you stop fighting the cascade.

```css
@layer reset, theme, layout, components, utilities;
```

Anything in `utilities` beats anything in `components`, which beats `layout`, and so on. A `!important` rule in `reset` cannot override a normal rule in `utilities`.

## Why it matters

Without layers, CSS specificity is the cascade — and specificity is hard to predict. A selector like `.card .button.primary[type="button"]` has different weight from `button.primary`, and the wrong one wins by accident. Teams reach for `!important` to break ties, which begets more `!important`, which begets the rewrite.

Layers replace specificity-as-priority with **explicit author intent**. You decide the order once. Specificity still matters *within* a layer — but never *between* layers.

## How it works

Declaring layers up front fixes the order. Subsequent `@layer` blocks add rules to the named layer regardless of where they appear in the file:

```css
@layer reset, theme, layout, components, utilities;

@layer reset {
  *, *::before, *::after { box-sizing: border-box; }
}

@layer theme {
  :root {
    --brand: oklch(60% 0.18 250);
    --color-text: light-dark(oklch(20% 0 0), oklch(95% 0 0));
  }
}

@layer components {
  .button { padding: 0.5em 1em; background: var(--brand); }
}
```

Unlayered rules sit *above* all layered rules in the cascade — useful for the rare emergency override, dangerous if used by accident.

## The yakbrother layer order

From the [yakbrother Fluid Design System v3.2](/sources/2026-04-yakbrother-fluid-design-system-v3-2/):

| Layer | Purpose |
|---|---|
| `reset` | Normalize browser defaults — box-sizing, margin reset, base line-height |
| `theme` | Design tokens — colors, type scale, spacing scale (custom properties) |
| `layout` | Reusable structural utilities — `.fluid-grid`, `.stack`, `.repeating-grid` |
| `components` | Specific UI components — buttons, cards, navigation |
| `utilities` | Single-purpose overrides — last word, but rare |

The order matters. Theme tokens defined in `theme` are available to every higher layer. Layout primitives in `layout` set positioning, but components can still override their own padding without specificity battles. Utilities sit at the top so a one-off `text-align: center` always wins.

## In practice

- **Third-party CSS goes in its own layer.** `@import url("vendor.css") layer(vendor);` lets you keep vendor styles below your own without forking them.
- **Avoid unlayered rules.** They beat *all* layers and become surprise wildcards. Put them in a layer even if it's a one-rule layer.
- **Specificity inside a layer still matters.** Layers don't replace specificity — they replace specificity *as the conflict resolution mechanism between groups*. Inside `components`, `.card .button` still beats `.button`.
- **Combine with `@scope`** for component encapsulation when you want styles to apply only within a parent and stop at a boundary.

## Open questions

- Should design system tokens live in `theme` or in unlayered `:root`? The yakbrother system puts them in `theme` so a downstream consumer can override token values from a higher layer (e.g., a theme-pack). Unlayered `:root` is harder to override cleanly.
- How do layers interact with shadow DOM? Each shadow root has its own cascade — layers declared in light DOM don't reach into shadow trees. Component libraries built on web components need to declare layer order inside each component.

## Source

Adapted from the [yakbrother Fluid Design System v3.2](/sources/2026-04-yakbrother-fluid-design-system-v3-2/) (CC BY-SA 4.0). Andy Bell's [primer on cascade layers](https://piccalil.li/blog/a-primer-to-cascade-layers/) is the recommended deep-dive.
