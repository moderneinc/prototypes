#!/usr/bin/env node
// Design system status report.
// Run: npm run status
//
// Shows: pattern coverage, mirror items, lint results, recent changes.
// Designed to run on startup or on demand so everyone knows what's in flight.

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { execSync } from "node:child_process";
import { dirname, join, basename } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const PATTERNS_DIR = join(ROOT, "design-system/patterns");
const MIRROR_DIR = join(ROOT, "design-system/mirror");
const SCREENS_PATH = join(ROOT, "design-system/screens.json");
const COMPOSITION_PATH = join(ROOT, "design-system/composition.json");

const CYAN = "\x1b[36m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const RED = "\x1b[31m";
const DIM = "\x1b[2m";
const BOLD = "\x1b[1m";
const RESET = "\x1b[0m";

console.log("");
console.log(`${CYAN}${BOLD}◆ CONSTRUCT — Design System Status${RESET}`);
console.log(`${DIM}${"─".repeat(50)}${RESET}`);

// --- Patterns ---
const patterns = readdirSync(PATTERNS_DIR).filter((f) => f.endsWith(".md"));
console.log(`\n${BOLD}Patterns${RESET}  ${GREEN}${patterns.length} canonical${RESET}`);

// --- Mirror ---
const mirrorFiles = existsSync(MIRROR_DIR)
  ? readdirSync(MIRROR_DIR).filter((f) => f.endsWith(".md"))
  : [];
if (mirrorFiles.length > 0) {
  console.log(`${BOLD}Mirror${RESET}    ${YELLOW}${mirrorFiles.length} proposed${RESET}`);
  for (const f of mirrorFiles) {
    const content = readFileSync(join(MIRROR_DIR, f), "utf-8");
    const isStub = content.includes("NEEDS PATTERN");
    const slug = basename(f, ".md");
    console.log(`  ${isStub ? RED + "⚠ NEEDS PATTERN" : CYAN + "● proposed"}${RESET}  ${slug}`);
  }
} else {
  console.log(`${BOLD}Mirror${RESET}    ${DIM}empty — nothing in review${RESET}`);
}

// --- Screen coverage ---
if (existsSync(SCREENS_PATH)) {
  const screens = JSON.parse(readFileSync(SCREENS_PATH, "utf-8"));
  const total = screens.screens.length;
  const covered = screens.screens.filter((s) => s.pattern && patterns.some((p) => basename(p, ".md") === s.pattern)).length;
  const gaps = total - covered;
  if (gaps > 0) {
    console.log(`${BOLD}Coverage${RESET}  ${YELLOW}${covered}/${total} screens${RESET}  ${RED}${gaps} gap(s)${RESET}`);
  } else {
    console.log(`${BOLD}Coverage${RESET}  ${GREEN}${covered}/${total} screens — full coverage${RESET}`);
  }
}

// --- Composition rules ---
if (existsSync(COMPOSITION_PATH)) {
  const comp = JSON.parse(readFileSync(COMPOSITION_PATH, "utf-8"));
  const ruleCount = comp.rules ? comp.rules.length : 0;
  console.log(`${BOLD}Rules${RESET}     ${DIM}${ruleCount} composition rules active${RESET}`);
}

// --- Recent git activity ---
try {
  const log = execSync("git log --oneline -5 -- design-system/ tokens/ lib/interpreters/figma-plugin/src/", {
    cwd: ROOT,
    encoding: "utf-8",
    timeout: 5000,
  }).trim();
  if (log) {
    console.log(`\n${BOLD}Recent changes${RESET}`);
    for (const line of log.split("\n")) {
      console.log(`  ${DIM}${line}${RESET}`);
    }
  }
} catch (e) {
  // git not available or not a repo — skip
}

// --- Figma reminder ---
console.log(`\n${DIM}${"─".repeat(50)}${RESET}`);
if (mirrorFiles.length > 0) {
  console.log(`${YELLOW}Mirror items pending review.${RESET} Open Figma plugin to approve/reject.`);
}
console.log(`${DIM}To check Figma for approvals, say in Claude Code:${RESET} ${CYAN}check Figma for approvals${RESET}`);
console.log(`${DIM}To pull Figma changes, say in Claude Code:${RESET} ${CYAN}pull from Figma${RESET}`);
console.log("");
