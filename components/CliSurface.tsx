/**
 * CliSurface — terminal-frame wrapper for example surfaces. Replaces the
 * inline <pre> styling previously inlined in /examples. Renders against
 * color.bg.terminal with a panel-colored 1px border, monospace, and
 * preserves whitespace so example layouts read like real terminal output.
 *
 * Tokens used:
 *   - color.bg.terminal   (surface)
 *   - color.bg.panel      (border)
 *   - color.text.body     (default text)
 */
import * as React from "react";

export type CliSurfaceProps = {
  children: React.ReactNode;
  className?: string;
  /** Optional caption placed beneath the surface explaining what it exercises. */
  caption?: React.ReactNode;
};

export function CliSurface({ children, className = "", caption }: CliSurfaceProps) {
  return (
    <div className="space-y-2">
      <div
        className={`rounded-md border p-5 ${className}`}
        style={{
          background: "var(--color-bg-terminal)",
          borderColor: "var(--color-bg-panel)",
          color: "var(--color-text-body)",
          fontFamily: "var(--font-mono)",
          fontSize: "0.875rem",
          lineHeight: 1.6,
          whiteSpace: "pre-wrap",
        }}
      >
        {children}
      </div>
      {caption && (
        <div
          style={{
            color: "var(--color-text-supporting)",
            fontSize: "0.8125rem",
            lineHeight: 1.5,
          }}
        >
          {caption}
        </div>
      )}
    </div>
  );
}
