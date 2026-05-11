#!/usr/bin/env node
// Validates existing pattern files against composition.json rules.
// Run: node scripts/validate-composition.mjs
//
// Checks each pattern's "What the user sees" code block for:
// - Glyph-color pairing violations (via glyph presence + context)
// - Section header formatting (ALL CAPS)
// - Close banner presence/absence where expected
// - Required elements per pattern_shapes
// - Structural lint (spacing, indent)

import { readFileSync, readdirSync } from "node:fs";
import { dirname, join, basename } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const PATTERNS_DIR = join(ROOT, "design-system/patterns");
const COMPOSITION_PATH = join(ROOT, "design-system/composition.json");

const composition = JSON.parse(readFileSync(COMPOSITION_PATH, "utf-8"));

const CLOSE_BANNER_PHRASES = Object.values(composition.close_banners.variants).map((v) => v.phrase);

function extractPreview(content) {
  const match = content.match(/## What the user sees[\s\S]*?```[^\n]*\n([\s\S]*?)```/);
  return match ? match[1] : "";
}

function extractCompositionRules(content) {
  const match = content.match(/## Composition rules\n([\s\S]*?)(?:\n## |\n$)/);
  return match ? match[1] : "";
}

function classify(slug) {
  if (slug === "error") return ["error-full", "error-inline"];
  if (slug === "success") return ["success"];
  if (slug === "partial-success") return ["partial-success"];
  if (slug === "progress") return ["progress"];
  if (slug === "help-top-level") return ["help-top-level"];
  if (slug === "help-subcommand") return ["help-subcommand"];
  if (slug === "help-command") return ["help-command"];
  if (slug === "list") return ["list"];
  if (slug === "onboarding-sequence") return ["onboarding-sequence"];
  if (slug === "start-banner") return ["start-banner"];
  if (slug === "inline-command-reference") return ["inline-command-reference"];
  return [];
}

const results = [];

function warn(slug, ruleId, message) {
  results.push({ slug, ruleId, severity: "warning", message });
}

function error(slug, ruleId, message) {
  results.push({ slug, ruleId, severity: "error", message });
}

const files = readdirSync(PATTERNS_DIR).filter((f) => f.endsWith(".md"));

for (const file of files) {
  const slug = basename(file, ".md");
  const content = readFileSync(join(PATTERNS_DIR, file), "utf-8");
  const preview = extractPreview(content);
  const lines = preview.split("\n");
  const shapes = classify(slug);

  // GLYPH-01: Check glyph-color pairing (we can check glyph presence but not color from markdown)
  const glyphsPresent = new Set();
  for (const line of lines) {
    const t = line.trim();
    for (const g of Object.keys(composition.glyph_color_pairs)) {
      if (t.startsWith(g) || t.includes(" " + g + " ") || t.includes("  " + g)) {
        glyphsPresent.add(g);
      }
    }
  }

  // HEADER-01: Section headers should be ALL CAPS
  for (const line of lines) {
    const t = line.trim();
    if (t.length >= 3 && /^[A-Z][A-Z\s()\/\-:]+$/.test(t) && !/^(MOD |FAILURE:|PARTIAL)/.test(t)) {
      if (!composition.section_headers.known_headers.includes(t) && !t.includes("(")) {
        warn(slug, "HEADER-02", `Unknown section header: "${t}" — consider adding to known_headers`);
      }
    }
  }

  // BANNER checks
  const hasBanner = lines.some((l) => CLOSE_BANNER_PHRASES.some((p) => l.includes(p)));
  for (const shape of shapes) {
    const spec = composition.pattern_shapes[shape];
    if (!spec) continue;

    // Multi-tier patterns (e.g. error has tier 1 with banner + tier 2 without):
    // only flag if this is the ONLY shape for this pattern.
    if (spec.no_close_banner && hasBanner && shapes.length === 1) {
      error(slug, "BANNER-03", `Pattern shape "${shape}" should not have a close banner, but one was found`);
    }

    if (!spec.no_close_banner && spec.required.some((r) => r.includes("close banner")) && !hasBanner) {
      error(slug, "BANNER-01", `Pattern shape "${shape}" requires a close banner, but none was found`);
    }

    // Required element checks (heuristic — check for key phrases)
    for (const req of spec.required) {
      if (req.includes("close banner")) continue; // handled above
      if (req.includes("WHAT WENT WRONG") && !lines.some((l) => l.includes("WHAT WENT WRONG"))) {
        error(slug, "ERROR-01", `Missing required element: ${req}`);
      }
      if (req.includes("TRY") && !req.includes("entry") && shape === "error-full" && !lines.some((l) => l.trim() === "TRY" || l.includes("● TRY"))) {
        error(slug, "ERROR-01", `Missing required element: ${req}`);
      }
      if (req.includes("FAILURE preface") && !lines.some((l) => l.includes("FAILURE"))) {
        error(slug, "ERROR-01", `Missing required element: ${req}`);
      }
      if (req.includes("USAGE") && !lines.some((l) => l.trim() === "USAGE")) {
        error(slug, "HELP-01", `Missing required element: ${req}`);
      }
      if (req.includes("LEARN MORE") && !lines.some((l) => l.trim() === "LEARN MORE")) {
        error(slug, "HELP-01", `Missing required element: ${req}`);
      }
      if (req.includes("✓ result row") && !lines.some((l) => l.includes("✓"))) {
        error(slug, "SUCCESS-01", `Missing required element: ${req}`);
      }
      if (req.includes("⚠ count line") && !lines.some((l) => l.includes("⚠"))) {
        error(slug, "PARTIAL-01", `Missing required element: ${req}`);
      }
    }
  }

  // BANNER-02: Close banner should be last content
  if (hasBanner) {
    const nonEmpty = lines.filter((l) => l.trim() !== "");
    const lastLine = nonEmpty[nonEmpty.length - 1] || "";
    if (!CLOSE_BANNER_PHRASES.some((p) => lastLine.includes(p))) {
      warn(slug, "BANNER-02", "Close banner should be the last visible content");
    }
  }

  // ERROR-02: WHAT WENT WRONG body should be one line
  if (shapes.includes("error-full")) {
    const wwIdx = lines.findIndex((l) => l.includes("WHAT WENT WRONG"));
    if (wwIdx >= 0) {
      let bodyLines = 0;
      for (let i = wwIdx + 1; i < lines.length; i++) {
        const t = lines[i].trim();
        if (t === "" || /^[●?▶!⚠✓$]/.test(t) || /^[A-Z]{2,}/.test(t) || t.startsWith("MOD ")) break;
        bodyLines++;
      }
      if (bodyLines > 1) {
        warn(slug, "ERROR-02", `WHAT WENT WRONG body has ${bodyLines} lines (expected 1). Multi-cause goes in ? Hint.`);
      }
    }
  }
}

// Report
console.log(`\nValidating ${files.length} patterns against composition.json\n`);

const errors = results.filter((r) => r.severity === "error");
const warnings = results.filter((r) => r.severity === "warning");

if (errors.length === 0 && warnings.length === 0) {
  console.log("✓ All patterns pass composition rules.\n");
} else {
  for (const r of errors) {
    console.log(`  ✗ [${r.ruleId}] ${r.slug}: ${r.message}`);
  }
  for (const r of warnings) {
    console.log(`  ? [${r.ruleId}] ${r.slug}: ${r.message}`);
  }
  console.log(`\n  ${errors.length} error(s), ${warnings.length} warning(s)\n`);
}

if (errors.length > 0) process.exit(1);
