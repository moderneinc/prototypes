import * as React from "react";

const box: React.CSSProperties = {
  border: "1px solid var(--color-bg-panel)",
  borderRadius: "0.375rem",
  background: "var(--color-bg-terminal)",
  padding: "0.75rem 1.25rem",
};

const boxHighlight: React.CSSProperties = {
  ...box,
  border: "1px solid var(--color-info)",
  background: "rgba(103,232,249,0.04)",
};

const boxDashed: React.CSSProperties = {
  ...box,
  border: "1px dashed var(--color-bg-panel)",
};

const label: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: "0.875rem",
  fontWeight: 700,
  color: "var(--color-text-primary)",
};

const sub: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: "0.75rem",
  color: "var(--color-text-supporting)",
  marginTop: "0.125rem",
};

const arrow: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  color: "var(--color-text-metadata)",
  textAlign: "center",
  lineHeight: 1,
  userSelect: "none",
  padding: "0.125rem 0",
};

export function ApproachDiagram() {
  return (
    <div
      aria-label="Construct bidirectional token flow"
      style={{ display: "flex", flexDirection: "column", gap: 0 }}
    >
      {/* Layer 1 — Authoring */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ ...box, textAlign: "center", minWidth: "16rem", maxWidth: "24rem", flex: 1 }}>
          <div style={label}>design-system/tokens.json</div>
          <div style={sub}>authoring source</div>
        </div>
      </div>

      <div style={arrow}>│<br />▼</div>

      {/* Layer 2 — Canonical */}
      <div style={{ ...boxHighlight }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ ...label, color: "var(--color-info)" }}>tokens/canonical.json</div>
          <div style={sub}>semantic source of truth</div>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "0.25rem 0.75rem",
            marginTop: "0.5rem",
          }}
        >
          {["role", "evidence", "applies_to", "note", "extrapolated", "disambiguation"].map((f) => (
            <code
              key={f}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.75rem",
                color: "var(--color-text-supporting)",
              }}
            >
              {f}
            </code>
          ))}
        </div>
      </div>

      <div style={arrow}>│<br />▼</div>

      {/* Layer 3 — Projections */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(10rem, 1fr))",
          gap: "0.5rem",
        }}
      >
        {/* Figma */}
        <div style={{ ...box, borderColor: "var(--color-success)", background: "rgba(74,222,128,0.04)" }}>
          <div style={label}>Figma</div>
          <div style={{ ...sub, color: "var(--color-success)" }}>↓ push via plugin</div>
          <div style={{ ...sub, color: "var(--color-success)" }}>↑ pull via Claude + MCP</div>
          <div style={{ ...sub, marginTop: "0.375rem" }}>
            Tokens, Components, Patterns pages
          </div>
        </div>

        {/* CLI runtime */}
        <div style={box}>
          <div style={label}>CLI runtime</div>
          <div style={sub}>interpreter stub</div>
        </div>

        {/* Docs */}
        <div style={box}>
          <div style={label}>Docs / playground</div>
          <div style={sub}>this site</div>
        </div>

        {/* Future */}
        <div style={boxDashed}>
          <div style={{ ...label, color: "var(--color-text-supporting)" }}>Future consumers</div>
          <div style={sub}>agents, IDEs, …</div>
        </div>
      </div>
    </div>
  );
}
