/**
 * Glyph — renders a glyph from canonical by name. Resolves the glyph's
 * `color` reference into a hex value at render time. Supports a
 * `colorOverride` for cases the canonical color_description calls out
 * (e.g. note_marker is yellow when leading word is "Note:" but red when
 * leading word is "Error:" — same glyph, different inherited color).
 *
 * Tokens used:
 *   - glyph.<name>            (char + color ref)
 *   - color.semantic.*        (resolved color)
 */
import * as React from "react";
import { loadCanonical, resolveColorHex, type GlyphToken } from "@/lib/tokens";

export type GlyphProps = {
  /** Glyph token name, e.g. "section_marker", "warning_marker". */
  name: string;
  /** Override the resolved color with another canonical ref (e.g. "color.semantic.danger"). */
  colorOverride?: string;
  /** If true, render the asciiFallback char instead of the rich char. */
  asciiOnly?: boolean;
  className?: string;
};

export function Glyph({ name, colorOverride, asciiOnly, className = "" }: GlyphProps) {
  const canonical = loadCanonical();
  const token = (canonical.glyph as Record<string, GlyphToken | string | undefined>)[name];
  if (!token || typeof token !== "object" || token.$type !== "terminal.glyph") {
    return <span aria-hidden>?</span>;
  }
  const colorRef = colorOverride ?? token.$value.color;
  const hex = resolveColorHex(colorRef) ?? "#ffffff";
  const char = asciiOnly ? token.$value.asciiFallback : token.$value.char;
  return (
    <span style={{ color: hex }} className={className} aria-hidden>
      {char}
    </span>
  );
}
