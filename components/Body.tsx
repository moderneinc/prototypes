/**
 * Body — default reading text. Three roles:
 *   - "primary"     → typography.primary    (color.text.body)
 *   - "supporting"  → typography.supporting (color.text.supporting)
 *   - "metadata"    → typography.metadata   (color.text.metadata)
 *
 * No casing, no weight changes, no color overrides outside these three.
 * The cyan/green/red/yellow semantic colors do not flow through Body —
 * those are reserved for inline glyphs, banner phrases, and Link.
 */
import * as React from "react";

export type BodyProps = {
  children: React.ReactNode;
  role?: "primary" | "supporting" | "metadata";
  as?: "p" | "span" | "div";
  className?: string;
};

const ROLE_TO_VAR: Record<NonNullable<BodyProps["role"]>, string> = {
  primary: "var(--color-text-body)",
  supporting: "var(--color-text-supporting)",
  metadata: "var(--color-text-metadata)",
};

export function Body({ children, role = "primary", as = "p", className = "" }: BodyProps) {
  const Tag = as;
  return (
    <Tag className={className} style={{ color: ROLE_TO_VAR[role] }}>
      {children}
    </Tag>
  );
}
