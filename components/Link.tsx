/**
 * Link — semantic hyperlink. Renders in color.semantic.info (cyan). The
 * canonical link policy says we don't impose an underline on terminals;
 * on the canvas (web) we do underline on hover only — terminals that
 * render OSC-8 with their own underline are honored. There's no
 * bracket/parenthesis fallback when a link can't render.
 *
 * Tokens used:
 *   - link.policy ($value.color = color.semantic.info)
 *   - color.semantic.info
 */
import * as React from "react";

export type LinkProps = {
  href: string;
  children: React.ReactNode;
  /** External link — opens in a new tab with rel=noopener. */
  external?: boolean;
  className?: string;
};

export function Link({ href, children, external = false, className = "" }: LinkProps) {
  const externalProps = external ? { target: "_blank", rel: "noopener noreferrer" } : {};
  return (
    <a
      href={href}
      className={className}
      style={{ color: "var(--color-info)" }}
      {...externalProps}
    >
      {children}
    </a>
  );
}
