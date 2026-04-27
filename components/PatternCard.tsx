"use client";

import * as React from "react";
import { BottomSheet } from "@/components/BottomSheet";

type PatternCardProps = {
  slug: string;
  title: string;
  body: string;
  exampleNote?: string;
  children?: React.ReactNode;
};

const pillInactive: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: "0.75rem",
  border: "1px solid var(--color-bg-panel)",
  padding: "0.125rem 0.5rem",
  background: "transparent",
  borderRadius: "0.25rem",
  cursor: "pointer",
  lineHeight: 1.5,
  color: "var(--color-text-supporting)",
};

export function PatternCard({ slug, title, body, exampleNote, children }: PatternCardProps) {
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const hasBody = body.trim().length > 0;

  return (
    <div className="space-y-4">
      <div id={"pattern-" + slug} />

      {/* Title row */}
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
        <h3 style={{ color: "var(--color-text-primary)", fontWeight: 700, fontSize: "1rem", margin: 0 }}>
          {title}
        </h3>
        {hasBody && (
          <button type="button" onClick={() => setSheetOpen(true)} style={pillInactive}>
            {slug}.md
          </button>
        )}
      </div>

      {/* Example area */}
      {children && (
        <div>
          {children}
          {exampleNote && (
            <p style={{ color: "var(--color-text-metadata)", fontSize: "0.75rem", fontFamily: "var(--font-mono)", marginTop: "0.5rem" }}>
              {exampleNote}
            </p>
          )}
        </div>
      )}

      {sheetOpen && (
        <BottomSheet
          filename={`design-system/patterns/${slug}.md`}
          body={body}
          onClose={() => setSheetOpen(false)}
        />
      )}
    </div>
  );
}
