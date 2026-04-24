# Audit Metadata

> Records the provenance of the Phase-1 audit so Phase-2 reconciliation knows exactly what was — and was not — represented.

## CLI reference

| Field | Value |
|-------|-------|
| Repo | `moderne-cli` (github.com/moderneinc/moderne-cli) |
| Commit SHA | `290f08af81b33d25c7c124886ab62b4a1175bdb5` |
| Commit date | `2026-04-23` |
| Commit subject | `Skip eager verification in mod config <lang> installation edit (#3714)` |
| Access mode | Read-only local worktree at `/Users/jaydjackson/conductor/workspaces/moderne-cli` |
| Writes to CLI repo during audit | None. Zero files created, modified, moved, or deleted. |

## Audit run

| Field | Value |
|-------|-------|
| Audit date | `2026-04-24` |
| Auditor | Claude (Opus 4.7) under Jayd Jackson's direction |
| Output location | `github.com/jaydjj/Construct`, branch `audit/initial`, path `audit/` |
| Tools used | Read, Grep, Glob, parallel Explore sub-agents across help / error / progress / banners-and-tables domains |
| Deliverables | `cli-inventory.md`, `cli-categorized.md`, `cli-deltas.md`, `cli-findings.md`, `audit-metadata.md` (this file) |

## Method summary

The audit was scoped to **every user-facing output surface** the CLI can produce:

- Help text (`--help`, `-h`, subcommand help, option descriptions).
- Error output (every `CommandException` throw site, every render branch of `convertError`, stack-trace / SSL / cause decoration).
- Progress output (all four progress-bar implementations and their selection logic).
- Banners (five end-of-run banners, startup banner, deprecation banner, incubation tag).
- Prompts, tables, action headers, next-steps, success/warning/info lines, hyperlinks.

For each surface, the inventory records: the literal string (or template), the code reference (`file:line`), and a representative rendered sample. Categorization then groups surfaces by emergent semantic type (not a predetermined taxonomy). Deltas and findings document inconsistencies and defects respectively.

The canonical entry point explored first was `StandardCommand.java` (the abstract base that every subcommand inherits); each domain was then crawled outward from there into concrete subcommands and support classes.

## Intentional exclusions

The following areas of `moderne-cli` were intentionally **not** audited and are therefore not represented in Phase 1. Phase 2 should know these surfaces exist but haven't been characterized:

- **`tray` subcommand** — macOS system-tray integration that renders native UI, not terminal output.
- **MCP-protocol message surfaces** — `ModMcpServer` and friends emit JSON-RPC messages for LLM tooling, not user-facing terminal output.
- **GraphQL payload construction** — query/mutation bodies sent over the wire; not user-facing.
- **Metrics / telemetry emissions** — OpenTelemetry spans, Prometheus metrics, Honeycomb exports; not user-facing.
- **Cron / scheduler diagnostics** — background task internals surfaced only to ops, not to the CLI user.
- **Test-fixture outputs** — `*Test.java` output is excluded; only production code paths are represented.
- **Internal `jsonschema` generation output** — build-time artifacts, not runtime.
- **Raw log output** — `ModerneSLF4JLoggerFactory` configuration and any log-level-gated stderr output is excluded; the audit characterizes user-visible terminal output only.

Some subcommands were touched lightly enough that their leaf-level option descriptions may not be individually inventoried even though the command's help-surface archetype is represented. Phase 2 should treat per-option literal text as "representatively sampled" rather than "exhaustively enumerated" — the patterns are captured; individual string polish is not.

## Out-of-scope deliverables (explicitly)

Per the Phase-1 brief, the audit produced **no**:

- Site scaffolding or framework choice.
- Extracted design tokens.
- Figma/Figma-MCP work.
- Reconciliation artifacts or design proposals.
- Recommendations — every finding is observation-only.
- Drift-detection loop, submodule, or any writeback path to `moderne-cli`.

## Notes for Phase 2

The outputs of this audit are structured for comparison, not just documentation. Specifically:

- `cli-inventory.md` entries carry stable IDs (e.g. `ERR-004`, `BAN-002`, `PROG-003`) that are cross-referenced from `cli-categorized.md` and `cli-deltas.md`. Phase 2 can reference any individual surface by its ID without re-crawling the CLI.
- `cli-categorized.md` groups by *emergent* category (from the CLI's actual behaviour), not a predetermined taxonomy. Phase 2's job is to map these onto the design-direction taxonomy; do not assume 1:1 alignment.
- `cli-deltas.md` is the **highest-leverage** deliverable for Phase 2. Each delta is a place where the design system must *decide* rather than codify, and carries a Phase-2 decision-cost rating (very low / low / medium / high) to help sequence the reconciliation. D-02 and D-10 are the two highest-leverage deltas.
- `cli-findings.md` is observation-only. Anything logged there is a bug or dead-code concern; none of it should be acted on as part of Phase 2 reconciliation. If any finding surfaces a CLI-engineering need, it should be tracked in the `moderne-cli` repo's issue tracker, not in Construct.
