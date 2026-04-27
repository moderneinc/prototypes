/**
 * Button — primary interactive primitive on the web canvas.
 *
 * The CLI does not have buttons. This component is the canvas analogue of
 * "an actionable, runnable command" — i.e. it borrows the same semantic
 * color the CLI uses for actionable content (color.semantic.info / cyan)
 * for its primary tone, and the danger color for destructive actions.
 *
 * Tokens used:
 *   - color.semantic.info       (primary)
 *   - color.semantic.danger     (danger)
 *   - color.bg.terminal         (button face)
 *   - color.text.primary        (label)
 */
import * as React from "react";

export type ButtonProps = {
  children: React.ReactNode;
  tone?: "primary" | "danger" | "neutral";
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
};

const BORDER_BY_TONE: Record<NonNullable<ButtonProps["tone"]>, string> = {
  primary: "var(--color-info)",
  danger: "var(--color-danger)",
  neutral: "var(--color-bg-panel)",
};

const TEXT_BY_TONE: Record<NonNullable<ButtonProps["tone"]>, string> = {
  primary: "var(--color-info)",
  danger: "var(--color-danger)",
  neutral: "var(--color-text-primary)",
};

export function Button({
  children,
  tone = "primary",
  type = "button",
  disabled,
  onClick,
  className = "",
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-50 ${className}`}
      style={{
        background: "transparent",
        borderColor: BORDER_BY_TONE[tone],
        color: TEXT_BY_TONE[tone],
        fontFamily: "var(--font-mono)",
      }}
    >
      {children}
    </button>
  );
}
