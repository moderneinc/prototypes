import * as React from "react";

const steps = [
  {
    n: 1,
    title: "Source",
    sub: "what already existed",
    items: ["2 PDFs", "1 journey map", "existing CLI source"],
    note: "no new opinions",
    highlight: false,
    dashed: false,
  },
  {
    n: 2,
    title: "Audit",
    sub: "group by visual concern",
    items: ["20 categories  (A – T)", "color, glyph, banner, spacing, grammar, …"],
    note: null,
    highlight: false,
    dashed: false,
  },
  {
    n: 3,
    title: "Reconcile",
    sub: "decide where they disagreed",
    items: ["19 decisions  (D-01 … D-19)", "picked by evidence; rationale recorded"],
    note: null,
    highlight: false,
    dashed: false,
  },
  {
    n: 4,
    title: "Codify",
    sub: "design system files",
    items: ["tokens.json", "canonical.json", "patterns/*.md", "voice.md"],
    note: "with provenance",
    highlight: true,
    dashed: false,
  },
  {
    n: 5,
    title: "Project",
    sub: "any consumer, headless",
    items: ["Figma", "CLI runtime", "docs / playground", "any app"],
    note: "agents, IDEs, future",
    highlight: false,
    dashed: true,
  },
];

export function ProcessDiagram() {
  return (
    <div
      role="list"
      aria-label="How Construct was extracted from the existing CLI, five steps"
      style={{ display: "flex", flexDirection: "column", gap: 0 }}
    >
      {steps.map((step, i) => (
        <React.Fragment key={step.n}>
          <div
            role="listitem"
            style={{
              display: "flex",
              gap: "1rem",
              padding: "1rem 1.25rem",
              borderRadius: "0.375rem",
              border: step.highlight
                ? "1px solid var(--color-info)"
                : step.dashed
                ? "1px dashed var(--color-bg-panel)"
                : "1px solid var(--color-bg-panel)",
              background: step.highlight
                ? "rgba(103,232,249,0.04)"
                : "var(--color-bg-terminal)",
            }}
          >
            {/* Step number */}
            <div
              style={{
                flexShrink: 0,
                width: "2.5rem",
                paddingTop: "0.125rem",
                fontFamily: "var(--font-mono)",
                fontSize: "0.6875rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                color: step.highlight ? "var(--color-info)" : "var(--color-text-metadata)",
                textTransform: "uppercase",
              }}
            >
              {String(step.n).padStart(2, "0")}
            </div>

            {/* Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ marginBottom: "0.375rem", display: "flex", alignItems: "baseline", gap: "0.75rem", flexWrap: "wrap" }}>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.9375rem",
                    fontWeight: 700,
                    color: "var(--color-text-primary)",
                  }}
                >
                  {step.title}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.75rem",
                    color: "var(--color-text-supporting)",
                  }}
                >
                  {step.sub}
                </span>
              </div>

              <ul
                style={{
                  margin: 0,
                  padding: 0,
                  listStyle: "none",
                  display: "flex",
                  flexWrap: "wrap",
                  columnGap: "1.5rem",
                  rowGap: "0.125rem",
                }}
              >
                {step.items.map((item) => (
                  <li
                    key={item}
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.8125rem",
                      color: step.highlight ? "var(--color-info)" : "var(--color-text-body)",
                    }}
                  >
                    {item}
                  </li>
                ))}
              </ul>

              {step.note && (
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.75rem",
                    fontStyle: "italic",
                    color: "var(--color-text-metadata)",
                    margin: "0.375rem 0 0",
                  }}
                >
                  {step.note}
                </p>
              )}
            </div>
          </div>

          {i < steps.length - 1 && (
            <div
              aria-hidden
              style={{
                alignSelf: "flex-start",
                marginLeft: "1.5rem",
                color: "var(--color-text-metadata)",
                fontFamily: "var(--font-mono)",
                lineHeight: "1.25rem",
                userSelect: "none",
              }}
            >
              │
            </div>
          )}
        </React.Fragment>
      ))}

      {/* gaps.md callout */}
      <div
        style={{
          marginTop: "1rem",
          padding: "0.75rem 1.25rem",
          border: "1px solid var(--color-bg-panel)",
          borderRadius: "0.375rem",
          display: "flex",
          gap: "0.75rem",
          alignItems: "baseline",
          flexWrap: "wrap",
        }}
      >
        <code
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.8125rem",
            fontWeight: 700,
            color: "var(--color-text-primary)",
            flexShrink: 0,
          }}
        >
          gaps.md
        </code>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.8125rem",
            color: "var(--color-text-supporting)",
          }}
        >
          Where no source artifact specified a rule, we left it open. No invented answers. Just named questions.
        </span>
      </div>
    </div>
  );
}
