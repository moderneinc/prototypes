#!/usr/bin/env node
// Bakes canonical.json into a single code.js for the Figma plugin sandbox.
// Run after every canonical update: `node lib/interpreters/figma-plugin/build.mjs`.
//
// Concatenation order (single global scope, no module system in the sandbox):
//   src/header.js       — constants, helpers, baked CANONICAL + CANONICAL_HASHES + CANONICAL_PATTERNS
//   src/sync.js         — orchestrator + idempotency (depends on header)
//   src/builders/tokens.js
//   src/builders/rows.js
//   src/builders/sections.js
//   src/builders/banners.js
//   src/builders/patterns.js
//   src/footer.js       — figma.ui wiring (depends on everything above)

import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join, basename } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "../../..");
const CANONICAL_PATH = join(ROOT, "tokens/canonical.json");
const PATTERNS_DIR = join(ROOT, "design-system/patterns");
const MIRROR_DIR = join(ROOT, "design-system/mirror");
const COMPOSITION_PATH = join(ROOT, "design-system/composition.json");
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
  "builders/mirror.js",
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

// ------- Parse canonical patterns -----------------------------------------
// Reads design-system/patterns/*.md and extracts slug, title, description,
// and the "What the user sees" preview code block for each pattern.

const PATTERN_ORDER = [
  "help-top-level",
  "help-subcommand",
  "help-command",
  "inline-command-reference",
  "onboarding-sequence",
  "error",
  "partial-success",
  "success",
  "progress",
  "list",
  "start-banner",
];

