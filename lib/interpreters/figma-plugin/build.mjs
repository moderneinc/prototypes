#!/usr/bin/env node
// Bakes canonical.json into a single code.js for the Figma plugin sandbox.
// Run after every canonical update: `node lib/interpreters/figma-plugin/build.mjs`.
//
// Concatenation order (single global scope, no module system in the sandbox):
//   src/header.js       — constants, helpers, baked CANONICAL placeholder
//   src/sync.js         — orchestrator + idempotency (depends on header)
//   src/builders/atoms.js
//   src/builders/molecules.js
//   src/builders/organisms.js
//   src/builders/banners.js
//   src/builders/templates.js
//   src/footer.js       — figma.ui wiring (depends on everything above)

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "../../..");
const CANONICAL_PATH = join(ROOT, "tokens/canonical.json");
const SRC = join(HERE, "src");
const OUT = join(HERE, "code.js");

const ORDER = [
  "header.js",
  "sync.js",
  "builders/atoms.js",
  "builders/molecules.js",
  "builders/organisms.js",
  "builders/banners.js",
  "builders/templates.js",
  "footer.js",
];

const canonical = readFileSync(CANONICAL_PATH, "utf-8");
const builtAt = new Date().toISOString();

const parts = [
  "// Construct Figma plugin — generated. Do not hand-edit.",
  `// Canonical version: ${JSON.parse(canonical).$meta.version}`,
  `// Built at: ${builtAt}`,
  "",
];

for (const rel of ORDER) {
  const path = join(SRC, rel);
  let text = readFileSync(path, "utf-8");
  if (rel === "header.js") {
    text = text
      .replace("__CANONICAL_PLACEHOLDER__", canonical.trim())
      .replace("__BUILT_AT_PLACEHOLDER__", builtAt);
  }
  parts.push("// === " + rel + " ===");
  parts.push(text);
  parts.push("");
}

writeFileSync(OUT, parts.join("\n"));
console.log("✓ wrote " + OUT);
console.log("  canonical baked from " + CANONICAL_PATH);
console.log("  built at " + builtAt);
