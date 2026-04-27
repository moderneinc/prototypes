/**
 * Loader for the canonical token model.
 *
 * The Next.js app reads `tokens/canonical.json` directly — never the
 * authoring source (`design-system/tokens.json`) and never the projected
 * DTCG file (`tokens/dtcg.json`). Canonical preserves all provenance
 * (role, evidence, applies_to, note, extrapolated, disambiguation) which
 * the token-reference pages surface alongside each value.
 *
 * If the canonical file is missing, run `npm run tokens:build` from the
 * repo root.
 */
import fs from "node:fs";
import path from "node:path";

export type ColorToken = {
  $type: "color";
  $value: string;
  name?: string;
  role?: string;
  applies_to?: string[];
  evidence?: string[];
  note?: string;
  extrapolated?: boolean;
  disambiguation?: string;
};

export type TypographyToken = {
  $type: "typography";
  $value: {
    weight: string | number;
    case?: string;
    letterSpacing?: string;
    color: string;
    underline?: boolean;
  };
  role?: string;
  applies_to?: string[];
  supersedes?: string;
  evidence?: string[];
};

export type FontStackToken = {
  $type: "font_stack";
  $value: string[];
  $description?: string;
};

export type SimpleSpacingValue = {
  count: number;
  unit: "space" | "blank_line";
  axis: "horizontal" | "vertical";
  context: "indent" | "section_gap";
};

export type CompoundSpacingValue = {
  above: { count: number; unit: "space" | "blank_line" };
  below: { count: number; unit: "space" | "blank_line" };
  axis: "vertical";
  context: "section_gap";
};

export type SpacingToken = {
  $type: "terminal.spacing";
  $value: SimpleSpacingValue | CompoundSpacingValue;
  $source: string;
  role?: string;
  note?: string;
  evidence?: string[];
};

export type GlyphToken = {
  $type: "terminal.glyph";
  $value: {
    char: string;
    asciiFallback: string;
    role: string;
    color: string;
  };
  color_description?: string;
  role?: string;
  evidence?: string[];
  extrapolated?: boolean;
  disambiguation?: string;
};

export type BannerCloseVariant = {
  $type: "terminal.banner.close";
  $value: { phrase: string; color: string };
  evidence?: string[];
};

export type Canonical = {
  $meta: {
    name: string;
    version: string;
    phase: string;
    summary: string;
    scope: string;
    evidence_keys: Record<string, string>;
    generated: string;
    source: string;
    note: string;
  };
  color: {
    $description?: string;
    background: Record<string, ColorToken>;
    text: Record<string, ColorToken>;
    semantic: Record<string, ColorToken>;
    fallback: { $description?: string; [k: string]: unknown };
  };
  typography: {
    $description?: string;
    section_header: TypographyToken;
    primary: TypographyToken;
    supporting: TypographyToken;
    metadata: TypographyToken;
    monospace: FontStackToken;
  };
  spacing: {
    $description?: string;
    indent: Record<string, SpacingToken>;
    vertical: Record<string, SpacingToken>;
  };
  glyph: {
    $description?: string;
    [k: string]: GlyphToken | string | undefined;
  };
  banner: {
    $description?: string;
    start: {
      $type: "terminal.banner.start";
      $value: { rich: string; asciiFallback: string; shape: string };
      evidence?: string[];
    };
    close: {
      $shape: string;
      weight: string;
      leadingBlankLine: string;
      noGlyph: boolean;
      variants: Record<string, BannerCloseVariant>;
    };
  };
  link: {
    $type: "link.policy";
    $value: {
      transport: string;
      color: string;
      underlinePolicy: string;
      linkableTargets: Record<string, string>;
      fallback: string;
    };
    $description?: string;
    evidence?: string[];
  };
  machine_readable: {
    $type: "render.policy";
    $value: {
      color: string;
      glyph: string;
      weight: string;
      errorShape: string;
    };
    $description?: string;
    out_of_scope?: string;
    evidence?: string[];
  };
};

let cached: Canonical | null = null;

/**
 * Read tokens/canonical.json from the repo root. Cached after first read.
 */
export function loadCanonical(): Canonical {
  if (cached) return cached;
  const filePath = path.join(process.cwd(), "tokens", "canonical.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  cached = JSON.parse(raw) as Canonical;
  return cached;
}

/**
 * Resolve a dot-notation reference like "color.text.primary" against the
 * canonical model and return the underlying token (or undefined).
 */
export function resolveRef(ref: string, canonical: Canonical = loadCanonical()): unknown {
  const parts = ref.split(".");
  let cur: unknown = canonical;
  for (const p of parts) {
    if (cur && typeof cur === "object" && p in (cur as Record<string, unknown>)) {
      cur = (cur as Record<string, unknown>)[p];
    } else {
      return undefined;
    }
  }
  return cur;
}

/**
 * Resolve a color reference to its hex string. Returns undefined if the
 * reference doesn't point to a $type="color" token.
 */
export function resolveColorHex(ref: string, canonical: Canonical = loadCanonical()): string | undefined {
  const t = resolveRef(ref, canonical);
  if (t && typeof t === "object" && (t as ColorToken).$type === "color") {
    return (t as ColorToken).$value;
  }
  return undefined;
}
