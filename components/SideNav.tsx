"use client";

/**
 * SideNav — persistent left navigation rail.
 *
 * Desktop (≥ md): fixed-position rail along the left edge, ~14rem wide.
 * Mobile (< md): collapses behind a hamburger button at the top of the
 * page; opening the drawer covers the viewport.
 *
 * Scroll-spy: when the page hosts the long-scroll content (i.e. on `/`),
 * an IntersectionObserver watches every section anchor and the active
 * link is the section nearest the top of the viewport. When the page
 * does not contain the section anchors (e.g. /patterns/[slug],
 * /examples/[slug]), the SideNav still renders — links just deep-link
 * back to `/#…`. No scroll-spy applies on those pages, by design: the
 * goal is no dead-end pages, not active highlighting everywhere.
 *
 * Hand-rolled — no dependency on a UI library.
 */
import * as React from "react";

export type NavItem = { href: string; label: string; indent?: boolean };

export const NAV_ITEMS: NavItem[] = [
  { href: "#intro", label: "Intro" },
  { href: "#approach", label: "Approach" },
  { href: "#tokens", label: "Tokens" },
  { href: "#tokens-color", label: "Color", indent: true },
  { href: "#tokens-typography", label: "Typography", indent: true },
  { href: "#tokens-spacing", label: "Spacing", indent: true },
  { href: "#tokens-glyphs", label: "Glyphs", indent: true },
  { href: "#tokens-banners", label: "Banners", indent: true },
  { href: "#tokens-links", label: "Links", indent: true },
  { href: "#patterns", label: "Patterns" },
  { href: "#voice", label: "Voice" },
  { href: "#examples", label: "Examples" },
];

/**
 * If `homeBase` is true, anchor hrefs stay as-is (`#intro`). Otherwise
 * they are rewritten to `/#intro` so they navigate back to the long-scroll
 * page from a standalone route.
 */
export function SideNav({ homeBase = true }: { homeBase?: boolean }) {
  const [active, setActive] = React.useState<string>(NAV_ITEMS[0].href);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (!homeBase) return;
    const ids = NAV_ITEMS.map((i) => i.href.replace("#", ""));
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry that is currently most prominently in view —
        // intersecting and closest to the top of the viewport.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActive(`#${visible[0].target.id}`);
        }
      },
      { rootMargin: "-10% 0px -70% 0px", threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [homeBase]);

  const linkHref = (href: string) => (homeBase ? href : `/${href}`);

  const renderList = (onNavigate?: () => void) => (
    <ul className="space-y-1 text-sm">
      {NAV_ITEMS.map((item) => {
        const isActive = homeBase && active === item.href;
        return (
          <li key={item.href} className={item.indent ? "pl-4" : ""}>
            <a
              href={linkHref(item.href)}
              onClick={onNavigate}
              className="block rounded px-2 py-1 transition-colors"
              style={{
                color: isActive ? "var(--color-info)" : "var(--color-text-supporting)",
                fontFamily: "var(--font-mono)",
                background: isActive ? "rgba(103, 232, 249, 0.06)" : "transparent",
              }}
            >
              {item.label}
            </a>
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
          <a
            href={homeBase ? "#intro" : "/"}
            className="block font-bold uppercase tracking-[0.02em]"
            style={{ color: "var(--color-text-primary)" }}
          >
            Construct
          </a>
          <div style={{ color: "var(--color-text-metadata)", fontSize: "0.75rem", fontFamily: "var(--font-mono)" }}>
            visual playground
          </div>
        </div>
        {renderList()}
      </aside>

      {/* Mobile bar */}
      <div
        className="sticky top-0 z-30 flex items-center justify-between border-b px-4 py-3 md:hidden"
        style={{ borderColor: "var(--color-bg-panel)", background: "var(--color-bg-page)" }}
      >
        <a
          href={homeBase ? "#intro" : "/"}
          className="font-bold uppercase tracking-[0.02em]"
          style={{ color: "var(--color-text-primary)" }}
        >
          Construct
        </a>
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
            <span
              className="font-bold uppercase tracking-[0.02em]"
              style={{ color: "var(--color-text-primary)" }}
            >
              Construct
            </span>
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
