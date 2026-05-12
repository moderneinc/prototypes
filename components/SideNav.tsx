"use client";

/**
 * SideNav — persistent left navigation rail.
 *
 * Desktop (≥ md): fixed-position rail along the left edge, ~14rem wide.
 * Mobile (< md): collapses behind a hamburger button at the top of the
 * page; opening the drawer covers the viewport.
 *
 * Active state: uses usePathname() from next/navigation. "/" matches exact
 * only; all other routes match by startsWith so sub-routes also highlight
 * the parent nav item.
 *
 * Hand-rolled — no dependency on a UI library.
 */
import * as React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export type NavItem = { href: string; label: string };

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Intro" },
  { href: "/workflow", label: "Workflow" },
  { href: "/tokens", label: "Tokens" },
  { href: "/components", label: "Components" },
  { href: "/patterns", label: "Patterns" },
  { href: "/voice", label: "Voice" },
  { href: "/approach", label: "System Design" },
  { href: "/how-we-got-here", label: "How we got here" },
];

export function SideNav() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const renderList = (onNavigate?: () => void) => (
    <ul className="space-y-1">
      {NAV_ITEMS.map((item) => {
        const active = isActive(item.href);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              className="block rounded px-2 py-1 transition-colors"
              style={{
                fontSize: "0.875rem",
                fontWeight: 500,
                fontFamily: "var(--font-sans)",
                color: active ? "var(--color-info)" : "var(--color-text-body)",
                background: active ? "rgba(8, 145, 178, 0.08)" : "transparent",
                textDecoration: "none",
              }}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
      {/* Desktop rail */}
      <aside
        className="hidden md:fixed md:left-0 md:top-0 md:bottom-0 md:block md:w-56 md:overflow-y-auto md:border-r md:px-4 md:py-8"
        style={{ borderColor: "var(--color-bg-panel)", background: "var(--color-bg-page)" }}
        aria-label="Section navigation"
      >
        <div className="mb-6">
          <Link href="/" style={{ textDecoration: "none", display: "block" }}>
            <div style={{ fontFamily: "var(--font-mono)", lineHeight: 1.4 }}>
              <div style={{ fontSize: "0.6875rem", color: "var(--color-text-metadata)", letterSpacing: "0.04em", marginBottom: "0.125rem" }}>moderne /</div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                <span style={{ color: "var(--color-info)", fontSize: "0.75rem" }}>◆</span>
                <span style={{ fontSize: "1rem", fontWeight: 700, color: "var(--color-text-primary)", letterSpacing: "0.04em" }}>construct</span>
              </div>
            </div>
          </Link>
          <div style={{ color: "var(--color-text-body)", fontSize: "0.75rem", fontFamily: "var(--font-sans)", marginTop: "0.375rem", paddingLeft: "0.125rem" }}>
            CLI design system
          </div>
        </div>
        {renderList()}
      </aside>

      {/* Mobile bar */}
      <div
        className="sticky top-0 z-30 flex items-center justify-between border-b px-4 py-3 md:hidden"
        style={{ borderColor: "var(--color-bg-panel)", background: "var(--color-bg-page)" }}
      >
        <Link href="/" style={{ textDecoration: "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontFamily: "var(--font-mono)" }}>
            <span style={{ color: "var(--color-info)", fontSize: "0.75rem" }}>◆</span>
            <span style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--color-text-primary)", letterSpacing: "0.04em" }}>construct</span>
          </div>
        </Link>
        <button
          type="button"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="rounded border px-2 py-1 text-sm"
          style={{
            borderColor: "var(--color-bg-panel)",
            color: "var(--color-text-primary)",
            fontFamily: "var(--font-mono)",
          }}
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div
          className="fixed inset-0 z-40 overflow-y-auto px-6 py-8 md:hidden"
          style={{ background: "var(--color-bg-page)" }}
        >
          <div className="mb-4 flex items-center justify-between">
            <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontFamily: "var(--font-mono)" }}>
              <span style={{ color: "var(--color-info)", fontSize: "0.75rem" }}>◆</span>
              <span style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--color-text-primary)", letterSpacing: "0.04em" }}>construct</span>
            </div>
            <button
              type="button"
              aria-label="Close navigation"
              onClick={() => setOpen(false)}
              className="rounded border px-2 py-1 text-sm"
              style={{
                borderColor: "var(--color-bg-panel)",
                color: "var(--color-text-primary)",
                fontFamily: "var(--font-mono)",
              }}
            >
              ✕
            </button>
          </div>
          {renderList(() => setOpen(false))}
        </div>
      )}
    </>
  );
}
