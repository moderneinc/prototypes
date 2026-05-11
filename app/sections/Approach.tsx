/**
 * System Design — how Construct works and how to use it.
 */
import * as React from "react";
import { Section } from "@/components/Section";
import { Body } from "@/components/Body";
import { ApproachDiagram } from "@/components/ApproachDiagram";
import { Heading } from "@/components/Heading";
import { Card } from "@/components/Card";

const mono: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: "0.8125rem",
  color: "var(--color-text-body)",
  background: "var(--color-bg-terminal)",
  padding: "0.5rem 0.75rem",
  borderRadius: "0.25rem",
  display: "block",
  overflowX: "auto",
};

const step: React.CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontSize: "0.9375rem",
  color: "var(--color-text-body)",
  lineHeight: 1.55,
};

function StepList({ steps }: { steps: React.ReactNode[] }) {
  return (
    <ol style={{ padding: "0 0 0 1.25rem", margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      {steps.map((s, i) => (
        <li key={i} style={step}>{s}</li>
      ))}
    </ol>
  );
}

function CheckTable({ items }: { items: { label: string; ok: boolean }[] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "0.25rem 0.75rem", alignItems: "baseline" }}>
      {items.map((item) => (
        <React.Fragment key={item.label}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.8125rem", color: item.ok ? "var(--color-success)" : "var(--color-text-metadata)" }}>
            {item.ok ? "✓" : "✗"}
          </span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.8125rem", color: item.ok ? "var(--color-text-body)" : "var(--color-text-metadata)" }}>
            {item.label}
          </span>
        </React.Fragment>
      ))}
    </div>
  );
}

