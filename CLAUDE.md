# CLAUDE.md

Instructions for Claude Code when working in this repo.

## On session start

Run the status report and check Figma for pending work:

1. Run `npm run status` — shows pattern count, mirror items, coverage gaps, recent changes
2. Read the Figma file via MCP: `get_figma_data(fileKey="twkYEkdg94dq5FQB6D9vDq", depth=2)`
3. Check the Mirror page for:
   - `✓ APPROVED` nodes → promote: move `.md` from `design-system/mirror/` to `design-system/patterns/`, update `screens.json`
   - `✗ REJECTED` nodes → report the rejection reason from the node name, propose a revision
4. Report a summary: what's canonical, what's in review, what needs attention

## Figma file

- File key: `twkYEkdg94dq5FQB6D9vDq`
- URL: https://www.figma.com/design/twkYEkdg94dq5FQB6D9vDq/CLI-Design-System-Experiment

## Key commands

| Say this | What happens |
|---|---|
| `status` | Run `npm run status` — local design system health |
| `pull from Figma` | Read Figma via MCP, diff against canonical, propose token edits |
| `check Figma for approvals` | Read mirror items, promote approved ones |
| `check mirror for rejections` | Read rejected items, propose revisions based on rejection reasons |
| `approve <name>` | Move `design-system/mirror/<name>.md` to `design-system/patterns/` |
| `reset the <name> demo` | Restore a pattern to its mirror stub for re-demo |

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
