---
name: SaaS design system — next project
description: User wants to apply the Construct production-first pattern to Moderne's SaaS design system. Engineers use Storybook, no clean Figma DS.
type: project
---

Construct CLI experiment is complete and serves as the proof-of-concept for
applying production-first design system methodology to the SaaS product.

**Why:** SaaS has no clean design system in Figma. Multiple engineers use agents
to build pages. Multiple Storybooks exist with their own component rules.
Goal: analyze production → backwrite to Figma → harmonize → update UI + DS.

**How to apply:** Same loop as Construct — code is truth, Figma is bidirectional,
mirror/review/promote for new patterns, composition rules for lint. Component
vocabulary will be much larger (buttons, forms, tables, modals, cards, nav, etc.)
and rendering is React/HTML, not terminal text.

**Next step (2026-05-11):** User will analyze the SaaS repo to understand current
frontend architecture, then return to plan the adaptation.
