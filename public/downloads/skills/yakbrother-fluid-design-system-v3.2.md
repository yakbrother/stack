# Fluid Design System Ruleset v3.2

**Purpose:** This document serves as both a human-readable design philosophy AND machine-readable instructions for AI coding assistants (like Claude). When building web interfaces, follow these principles to create fluid, accessible, and modern experiences.

**Author:** Tim Eaton (@yakbrother)
**Last Updated:** April 27, 2026
**Conformance Targets:** WCAG 2.2 AA, EN 301 549, European Accessibility Act (EAA), EU AI Act, Modern CSS Standards

---

## Philosophy: Why This Approach?

Modern web design has moved beyond fixed breakpoints and rigid grid systems. The web is fundamentally fluid — it exists on devices from 320px watches to 4K monitors. Fighting this fluidity creates more work and worse experiences.

**Core Principle:** Let the browser do the heavy lifting. Use algorithms and intrinsic sizing instead of predetermined scales.

This approach embraces what Utopia calls "elegant scaling without breakpoints" — instead of designing for arbitrary breakpoints, we define minimum and maximum scales and let the browser interpolate between them based on viewport width. This creates a systematic approach to fluidity where designers and developers can work from the same mental model.

### The Three Priorities

1. **Fluidity First** — Content and context should determine layout, not arbitrary pixel values.
2. **Visual Hierarchy** — Not all elements deserve equal attention. Use contrast, size, and spacing deliberately.
3. **Comfortable Reading** — Typography should disappear. Readers shouldn't think about the text presentation.

---

## For AI Assistants: Instructions

When generating code for web interfaces, ALWAYS follow these rules. They represent tested patterns that create better user experiences with less code.

### Decision Framework

Use this flowchart when choosing layout approaches:

```
Does the layout need a fixed number of columns?
├─ YES → Use .repeating-grid or .repeating-flex
└─ NO → Should content determine column count?
   ├─ YES → Use .fluid-grid (PREFERRED)
   └─ NO → Explain why fixed columns are needed
```

### Critical "NEVER" Rules

These are absolute. If asked to violate these, push back and explain why:

- **NEVER** use fixed pixel breakpoints (`@media (min-width: 768px)`) — Use container queries or fluid units
- **NEVER** use generic divs when semantic HTML exists — `<article>`, `<section>`, `<nav>` have meaning
- **NEVER** omit alt text on images — Accessibility is non-negotiable
- **NEVER** trap keyboard focus — All interactive elements must be keyboard-accessible
- **NEVER** use color alone to convey information — Use icons, labels, or patterns too
- **NEVER** set line-height in pixels — Always use unitless values (e.g., `1.5`)
- **NEVER** use `!important` unless overriding third-party CSS you can't modify
- **NEVER** ignore `prefers-reduced-motion` for animations or transitions
- **NEVER** ship interactive targets smaller than 24×24 CSS pixels (WCAG 2.2 SC 2.5.8)

---

## CSS Architecture

All styles must be organized using CSS Cascade Layers for predictable specificity management.

### Layer Structure

```css
@layer reset, theme, layout, components, utilities;
```

**Why layers?** They prevent specificity wars. Lower layers (reset) can't override higher layers (utilities) regardless of selector specificity. This makes CSS predictable.

### Layer Purposes

#### `reset` — Normalize browser defaults

```css
@layer reset {
  *, *::before, *::after {
    box-sizing: border-box;
  }
  body {
    margin: 0;
    line-height: 1.5;
  }
}
```

#### `theme` — Global design tokens

> **Pro Tip:** Use Utopia's [Fluid Type Scale Calculator](https://utopia.fyi/type/calculator/) and [Fluid Space Calculator](https://utopia.fyi/space/calculator/) to generate optimized `clamp()` values.

