---
title: "Fluid grid"
summary: "auto-fit + minmax(min(target, 100%), 1fr) gives a responsive grid that needs no media queries — column count follows content."
tags: [css, layout, fluid-design, design-system]
related:
  - "yakbrother Fluid Design System v3.2"
  - "Fluid design"
  - "Cascade layers"
draft: false
created: 2026-05-05
updated: 2026-05-05
---

## Problem

You want a grid of cards (or any equally-weighted items) that:

- shows as many columns as fit the viewport,
- never makes a column narrower than a usable minimum,
- doesn't overflow the viewport on small screens,
- and doesn't require media queries.

The naive `grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))` *almost* works, but it overflows when the viewport is narrower than `250px` (small phones, embedded views, narrow split-screens).

## Solution

```css
.fluid-grid {
  display: grid;
  gap: var(--layout-default-gap, 3vmax);
  grid-template-columns: repeat(
    auto-fit,
    minmax(min(var(--_fluid-min, 35ch), 100%), 1fr)
  );
}
```

The trick is the inner `min()`: each column's minimum is **the smaller of** the target minimum and 100% of the container width. On a 200px viewport, `min(35ch, 100%)` collapses to `100%` — one full-width column. On a wide viewport, it stays at `35ch` and `auto-fit` packs as many columns as fit.

```html
<!-- default: items at least 35ch wide -->
<div class="fluid-grid">
  <article>Card 1</article>
  <article>Card 2</article>
  <article>Card 3</article>
</div>

<!-- override per instance -->
<div class="fluid-grid" style="--_fluid-min: 250px">
  <img src="product1.jpg" alt="Product 1">
  <img src="product2.jpg" alt="Product 2">
</div>
```

## Why it works

- `auto-fit` fills the row with as many columns as fit the minimum, then expands them via `1fr` to consume leftover space.
- `minmax(X, 1fr)` lets columns shrink to `X` and grow to fill.
- `min(35ch, 100%)` is the safety valve. Without it, `auto-fit minmax(35ch, 1fr)` overflows when the container is narrower than `35ch`.
- The `--_fluid-min` custom property (with a leading underscore by convention, marking it internal) lets each call site override the minimum without writing a new class.

## When to use

This is the default layout primitive. Reach for it whenever you don't know exactly how many columns you need:

- Card grids (blog posts, products, team members).
- Form section layouts where field widths suggest column count.
- Image galleries with similarly-sized images.
- Dashboard widgets where the count varies.

## When to avoid

- **Fixed structural grids** — a 3-column dashboard you've explicitly designed for. Use `.repeating-grid` with `grid-template-columns: repeat(N, 1fr)` instead. Don't dress up an explicit design as "fluid"; the design intent matters.
- **Layouts where item width should *not* depend on item count.** A page with two cards shouldn't show two giant full-width cards just because they fit; sometimes you want fixed widths. Use a flex layout with `flex: 0 0 250px` or a max-width on the grid container.
- **Layouts requiring item-level alignment across rows.** `auto-fit` doesn't know about adjacent rows. For card grids where headlines or images must align across rows, use explicit grid tracks plus `subgrid`.

## Trade-offs

- **The grid count is not stable across viewport widths.** A 1000px viewport might show 3 columns; resize to 1100px and it might show 4. This is the point — but it can surprise users who expect snap behavior. Don't use this primitive for navigation chrome or for layouts where the column count is part of the brand identity.
- **No JavaScript-readable column count.** If your code needs to know "are we currently in 2-column or 3-column mode?", `.fluid-grid` is the wrong tool — use a `ResizeObserver` or `@container` size queries.

## Companion: container queries on grid items

Pair the fluid grid with container queries so each item responds to its own width, not the viewport:

```css
.fluid-grid > * {
  container: grid-item / inline-size;
}

@container grid-item (min-width: 400px) {
  .card-title { font-size: var(--font-size-lg); }
  .card { display: grid; grid-template-columns: 200px 1fr; }
}
```

Now a card in a sidebar stays compact even on a 4K monitor, while the same card in the main content area expands when there's room. This is the modern alternative to viewport-keyed media queries inside reusable components.

## Source

Adapted from the [yakbrother Fluid Design System v3.2](/sources/2026-04-yakbrother-fluid-design-system-v3-2/) (CC BY-SA 4.0). The `min()` trick was popularized by [Andy Bell and Heydon Pickering's Every Layout](https://every-layout.dev) and refined in [Geoff Graham's "Modern CSS Layouts, No Framework Needed"](https://www.smashingmagazine.com/2024/05/modern-css-layouts-no-framework-needed/).
