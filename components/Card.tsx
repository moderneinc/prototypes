/**
 * Card — neutral surface for grouping content on the canvas. The CLI does
 * not have cards; on the canvas, Card is a 1px panel-bordered box used to
 * isolate examples and reference rows. No raised-elevation styling — the
 * CLI is flat.
 *
 * Tokens used:
 *   - color.bg.terminal   (card surface)
 *   - color.bg.panel      (border)
 */
import * as React from "react";

export type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-md border p-5 ${className}`}
      style={{
        background: "var(--color-bg-terminal)",
        borderColor: "var(--color-bg-panel)",
      }}
    >
      {children}
    </div>
  );
}
