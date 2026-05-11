#!/usr/bin/env node
// Bakes canonical.json into a single code.js for the Figma plugin sandbox.
// Run after every canonical update: `node lib/interpreters/figma-plugin/build.mjs`.
//
// Concatenation order (single global scope, no module system in the sandbox):
//   src/header.js       — constants, helpers, baked CANONICAL + CANONICAL_HASHES placeholders
//   src/sync.js         — orchestrator + idempotency (depends on header)
//   src/builders/tokens.js
//   src/builders/rows.js
//   src/builders/sections.js
//   src/builders/banners.js
//   src/builders/patterns.js
//   src/footer.js       — figma.ui wiring (depends on everything above)

import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
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
  "builders/tokens.js",
  "builders/rows.js",
  "builders/sections.js",
  "builders/banners.js",
  "builders/patterns.js",
  "footer.js",
];

// ------- stableHash -------------------------------------------------------
// JSON.stringify is key-order-unstable: { a:1, b:2 } and { b:2, a:1 } produce
// different strings, so hashes would differ across JS engine runs and object
// literal orderings. stableStringify sorts all object keys recursively before
// serializing, making the hash deterministic regardless of insertion order.
//
// If the build-time self-check below throws, it means stableStringify is no
// longer key-order-stable — check for any Object.keys() calls that rely on
// insertion order, or re-entrancy bugs in the recursive case.

function stableStringify(val) {
  if (val === null || typeof val !== "object" || Array.isArray(val)) {
    return JSON.stringify(val);
  }
  const sortedKeys = Object.keys(val).sort();
  return "{" + sortedKeys.map((k) => JSON.stringify(k) + ":" + stableStringify(val[k])).join(",") + "}";
}

function stableHash(entity) {
  return createHash("sha256").update(stableStringify(entity)).digest("hex").slice(0, 16);
}

function fileHash(filePath) {
  const content = readFileSync(filePath, "utf-8");
  return createHash("sha256").update(content).digest("hex").slice(0, 16);
}

// ------- Build-time self-check --------------------------------------------
// Shuffle 3 glyph entities (reverse key order) and re-hash. If hashes differ,
// stableHash() is broken. Throw immediately — a broken hash means every future
// diff will report false positives until the bug is fixed.

function runSelfCheck(canonical) {
  const glyphKeys = Object.keys(canonical.glyph).filter((k) => !k.startsWith("$"));
  const sample = glyphKeys.slice(0, 3);
  for (const name of sample) {
    const entity = canonical.glyph[name];
    const h1 = stableHash(entity);
    const keys = Object.keys(entity);
    const reversed = {};
    for (let i = keys.length - 1; i >= 0; i--) reversed[keys[i]] = entity[keys[i]];
    const h2 = stableHash(reversed);
    if (h1 !== h2) {
      throw new Error(
        "build-time self-check failed: stableHash produced different hashes for the same entity " +
          "with reversed key order. Check stableStringify() in build.mjs."
      );
    }
  }
}

// ------- Compute CANONICAL_HASHES -----------------------------------------
// Two categories:
//   1. Canonical-derived (per entity): glyphs and banner variants from canonical.json.
//      Hash granularity = per Figma component, so the diff UI can name them individually.
//   2. Builder-file (per builder): text styles, rows, sections, patterns are driven
//      by hardcoded specs inside their builder files. We hash the file content so any
//      edit to a builder triggers "modified" in the next sync diff.

function computeCanonicalHashes(canonical) {
  const hashes = {};

  // Per glyph (token/glyph/<name>)
  for (const name of Object.keys(canonical.glyph)) {
    if (name.startsWith("$")) continue;
    hashes["token/glyph/" + name] = stableHash(canonical.glyph[name]);
  }

  // Per banner close variant (banner/close/<name>)
  for (const name of Object.keys(canonical.banner.close.variants)) {
    hashes["banner/close/" + name] = stableHash(canonical.banner.close.variants[name]);
  }

  // Builder-file level (covers all hardcoded specs in each file)
  hashes["token/text-styles"] = fileHash(join(SRC, "builders/tokens.js"));
  hashes["row/specs"]         = fileHash(join(SRC, "builders/rows.js"));
  hashes["section/specs"]     = fileHash(join(SRC, "builders/sections.js"));
  hashes["pattern/specs"]     = fileHash(join(SRC, "builders/patterns.js"));

  return hashes;
}

// ------- Main build -------------------------------------------------------

const canonicalRaw = readFileSync(CANONICAL_PATH, "utf-8");
const canonical = JSON.parse(canonicalRaw);
const builtAt = new Date().toISOString();

runSelfCheck(canonical);

const canonicalHashes = computeCanonicalHashes(canonical);

const parts = [
  "// Construct Figma plugin — generated. Do not hand-edit.",
  `// Canonical version: ${canonical.$meta.version}`,
  `// Built at: ${builtAt}`,
  "",
];

for (const rel of ORDER) {
  const path = join(SRC, rel);
  let text = readFileSync(path, "utf-8");
  if (rel === "header.js") {
    text = text
      .replace("__CANONICAL_PLACEHOLDER__", canonicalRaw.trim())
      .replace("__BUILT_AT_PLACEHOLDER__", builtAt)
      .replace("__CANONICAL_HASHES_PLACEHOLDER__", JSON.stringify(canonicalHashes, null, 2));
  }
  parts.push("// === " + rel + " ===");
  parts.push(text);
  parts.push("");
}

writeFileSync(OUT, parts.join("\n"));
console.log("✓ wrote " + OUT);
console.log("  canonical baked from " + CANONICAL_PATH);
console.log("  canonical version: " + canonical.$meta.version);
console.log("  built at " + builtAt);
console.log("  canonical_hashes entries: " + Object.keys(canonicalHashes).length);
