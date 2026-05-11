/**
 * System Design — covers both how Construct is designed AND how to use it.
 * One continuous read; no collapsibles, no tabs.
 */
import * as React from "react";
import { Section } from "@/components/Section";
import { Body } from "@/components/Body";
import { ApproachDiagram } from "@/components/ApproachDiagram";
import { Heading } from "@/components/Heading";

const cardChrome: React.CSSProperties = {
  background: "var(--color-bg-terminal)",
  border: "1px solid var(--color-bg-panel)",
  borderRadius: "0.375rem",
  padding: "0.875rem 1rem",
  display: "flex",
  flexDirection: "column",
};

const layerLabel: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: "0.6875rem",
  fontWeight: 700,
  letterSpacing: "0.06em",
  color: "var(--color-text-supporting)",
};

const layerExampleStyle: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: "0.75rem",
  color: "var(--color-text-body)",
  marginTop: "auto",
};

const previewBox: React.CSSProperties = {
  height: "3.25rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0.625rem 0 0.875rem",
  overflow: "hidden",
};

const arrowStyle: React.CSSProperties = {
  alignItems: "center",
  color: "var(--color-text-metadata)",
  fontFamily: "var(--font-mono)",
  fontSize: "0.875rem",
  userSelect: "none",
};

function FiveLayersVisual() {
  const cardBase: React.CSSProperties = { ...cardChrome, flex: "1 1 8rem", minWidth: "8rem" };
  return (
    <div className="flex flex-wrap items-stretch gap-3" aria-label="Five composition layers from token to pattern">
      <div style={cardBase}>
        <div style={layerLabel}>TOKEN</div>
        <div style={previewBox}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "1.75rem", color: "var(--color-danger)", lineHeight: 1 }}>●</span>
        </div>
        <div style={layerExampleStyle}>section_marker</div>
      </div>

      <div className="hidden lg:flex" style={arrowStyle}>→</div>

      <div style={cardBase}>
        <div style={layerLabel}>ROW</div>
        <div style={previewBox}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", whiteSpace: "nowrap" }}>
            <span style={{ color: "var(--color-warning)" }}>?</span>
            <span style={{ color: "var(--color-text-body)" }}> Hint:&nbsp;…</span>
          </span>
        </div>
        <div style={layerExampleStyle}>hint row</div>
      </div>

      <div className="hidden lg:flex" style={arrowStyle}>→</div>

      <div style={cardBase}>
        <div style={layerLabel}>SECTION</div>
        <div style={previewBox}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", whiteSpace: "nowrap" }}>
            <span style={{ color: "var(--color-danger)" }}>●</span>
            <span style={{ color: "var(--color-text-primary)", fontWeight: 700 }}>&nbsp;WHAT WENT WRONG</span>
          </span>
        </div>
        <div style={layerExampleStyle}>section</div>
      </div>

      <div className="hidden lg:flex" style={arrowStyle}>→</div>

      <div style={cardBase}>
        <div style={layerLabel}>BANNER</div>
        <div style={previewBox}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.8125rem", fontWeight: 700, color: "var(--color-danger)", letterSpacing: "0.04em" }}>
            MOD FAILED
          </span>
        </div>
        <div style={layerExampleStyle}>failure</div>
      </div>

      <div className="hidden lg:flex" style={arrowStyle}>→</div>

      <div style={cardBase}>
        <div style={layerLabel}>PATTERN</div>
        <div style={previewBox}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.3125rem", width: "100%", padding: "0 0.375rem" }}>
            <div style={{ height: "6px", width: "70%", background: "var(--color-bg-panel)", borderRadius: "1px" }} />
            <div style={{ height: "3px", width: "100%", background: "var(--color-bg-panel)", borderRadius: "1px" }} />
            <div style={{ height: "3px", width: "55%", background: "var(--color-bg-panel)", borderRadius: "1px" }} />
            <div style={{ height: "5px", width: "40%", background: "var(--color-bg-panel)", borderRadius: "1px" }} />
          </div>
        </div>
        <div style={layerExampleStyle}>Help screen</div>
      </div>
    </div>
  );
}

const panelChrome: React.CSSProperties = {
  background: "var(--color-bg-terminal)",
  border: "1px solid var(--color-bg-panel)",
  borderRadius: "0.375rem",
  padding: "1rem 1.125rem",
  display: "flex",
  flexDirection: "column",
};

const roleLabel: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: "0.6875rem",
  fontWeight: 700,
  letterSpacing: "0.06em",
  color: "var(--color-text-supporting)",
};

const scenarioSummary: React.CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontSize: "0.9375rem",
  fontWeight: 600,
  color: "var(--color-text-primary)",
  marginTop: "0.5rem",
  marginBottom: "0.5rem",
  lineHeight: 1.35,
};

