---
title: "European Accessibility Act"
summary: "Binding EU accessibility requirements for digital products and services sold to EU consumers, effective 28 June 2025. Applies to non-EU sellers too."
tags: [accessibility, wcag, eaa, compliance, legal]
related:
  - "yakbrother Fluid Design System v3.2"
  - "Motion opt-in"
draft: false
created: 2026-05-05
updated: 2026-05-05
---

## Overview

The **European Accessibility Act** (EAA), formally **Directive (EU) 2019/882**, sets binding accessibility requirements for digital products and services sold to consumers in the European Union. It became binding on **28 June 2025**. The territoriality is consumer-facing: any business selling into the EU is covered, regardless of where it's headquartered. UK, US, Swiss, and other non-EU companies are not exempt.

## Scope

Products and services covered include:

- E-commerce websites and apps
- Banking, e-banking, and ATM software
- Transport ticketing and information services
- Telecommunications and messaging services
- E-books and e-readers
- Audio-visual media services (streaming, on-demand)
- Self-service terminals (kiosks, payment terminals)

A **microenterprise exemption** applies to *service* providers with fewer than 10 employees AND under €2 million annual turnover. Manufacturers of physical products get no such exemption.

## Conformance

Conformance with the EAA is presumed for digital services that meet **EN 301 549**, the European harmonized standard. EN 301 549 currently references **WCAG 2.1 Level AA**, with updates tracking WCAG 2.2. Targeting WCAG 2.2 AA is the recommended approach for future-proofing — WCAG 3.0 is still a Working Draft as of 2026 and is not expected to supersede 2.2 before 2027.

A claim of EAA conformance typically requires:

- Public **accessibility statement** describing conformance level, known issues, and remediation timeline.
- **Conformance testing** combining automated tools (axe, Lighthouse, WAVE) with manual screen reader testing (NVDA, JAWS, VoiceOver).
- **Documented remediation plans** for known non-conformances.
- Meaningful **complaint and feedback mechanisms** so users can report barriers.

**Accessibility overlays do not satisfy EAA requirements.** Tools that "auto-fix" accessibility by overlaying widgets on existing markup are explicitly insufficient and have been the subject of enforcement actions in adjacent jurisdictions.

## Penalties

Penalties vary by EU member state, but include:

- **Ireland**: criminal liability, up to imprisonment for non-compliance.
- **Germany, Spain, France**: substantial financial penalties, scaled to company size and harm.
- **All member states**: right of consumer action and regulator enforcement.

Multiple member states publish enforcement priorities; e-commerce, banking, and transport are commonly cited as initial focus areas.

## Practical implications for a public website

For a public-facing website built to the [yakbrother Fluid Design System v3.2](/sources/2026-04-yakbrother-fluid-design-system-v3-2/) standard:

- **Color contrast**: 4.5:1 for body text, 3:1 for large text and UI components (WCAG 2.2 AA).
- **Keyboard operability**: every interactive element must be reachable and operable without a pointer; never trap focus.
- **Visible focus indicators**: required by SC 2.4.7. The yakbrother system uses `:focus-visible` with an explicit `outline` and `outline-offset`.
- **Target size**: 24×24 CSS pixels minimum, per WCAG 2.2 SC 2.5.8.
- **Motion**: respect `prefers-reduced-motion`. See [motion opt-in](/patterns/motion-opt-in/) for the recommended pattern.
- **Forms**: visible labels (placeholder is not a label), `:user-valid`/`:user-invalid` validation, password fields must allow paste (SC 3.3.8).
- **Forced colors mode**: test with Windows High Contrast; preserve meaning when colors are overridden.

## Relationships

- **WCAG 2.2** — the technical standard the EAA effectively requires (via EN 301 549).
- **EN 301 549** — the harmonized European standard that references WCAG.
- **EU AI Act** — separate regulation, partially overlapping (AI-generated content disclosure, high-risk-system documentation). Different deadlines, different obligations.
- **ADA Title III (US)** — the closest US analogue; applies to "places of public accommodation," interpreted by US courts to include many websites. EAA is broader in scope and more explicit in technical requirements.

## Key outputs and references

- [European Accessibility Act — European Commission](https://commission.europa.eu/strategy-and-policy/policies/justice-and-fundamental-rights/disability/european-accessibility-act-eaa_en)
- [Directive (EU) 2019/882](https://eur-lex.europa.eu/eli/dir/2019/882/oj)
- [EN 301 549 standard](https://www.etsi.org/standards#page=1&search=301%20549)
- [WCAG 2.2 Quick Reference](https://www.w3.org/WAI/WCAG22/quickref/)
- [WCAG 2.2 New Success Criteria](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/)

## Source

Material adapted from the legal-compliance section of the [yakbrother Fluid Design System v3.2](/sources/2026-04-yakbrother-fluid-design-system-v3-2/) (CC BY-SA 4.0). For binding interpretation always consult the published Directive and the implementing national legislation in the relevant EU member state — this page is a working summary, not legal advice.
