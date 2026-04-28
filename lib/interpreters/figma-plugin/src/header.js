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

// ------- Constants --------------------------------------------------------
const KEY_CONSTRUCT = "construct.key";
const KEY_REVIEW = "construct.review";
const KEY_MANIFEST = "construct.manifest";
const ORPHAN_PAGE_NAME = "Construct / _orphans";

const PAGE_NAMES = {
  atom: "Construct / Atoms",
  molecule: "Construct / Molecules",
  organism: "Construct / Organisms",
  banner: "Construct / Banners",
  template: "Construct / Templates",
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
