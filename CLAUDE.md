# CLAUDE.md

Instructions for Claude Code when working in this repo.

## On session start

Run the status report and check Figma for pending work:

1. Run `npm run status` — shows pattern count, mirror items, coverage gaps, recent changes
2. Read the Figma file via MCP: `get_figma_data(fileKey="twkYEkdg94dq5FQB6D9vDq", depth=2)`
3. Check the Mirror page for:
   - `✓ APPROVED` nodes → promote: move `.md` from `design-system/mirror/` to `design-system/patterns/`, update `screens.json`, then `npm run figma-plugin:rebuild`
   - `✗ REJECTED` nodes → report the rejection reason from the node name, propose a revision, write the revision to `design-system/mirror/<name>.md`, then `npm run figma-plugin:rebuild`
4. Report a summary: what's canonical, what's in review, what needs attention

## Why the rebuild step matters

The Figma plugin **bakes mirror and pattern content into `code.js` at build time** (see `__MIRROR_ITEMS_PLACEHOLDER__` in `lib/interpreters/figma-plugin/src/header.js`). Editing a `.md` file is not enough — the plugin only sees changes after `npm run figma-plugin:rebuild` regenerates `code.js` with the new content + hashes. After rebuilding, reload the plugin in Figma and click Apply to re-render frames.

The git pre-commit hook rebuilds automatically on commit, but live demos don't commit between steps, so the rebuild must be explicit.

## Figma file

- File key: `twkYEkdg94dq5FQB6D9vDq`
- URL: https://www.figma.com/design/twkYEkdg94dq5FQB6D9vDq/CLI-Design-System-Experiment

## Key commands

When the user says any of these, **run the command directly** — don't tell them to run it in terminal. Execute it yourself.

| Say this | What Claude does |
|---|---|
| `status` | Run `npm run status` and report the output |
| `pull from Figma` | Read Figma via MCP, diff against canonical, propose token edits. If approved, edit `tokens.json`, run `npm run figma-plugin:rebuild` |
| `check mirror` | Read Figma via MCP, check all mirror items: promote `✓ APPROVED` ones (move to `patterns/`, update `screens.json`), report `✗ REJECTED` ones with the reason. For rejections, **always ask**: "Do you want me to revise based on this feedback, or would you like to upload a screenshot of what you have in mind?" Do not auto-revise. Run `npm run figma-plugin:rebuild` after any changes. |
| `approve <name>` | Move `design-system/mirror/<name>.md` to `design-system/patterns/`, update `screens.json`, run `npm run figma-plugin:rebuild` |
| `demo 1` or `start demo 1` | Run `npm run demo:start -- 1`, then run `npm run figma-plugin:rebuild`, then tell the user to open Figma and Apply |
| `demo 2` or `start demo 2` | Run `npm run demo:start -- 2`, then run `npm run figma-plugin:rebuild`, then tell the user to open Figma and Apply |
| `demo 3` or `start demo 3` | Run `npm run demo:start -- 3`, then run `npm run figma-plugin:rebuild`, then tell the user to open Figma and Apply |
| `demo 4` or `start demo 4` | Run `npm run demo:start -- 4`, then run `npm run figma-plugin:rebuild`, then tell the user to open Figma and Apply |
| `end demo` or `demo end` | Run `npm run demo:end` — restores everything to committed state |
| `reset the <name> demo` | Restore a pattern to its mirror stub, run `npm run figma-plugin:rebuild` |

**Important**: always run the commands yourself. The user should never need to open a terminal. The only things they do manually are: open Figma, run the plugin (Plugins → Development → Construct), and click Apply/Approve/Reject.

## Promoting patterns — composition rules analysis

When promoting an approved pattern (moving from mirror/ to patterns/), always:

1. Move the `.md` file and update `screens.json`
2. Read the pattern's `## Composition rules` section
3. Draft a `pattern_shapes` entry for `composition.json` (required, optional, order, semantic_colors)
4. Compare the draft against ALL existing rules and shapes:
   - Are any new rules already covered by existing rules? → remove the duplicate
   - Do any new rules conflict with existing rules? → flag for the user
   - Can existing rules be generalized to cover the new pattern? → suggest
   - Are there opportunities to combine or simplify? → suggest
5. Show the analysis to the user:
   - The draft pattern shape
   - Any overlaps, conflicts, or simplification opportunities
   - A recommendation
6. Wait for the user to approve before writing to `composition.json`

**Never auto-write composition rules.** Always show analysis first.

## Composition health check

When the user says `status` or asks about rule health, scan composition.json for:
- Redundant rules (two rules that say the same thing differently)
- Conflicting rules (two rules that contradict)
- Over-specific rules (applies to only one pattern, could generalize)
- Under-covered patterns (no pattern_shapes entry)

Report findings as suggestions. Don't auto-change.

## Handling rejections

When `check mirror` finds rejected items, **never auto-revise**. Always report the rejection reason and ask:

> "**[name]** was rejected: *[reason]*. Do you want me to revise based on this feedback, or would you like to upload a screenshot of what you have in mind?"

Wait for the user's response before making changes. If they share a screenshot, use it as the basis for the revision. If they say revise, use the rejection reason.

## Composition rules

Read `design-system/composition.json` before generating any CLI screen. 30 rules covering glyph-color pairing, semantic color limits, section ordering, and token enforcement.

## Build pipeline

```
design-system/tokens.json → npm run tokens:build → tokens/canonical.json
tokens/canonical.json → npm run figma-plugin:build → code.js
npm run figma-plugin:rebuild = both steps
npm run lint:composition = validate patterns + detect gaps
npm run status = design system health report
```

Git hooks auto-rebuild on commit (pre-commit) and pull (post-merge).
GitHub Action deploys the site on every merge to main.
