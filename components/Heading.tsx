/**
 * Heading — renders a section header in the CLI's typography.section_header
 * role. ALL CAPS, weight 700, color.text.primary by default. Pass `tone="danger"`
 * to render the leading ● bullet in color.semantic.danger (the bullet is
 * colored; the header text remains primary).
 *
 * Tokens used:
 *   - typography.section_header (weight, casing, color)
 *   - color.semantic.danger (bullet, when tone="danger")
 *   - glyph.section_marker (●)
 */
import * as React from "react";

export type HeadingProps = {
  children: React.ReactNode;
  /** Render a leading ● in the matching semantic color. */
  tone?: "neutral" | "danger";
  as?: "h1" | "h2" | "h3";
  className?: string;
};

export function Heading({ children, tone = "neutral", as = "h2", className = "" }: HeadingProps) {
  const Tag = as;
  return (
    <Tag
      className={`font-bold uppercase tracking-[0.02em] ${className}`}
      style={{ color: "var(--color-text-primary)" }}
    >
      {tone === "danger" && (
        <span style={{ color: "var(--color-danger)" }} aria-hidden>
          ●{" "}
        </span>
      )}
      {children}
    </Tag>
  );
}
