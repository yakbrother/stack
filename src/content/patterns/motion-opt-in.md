---
title: "Motion opt-in"
summary: "Make reduced motion the default and opt in to motion via prefers-reduced-motion: no-preference. Safer for users without an explicit preference, simpler to write."
tags: [css, accessibility, motion, wcag, fluid-design]
related:
  - "yakbrother Fluid Design System v3.2"
  - "European Accessibility Act"
draft: false
created: 2026-05-05
updated: 2026-05-05
---

## Problem

Animation and transition can trigger vestibular disorders, migraines, and ADHD-related discomfort. The standard fix is a global override:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

This works, but it has three problems:

1. **It uses `!important` everywhere.** That has cascading effects on other overrides.
2. **It assumes motion is the default.** Users without a stated preference get full motion — even though "no preference" doesn't actually mean "I want motion."
3. **It nukes useful state-change feedback** along with decorative motion. A button that fades in on focus loses its focus indicator timing.

## Solution

Invert the default. Write components without motion. Add motion in a `prefers-reduced-motion: no-preference` block:

```css
.toast {
  /* Default — works without animation */
  opacity: 1;
  transition: opacity 0.3s ease;
}

@media (prefers-reduced-motion: no-preference) {
  .toast {
    /* Add transform animation only when the user has expressed no preference */
    transition: opacity 0.3s ease, transform 0.3s ease;
  }
}
```

Users who:

- have set "reduce motion" — get the calm version,
- have *not* expressed a preference — get the calm version (safer default),
- have explicitly opted into motion (browsers expose this where supported) — get the full version.

The shift is from "treat reduced-motion as the special case" to "treat full motion as the special case."

## Why it works

`prefers-reduced-motion` has three values: `reduce`, `no-preference`, and the implicit "no `@media` rule applies." Most code only handles `reduce`, leaving everyone else with the maximalist default. By keying motion off `no-preference`, you flip the default *without* requiring users to opt out.

This also eliminates the `!important` cascade. There's no global override to fight; components ship with the calm version and self-elaborate when the user is fine with motion.

## When to use

This is the recommended default for new code. Apply to:

- **Decorative transitions** — toasts, modals, drawer slides, hover effects.
- **State-change animations** — the moving part of a button hover, the slide of an accordion.
- **Scroll-triggered animations** — almost always inappropriate without `no-preference` gating.

## When the global override still fits

Some cases benefit from the global override pattern, even with `no-preference` as the default approach:

- **Retrofitting an existing codebase.** The global `*` override is a one-line patch that makes an entire app safer immediately. Use it as a stepping stone, then refactor components to opt-in.
- **Third-party libraries you don't control.** A vendor widget that animates aggressively can be tamed with the override block.

## Trade-offs

- **More verbose for heavily animated UI.** Each animated component carries a `@media` block. For a marketing page with dozens of decorative effects, the line count adds up.
- **Easy to forget.** A new animation written outside `no-preference` ships full-motion to everyone. Code review and a test stylesheet (flag `* { animation: …; }` outside `@media` blocks) catch this.
- **Browser support for the explicit "more" preference is uneven.** macOS exposes "reduce motion" as a system setting; Windows users typically need browser-level prefs. This pattern still works — it just means most users land in the `no-preference` bucket.

## Companion: focus indicators that survive

Motion opt-in does **not** mean "no focus indicators." Focus visibility is a separate accessibility requirement:

```css
button:focus-visible {
  outline: 3px solid var(--color-primary);
  outline-offset: 2px;
}
```

Always use `:focus-visible` (not bare `:focus`), and never write `outline: none` without an equally visible replacement. See WCAG 2.2 SC 2.4.7 (Focus Visible) and SC 2.4.11 (Focus Not Obscured).

## Source

Adapted from the [yakbrother Fluid Design System v3.2](/sources/2026-04-yakbrother-fluid-design-system-v3-2/) (CC BY-SA 4.0). The pattern is consistent with WCAG 2.2 SC 2.3.3 (Animation from Interactions) and the [European Accessibility Act](/entities/european-accessibility-act/) requirement that interactive products must respect motion preferences.