function parsePattern(filename, content) {
  const slug = basename(filename, ".md");

  // H1 title: strip "Pattern — " prefix and backtick-wrapped parens
  const titleMatch = content.match(/^# Pattern\s*[—-]\s*(.+)$/m);
  let title = titleMatch ? titleMatch[1].trim() : slug;
  title = title.replace(/\s*\(`[^`]*`\)\s*/g, "").replace(/`/g, "").trim();

  // First paragraph after the H1 (up to next blank line or heading)
  const bodyStart = content.indexOf("\n") + 1;
  const bodyText = content.slice(bodyStart).trimStart();
  const descMatch = bodyText.match(/^([^#].+?)(?:\n\n|\n##)/s);
  const description = descMatch ? descMatch[1].replace(/\n/g, " ").trim() : "";

  // First code block under "## What the user sees"
  let preview = "";
  const whatSection = content.match(/## What the user sees[\s\S]*?```[^\n]*\n([\s\S]*?)```/);
  if (whatSection) preview = whatSection[1];

  return { slug, title, description, preview };
}

function loadCanonicalPatterns() {
  const files = readdirSync(PATTERNS_DIR).filter((f) => f.endsWith(".md"));
  const bySlug = {};
  for (const file of files) {
    const content = readFileSync(join(PATTERNS_DIR, file), "utf-8");
    const p = parsePattern(file, content);
    bySlug[p.slug] = p;
  }
  // Return in canonical order, then append any unlisted files alphabetically.
  const ordered = [];
  for (const slug of PATTERN_ORDER) {
    if (bySlug[slug]) ordered.push(bySlug[slug]);
  }
  for (const slug of Object.keys(bySlug).sort()) {
    if (!PATTERN_ORDER.includes(slug)) ordered.push(bySlug[slug]);
  }
  return ordered;
}

// ------- Compute CANONICAL_HASHES -----------------------------------------
// Two categories:
//   1. Canonical-derived (per entity): glyphs, banner variants, and each
//      pattern (from .md file content) — granularity matches Figma components.
//   2. Builder-file (per builder): text styles, rows, sections — file content
//      hash so any spec edit triggers "modified" in the next sync diff.

function computeCanonicalHashes(canonical, patterns) {
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

  // Per pattern (pattern/<slug>) — from .md file content
  for (const p of patterns) {
    hashes["pattern/" + p.slug] = stableHash({ slug: p.slug, title: p.title, description: p.description, preview: p.preview });
  }

  // Per-token value hashes — catches individual token changes.
  // Each leaf $value gets its own hash so the diff names the specific token.
  function hashLeafValues(obj, prefix) {
    for (const [key, val] of Object.entries(obj)) {
      if (key.startsWith("$")) continue;
      const path = prefix ? prefix + "." + key : key;
      if (val && typeof val === "object" && "$value" in val) {
        hashes["token/" + path] = stableHash(val.$value);
      } else if (val && typeof val === "object") {
        hashLeafValues(val, path);
      }
    }
  }
  hashLeafValues(canonical.color, "color");
  hashLeafValues(canonical.spacing, "spacing");

  // Builder-file level (covers hardcoded specs — any edit triggers "modified")
  hashes["token/text-styles"] = fileHash(join(SRC, "builders/tokens.js"));
  hashes["row/specs"]         = fileHash(join(SRC, "builders/rows.js"));
  hashes["section/specs"]     = fileHash(join(SRC, "builders/sections.js"));
  hashes["builder/patterns"]  = fileHash(join(SRC, "builders/patterns.js"));

  return hashes;
}

function addMirrorHashes(hashes, mirrorItems) {
  for (const m of mirrorItems) {
    hashes["mirror/" + m.slug] = stableHash({ slug: m.slug, title: m.title, preview: m.preview, status: m.status });
  }
}

// ------- Load mirror items ------------------------------------------------
// Reads design-system/mirror/*.md — proposed patterns not yet canonical.
// Each is parsed the same way as canonical patterns, plus validated against
// composition.json. Lint results are baked in so the plugin can show badges.

import { existsSync } from "node:fs";

function lintMirrorItem(preview, composition) {
  const warnings = [];
  const errors = [];
  const lines = preview.split("\n");

  // Check for close banner
  const bannerPhrases = Object.values(composition.close_banners.variants).map((v) => v.phrase);
  const hasBanner = lines.some((l) => bannerPhrases.some((p) => l.includes(p)));

  // Check for unknown section headers
  const knownHeaders = composition.section_headers.known_headers;
  for (const line of lines) {
    const t = line.trim();
    if (t.length >= 3 && /^[A-Z][A-Z\s()\/\-:]+$/.test(t) && !/^(MOD |FAILURE:|PARTIAL)/.test(t)) {
      if (!knownHeaders.includes(t) && !t.includes("(")) {
        warnings.push("Unknown section header: " + t);
      }
    }
  }

  // Count semantic colors used
  const colorsUsed = new Set();
  for (const line of lines) {
    const t = line.trim();
    if (/^[●]/.test(t) && /WHAT WENT WRONG|TRY/.test(t)) colorsUsed.add("danger");
    if (/^[✓]/.test(t)) colorsUsed.add("success");
    if (/^[⚠]/.test(t)) colorsUsed.add("warning");
    if (/^[▶$]/.test(t)) colorsUsed.add("info");
    if (/FAILURE:/.test(t) || /MOD FAILED/.test(t)) colorsUsed.add("danger");
    if (/MOD SUCCEEDED/.test(t)) colorsUsed.add("success");
    if (/PARTIAL/.test(t)) colorsUsed.add("warning");
  }
  if (colorsUsed.size > 3) {
    warnings.push("Uses " + colorsUsed.size + " semantic colors (max 3 recommended)");
  }

  return { errors: errors, warnings: warnings, pass: errors.length === 0 };
}

function loadMirrorItems(composition) {
  if (!existsSync(MIRROR_DIR)) return [];
  const files = readdirSync(MIRROR_DIR).filter((f) => f.endsWith(".md"));
  const items = [];
  for (const file of files) {
    const content = readFileSync(join(MIRROR_DIR, file), "utf-8");
    const parsed = parsePattern(file, content);
    const lint = lintMirrorItem(parsed.preview, composition);
    items.push({
      slug: parsed.slug,
      title: parsed.title,
      description: parsed.description,
      preview: parsed.preview,
      status: "proposed",
      lint: lint,
    });
  }
  return items;
}

// ------- Main build -------------------------------------------------------

const canonicalRaw = readFileSync(CANONICAL_PATH, "utf-8");
const canonical = JSON.parse(canonicalRaw);
const builtAt = new Date().toISOString();

runSelfCheck(canonical);

const composition = existsSync(COMPOSITION_PATH) ? JSON.parse(readFileSync(COMPOSITION_PATH, "utf-8")) : null;
// Build human-readable values map for diff display
function computeCanonicalValues(canonical) {
  const values = {};
  function collectLeafValues(obj, prefix) {
    for (const [key, val] of Object.entries(obj)) {
      if (key.startsWith("$")) continue;
      const path = prefix ? prefix + "." + key : key;
      if (val && typeof val === "object" && "$value" in val) {
        const v = val.$value;
        values["token/" + path] = typeof v === "string" ? v : JSON.stringify(v);
      } else if (val && typeof val === "object") {
        collectLeafValues(val, path);
      }
    }
  }
  collectLeafValues(canonical.color, "color");
  collectLeafValues(canonical.spacing, "spacing");
  // Glyphs
  for (const [name, g] of Object.entries(canonical.glyph)) {
    if (name.startsWith("$")) continue;
    values["token/glyph/" + name] = g.$value.char + " (" + g.$value.role + ")";
  }
  // Banners
  for (const [name, v] of Object.entries(canonical.banner.close.variants)) {
    values["banner/close/" + name] = v.$value.phrase;
  }
  return values;
}

const canonicalPatterns = loadCanonicalPatterns();
const mirrorItems = composition ? loadMirrorItems(composition) : [];
const canonicalHashes = computeCanonicalHashes(canonical, canonicalPatterns);
const canonicalValues = computeCanonicalValues(canonical);
addMirrorHashes(canonicalHashes, mirrorItems);

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
      .replace("__CANONICAL_HASHES_PLACEHOLDER__", JSON.stringify(canonicalHashes, null, 2))
      .replace("__CANONICAL_PATTERNS_PLACEHOLDER__", JSON.stringify(canonicalPatterns, null, 2))
      .replace("__MIRROR_ITEMS_PLACEHOLDER__", JSON.stringify(mirrorItems, null, 2))
      .replace("__CANONICAL_VALUES_PLACEHOLDER__", JSON.stringify(canonicalValues, null, 2));
  }
  parts.push("// === " + rel + " ===");
  parts.push(text);
  parts.push("");
}

writeFileSync(OUT, parts.join("\n"));
console.log("✓ wrote " + OUT);
console.log("  canonical version: " + canonical.$meta.version);
console.log("  patterns: " + canonicalPatterns.map((p) => p.slug).join(", "));
console.log("  canonical_hashes entries: " + Object.keys(canonicalHashes).length);
console.log("  mirror items: " + mirrorItems.length + (mirrorItems.length ? " (" + mirrorItems.map((m) => m.slug).join(", ") + ")" : ""));
console.log("  built at " + builtAt);
