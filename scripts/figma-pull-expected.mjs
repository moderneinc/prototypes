#!/usr/bin/env node
// Generates tokens/figma-expected.json from canonical.json.
//
// This file describes what every Figma component SHOULD look like based on
// the current canonical state. Claude compares it against the live Figma file
// (read via MCP) to detect designer changes that should flow back to code.
//
// Usage:
//   node scripts/figma-pull-expected.mjs
//
// Then tell Claude: "pull from Figma" — it reads figma-expected.json,
// reads the Figma file via MCP, diffs, and proposes edits to tokens.json.

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const CANONICAL_PATH = join(ROOT, "tokens/canonical.json");
const OUT = join(ROOT, "tokens/figma-expected.json");

const canonical = JSON.parse(readFileSync(CANONICAL_PATH, "utf-8"));

// ------- Hex ↔ token path mappings ----------------------------------------

function collectColors(obj, prefix) {
  const map = {};
  for (const [key, val] of Object.entries(obj)) {
    if (key.startsWith("$")) continue;
    const path = prefix ? prefix + "." + key : key;
    if (val && typeof val === "object" && "$value" in val && typeof val.$value === "string" && val.$value.startsWith("#")) {
      map[val.$value.toLowerCase()] = "color." + path;
    } else if (val && typeof val === "object") {
      Object.assign(map, collectColors(val, path));
    }
  }
  return map;
}

const hexToToken = collectColors(canonical.color, "");
const tokenToHex = {};
for (const [hex, path] of Object.entries(hexToToken)) {
  tokenToHex[path] = hex;
}

// ------- Banner expected state --------------------------------------------

function resolveBannerColor(colorRef) {
  // colorRef = "color.semantic.success" → look up hex
  return tokenToHex[colorRef] || null;
}

const banners = {};
for (const [name, variant] of Object.entries(canonical.banner.close.variants)) {
  const phraseHex = resolveBannerColor(variant.$value.color);
  banners["close / " + name] = {
    canonicalPath: "banner.close.variants." + name,
    phrase: variant.$value.phrase,
    phraseColorToken: variant.$value.color,
    phraseColorHex: phraseHex,
    durationColorHex: tokenToHex["color.text.metadata"] || null,
  };
}

// ------- Glyph expected state ---------------------------------------------

const glyphs = {};
for (const [name, glyph] of Object.entries(canonical.glyph)) {
  if (name.startsWith("$")) continue;
  const defaultColorToken = glyph.$value.color;
  const defaultHex = tokenToHex[defaultColorToken] || null;
  const variants = {};
  for (const colorPath of (glyph.$value.validColors || [])) {
    const fullPath = "color." + colorPath;
    variants["color=" + colorPath] = {
      colorToken: fullPath,
      colorHex: tokenToHex[fullPath] || null,
    };
  }
  glyphs["glyph/" + name] = {
    canonicalPath: "glyph." + name,
    char: glyph.$value.char,
    asciiFallback: glyph.$value.asciiFallback,
    defaultColorToken: defaultColorToken,
    defaultColorHex: defaultHex,
    variants: variants,
  };
}

// ------- Text style expected state ----------------------------------------
// These mirror the TEXT_STYLE_SPECS in the Figma plugin's tokens.js builder.

