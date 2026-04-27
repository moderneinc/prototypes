/**
 * ApproachDiagram — single inline SVG illustrating the three-layer model.
 *
 *   authoring (design-system/tokens.json)
 *      │
 *      ▼
 *   canonical (tokens/canonical.json — semantic, with provenance)
 *      │
 *      ├─→ Figma  ←── Code Connect ── components (return arrow)
 *      ├─→ CLI runtime
 *      ├─→ Docs / playground
 *      └─→ Future consumers
 *
 * Native to the playground's visual language: monospace labels, panel
 * borders, semantic colors. No reference visual is copied — the shape is
 * driven by the relationships in the model, not by any vendor diagram.
 */
import * as React from "react";

export function ApproachDiagram() {
  return (
    <div
      className="rounded-md border p-6"
      style={{
        background: "var(--color-bg-terminal)",
        borderColor: "var(--color-bg-panel)",
      }}
    >
      <svg
        viewBox="0 0 720 460"
        role="img"
        aria-labelledby="approach-diagram-title approach-diagram-desc"
        style={{ width: "100%", height: "auto", fontFamily: "var(--font-mono)" }}
      >
        <title id="approach-diagram-title">Construct three-layer token flow</title>
        <desc id="approach-diagram-desc">
          Authoring source flows down into canonical with provenance. Canonical projects out to
          Figma via DTCG, to the CLI runtime, to docs, and to future consumers. Code Connect
          returns from Figma back to the React components, making the loop bidirectional.
        </desc>

        {/* defs: arrowheads */}
        <defs>
          <marker id="arrow-supporting" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--color-text-supporting)" />
          </marker>
          <marker id="arrow-info" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--color-info)" />
          </marker>
        </defs>

        {/* Layer 1: authoring */}
        <g>
          <rect x="240" y="20" width="240" height="56" rx="6" fill="none" stroke="var(--color-bg-panel)" strokeWidth="1" />
          <text x="360" y="42" textAnchor="middle" fontSize="13" fill="var(--color-text-primary)" fontWeight="700">
            design-system/tokens.json
          </text>
          <text x="360" y="62" textAnchor="middle" fontSize="11" fill="var(--color-text-supporting)">
            authoring · human-edited
          </text>
        </g>

        {/* arrow → canonical */}
        <line
          x1="360"
          y1="76"
          x2="360"
          y2="120"
          stroke="var(--color-text-supporting)"
          strokeWidth="1.5"
          markerEnd="url(#arrow-supporting)"
        />

        {/* Layer 2: canonical */}
        <g>
          <rect x="180" y="120" width="360" height="80" rx="6" fill="none" stroke="var(--color-info)" strokeWidth="1.5" />
          <text x="360" y="146" textAnchor="middle" fontSize="13" fill="var(--color-text-primary)" fontWeight="700">
            tokens/canonical.json
          </text>
          <text x="360" y="166" textAnchor="middle" fontSize="11" fill="var(--color-text-supporting)">
            semantic source of truth
          </text>
          <text x="360" y="184" textAnchor="middle" fontSize="11" fill="var(--color-text-supporting)">
            role · evidence · applies_to · note · extrapolated · disambiguation
          </text>
        </g>

        {/* fan-out lines from canonical to four projection boxes */}
        {/* Figma column */}
        <line x1="240" y1="200" x2="120" y2="260" stroke="var(--color-text-supporting)" strokeWidth="1.5" markerEnd="url(#arrow-supporting)" />
        {/* CLI column */}
        <line x1="320" y1="200" x2="280" y2="260" stroke="var(--color-text-supporting)" strokeWidth="1.5" markerEnd="url(#arrow-supporting)" />
        {/* Docs column */}
        <line x1="400" y1="200" x2="440" y2="260" stroke="var(--color-text-supporting)" strokeWidth="1.5" markerEnd="url(#arrow-supporting)" />
        {/* Future column */}
        <line x1="480" y1="200" x2="600" y2="260" stroke="var(--color-text-supporting)" strokeWidth="1.5" markerEnd="url(#arrow-supporting)" />

        {/* Layer 3: projections */}
        {/* Figma */}
        <g>
          <rect x="40" y="260" width="160" height="56" rx="6" fill="none" stroke="var(--color-bg-panel)" strokeWidth="1" />
          <text x="120" y="282" textAnchor="middle" fontSize="12" fill="var(--color-text-primary)" fontWeight="700">
            Figma
          </text>
          <text x="120" y="300" textAnchor="middle" fontSize="10" fill="var(--color-text-supporting)">
            via DTCG + Tokens Studio
          </text>
        </g>
        {/* CLI runtime */}
        <g>
          <rect x="200" y="260" width="160" height="56" rx="6" fill="none" stroke="var(--color-bg-panel)" strokeWidth="1" />
          <text x="280" y="282" textAnchor="middle" fontSize="12" fill="var(--color-text-primary)" fontWeight="700">
            CLI runtime
          </text>
          <text x="280" y="300" textAnchor="middle" fontSize="10" fill="var(--color-text-supporting)">
            (interpreter — stub)
          </text>
        </g>
        {/* Docs */}
        <g>
          <rect x="360" y="260" width="160" height="56" rx="6" fill="none" stroke="var(--color-bg-panel)" strokeWidth="1" />
          <text x="440" y="282" textAnchor="middle" fontSize="12" fill="var(--color-text-primary)" fontWeight="700">
            Docs / playground
          </text>
          <text x="440" y="300" textAnchor="middle" fontSize="10" fill="var(--color-text-supporting)">
            this site
          </text>
        </g>
        {/* Future */}
        <g>
          <rect x="520" y="260" width="160" height="56" rx="6" fill="none" stroke="var(--color-bg-panel)" strokeWidth="1" strokeDasharray="4 4" />
          <text x="600" y="282" textAnchor="middle" fontSize="12" fill="var(--color-text-supporting)" fontWeight="700">
            Future consumers
          </text>
          <text x="600" y="300" textAnchor="middle" fontSize="10" fill="var(--color-text-metadata)">
            agents, IDE, …
          </text>
        </g>

        {/* Components (target of Code Connect return) */}
        <g>
          <rect x="40" y="380" width="160" height="56" rx="6" fill="none" stroke="var(--color-bg-panel)" strokeWidth="1" />
          <text x="120" y="402" textAnchor="middle" fontSize="12" fill="var(--color-text-primary)" fontWeight="700">
            React components
          </text>
          <text x="120" y="420" textAnchor="middle" fontSize="10" fill="var(--color-text-supporting)">
            /components/*.tsx
          </text>
        </g>

        {/* Code Connect return arrow: Figma → React components.
            The path drops out of the right side of the Figma box and curves
            up to enter the components box from the right side. Cyan to mark
            it as the bidirectional leg. */}
        <path
          d="M 200 290 C 240 360, 220 408, 200 408"
          fill="none"
          stroke="var(--color-info)"
          strokeWidth="1.5"
          markerEnd="url(#arrow-info)"
        />
        <text x="220" y="356" fontSize="10" fill="var(--color-info)" fontFamily="var(--font-mono)">
          Code Connect
        </text>

        {/* Components → canonical (the components consume canonical at runtime).
            A faint vertical hint that the React components read from canonical,
            closing the loop. */}
        <line
          x1="120"
          y1="380"
          x2="120"
          y2="350"
          stroke="var(--color-text-metadata)"
          strokeWidth="1"
          strokeDasharray="2 3"
        />
        <line
          x1="120"
          y1="350"
          x2="180"
          y2="350"
          stroke="var(--color-text-metadata)"
          strokeWidth="1"
          strokeDasharray="2 3"
        />
        <line
          x1="180"
          y1="350"
          x2="180"
          y2="200"
          stroke="var(--color-text-metadata)"
          strokeWidth="1"
          strokeDasharray="2 3"
          markerEnd="url(#arrow-supporting)"
        />
        <text x="124" y="368" fontSize="9" fill="var(--color-text-metadata)" fontFamily="var(--font-mono)">
          reads canonical
        </text>
      </svg>
    </div>
  );
}
