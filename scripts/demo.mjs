#!/usr/bin/env node
// Demo sandbox — set up and tear down try-it scenarios.
//
// Usage:
//   npm run demo:start 1   — Edit an existing token
//   npm run demo:start 2   — Create a new token
//   npm run demo:start 3   — Edit a pattern's structure
//   npm run demo:start 4   — Create a new pattern
//   npm run demo:end       — Clean up all demo changes

import { readFileSync, writeFileSync, existsSync, unlinkSync } from "node:fs";
import { execSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const TOKENS = join(ROOT, "design-system/tokens.json");
const MIRROR = join(ROOT, "design-system/mirror");

const CYAN = "\x1b[36m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const DIM = "\x1b[2m";
const BOLD = "\x1b[1m";
const RESET = "\x1b[0m";

const action = process.argv[2];
const scenario = process.argv[3];

if (action === "start") {
  if (!scenario || !["1", "2", "3", "4"].includes(scenario)) {
    console.log(`\nUsage: npm run demo:start -- 1|2|3|4\n`);
    console.log("  1  Edit an existing token (change success color)");
    console.log("  2  Create a new token (propose a new semantic color)");
    console.log("  3  Edit a pattern's structure (add a section to error)");
    console.log("  4  Create a new pattern (batch operation summary)\n");
    process.exit(1);
  }

  console.log(`\n${CYAN}${BOLD}◆ DEMO ${scenario} — Setting up...${RESET}\n`);

  if (scenario === "1") {
    // Change color.semantic.success from #4ade80 to #22d3ee
    const tokens = readFileSync(TOKENS, "utf-8");
    const updated = tokens.replace('"value": "#4ade80"', '"value": "#22d3ee"');
    if (tokens === updated) {
      console.log(`${YELLOW}Could not find #4ade80 in tokens.json — already modified?${RESET}`);
    } else {
      writeFileSync(TOKENS, updated);
      execSync("npm run tokens:build", { cwd: ROOT, stdio: "inherit" });
      console.log(`${GREEN}✓ Changed color.semantic.success from #4ade80 → #22d3ee${RESET}`);
      console.log(`\n${BOLD}Try it:${RESET}`);
      console.log(`  ${DIM}In Figma, the success color on banners and ✓ glyphs is still green.${RESET}`);
      console.log(`  ${DIM}Rebuild and sync to push the change:${RESET}`);
      console.log(`  ${CYAN}npm run figma-plugin:rebuild${RESET}`);
      console.log(`  ${DIM}Then open Figma → run plugin → Apply.${RESET}`);
      console.log(`  ${DIM}Or: change a color in Figma and say${RESET} ${CYAN}pull from Figma${RESET} ${DIM}in Claude.${RESET}`);
    }
  }

  if (scenario === "2") {
    // Write a token gap proposal
    const proposal = `# Pattern — Token proposal: semantic.progress

> **TOKEN GAP PROPOSAL** — this token does not exist yet.

## Proposed token

- **Path:** \`color.semantic.progress\`
- **Value:** \`#38bdf8\` (sky-400)
- **Role:** In-flight state color for progress bars and active operations.

## Why it's needed

The current palette has success (green), warning (yellow), danger (red), and info (cyan).
Progress bars and loading states use info cyan, but that's also used for commands and links.
A dedicated progress color would disambiguate "this is running" from "this is a command."

## What the user sees

\`\`\`
● Running recipe on 47 repositories
  [████████████░░░░░░░░░░░░░░░░░░░░] 23/47 (49%)
\`\`\`

## Composition rules

- **Only for in-flight states.** Not for completed, failed, or idle.
- **Replaces info cyan on progress bars only.** Commands and links stay cyan.
`;
    writeFileSync(join(MIRROR, "token-semantic-progress.md"), proposal);
    execSync("npm run figma-plugin:rebuild", { cwd: ROOT, stdio: "inherit" });
    console.log(`${GREEN}✓ Wrote token gap proposal: token-semantic-progress${RESET}`);
    console.log(`\n${BOLD}Try it:${RESET}`);
    console.log(`  ${DIM}Open Figma → run plugin → Apply.${RESET}`);
    console.log(`  ${DIM}The proposal appears on${RESET} ${CYAN}Construct / Mirror${RESET} ${DIM}with a lint badge.${RESET}`);
    console.log(`  ${DIM}Approve or Reject it in the plugin UI.${RESET}`);
  }

  if (scenario === "3") {
    // Add a LEARN MORE section to the success pattern preview
    const successPath = join(ROOT, "design-system/patterns/success.md");
    const success = readFileSync(successPath, "utf-8");
    if (success.includes("LEARN MORE")) {
      console.log(`${YELLOW}success.md already has LEARN MORE — already modified?${RESET}`);
    } else {
      const marker = "MOD SUCCEEDED";
      const addition = `LEARN MORE
  Docs: https://docs.moderne.io/cli/recipes

`;
      const updated = success.replace(marker, addition + marker);
      writeFileSync(successPath, updated);
      execSync("npm run figma-plugin:rebuild", { cwd: ROOT, stdio: "inherit" });
      console.log(`${GREEN}✓ Added LEARN MORE section to success pattern${RESET}`);
      console.log(`\n${BOLD}Try it:${RESET}`);
      console.log(`  ${DIM}Open Figma → run plugin → Apply.${RESET}`);
      console.log(`  ${DIM}The success pattern on the Patterns page now shows a LEARN MORE section.${RESET}`);
    }
  }

  if (scenario === "4") {
    // Write a deliberately incomplete pattern to mirror — missing per-repo
    // detail so the tester has a reason to reject it.
    const pattern = `# Pattern — Batch operation summary

The visual treatment of a multi-repository operation — what the user sees after running a command that affects many repos at once, like \`mod git commit --last-recipe-run\`.

## When this pattern applies

- After any batch git operation across multiple repositories.
- After \`mod run\` when the recipe completes across all repos.

This pattern does **not** apply to:

- Single-repo operations — those use the success or error pattern.
- In-flight progress — that's the progress pattern.

## What the user sees

\`\`\`
● Committing changes across 47 repositories

✓ 42 repositories committed
✓ 5 repositories unchanged

MOD SUCCEEDED in (1m 12s)
\`\`\`

## Composition rules

- **Uses the success pattern shape.** Action header + ✓ result rows + close banner.
- **No per-repo detail.** The summary is aggregate only.
`;
    writeFileSync(join(MIRROR, "batch-operation-summary.md"), pattern);
    execSync("npm run figma-plugin:rebuild", { cwd: ROOT, stdio: "inherit" });
    console.log(`${GREEN}✓ Wrote new pattern: batch-operation-summary${RESET}`);
    console.log(`${YELLOW}  This version is deliberately incomplete — it only shows aggregate${RESET}`);
    console.log(`${YELLOW}  counts, no per-repo detail. Try rejecting it with:${RESET}`);
    console.log(`${YELLOW}  "needs per-repo status rows showing which repos failed and why"${RESET}`);
    console.log(`\n${BOLD}Try it:${RESET}`);
    console.log(`  ${DIM}Open Figma → run plugin → Apply.${RESET}`);
    console.log(`  ${DIM}The pattern appears on${RESET} ${CYAN}Construct / Mirror${RESET}`);
    console.log(`  ${DIM}Reject it with the reason above, then say${RESET} ${CYAN}check mirror for rejections${RESET} ${DIM}in Claude.${RESET}`);
    console.log(`  ${DIM}Claude will revise it with per-repo rows. Approve the revision.${RESET}`);
  }

  console.log(`\n${DIM}When done, run:${RESET} ${CYAN}npm run demo:end${RESET}\n`);

} else if (action === "end") {
  console.log(`\n${CYAN}${BOLD}◆ DEMO — Cleaning up...${RESET}\n`);

  // Restore all design-system files to committed state
  try {
    execSync("git checkout -- design-system/", { cwd: ROOT, stdio: "pipe" });
    console.log(`${GREEN}✓ Restored design-system/ to committed state${RESET}`);
  } catch (e) {
    console.log(`${DIM}No changes to restore in design-system/${RESET}`);
  }

  // Delete any untracked files in mirror/
  try {
    const untracked = execSync("git ls-files --others --exclude-standard design-system/mirror/", {
      cwd: ROOT, encoding: "utf-8",
    }).trim();
    if (untracked) {
      for (const f of untracked.split("\n")) {
        unlinkSync(join(ROOT, f));
        console.log(`${GREEN}✓ Deleted ${f}${RESET}`);
      }
    }
  } catch (e) {
    // no untracked files
  }

  // Rebuild
  execSync("npm run figma-plugin:rebuild", { cwd: ROOT, stdio: "inherit" });

  console.log(`\n${GREEN}✓ Demo cleaned up. Design system is back to its committed state.${RESET}`);
  console.log(`\n${YELLOW}${BOLD}Last step: sync Figma to remove demo artifacts${RESET}`);
  console.log(`  ${DIM}1. Open the Figma file${RESET}`);
  console.log(`  ${DIM}2. Go to${RESET} ${CYAN}Plugins → Development → Construct${RESET}`);
  console.log(`  ${DIM}3. Click${RESET} ${CYAN}Apply${RESET} ${DIM}to clean up the Mirror page and any changed components${RESET}`);
  console.log(`  ${DIM}4. Delete the${RESET} ${CYAN}Construct / _orphans${RESET} ${DIM}page if it appeared${RESET}\n`);

} else {
  console.log(`\nUsage:`);
  console.log(`  npm run demo:start -- 1|2|3|4   Start a demo scenario`);
  console.log(`  npm run demo:end                Clean up all demo changes\n`);
}