export function Approach() {
  return (
    <Section id="approach" title="System Design">
      {/* --- Thesis -------------------------------------------------------- */}
      <div className="space-y-4">
        <Heading as="h3" className="text-base">How it works</Heading>
        <Body role="primary">
          Code is the source of truth. Figma is bidirectional. Anyone can contribute.
        </Body>
        <Body role="supporting">
          Tokens, patterns, and voice rules live in the repo. The Figma plugin pushes them
          into Figma as components. When you change a token value in Figma, Claude can read
          the change and propose an update to the source files. The repo stays canonical;
          Figma stays in sync.
        </Body>
      </div>

      <ApproachDiagram />

      {/* --- Three layers -------------------------------------------------- */}
      <div className="space-y-4">
        <Heading as="h3" className="text-base">Three layers</Heading>
        <Body role="supporting">
          Everything in the system is organized into three layers. These are the same
          in code, in Figma, and on this site.
        </Body>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Card>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.06em", color: "var(--color-text-supporting)" }}>TOKENS</div>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "var(--color-text-body)", marginTop: "0.25rem" }}>
              Colors, typography, spacing, glyphs, links. The atomic values everything else is built from.
            </div>
          </Card>
          <Card>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.06em", color: "var(--color-text-supporting)" }}>COMPONENTS</div>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "var(--color-text-body)", marginTop: "0.25rem" }}>
              Rows, sections, banners. Building blocks composed from tokens.
            </div>
          </Card>
          <Card>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.06em", color: "var(--color-text-supporting)" }}>PATTERNS</div>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "var(--color-text-body)", marginTop: "0.25rem" }}>
              Full screens like help, error, progress, success. Each generated from a canonical pattern file.
            </div>
          </Card>
        </div>
      </div>

      {/* --- Push to Figma ------------------------------------------------- */}
      <div className="space-y-3">
        <Heading as="h3" className="text-base">Push: code → Figma</Heading>
        <Body role="supporting">
          When tokens or patterns change in code, push the update to Figma.
        </Body>

        <StepList steps={[
          <span key="1">In terminal, rebuild the plugin: <code style={mono}>npm run figma-plugin:rebuild</code></span>,
          <span key="2">In Figma desktop, run <strong>Plugins → Development → Construct</strong></span>,
          <span key="3">The plugin shows a diff — what changed since last sync. Click <strong>Apply</strong>.</span>,
          <span key="4">First time? Click <strong>Initialize</strong> instead. It creates all three pages.</span>,
        ]} />

        <Body role="metadata">
          The plugin is idempotent. Re-running it updates components in place — it never duplicates or destroys work.
        </Body>
      </div>

      {/* --- Pull from Figma ----------------------------------------------- */}
      <div className="space-y-3">
        <Heading as="h3" className="text-base">Pull: Figma → code</Heading>
        <Body role="supporting">
          Changed a color, font size, or banner phrase in Figma? Pull the change back to code.
        </Body>

        <StepList steps={[
          <span key="1">In Claude Code, say: <code style={mono}>pull from Figma</code></span>,
          <span key="2">Claude reads the live Figma file, compares it against canonical, and reports what changed.</span>,
          <span key="3">Review the diff. If it looks right, tell Claude to apply it.</span>,
          <span key="4">Claude edits <code style={{ fontFamily: "var(--font-mono)" }}>tokens.json</code> and rebuilds. Push the change to Figma to close the loop.</span>,
        ]} />
      </div>

      {/* --- What's pullable ----------------------------------------------- */}
      <div className="space-y-3">
        <Heading as="h3" className="text-base">What you can change in Figma</Heading>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.06em", color: "var(--color-success)", marginBottom: "0.5rem" }}>PULLABLE</div>
            <CheckTable items={[
              { label: "Fill colors on any component", ok: true },
              { label: "Banner phrases (e.g. MOD SUCCEEDED → RECIPE SUCCEEDED)", ok: true },
              { label: "Font family, weight, size", ok: true },
              { label: "Letter spacing, text alignment", ok: true },
              { label: "Glyph characters (● ✓ ▶ etc.)", ok: true },
              { label: "Component padding and gap", ok: true },
            ]} />
          </Card>
          <Card>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.06em", color: "var(--color-text-metadata)", marginBottom: "0.5rem" }}>NOT PULLABLE</div>
            <CheckTable items={[
              { label: "Adding new components", ok: false },
              { label: "Adding or removing children inside a component", ok: false },
              { label: "Rearranging sections within a pattern", ok: false },
              { label: "Pattern prose and documentation", ok: false },
              { label: "New glyph types or new banner variants", ok: false },
              { label: "Structural layout changes", ok: false },
            ]} />
          </Card>
        </div>

        <Body role="metadata">
          Rule of thumb: if you can change it with a property inspector (color, font, text content), it&rsquo;s pullable.
          If it requires creating or deleting nodes, do it in code.
        </Body>
      </div>

      {/* --- Commands reference --------------------------------------------- */}
      <div className="space-y-3">
        <Heading as="h3" className="text-base">Commands</Heading>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
          {[
            { cmd: "npm run figma-plugin:rebuild", desc: "Rebuild plugin from canonical" },
            { cmd: "npm run figma-pull:expected", desc: "Regenerate expected Figma state" },
            { cmd: "npm run tokens:build", desc: "Rebuild canonical from tokens.json" },
            { cmd: "npm run dev", desc: "Start the playground locally" },
          ].map((r) => (
            <div key={r.cmd} style={{ background: "var(--color-bg-terminal)", border: "1px solid var(--color-bg-panel)", borderRadius: "0.25rem", padding: "0.5rem 0.75rem" }}>
              <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--color-info)", display: "block" }}>{r.cmd}</code>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "var(--color-text-metadata)", marginTop: "0.125rem" }}>{r.desc}</div>
            </div>
          ))}
        </div>

        <div style={{ background: "var(--color-bg-terminal)", border: "1px solid var(--color-bg-panel)", borderRadius: "0.25rem", padding: "0.5rem 0.75rem" }}>
          <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--color-info)", display: "block" }}>pull from Figma</code>
          <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "var(--color-text-metadata)", marginTop: "0.125rem" }}>
            Say this in Claude Code. Claude reads the Figma file via MCP, diffs against canonical, and proposes edits.
          </div>
        </div>
      </div>

      {/* --- File structure ------------------------------------------------ */}
      <div className="space-y-3">
        <Heading as="h3" className="text-base">File structure</Heading>
        <pre
          aria-label="Construct file structure"
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
{`design-system/
├── tokens.json              ← edit tokens here
├── patterns/*.md            ← edit patterns here
└── voice.md, gaps.md        ← voice rules, known gaps

tokens/
├── canonical.json           ← generated source of truth
└── figma-expected.json      ← expected Figma state (for pull)

lib/interpreters/figma-plugin/
├── build.mjs                ← bakes canonical into code.js
├── ui.html                  ← plugin UI (diff preview)
└── src/builders/            ← tokens, rows, sections, banners, patterns

scripts/
├── build-tokens.mjs         ← tokens.json → canonical.json
└── figma-pull-expected.mjs  ← canonical → figma-expected.json`}
        </pre>
      </div>

      {/* --- Where to learn more ------------------------------------------- */}
      <div className="space-y-3">
        <Heading as="h3" className="text-base">Reference</Heading>
        <div className="space-y-1">
          <Body role="metadata">
            <code style={{ fontFamily: "var(--font-mono)" }}>canonical.json</code>
            {" "}— all tokens with role, evidence, and provenance.
          </Body>
          <Body role="metadata">
            <code style={{ fontFamily: "var(--font-mono)" }}>AGENTS.md</code>
            {" "}— repo conventions for Claude and other AI tools.
          </Body>
          <Body role="metadata">
            <code style={{ fontFamily: "var(--font-mono)" }}>figma-plugin/README.md</code>
            {" "}— plugin install, diff model, idempotency details.
          </Body>
          <Body role="metadata">
            <code style={{ fontFamily: "var(--font-mono)" }}>gaps.md</code>
            {" "}— known extrapolations and out-of-scope items.
          </Body>
        </div>
      </div>
    </Section>
  );
}