```css
@layer theme {
  :root {
    color-scheme: light dark;

    /* Fluid Spacing — grows with viewport */
    --space-3xs: clamp(0.25rem, 0.23rem + 0.11vw, 0.31rem);
    --space-2xs: clamp(0.5rem, 0.46rem + 0.22vw, 0.63rem);
    --space-xs:  clamp(0.75rem, 0.68rem + 0.33vw, 0.94rem);
    --space-s:   clamp(1rem, 0.91rem + 0.43vw, 1.25rem);
    --space-m:   clamp(1.5rem, 1.37rem + 0.65vw, 1.88rem);
    --space-l:   clamp(2rem, 1.83rem + 0.87vw, 2.5rem);
    --space-xl:  clamp(3rem, 2.74rem + 1.3vw, 3.75rem);
    --space-2xl: clamp(4rem, 3.65rem + 1.74vw, 5rem);
    --space-3xl: clamp(6rem, 5.48rem + 2.61vw, 7.5rem);

    /* One-up pairs for consistent spacing relationships */
    --space-3xs-2xs: clamp(0.25rem, 0.14rem + 0.54vw, 0.63rem);
    --space-2xs-xs: clamp(0.5rem, 0.37rem + 0.65vw, 0.94rem);
    --space-xs-s:   clamp(0.75rem, 0.59rem + 0.76vw, 1.25rem);
    --space-s-m:    clamp(1rem, 0.74rem + 1.3vw, 1.88rem);
    --space-m-l:    clamp(1.5rem, 1.2rem + 1.52vw, 2.5rem);
    --space-l-xl:   clamp(2rem, 1.48rem + 2.61vw, 3.75rem);
    --space-xl-2xl: clamp(3rem, 2.39rem + 3.04vw, 5rem);
    --space-2xl-3xl: clamp(4rem, 2.96rem + 5.22vw, 7.5rem);

    /* Simplified aliases */
    --space-default: var(--space-m);
    --space-compact: var(--space-s);
    --space-section: var(--space-xl-2xl);

    /* Fluid Typography */
    --font-size-xs:   clamp(0.75rem, 0.7rem + 0.26vw, 0.94rem);
    --font-size-sm:   clamp(0.89rem, 0.83rem + 0.28vw, 1.06rem);
    --font-size-base: clamp(1rem, 0.95rem + 0.25vw, 1.25rem);
    --font-size-md:   clamp(1.13rem, 1.06rem + 0.33vw, 1.38rem);
    --font-size-lg:   clamp(1.27rem, 1.17rem + 0.47vw, 1.63rem);
    --font-size-xl:   clamp(1.42rem, 1.29rem + 0.65vw, 1.91rem);
    --font-size-2xl:  clamp(1.6rem, 1.42rem + 0.87vw, 2.25rem);
    --font-size-3xl:  clamp(1.8rem, 1.57rem + 1.15vw, 2.66rem);
    --font-size-4xl:  clamp(2.03rem, 1.73rem + 1.52vw, 3.16rem);
    --font-size-5xl:  clamp(2.28rem, 1.89rem + 1.96vw, 3.75rem);

    /* Layout Configuration */
    --layout-fluid-min: 35ch;     /* Optimal reading line length */
    --layout-content-max: 70ch;   /* Maximum readable line length */

    /* Modern Color System — see "Color" section below for full details */
    --brand: oklch(60% 0.18 250);
    --color-primary: var(--brand);
    --color-primary-hover: oklch(from var(--brand) calc(l - 0.08) c h);
    --color-primary-active: oklch(from var(--brand) calc(l - 0.15) c h);

    --color-surface: light-dark(oklch(99% 0 0), oklch(15% 0 0));
    --color-text:    light-dark(oklch(20% 0 0), oklch(95% 0 0));
    --color-muted:   color-mix(in oklch, var(--color-text) 60%, transparent);
    --color-border:  color-mix(in oklch, var(--color-text) 15%, transparent);
  }
}
```

**Why fluid scales?** Traditional design systems use fixed values that jump at breakpoints. Fluid scales use `clamp()` to smoothly interpolate, eliminating the need for most breakpoints while maintaining proportional relationships.

#### `layout` — Reusable structural utilities (see Layout System)
#### `components` — Specific UI components
#### `utilities` — Single-purpose overrides

---

## Color: The Modern Approach

> **Updated in v3.2.** Earlier versions of this document recommended HSL. As of 2026, `oklch()`, `color-mix()`, `light-dark()`, and relative color syntax are all Baseline Widely Available (Chrome, Firefox, Safari, Edge). HSL is no longer the recommended default.

### Why OKLCH Over HSL

HSL has a perceptual uniformity problem: yellow at `hsl(60 100% 50%)` is dramatically lighter than blue at `hsl(240 100% 50%)`, even though the lightness value is identical. This breaks programmatic color generation and creates contrast surprises.

**OKLCH is perceptually uniform** — adjusting just the hue keeps lightness and chroma visually consistent. This matters because:

- Programmatic palettes stay readable across hues
- Hover/active/disabled states maintain predictable contrast ratios
- Wide-gamut P3 displays render correctly
- Theming can be derived from a single brand token

### Pattern: Derive Tokens From One Source

