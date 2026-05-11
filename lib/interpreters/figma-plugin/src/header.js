// Construct — Figma interpreter (runtime).
//
// Reads canonical (baked in by build.mjs) and writes/updates Figma components,
// styles, and variables in the open file. Idempotent: each generated node
// carries a stable construct.key in pluginData; re-runs update in place rather
// than recreate. A manifest on figma.root tracks ownership for orphan review.
//
// This file is generated. Do not edit code.js directly — edit src/ and run
// `node build.mjs`.

// ------- BAKED CANONICAL --------------------------------------------------
// Replaced at build time by build.mjs.
const CANONICAL = __CANONICAL_PLACEHOLDER__;
const BUILT_AT = "__BUILT_AT_PLACEHOLDER__";
// Per-entity stable hashes of the canonical build — replaced at build time.
// Used by the diff engine to detect added/modified/removed entities since last sync.
const CANONICAL_HASHES = __CANONICAL_HASHES_PLACEHOLDER__;
// Canonical patterns parsed from design-system/patterns/*.md at build time.
const CANONICAL_PATTERNS = __CANONICAL_PATTERNS_PLACEHOLDER__;
// Mirror items: proposed patterns from design-system/mirror/*.md, with lint results.
const MIRROR_ITEMS = __MIRROR_ITEMS_PLACEHOLDER__;

// ------- Constants --------------------------------------------------------
const KEY_CONSTRUCT = "construct.key";
const KEY_REVIEW = "construct.review";
const KEY_MANIFEST = "construct.manifest";
const ORPHAN_PAGE_NAME = "Construct / _orphans";

const PAGE_NAMES = {
  token: "Construct / Tokens",
  component: "Construct / Components",
  pattern: "Construct / Patterns",
  mirror: "Construct / Mirror",
};

// Old-prefix → new-prefix rewrite map. Applied once per file on first sync after rename.
const MIGRATION_MAP = {
  "atom/": "token/",
  "molecule/": "row/",
  "organism/": "section/",
  "template/": "pattern/",
};

// ------- Helpers ----------------------------------------------------------
function hexToRgb(hex) {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.slice(0, 2), 16) / 255,
    g: parseInt(h.slice(2, 4), 16) / 255,
    b: parseInt(h.slice(4, 6), 16) / 255,
  };
}

function colorByPath(path) {
  // path = "semantic.danger" -> CANONICAL.color.semantic.danger.$value
  const parts = path.split(".");
  let n = CANONICAL.color;
  for (const p of parts) n = n && n[p];
  if (!n || !n.$value) throw new Error("Color path not found: " + path);
  return n.$value;
}

let LOG_FN = (line, cls) => {};
function setLog(fn) { LOG_FN = fn; }
function log(line, cls) { LOG_FN(line, cls); }
