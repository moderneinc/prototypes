#!/usr/bin/env node
// Copies shared git hooks from scripts/hooks/ into the local .git/hooks/ directory.
// Handles both regular repos and worktrees.
// Runs automatically via npm's "prepare" lifecycle — no manual setup needed.

import { readFileSync, writeFileSync, readdirSync, chmodSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const SOURCE_DIR = join(HERE, "hooks");
const GIT_PATH = join(ROOT, ".git");

function findHooksDir() {
  if (!existsSync(GIT_PATH)) return null;

  const stat = readFileSync(GIT_PATH, "utf-8").trim();

  // Worktree: .git is a file with "gitdir: /path/to/.git/worktrees/name"
  if (stat.startsWith("gitdir:")) {
    const worktreeGitDir = stat.replace("gitdir:", "").trim();
    // Hooks live in the parent repo's .git/hooks/, not the worktree's
    const parentGit = join(worktreeGitDir, "../..");
    const hooksDir = join(parentGit, "hooks");
    if (existsSync(parentGit)) return hooksDir;
  }

  // Regular repo: .git is a directory
  return join(GIT_PATH, "hooks");
}

const hooksDir = findHooksDir();
if (!hooksDir) {
  console.log("  ⚠ No .git directory found — skipping hook install.");
  process.exit(0);
}

if (!existsSync(hooksDir)) {
  mkdirSync(hooksDir, { recursive: true });
}

const hooks = readdirSync(SOURCE_DIR).filter((f) => !f.startsWith("."));
let installed = 0;

for (const hook of hooks) {
  const src = join(SOURCE_DIR, hook);
  const dest = join(hooksDir, hook);
  const content = readFileSync(src, "utf-8");
  writeFileSync(dest, content);
  chmodSync(dest, 0o755);
  installed++;
}

if (installed > 0) {
  console.log(`  ◆ Installed ${installed} git hook(s) from scripts/hooks/`);
} else {
  console.log("  ◆ No hooks to install.");
}