```css
:root {
  --brand: oklch(60% 0.18 250);

  /* States derived from the brand token */
  --brand-hover:    oklch(from var(--brand) calc(l - 0.08) c h);
  --brand-active:   oklch(from var(--brand) calc(l - 0.15) c h);
  --brand-disabled: oklch(from var(--brand) l calc(c * 0.3) h);

  /* Subtle backgrounds via mixing */
  --brand-bg-soft:   color-mix(in oklch, var(--brand) 8%, var(--color-surface));
  --brand-bg-medium: color-mix(in oklch, var(--brand) 15%, var(--color-surface));
}
```

Change `--brand` and the entire interaction palette updates automatically.

### Pattern: Light/Dark With `light-dark()`

```css
:root {
  color-scheme: light dark; /* Required for light-dark() to work */
  --color-surface: light-dark(white, oklch(15% 0 0));
  --color-text:    light-dark(oklch(20% 0 0), oklch(95% 0 0));
}

/* User override (e.g., toggle button sets data-theme) */
[data-theme="light"] { color-scheme: light; }
[data-theme="dark"]  { color-scheme: dark; }
```

This replaces verbose `@media (prefers-color-scheme: dark)` blocks for simple cases.

### Pattern: Contrast-Aware Text

```css
.badge {
  background: var(--brand);
  /* Pick black or white text based on background lightness */
  color: oklch(from var(--brand) calc((l - 0.6) * -infinity) 0 0);
}
```

Or, when supported, use the upcoming `contrast-color()` function.

### Fallback Strategy

For the rare older browser:

```css
.button {
  background: #4a6fa5; /* sRGB fallback */
  background: oklch(60% 0.18 250); /* Modern */
}

@supports (color: color-mix(in oklch, red, blue)) {
  .button { background: var(--brand); }
}
```

---

## Layout System: Fluid Utilities

These classes form the foundation of all layouts. They're framework-independent and work with any content.

### Primary Choice: Fluid Grid

**Class:** `.fluid-grid`

**When to use:** Whenever you DON'T know exactly how many columns you need. This is the default choice.

```css
@layer layout {
  .fluid-grid {
    display: grid;
    gap: var(--layout-default-gap, 3vmax);
    grid-template-columns: repeat(
      auto-fit,
      minmax(min(var(--_fluid-min, var(--layout-fluid-min)), 100%), 1fr)
    );
  }
}
```

**Example usage:**

```html
<!-- Default: items at least 35ch wide -->
<div class="fluid-grid">
  <article>Card 1</article>
  <article>Card 2</article>
  <article>Card 3</article>
</div>

<!-- Override: items at least 250px wide -->
<div class="fluid-grid" style="--_fluid-min: 250px">
  <img src="product1.jpg" alt="Product 1">
  <img src="product2.jpg" alt="Product 2">
</div>
```

### Alternative: Fluid Flex

**Class:** `.fluid-flex`

**When to use:** When you want items to shrink below their minimum size if needed (rare).

```css
@layer layout {
  .fluid-flex {
    display: flex;
    flex-wrap: wrap;
    gap: var(--layout-default-gap, 3vmax);
  }
  .fluid-flex > * {
    flex: 1 1 var(--_fluid-min, var(--layout-fluid-min));
  }
}
```

### Secondary Choices: Fixed Columns

**Class:** `.repeating-grid`

```css
@layer layout {
  .repeating-grid {
    display: grid;
    gap: var(--layout-default-gap, 3vmax);
    grid-template-columns: repeat(var(--_grid-repeat, 2), 1fr);
  }
}
```

```html
<div class="repeating-grid" style="--_grid-repeat: 4">
  <div>Col 1</div><div>Col 2</div><div>Col 3</div><div>Col 4</div>
</div>
```

### Stack Layouts

**Class:** `.stack`

```css
@layer layout {
  .stack {
    display: flex;
    flex-direction: column;
    gap: var(--_stack-gap, var(--layout-default-gap));
  }
}
```

### Container Queries

```css
@layer layout {
  .fluid-grid > * {
    container: grid-item / inline-size;
  }
}

/* Item responds to its own width, not viewport */
@container grid-item (min-width: 400px) {
  .card-title { font-size: var(--font-size-lg); }
}
```

---

## Typography: Comfortable Reading

**Core principle:** "Readers read best what they read most." Typography should be invisible.

### Rules

- **Line Length:** 45–75 characters (20–35em) for body text
- **Line Height:** Inversely proportional to font size
  - Small text (12–16px): `line-height: 1.6–1.8`
  - Body text (16–20px): `line-height: 1.5`
  - Large headings (32px+): `line-height: 1.1–1.3`