const textStyles = {
  "text-style/section-header": {
    canonicalPath: "typography.section_header",
    fontFamily: "Inter", fontWeight: 700, fontSize: 14,
    letterSpacingPercent: 2,
    colorToken: "color.text.primary",
    colorHex: tokenToHex["color.text.primary"],
  },
  "text-style/primary": {
    canonicalPath: "typography.primary",
    fontFamily: "Inter", fontWeight: 400, fontSize: 14,
    letterSpacingPercent: 0,
    colorToken: "color.text.body",
    colorHex: tokenToHex["color.text.body"],
  },
  "text-style/supporting": {
    canonicalPath: "typography.supporting",
    fontFamily: "Inter", fontWeight: 400, fontSize: 14,
    letterSpacingPercent: 0,
    colorToken: "color.text.supporting",
    colorHex: tokenToHex["color.text.supporting"],
  },
  "text-style/metadata": {
    canonicalPath: "typography.metadata",
    fontFamily: "Inter", fontWeight: 400, fontSize: 14,
    letterSpacingPercent: 0,
    colorToken: "color.text.metadata",
    colorHex: tokenToHex["color.text.metadata"],
  },
  "text-style/inline-command": {
    canonicalPath: "typography.monospace (inline)",
    fontFamily: "Inter", fontWeight: 400, fontSize: 14,
    letterSpacingPercent: 0,
    colorToken: "color.semantic.info",
    colorHex: tokenToHex["color.semantic.info"],
  },
  "text-style/banner-phrase": {
    canonicalPath: "typography.section_header (banner weight)",
    fontFamily: "Inter", fontWeight: 700, fontSize: 16,
    letterSpacingPercent: 4,
    colorToken: "color.text.primary",
    colorHex: tokenToHex["color.text.primary"],
  },
};

// ------- Row expected state -----------------------------------------------

const rows = {
  "section-header-row": {
    glyphChar: "●", glyphColorHex: tokenToHex["color.semantic.danger"],
    textContent: "WHAT WENT WRONG", textColorHex: tokenToHex["color.text.primary"],
  },
  "sub-task-summary": {
    glyphChar: "✓", glyphColorHex: tokenToHex["color.semantic.success"],
    textContent: "42 repositories modified", textColorHex: tokenToHex["color.text.body"],
  },
  "recovery-action": {
    glyphChar: "▶", glyphColorHex: tokenToHex["color.semantic.info"],
    textContent: "Add a build config to the directory.", textColorHex: tokenToHex["color.text.body"],
  },
  "inlined-command": {
    glyphChar: "▶", glyphColorHex: tokenToHex["color.semantic.info"],
    textContent: "mod build /home/user/project --only-tool maven", textColorHex: tokenToHex["color.semantic.info"],
  },
  "hint-row": {
    glyphChar: "?", glyphColorHex: tokenToHex["color.semantic.warning"],
    textContent: "Hint: The recipe may not emit tables.", textColorHex: tokenToHex["color.text.body"],
  },
  "note-row": {
    glyphChar: "!", glyphColorHex: tokenToHex["color.semantic.warning"],
    textContent: "Note: Needs read AND write access.", textColorHex: tokenToHex["color.text.body"],
  },
  "error-row": {
    glyphChar: "!", glyphColorHex: tokenToHex["color.semantic.danger"],
    textContent: "Error: Unknown command 'confg'.", textColorHex: tokenToHex["color.text.body"],
  },
  "warning-row": {
    glyphChar: "⚠", glyphColorHex: tokenToHex["color.semantic.warning"],
    textContent: "0 repositories searched — all 47 skipped (no search index).", textColorHex: tokenToHex["color.text.body"],
  },
  "empty-state-row": {
    glyphChar: null, glyphColorHex: null,
    textContent: "No repositories configured.", textColorHex: tokenToHex["color.text.supporting"],
  },
  "example-row": {
    glyphChar: "$", glyphColorHex: tokenToHex["color.text.metadata"],
    textContent: "mod build /home/user/project", textColorHex: tokenToHex["color.semantic.info"],
  },
};

// ------- Write output -----------------------------------------------------

const expected = {
  _generated: new Date().toISOString(),
  _canonicalVersion: canonical.$meta.version,
  _description: "Expected Figma state derived from canonical.json. Compare against live Figma file via MCP to detect designer changes.",
  figmaFileKey: "twkYEkdg94dq5FQB6D9vDq",
  hexToToken,
  tokenToHex,
  banners,
  glyphs,
  textStyles,
  rows,
};

writeFileSync(OUT, JSON.stringify(expected, null, 2) + "\n");
console.log("✓ wrote " + OUT);
console.log("  " + Object.keys(hexToToken).length + " color mappings");
console.log("  " + Object.keys(banners).length + " banner components");
console.log("  " + Object.keys(glyphs).length + " glyph component sets");
console.log("  " + Object.keys(textStyles).length + " text style swatches");
console.log("  " + Object.keys(rows).length + " row components");