const scenarioDetail: React.CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontSize: "0.875rem",
  color: "var(--color-text-body)",
  lineHeight: 1.55,
};

function ClaudeScenarios() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3" aria-label="Three working-with-Claude scenarios">
      <div style={panelChrome}>
        <div style={roleLabel}>DESIGNER</div>
        <div style={scenarioSummary}>Drafting a new error screen</div>
        <div style={scenarioDetail}>
          Claude reads canonical, follows the voice rules, and proposes the screen using the
          right glyphs and colors. The designer adjusts in Figma.
        </div>
      </div>
      <div style={panelChrome}>
        <div style={roleLabel}>ENGINEER</div>
        <div style={scenarioSummary}>Adding a flag to a CLI command</div>
        <div style={scenarioDetail}>
          Claude reads the help-screen pattern, drafts the inline reference styled to
          canonical, and matches the voice rules without being told.
        </div>
      </div>
      <div style={panelChrome}>
        <div style={roleLabel}>SYSTEM AUTHOR</div>
        <div style={scenarioSummary}>Evolving canonical itself</div>
        <div style={scenarioDetail}>
          Claude proposes the change as a structured edit, preserving evidence and
          applies_to fields. The author reviews and merges.
        </div>
      </div>
    </div>
  );
}

export function Approach() {
  return (
    <Section id="approach" title="System Design">
      <div className="space-y-4">
        <Heading as="h3" className="text-base">The thesis</Heading>
        <Body role="primary">
          Construct is production-first and AI-ready. Tokens are <em>semantic intent in code</em>{" "}
          — not visual values projected from a design tool. Figma is one consumer among many.
          The repo is the source of truth; everything else mirrors it.
        </Body>

        <Heading as="h3" className="text-base">Why this direction</Heading>
        <ul style={{ padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "0.625rem" }}>
          <li style={{ fontFamily: "var(--font-sans)", fontSize: "0.9375rem", color: "var(--color-text-body)", lineHeight: 1.55 }}>
            <strong style={{ color: "var(--color-text-primary)" }}>Canonical as the source.</strong>{" "}
            No more &ldquo;is the right color in{" "}
            <code style={{ fontFamily: "var(--font-mono)" }}>tokens.ts</code> or in the Figma file?&rdquo; — there&rsquo;s one answer, and it&rsquo;s in code.
          </li>
          <li style={{ fontFamily: "var(--font-sans)", fontSize: "0.9375rem", color: "var(--color-text-body)", lineHeight: 1.55 }}>
            <strong style={{ color: "var(--color-text-primary)" }}>Context survives the export.</strong>{" "}
            A color isn&rsquo;t just{" "}
            <code style={{ fontFamily: "var(--font-mono)" }}>#f87171</code> — it carries what it&rsquo;s for, where it applies, and the evidence behind it. Engineers, designers, and Claude all read the same file.
          </li>
          <li style={{ fontFamily: "var(--font-sans)", fontSize: "0.9375rem", color: "var(--color-text-body)", lineHeight: 1.55 }}>
            <strong style={{ color: "var(--color-text-primary)" }}>Terminal semantics stay terminal.</strong>{" "}
            Two spaces of indent is &ldquo;two spaces,&rdquo; not sixteen pixels. The CLI never round-trips through a design tool&rsquo;s mental model.
          </li>
        </ul>

        <Heading as="h3" className="text-base">The loop, end to end</Heading>
        <ul style={{ padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "0.625rem" }}>
          <li style={{ fontFamily: "var(--font-sans)", fontSize: "0.9375rem", color: "var(--color-text-body)", lineHeight: 1.55 }}>
            <strong style={{ color: "var(--color-text-primary)" }}>One source, many consumers.</strong>{" "}
            Canonical lives in the repo. Figma, the CLI, and this site all read from it.
          </li>
          <li style={{ fontFamily: "var(--font-sans)", fontSize: "0.9375rem", color: "var(--color-text-body)", lineHeight: 1.55 }}>
            <strong style={{ color: "var(--color-text-primary)" }}>The plugin is idempotent.</strong>{" "}
            Designers can iterate in Figma without their work being destroyed when canonical updates. Re-runs update in place — never duplicate, never destroy.
          </li>
          <li style={{ fontFamily: "var(--font-sans)", fontSize: "0.9375rem", color: "var(--color-text-body)", lineHeight: 1.55 }}>
            <strong style={{ color: "var(--color-text-primary)" }}>AI-readability is built in.</strong>{" "}
            Claude can build new CLI surfaces consistent with the system without an engineer hand-holding it through every token lookup.
          </li>
          <li style={{ fontFamily: "var(--font-sans)", fontSize: "0.9375rem", color: "var(--color-text-body)", lineHeight: 1.55 }}>
            <strong style={{ color: "var(--color-text-primary)" }}>Code Connect is next.</strong>{" "}
            Designers will see the actual React code in Dev Mode. Closes the loop architecturally; mostly a handoff benefit.
          </li>
        </ul>
      </div>

      <ApproachDiagram />

      <div className="space-y-4">
        <Heading as="h3" className="text-base">Working in Figma</Heading>
        <Body role="primary">
          The plugin produces five layers, all bound to canonical.
        </Body>

        <FiveLayersVisual />

        <dl
          className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2"
          style={{ marginTop: "0.25rem" }}
        >
          <div>
            <dt
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.6875rem",
                fontWeight: 700,
                letterSpacing: "0.06em",
                color: "var(--color-text-supporting)",
              }}
            >
              ATOM
            </dt>
            <dd style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "var(--color-text-body)", margin: 0 }}>
              The smallest indivisible unit. A single glyph or text style bound to a canonical token.
            </dd>
          </div>
          <div>
            <dt
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.6875rem",
                fontWeight: 700,
                letterSpacing: "0.06em",
                color: "var(--color-text-supporting)",
              }}
            >
              ROW
            </dt>
            <dd style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "var(--color-text-body)", margin: 0 }}>
              A small composed row. One glyph, one text style, one job.
            </dd>
          </div>
          <div>
            <dt
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.6875rem",
                fontWeight: 700,
                letterSpacing: "0.06em",
                color: "var(--color-text-supporting)",
              }}
            >
              SECTION
            </dt>
            <dd style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "var(--color-text-body)", margin: 0 }}>
              A full section of a CLI surface. A header plus the rows that fill it.
            </dd>
          </div>
          <div>
            <dt
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.6875rem",
                fontWeight: 700,
                letterSpacing: "0.06em",
                color: "var(--color-text-supporting)",
              }}
            >
              BANNER
            </dt>
            <dd style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "var(--color-text-body)", margin: 0 }}>
              The opening or closing line of a CLI run. Carries the overall outcome state.
            </dd>
          </div>
          <div>
            <dt
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.6875rem",
                fontWeight: 700,
                letterSpacing: "0.06em",
                color: "var(--color-text-supporting)",
              }}
            >
              PATTERN
            </dt>
            <dd style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "var(--color-text-body)", margin: 0 }}>
              A pre-composed full screen. Sections and banners arranged into a starting point a designer can adapt.
            </dd>
          </div>
        </dl>

        <pre
          aria-label="Figma plugin file structure"
          style={{
            margin: 0,
            padding: "0.75rem 1rem",
            background: "var(--color-bg-terminal)",
            border: "1px solid var(--color-bg-panel)",
            borderRadius: "0.375rem",
            fontFamily: "var(--font-mono)",
            fontSize: "0.75rem",
            lineHeight: 1.55,
            color: "var(--color-text-supporting)",
            overflowX: "auto",
          }}
        >
{`lib/interpreters/figma-plugin/
├── manifest.json
├── code.js          (generated, gitignored)
├── ui.html
├── build.mjs
├── README.md
└── src/
    ├── header.js
    ├── sync.js
    ├── footer.js
    └── builders/
        ├── tokens.js
        ├── rows.js
        ├── sections.js
        ├── banners.js
        └── patterns.js`}
        </pre>

        <Body role="primary">
          Three steps to get going: rebuild the plugin (one npm command), import the
          manifest in Figma&rsquo;s developer plugins menu, and click Sync. Full install
          steps and troubleshooting live in the plugin README.
        </Body>

        <Heading as="h3" className="text-base">Working in code</Heading>
        <Body role="primary">
          Code Connect is the bridge from a Figma component to its real React
          implementation. When a designer hovers a component in Figma&rsquo;s Dev Mode,
          they see the actual props, names, and imports an engineer would write, not a
          generic snippet. Mappings live next to each React component; engineers re-publish
          when components change.
        </Body>

        <Heading as="h3" className="text-base">Working with Claude</Heading>

        <ClaudeScenarios />

        <Heading as="h3" className="text-base">Where to learn more</Heading>
        <div className="space-y-1">
          <Body role="metadata">
            <code style={{ fontFamily: "var(--font-mono)" }}>canonical.json</code>
            {" "}— tokens, grammar, provenance.
          </Body>
          <Body role="metadata">
            <code style={{ fontFamily: "var(--font-mono)" }}>AGENTS.md</code>
            {" "}— repo conventions, architecture.
          </Body>
          <Body role="metadata">
            <code style={{ fontFamily: "var(--font-mono)" }}>figma-plugin/README.md</code>
            {" "}— install, idempotency, export paths.
          </Body>
          <Body role="metadata">
            <code style={{ fontFamily: "var(--font-mono)" }}>gaps.md</code>
            {" "}— extrapolations, out-of-scope.
          </Body>
        </div>
      </div>
    </Section>
  );
}