- **Font Size:** Use fluid scales, never fixed sizes

```css
/* Good */
font-size: clamp(1rem, 0.95rem + 0.25vw, 1.25rem);

/* Bad */
font-size: 16px;
@media (min-width: 768px) { font-size: 18px; }
```

### Measure Constraint

```css
.prose {
  max-width: var(--layout-content-max, 70ch);
  margin-inline: auto;
}
```

### Modern Text Wrapping (Baseline 2024+)

Two CSS properties that solve typography problems we used to fix manually:

```css
/* Headings: avoid orphan words, balance lines */
h1, h2, h3, h4, h5, h6 {
  text-wrap: balance;
}

/* Body copy: avoid single-word last lines, improve rag */
p, li {
  text-wrap: pretty;
}
```

`text-wrap: balance` is computationally expensive on long blocks — apply it to short text (headings, pull quotes, captions). `text-wrap: pretty` is cheap enough for body copy.

### Hanging Punctuation (Progressive Enhancement)

Currently Safari-only as of April 2026. Use as progressive enhancement:

```css
.prose {
  hanging-punctuation: first last;
}

/* Critical fix: Prevent quotes from disappearing in form fields */
input, textarea, output {
  hanging-punctuation: none;
}
```

> **Gotcha:** Without the form field fix, quotation marks at the start of input values get pushed outside the field boundary and hidden. Credit: [Jeremy Keith](https://adactio.com/journal/21027)

### Self-Resizing Form Fields

```css
textarea {
  field-sizing: content;
  min-height: 3lh;
  max-height: 20lh;
}
```

`field-sizing: content` (Baseline 2024) makes form controls grow with their content. Eliminates most JS-based auto-resize libraries.

### Hierarchy Through Contrast

```css
h1 {
  font-size: var(--font-size-xl);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.02em;
  text-wrap: balance;
}

p {
  font-size: var(--font-size-base);
  line-height: 1.6;
  color: var(--color-text);
  text-wrap: pretty;
}

.text-secondary {
  color: var(--color-muted);
  font-size: 0.875em;
}
```

---

## Visual Hierarchy: Directing Attention

### 1. Size and Weight

```css
.btn-primary {
  padding: 1em 2em;
  font-weight: 600;
  background: var(--color-primary);
  color: white;
  min-height: 44px; /* Comfortably above 24px minimum */
}

.btn-secondary {
  padding: 1em 2em;
  border: 2px solid currentColor;
  background: transparent;
}

.btn-tertiary {
  padding: 0.5em 1em;
  text-decoration: underline;
  background: none;
}
```

### 2. Color and Contrast

De-emphasize rather than only emphasizing:

```css
.metadata {
  color: var(--color-muted);
  font-size: 0.875em;
}
```

### 3. Spacing

```css
.section-major { margin-block: 5vmax; }
.section-minor { margin-block: 2vmax; }
```

---

## Accessibility (Non-Negotiable)

These rules are legal requirements in many jurisdictions and ethical requirements everywhere.

### WCAG 2.2 AA Compliance

#### Perceivable

- All images must have alt text describing their purpose
- Videos must have captions and audio descriptions
- Color contrast must meet 4.5:1 for body text, 3:1 for large text and UI components

```html
<!-- Good -->
<img src="chart.png" alt="Sales increased 23% in Q3 compared to Q2">

<!-- Bad -->
<img src="chart.png" alt="chart">
<img src="chart.png">
```

#### Operable

- All functionality must work with keyboard only
- Focus indicators must be visible (never `outline: none` without replacement)
- No content flashes more than 3 times per second

```css
/* Good */
button:focus-visible {
  outline: 3px solid var(--color-primary);
  outline-offset: 2px;
}

/* Bad */
button:focus { outline: none; }
```

#### Understandable

```html
<!-- Good -->
<label for="email">Email address</label>
<input type="email" id="email" name="email" required>

<!-- Bad — placeholder is not a label -->
<input type="email" placeholder="Email">
```

#### Robust

```html
<!-- Good — semantic HTML -->
<button type="button">Click me</button>

<!-- Bad — div pretending to be a button -->
<div onclick="handleClick()">Click me</div>
```

### WCAG 2.2-Specific Success Criteria

WCAG 2.2 added nine new criteria. The ones with direct CSS/HTML implications:

#### SC 2.4.11 — Focus Not Obscured (Minimum) — AA

The focused element must not be entirely hidden by sticky headers, footers, or modals.

```css
/* Use scroll-padding to keep focused elements visible */
html {
  scroll-padding-top: 5rem; /* Match your sticky header height */
  scroll-padding-bottom: 2rem;
}
```

#### SC 2.5.7 — Dragging Movements — AA

Any drag-based action must have a single-pointer alternative (click/tap). If you implement drag-to-reorder, also provide up/down buttons or keyboard handlers.

#### SC 2.5.8 — Target Size (Minimum) — AA

Interactive targets must be at least 24×24 CSS pixels, or have spacing that creates a 24×24 hit area.

```css
button, [role="button"], a.btn, input[type="checkbox"], input[type="radio"] {
  min-height: 24px;
  min-width: 24px;
}

/* For inline links in body text, ensure spacing */
nav a {
  padding-block: max(0.5rem, calc((24px - 1lh) / 2));
}
```

#### SC 3.2.6 — Consistent Help

If a help mechanism (contact info, FAQ link, chat widget) appears on multiple pages, it must be in a consistent location.

#### SC 3.3.7 — Redundant Entry

Don't ask users to re-enter information they've already provided in the same session, unless re-entry is essential (e.g., password confirmation).

#### SC 3.3.8 — Accessible Authentication (Minimum)

No cognitive function tests (e.g., remembering a password, solving a puzzle) without an alternative. Support password managers — never disable paste on password fields.

```html
<!-- Good — supports password managers -->
<input type="password" autocomplete="current-password">

<!-- Bad — actively hostile -->
<input type="password" onpaste="return false">
```

### Motion Preferences (Critical Accessibility Gap in Earlier Versions)

Vestibular disorders, migraines, and ADHD can all be triggered by motion. Always respect `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* Or, write motion-aware components from the start */
.toast {
  transition: opacity 0.3s ease;
}

@media (prefers-reduced-motion: no-preference) {
  .toast {
    transition: opacity 0.3s ease, transform 0.3s ease;
  }
}
```

The second pattern is preferable for new code: motion is opt-in via `no-preference`, so users without explicit preferences get reduced motion as the safer default.

### Form Validation Styling

Use `:user-valid` and `:user-invalid` (Baseline 2023) instead of `:valid` / `:invalid`. The `:user-` variants only activate after the user has interacted, avoiding the "all fields are red on page load" anti-pattern:

```css
input:user-invalid {
  border-color: var(--color-danger);
}

input:user-valid {
  border-color: var(--color-success);
}
```

### Forced Colors Mode

Windows High Contrast users override site colors. Test with forced colors:

```css
@media (forced-colors: active) {
  .card {
    border: 1px solid CanvasText;
  }
  button {
    forced-color-adjust: none; /* Only when necessary */
  }
}
```

---

## Legal Compliance

### European Accessibility Act (EAA)

**Effective:** 28 June 2025

The EAA (Directive (EU) 2019/882) sets binding accessibility requirements for digital products and services sold to EU consumers. It applies regardless of where the provider is located — non-EU businesses (UK, US, Switzerland, etc.) selling into the EU are covered.

#### Who's Covered

- E-commerce websites and apps
- Banking, e-banking, ATM software
- Transport ticketing and information services
- Telecommunications and messaging services
- E-books and e-readers
- Audio-visual media services
- Self-service terminals

#### Microenterprise Exemption

Service providers with fewer than 10 employees AND under €2 million annual turnover are exempt — but only for services. Manufacturers of physical products get no such exemption.

#### Technical Standard

Conformance is presumed for digital services that meet **EN 301 549**, which currently references **WCAG 2.1 Level AA**. WCAG 2.2 conformance is recommended for future-proofing — EN 301 549 updates are tracking 2.2.

#### Penalties Vary by Member State

- **Ireland:** Includes potential criminal liability (up to imprisonment)
- **Germany, Spain, France:** Substantial financial penalties
- **All states:** Right of consumer action and regulator enforcement

#### What This Means in Practice

- Maintain a public accessibility statement
- Conduct accessibility conformance testing (e.g., axe, manual SR testing)
- Document remediation plans for known issues
- Don't rely on accessibility overlays — they don't satisfy EAA requirements

### EU AI Act

The EU AI Act is being implemented in phases. As of 2026:

- **Prohibited practices** (social scoring, manipulation, exploiting vulnerabilities, untargeted facial scraping): in force since February 2025
- **General-purpose AI obligations** (transparency, technical documentation): in force since August 2025
- **High-risk system rules** (employment, education, credit, critical infrastructure): being phased in through August 2026

When using AI-generated content or AI systems:

```html
<!-- Transparency is required -->
<figure>
  <img src="ai-generated.png" alt="Description of image content">
  <figcaption>
    <small>Image generated by AI</small>
  </figcaption>
</figure>
```

For high-risk systems: human oversight, explainability, data governance, and logging are all required.

### WCAG 2.2 vs. WCAG 3.0

WCAG 3.0 remains a Working Draft and is not expected to supersede 2.2 as a conformance target before 2027. Continue targeting 2.2 AA. APCA (Advanced Perceptual Contrast Algorithm) is being explored for 3.0 but is not yet a normative requirement; the 4.5:1 / 3:1 ratios from 2.x still apply.

---

## Practical Examples

### Example 1: Blog Post Layout

```html
<article class="stack prose">
  <header class="stack" style="--_stack-gap: 1rem">
    <p class="text-secondary">
      <time datetime="2026-04-27">April 27, 2026</time>
    </p>
    <h1>Fluid Design Systems</h1>
    <p class="text-large">Why fixed breakpoints are obsolete</p>
  </header>

  <div class="stack" style="--_stack-gap: 1.5rem">
    <p>Traditional responsive design relies on media queries…</p>
    <figure>
      <img src="comparison.png"
           alt="Side-by-side comparison showing fixed grid breaking at 768px versus fluid grid adapting smoothly">
      <figcaption>Fluid grids adapt continuously, not at arbitrary breakpoints</figcaption>
    </figure>
  </div>
</article>
```

### Example 2: Dashboard Layout

```html
<div class="repeating-grid" style="--_grid-repeat: 3; --layout-default-gap: 2rem">
  <section class="card">
    <h2>Revenue</h2>
    <p class="metric">$1.2M</p>
    <p class="change positive">
      <span aria-hidden="true">▲</span>
      <span>+23% vs last month</span>
    </p>
  </section>
  <!-- … -->
</div>
```

Note the icon plus text in `.change` — never communicate change direction by color alone.

### Example 3: Product Grid

```html
<div class="fluid-grid" style="--_fluid-min: 250px">
  <article class="product-card">
    <img src="product1.jpg" alt="Ergonomic keyboard with backlit keys">
    <h3>Pro Keyboard</h3>
    <p class="price">$129</p>
    <button class="btn-primary" type="button">Add to Cart</button>
  </article>
</div>
```

---

## Common Mistakes to Avoid

### ❌ Using Fixed Breakpoints for Layout

```css
/* Bad */
@media (min-width: 640px) { .grid { grid-template-columns: 1fr 1fr; } }
@media (min-width: 1024px) { .grid { grid-template-columns: 1fr 1fr 1fr 1fr; } }

/* Good */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(250px, 100%), 1fr));
  gap: 2rem;
}
```

### ❌ HSL for Programmatic Color

```css
/* Bad — yellow at l=50% is much lighter than blue at l=50% */
--accent: hsl(60 100% 50%);
--accent-hover: hsl(60 100% 40%); /* Actually similar lightness to base */

/* Good — perceptually uniform */
--accent: oklch(80% 0.18 90);
--accent-hover: oklch(from var(--accent) calc(l - 0.08) c h);
```

### ❌ Pixel-Perfect Spacing

```css
/* Bad */
.card { padding: 24px; }
@media (min-width: 768px) { .card { padding: 32px; } }

/* Good */
.card { padding: clamp(1.5rem, 2vw, 3rem); }
```

### ❌ Ignoring Content Width

```css
/* Bad */
.article { width: 100%; }

/* Good */
.article {
  max-width: 70ch;
  margin-inline: auto;
}
```

---

## Troubleshooting Common Issues

### When `aspect-ratio` Doesn't Work

#### Both dimensions set

```css
/* Bad */
.box { width: 300px; height: 200px; aspect-ratio: 16 / 9; /* Ignored */ }

/* Good */
.box { width: 300px; aspect-ratio: 16 / 9; }
```

#### Content forces height

```css
.card {
  width: 300px;
  aspect-ratio: 1;
  overflow: auto;
}
```

#### Flexbox stretching

```css
.flex-item {
  aspect-ratio: 16 / 9;
  align-self: flex-start;
}
```

Reference: [Chris Coyier's "Things That Can Break aspect-ratio"](https://chriscoyier.net/2023/04/04/things-that-can-break-aspect-ratio-in-css/)

---

## Testing & Validation

### Testing HTML with CSS

Modern CSS selectors are powerful enough to audit your HTML for accessibility issues without JavaScript. Useful when you don't have direct access to a codebase — provide a test stylesheet.

```css
/* Flag images without alt text */
img:not([alt]) { outline: 5px solid red; }

/* Flag links opening in new windows without warning */
a[target="_blank"]:not([aria-label]):not([title])::after {
  content: " ⚠️ Opens in new window";
  color: red;
}

/* Flag empty headings */
h1:empty, h2:empty, h3:empty, h4:empty, h5:empty, h6:empty {
  outline: 5px solid orange;
}

/* Flag inputs without associated labels */
input[id]:not([type="hidden"]):not(:has(+ label[for])) {
  outline: 3px solid orange;
}

/* Flag interactive elements smaller than 24×24 (WCAG 2.2 SC 2.5.8) */
button, [role="button"], a {
  &:not([style*="min-height"]) {
    /* Visual regression check — adjust to your actual computed values */
  }
}

/* Flag non-semantic markup */
div[class*="header"], div[class*="footer"], div[class*="nav"], div[class*="article"] {
  outline: 3px solid blue;
}
div[class*="header"]::before {
  content: "Consider semantic HTML: <header>, <footer>, <nav>, <article>";
  background: blue; color: white; display: block; padding: 0.5em;
}
```

Reference: [Heydon Pickering's "Testing HTML With Modern CSS"](https://htmhell.dev/adventcalendar/2023/12/)

### Browser Testing Checklist

Before considering any interface complete:

- [ ] Resize browser from 320px to 3840px — layout never breaks
- [ ] Navigate entire interface using only keyboard (Tab, Enter, Space, Arrows)
- [ ] Turn off CSS — content still makes sense in logical order
- [ ] Run axe DevTools or similar — zero violations
- [ ] Test with screen reader (NVDA, JAWS, or VoiceOver)
- [ ] Check color contrast (4.5:1 body, 3:1 large text and UI)
- [ ] View in forced colors mode (Windows High Contrast)
- [ ] Test with 200% browser zoom — no horizontal scrolling
- [ ] Test with `prefers-reduced-motion: reduce` enabled
- [ ] Verify all interactive targets are at least 24×24 CSS pixels
- [ ] Verify focused elements are not obscured by sticky UI
- [ ] Apply test stylesheet to check for HTML issues
- [ ] Confirm password managers can fill auth forms (no `onpaste` blockers)

---

## Advanced Techniques

### Container Queries for Component-Level Responsiveness

```css
.card {
  container: card / inline-size;
  padding: var(--space-s);
}

@container card (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: 200px 1fr;
    gap: var(--space-m);
  }
  .card-image { grid-row: 1 / -1; }
}

@container card (min-width: 600px) {
  .card { padding: var(--space-l); gap: var(--space-l); }
  .card-title { font-size: var(--font-size-2xl); }
}
```

### View Transitions API

For same-document transitions (route changes, list reorder, modal open):

```css
@view-transition {
  navigation: auto;
}

::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 0.3s;
}

@media (prefers-reduced-motion: reduce) {
  ::view-transition-group(*),
  ::view-transition-old(*),
  ::view-transition-new(*) {
    animation: none !important;
  }
}
```

### CSS Anchor Positioning

Anchor positioning (Baseline 2024 in Chromium, partial support elsewhere) lets you position elements relative to other elements without JavaScript — useful for tooltips, popovers, and submenu positioning.

```css
.anchor { anchor-name: --my-anchor; }

.tooltip {
  position: absolute;
  position-anchor: --my-anchor;
  top: anchor(bottom);
  left: anchor(center);
  translate: -50% 0.5rem;
}
```

For browsers without support, fall back to existing positioning approaches via `@supports`.

### `@scope` for Component Encapsulation

```css
@scope (.card) to (.card-content) {
  h2 { font-size: var(--font-size-lg); }
  /* These styles apply only inside .card and stop at .card-content */
}
```

Useful when you can't add unique class names to every nested element.

### Animating to `auto` With `interpolate-size`

Long-standing pain point: you couldn't animate `height: 0` to `height: auto`. Now you can:

```css
:root {
  interpolate-size: allow-keywords;
}

.accordion-content {
  height: 0;
  overflow: clip;
  transition: height 0.3s ease;
}

.accordion-content[data-open] {
  height: auto;
}
```

### Subgrid With Auto-Counting Rows

```css
.subgrid-rows {
  &:has(> :nth-child(1):last-child) { --subgrid-rows: 1; }
  &:has(> :nth-child(2):last-child) { --subgrid-rows: 2; }
  &:has(> :nth-child(3):last-child) { --subgrid-rows: 3; }
  &:has(> :nth-child(4):last-child) { --subgrid-rows: 4; }
  &:has(> :nth-child(5):last-child) { --subgrid-rows: 5; }
  &:has(> :nth-child(6):last-child) { --subgrid-rows: 6; }

  > * {
    display: grid;
    grid-row: auto / span var(--subgrid-rows, 4);
    grid-template-rows: subgrid;
    gap: var(--subgrid-gap, var(--space-s));
  }
}
```

> **Note:** This approach is bounded by the number of `:has()` rules you write. For unbounded child counts, use a CSS counter or set `--subgrid-rows` from JS.

---

## References and Further Reading

### Core Concepts
- [Utopia Fluid Design](https://utopia.fyi)
- [Utopia Type Calculator](https://utopia.fyi/type/calculator/)
- [Utopia Space Calculator](https://utopia.fyi/space/calculator/)
- [Modern CSS Layouts on web.dev](https://web.dev/learn/css/layout)

### Layout Systems
- [Modern CSS Layouts, No Framework Needed](https://www.smashingmagazine.com/2024/05/modern-css-layouts-no-framework-needed/) — Geoff Graham
- [Every Layout](https://every-layout.dev) — Heydon Pickering and Andy Bell
- [CSS Subgrid on MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Subgrid)

### Color
- [Color themes with Baseline CSS features](https://web.dev/articles/baseline-in-action-color-theme)
- [OKLCH color picker](https://oklch.com)
- [CSS Color Module Level 5](https://www.w3.org/TR/css-color-5/)
- [Relative color syntax on MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Colors/Using_relative_colors)

### Accessibility & Standards
- [WCAG 2.2 Quick Reference](https://www.w3.org/WAI/WCAG22/quickref)
- [WCAG 2.2 New Success Criteria](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/)
- [European Accessibility Act — European Commission](https://commission.europa.eu/strategy-and-policy/policies/justice-and-fundamental-rights/disability/european-accessibility-act-eaa_en)
- [EN 301 549 standard](https://www.etsi.org/standards#page=1&search=301%20549)
- [EU AI Act](https://eur-lex.europa.eu/eli/reg/2024/1689/oj)
- [Testing HTML with Modern CSS](https://htmhell.dev/adventcalendar/2023/12/) — Heydon Pickering

### Typography & Visual Design
- [On Web Typography](https://abookapart.com/products/on-web-typography) — Jason Santa Maria
- [Refactoring UI](https://www.refactoringui.com) — Steve Schoger and Adam Wathan
- [Hanging Punctuation Gotcha](https://adactio.com/journal/21027) — Jeremy Keith
- [text-wrap: balance & pretty on web.dev](https://web.dev/articles/css-text-wrap-balance)

### Advanced CSS
- [CSS Container Queries on MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries)
- [View Transitions API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API)
- [CSS Anchor Positioning](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_anchor_positioning)
- [@scope on MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/@scope)
- [Cascade Layers Primer](https://piccalil.li/blog/a-primer-to-cascade-layers/) — Andy Bell
- [Things That Break aspect-ratio](https://chriscoyier.net/2023/04/04/things-that-can-break-aspect-ratio-in-css/) — Chris Coyier

---

## Version History

- **v3.2 (2026-04-27):** Added EAA compliance section, modernized color system to OKLCH/`color-mix()`/`light-dark()`, added `prefers-reduced-motion` guidance, added WCAG 2.2-specific success criteria (Focus Not Obscured, Target Size, Dragging, Accessible Authentication, etc.), added `text-wrap: balance/pretty`, `field-sizing`, `:user-valid`/`:user-invalid`, View Transitions, Anchor Positioning, `@scope`, and `interpolate-size`. Updated EU AI Act phasing dates. Fixed v3.0/v3.1 version inconsistency.
- **v3.1 (2025-09-30):** Added Utopia fluid scales, hanging-punctuation, CSS testing techniques, aspect-ratio troubleshooting, self-modifying variables, expanded references.
- **v3.0 (2025-09-30):** Added AI assistant instructions, expanded examples, clarified rationale.
- **v2.0 (2025-08):** Initial fluid design system.
- **v1.0 (2024):** Bootstrap-based system (deprecated).

---

**License:** CC BY-SA 4.0 — Use freely, attribute, share improvements.

This document lives at [stack.yakbrother.dev](https://stack.yakbrother.dev) and is continuously refined based on real-world usage.
