// Figma interpreter — projects canonical tokens into:
//   1. tokens/dtcg.json   — W3C DTCG file for Tokens Studio import.
//   2. tokens/figma-map.json — projection rules for terminal-native types
//      (terminal.spacing, terminal.glyph) into canvas-friendly values.
//
// The canonical file is the source of meaning; this interpreter chooses
// how to express that meaning on the canvas.
//
// Assumption (stated inline per spec): this module is .mjs rather than .ts
// so the build script can import it without TypeScript compilation. It is
// build-time-only; the Next.js app reads canonical.json directly and never
// needs to call the interpreter at runtime.

const STRIP = new Set([
  "role",
  "evidence",
  "applies_to",
  "note",
  "extrapolated",
  "disambiguation",
  "name",
  "description",
  "color_description",
  "supersedes",
  "$source",
  "$kind",
  "$description",
]);

/**
 * @param {object} canonical Parsed contents of tokens/canonical.json.
 * @returns {{ dtcg: object, figmaMap: object }}
 */
export function project(canonical) {
  const figmaMap = buildFigmaMap();
  const dtcg = {};

  dtcg.color = projectColor(canonical.color);
  dtcg.typography = projectTypography(canonical.typography);
  dtcg.spacing = projectSpacing(canonical.spacing, figmaMap);
  dtcg.glyph = projectGlyphs(canonical.glyph);
  dtcg.banner = projectBanner(canonical.banner);

  return { dtcg, figmaMap };
}

function projectColor(node) {
  const out = {};
  for (const groupKey of Object.keys(node)) {
    if (groupKey.startsWith("$")) continue;
    if (groupKey === "fallback") continue; // descriptive prose; strip from DTCG
    const group = node[groupKey];
    out[groupKey] = {};
    for (const tokenKey of Object.keys(group)) {
      if (tokenKey.startsWith("$")) continue;
      const t = group[tokenKey];
      if (t.$type !== "color") continue;
      out[groupKey][tokenKey] = { $type: "color", $value: t.$value };
    }
  }
  return out;
}

function projectTypography(node) {
  const out = {};
  for (const key of Object.keys(node)) {
    if (key.startsWith("$")) continue;
    const t = node[key];
    if (t.$type === "font_stack") {
      out[key] = { $type: "fontFamily", $value: t.$value };
      continue;
    }
    if (t.$type !== "typography") continue;
    const v = { ...t.$value };
    // DTCG alias: "color.text.primary" → "{color.text.primary}"
    if (v.color && typeof v.color === "string") v.color = `{${v.color}}`;
    // Drop properties that don't translate to Figma typography styles.
    delete v.case;
    out[key] = { $type: "typography", $value: v };
  }
  return out;
}

function projectSpacing(node, figmaMap) {
  const out = {};
  for (const groupKey of Object.keys(node)) {
    if (groupKey.startsWith("$")) continue;
    const group = node[groupKey];
    out[groupKey] = {};
    for (const tokenKey of Object.keys(group)) {
      if (tokenKey.startsWith("$")) continue;
      const t = group[tokenKey];
      if (t.$type !== "terminal.spacing") continue;
      out[groupKey][tokenKey] = projectOneSpacing(t.$value, figmaMap);
    }
  }
  return out;
}

function projectOneSpacing(value, figmaMap) {
  if ("count" in value) {
    const px = unitToPx(value.unit, value.count, figmaMap);
    return { $type: "dimension", $value: `${px}px` };
  }
  // Compound: average above+below or emit object — Tokens Studio handles object values.
  const above = unitToPx(value.above.unit, value.above.count, figmaMap);
  const below = unitToPx(value.below.unit, value.below.count, figmaMap);
  return {
    $type: "dimension",
    $value: { above: `${above}px`, below: `${below}px` },
  };
}

function unitToPx(unit, count, figmaMap) {
  const rule = figmaMap.spacingUnits[unit];
  if (!rule) return 0;
  return rule.pxPerUnit * count;
}

function projectGlyphs(node) {
  const out = {};
  for (const key of Object.keys(node)) {
    if (key.startsWith("$")) continue;
    const g = node[key];
    if (g.$type !== "terminal.glyph") continue;
    // Spec: glyphs flatten to a plain string in DTCG only.
    out[key] = { $type: "string", $value: g.$value.char };
  }
  return out;
}

function projectBanner(node) {
  const out = {};
  if (node.close && node.close.variants) {
    out.close = {};
    for (const v of Object.keys(node.close.variants)) {
      const variant = node.close.variants[v];
      const value = { ...variant.$value };
      if (value.color && typeof value.color === "string") value.color = `{${value.color}}`;
      out.close[v] = { $type: "object", $value: value };
    }
  }
  return out;
}

/**
 * Editable projection rules. Designers / engineers can tune these without
 * touching the canonical model. The interpreter consults this map when
 * projecting terminal-native types onto the canvas.
 */
function buildFigmaMap() {
  return {
    $description:
      "Projection rules for terminal-native token types onto Figma canvas dimensions. Edit these values to retune the canvas projection without changing canonical meaning.",
    spacingUnits: {
      space: {
        pxPerUnit: 8,
        rationale:
          "One terminal column ≈ 8px on a 16px monospace baseline. Adjust if the canvas typography changes.",
      },
      blank_line: {
        pxPerUnit: 16,
        rationale:
          "One blank line ≈ one line-height (16px @ 1.0 leading). Doubles to 32px if the canvas uses 1.5 leading.",
      },
      unknown: { pxPerUnit: 0, rationale: "Unparsed unit. Should not appear." },
    },
    glyphFontFamily: {
      $value: "JetBrains Mono",
      rationale:
        "Monospace family used to render glyph tokens on canvas so widths match terminal output.",
    },
  };
}
