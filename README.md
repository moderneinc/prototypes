# Construct

**Code is the source of truth. Figma is bidirectional. Anyone can contribute.**

Construct is a production-first design system for the Moderne CLI, built for humans and AI agents working together. The repository is the authority. Tokens represent semantic intent, not hardcoded visual values. Figma, the CLI, documentation, and runtime interfaces all read from the same canonical source.

## Start here

```bash
git clone https://github.com/moderneinc/prototypes.git
cd prototypes
git checkout jaydjackson/construct
npm install
npm run dev
```

Open **http://localhost:3000**. This is the Construct website — it has everything: tokens, components, patterns, voice rules, workflow instructions, system architecture, and interactive demos you can try. Start there.

The Figma file is at: [CLI Design System Experiment](https://www.figma.com/design/twkYEkdg94dq5FQB6D9vDq/CLI-Design-System-Experiment)

> **Important:** The Construct plugin only works in the **Figma desktop app**. It will not appear in the browser version of Figma.

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

After setup, you work in **Claude Code** and **Figma** only. No terminal. Say it to Claude, Claude does it.

### 1. Edit an existing token (pullable)

- **From Figma**: change the property → say `pull from Figma` to Claude → Claude updates `tokens.json` and rebuilds → open Figma → Apply
- **From Claude**: tell Claude what to change → Claude edits and rebuilds → open Figma → Apply

### 2. Create a new token

- Tell Claude what you need → Claude writes a proposal to `mirror/` and rebuilds → open Figma → Apply → Approve or Reject → say `check mirror` to Claude

### 3. Edit a pattern's structure (not pullable)

- Describe the change to Claude → Claude edits the pattern and rebuilds → open Figma → Apply

### 4. Create a new pattern

- Describe the screen to Claude (or share a Figma screenshot) → Claude writes it to `mirror/` and rebuilds → open Figma → Apply → Approve or Reject → say `check mirror` to Claude

### Try the demos

Set up a sandbox so demos don't touch your main workspace:

```bash
git worktree add demo origin/main
cd demo
npm install
npm run dev
```

Then say any of these **to Claude** (not in terminal):

| Say to Claude | What happens |
|---|---|
| `demo 1` | Changes the success color so you can test pull/push |
| `demo 2` | Creates a token gap proposal on the Mirror page |
| `demo 3` | Adds a section to the error pattern |
| `demo 4` | Creates a new pattern on the Mirror page |
| `end demo` | Restores everything to its original state |

When done with the sandbox:

```bash
cd ..
git worktree remove demo
```

Full step-by-step walkthroughs are on the Workflow page of the site.

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

### One-time terminal (setup only)

| Command | What it does |
|---|---|
| `npm install` | Install dependencies + set up git hooks |
| `npm run dev` | Status report + start playground |

### Say to Claude (daily workflow)

| Say this | What Claude does |
|---|---|
| `status` | Runs the health report and shows it |
| `pull from Figma` | Reads Figma, diffs against canonical, proposes edits, rebuilds |
| `approve <name>` | Promotes a mirror item to canonical, rebuilds |
| `check mirror` | Reads Figma — promotes approvals, revises rejections, reports status |
| `demo 1` / `demo 2` / `demo 3` / `demo 4` | Sets up a sandboxed demo and rebuilds |
| `end demo` | Restores everything to its committed state |

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
