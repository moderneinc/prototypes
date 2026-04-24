# Construct

The design system for the Moderne CLI.

Construct documents the visual language, patterns, voice, and states of the Moderne CLI — how the CLI communicates with its users through help text, errors, progress, prompts, and output. It is the source of truth for how CLI surfaces should look and read.

## Status

Early development. This repo is being built in phases:

- **Phase 1 — Audit** (in progress). A read-only audit of the current CLI's user-facing output surfaces. Artifacts live in `audit/`.
- **Phase 2 — Reconciliation & extrapolation.** Compare the audit against existing design directions (staged in `context/`) and extrapolate a design system. Outputs will live in `design-system/`.
- **Phase 3+** — Design system website, Figma mirror, and drift-detection loop. Scoped later.

## Repository structure

- `audit/` — Read-only audit of the current CLI. Inventory, categorization, consistency deltas, findings, and audit metadata. Describes the CLI as it is, not as it should be.
- `context/` — Design direction artifacts authored prior to this repo (UX proposals, help text rewrites, error-state uplifts). Historical inputs to Phase 2. Not edited.
- `design-system/` — The reconciled design system: tokens, patterns, voice, rationale, gaps. Produced in Phase 2.

## Scope

Construct covers the CLI's UI layer — what the user sees on screen. Patterns, technical architecture, and machine-readable output contracts are separate conversations owned jointly with product and technical leadership.

## Relationship to the CLI

Construct is a separate repository from the CLI. The CLI (`moderne-cli`) is never modified by work in this repo. Audits reference the CLI at a pinned commit; any findings are logged, not fixed. Changes to the CLI originate from product decisions, not from Construct.

## Contributing

Active contributors: Jayd Jackson, Annie Rimbach (UX).

Work happens on feature branches with PRs into `main`. Phase deliverables are reviewed before merge.
