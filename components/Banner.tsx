/**
 * Banner — close banner. Reproduces the four canonical close-banner
 * variants from canonical.banner.close.variants. The shape is:
 *
 *   <one blank line above>
 *   <CAPS PHRASE> in (<duration>)
 *
 * Bold weight; no leading glyph; phrase color comes from the variant's
 * canonical color reference.
 *
 * Tokens used:
 *   - banner.close (shape, weight, leadingBlankLine, noGlyph)
 *   - color.semantic.success / .warning / .danger
 */
import * as React from "react";

export type BannerVariant = "success" | "partial_success" | "success_with_warnings" | "failure";

const PHRASE_BY_VARIANT: Record<BannerVariant, string> = {
  success: "MOD SUCCEEDED",
  partial_success: "MOD PARTIALLY SUCCEEDED",
  success_with_warnings: "MOD SUCCEEDED WITH WARNINGS",
  failure: "MOD FAILED",
};

const COLOR_VAR_BY_VARIANT: Record<BannerVariant, string> = {
  success: "var(--color-success)",
  partial_success: "var(--color-warning)",
  success_with_warnings: "var(--color-warning)",
  failure: "var(--color-danger)",
};

export type BannerProps = {
  variant: BannerVariant;
  /** Duration string, rendered as "in (<duration>)" after the phrase. */
  duration?: string;
  className?: string;
};

export function Banner({ variant, duration, className = "" }: BannerProps) {
  return (
    <div
      className={`font-bold ${className}`}
      style={{ fontFamily: "var(--font-mono)", color: COLOR_VAR_BY_VARIANT[variant] }}
    >
      {/* one blank line above is implicit in canonical banner.close.leadingBlankLine — leave layout to the caller */}
      {PHRASE_BY_VARIANT[variant]}
      {duration ? (
        <span style={{ color: "var(--color-text-metadata)" }}>{` in (${duration})`}</span>
      ) : null}
    </div>
  );
}
