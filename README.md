# Construct

**Code is the source of truth. Figma is bidirectional. Anyone can contribute.**

Construct is a production-first design system for the Moderne CLI, built for humans and AI agents working together. The repository is the authority. Tokens represent semantic intent, not hardcoded visual values. Figma, the CLI, documentation, and runtime interfaces all read from the same canonical source.

## Start here

```bash
npm install
npm run dev
```

Open **http://localhost:3000**. This is the Construct website — it has everything: tokens, components, patterns, voice rules, workflow instructions, system architecture, and interactive demos you can try. Start there.

The Figma file is at: [CLI Design System Experiment](https://www.figma.com/design/twkYEkdg94dq5FQB6D9vDq/CLI-Design-System-Experiment)

## What you'll find on the site

| Page | What it covers |
|---|---|
| **Intro** | What Construct is and why it exists |
| **Workflow** | How to use the system — 4 scenarios with step-by-step walkthroughs and sandboxed demos |
| **Tokens** | Colors, typography, spacing, glyphs, links — every canonical value |
| **Components** | Rows, sections, banners — the building blocks |
| **Patterns** | 17 canonical CLI screens (help, error, success, progress, etc.) |
| **Voice** | Editorial conventions, tone, grammar rules |
| **System Design** | Architecture, composition rules, mirror flow, file structure |
| **How we got here** | The audit process that produced this system |

## Workflows

There are four workflows depending on what you're changing. Each can start from Figma or from code.

### 1. Edit an existing token (pullable)

Change a color, font, glyph, or banner phrase.

- **From Figma**: change the property → say `pull from Figma` in Claude Code → Claude updates `tokens.json` → commit
- **From code**: edit `tokens.json` → commit → open Figma → run plugin → Apply

### 2. Create a new token

Propose a token that doesn't exist yet. Goes through the mirror for review.

- Write a token gap proposal to `design-system/mirror/` → commit → appears on Figma Mirror page → approve or reject → add to `tokens.json`

### 3. Edit a pattern's structure (not pullable)

Add, remove, or reorder sections in an existing pattern.

- **From Figma**: describe the change to Claude → Claude edits the `.md` file → commit → open Figma → Apply
- **From code**: edit `design-system/patterns/<name>.md` → run `npm run lint:composition` → commit → Apply

### 4. Create a new pattern

Build a new CLI screen. Goes through the mirror for review.

- Write a `.md` file using the [pattern template](design-system/pattern-template.md) → save to `design-system/mirror/` → commit → appears on Figma Mirror page with lint badge → approve or reject → promote to `patterns/`

### Try the demos

Each workflow has a sandboxed demo you can run without affecting the real design system:

```bash
npm run demo:start -- 1    # Edit a token (changes success color)
npm run demo:start -- 2    # Create a token (writes a mirror proposal)
npm run demo:start -- 3    # Edit a pattern (adds a section to error)
npm run demo:start -- 4    # Create a pattern (writes to mirror)
npm run demo:end           # Restore everything
```

Full step-by-step instructions are on the Workflow page of the site.

## System design

### Three layers

Everything is organized into three layers — the same in code, in Figma, and on the site:

- **Tokens** — colors, typography, spacing, glyphs, links
- **Components** — rows, sections, banners (building blocks)
- **Patterns** — full CLI screens composed from components

### Bidirectional Figma

A plugin pushes canonical to Figma. Claude reads Figma via MCP and pulls changes back. Token-level edits flow in both directions. Structural changes go through the mirror/review flow.

### Composition rules

30 machine-readable rules in `composition.json` enforce consistency: glyph-color pairing, semantic color limits, section ordering, required elements per pattern type. Claude reads them before generating anything. `npm run lint:composition` validates all patterns and detects screen coverage gaps.

### Mirror: how new things enter the system

New patterns and tokens don't go straight to canonical. They land on a staging page in Figma (Construct / Mirror) for review. Approve or reject from the Figma plugin or from Claude. Rejected items include a reason — Claude reads it and proposes a revision. The cycle repeats until approved.

### Automation

- **Git hooks**: pre-commit rebuilds the plugin and validates the pattern template. Post-merge rebuilds on pull.
- **Status report**: `npm run status` (or `npm run dev`) shows pattern count, coverage, mirror items, and recent changes.
- **Auto-deploy**: GitHub Action builds and deploys the site on every merge to main.

## How we got here

Construct was built by extracting what the Moderne CLI already ships. Two design artifacts were audited alongside the existing CLI in four passes, surfacing every color, glyph, banner, spacing rule, and grammar convention already in use.

That audit produced a canonical token set. Twenty categories were reconciled into nineteen named decisions, with each token carrying its provenance: which artifact it came from, what evidence supports it, and how conflicts were resolved. Gaps were named, not filled.

Source documents:
- `design-system/reconciliation.md` — audit categories A–T and decisions D-01–D-19
- `design-system/gaps.md` — silences surfaced during the audit
- `design-system/rationale.md` — rationale behind visual decisions
- `design-system/intended-direction.md` — scope, philosophy, direction
- `design-system/voice.md` — editorial conventions, tone, grammar

## Commands

| Command | What it does |
|---|---|
| `npm install` | Install dependencies + set up git hooks |
| `npm run dev` | Status report + start playground |
| `npm run status` | Design system health report |
| `npm run lint:composition` | Validate patterns + detect screen gaps |
| `npm run figma-plugin:rebuild` | Rebuild Figma plugin (usually automatic) |
| `npm run tokens:build` | Rebuild canonical from tokens.json |
| `npm run demo:start -- 1\|2\|3\|4` | Start a sandboxed demo scenario |
| `npm run demo:end` | Clean up demo changes |

**Say in Claude Code:**

| Command | What it does |
|---|---|
| `status` | Design system health report |
| `pull from Figma` | Diff Figma → propose token edits |
| `approve <name>` | Promote mirror item → canonical |
| `check Figma for approvals` | Read Figma approvals, promote them |
| `check mirror for rejections` | Read rejections, propose revisions |

## File structure

```
design-system/
├── tokens.json              ← edit tokens here
├── patterns/*.md            ← 17 canonical patterns
├── mirror/*.md              ← proposed patterns (staging)
├── screens.json             ← screen manifest (gap detection)
├── composition.json         ← 30 lint rules
├── pattern-template.md      ← template for new patterns
├── voice.md                 ← voice rules
└── gaps.md                  ← known gaps

tokens/
├── canonical.json           ← generated source of truth
└── figma-expected.json      ← expected Figma state (for pull)

lib/interpreters/figma-plugin/
├── build.mjs                ← bakes canonical + mirror into code.js
├── ui.html                  ← plugin UI (diff, approve/reject)
└── src/builders/            ← tokens, rows, sections, banners, patterns, mirror

scripts/
├── build-tokens.mjs         ← tokens.json → canonical.json
├── figma-pull-expected.mjs  ← canonical → figma-expected.json
├── validate-composition.mjs ← lint + gap detection
├── status.mjs               ← design system health report
├── demo.mjs                 ← sandboxed demo scenarios
├── setup-hooks.mjs          ← installs git hooks on npm install
└── hooks/
    ├── pre-commit           ← auto-rebuild + template enforcement
    └── post-merge           ← auto-rebuild on pull
```
