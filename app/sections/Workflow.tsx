/**
 * Workflow — getting started + step-by-step instructions for every operation.
 */
"use client";
import * as React from "react";
import { Section } from "@/components/Section";
import { Body } from "@/components/Body";
import { Heading } from "@/components/Heading";
import { Card } from "@/components/Card";

function CopyCode({ children }: { children: string }) {
  const [copied, setCopied] = React.useState(false);
  return (
    <div style={{ position: "relative", marginTop: "0.25rem" }}>
      <code style={{
        fontFamily: "var(--font-mono)",
        fontSize: "0.8125rem",
        color: "var(--color-text-body)",
        background: "var(--color-bg-terminal)",
        padding: "0.5rem 0.75rem",
        paddingRight: "3.5rem",
        borderRadius: "0.25rem",
        display: "block",
        overflowX: "auto",
      }}>{children}</code>
      <button
        onClick={() => { navigator.clipboard.writeText(children); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
        style={{
          position: "absolute",
          top: "0.375rem",
          right: "0.375rem",
          background: "transparent",
          border: "1px solid var(--color-bg-panel)",
          borderRadius: "3px",
          color: copied ? "var(--color-success)" : "var(--color-text-metadata)",
          fontFamily: "var(--font-mono)",
          fontSize: "0.625rem",
          padding: "2px 6px",
          cursor: "pointer",
          width: "auto",
          margin: 0,
          display: "inline",
          transition: "color 0.15s",
        }}
      >{copied ? "copied" : "copy"}</button>
    </div>
  );
}

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

export function Workflow() {
  return (
    <Section id="workflow" title="Workflow">
      {/* --- Getting started ----------------------------------------------- */}
      <div className="space-y-3">
        <Heading as="h3" className="text-base">Getting started</Heading>
        <Body role="supporting">
          One-time setup. After this, everything auto-updates on pull.
        </Body>

        <StepList steps={[
          <span key="1">Clone the repo and install dependencies: <CopyCode>npm install</CopyCode>This installs git hooks that auto-rebuild the Figma plugin on every commit and pull. No manual rebuild needed after this.</span>,
          <span key="2">Start the playground: <CopyCode>npm run dev</CopyCode> then open <strong>http://localhost:3000</strong></span>,
          <span key="3">In Figma desktop, go to <strong>Plugins → Development → Import plugin from manifest</strong> and select <code style={{ fontFamily: "var(--font-mono)" }}>lib/interpreters/figma-plugin/manifest.json</code></span>,
          <span key="4">Run the plugin: <strong>Plugins → Development → Construct</strong> → click <strong>Initialize</strong>.</span>,
        ]} />

        <Body role="metadata">
          After this, you never need to re-import or rebuild manually. Commits and pulls that touch design files auto-rebuild the plugin. Figma hot-reload picks up the change.
        </Body>
      </div>

      {/* --- Push ---------------------------------------------------------- */}
      <div className="space-y-3">
        <Heading as="h3" className="text-base">Push: code → Figma</Heading>
        <Body role="supporting">
          When tokens or patterns change in code, the plugin rebuilds automatically on commit. Just open Figma and apply.
        </Body>

        <StepList steps={[
          <span key="1">Commit your changes. The pre-commit hook rebuilds the plugin automatically.</span>,
          <span key="2">In Figma: <strong>Plugins → Development → Construct</strong></span>,
          <span key="3">The plugin shows a diff — what changed since last sync. Click <strong>Apply</strong>.</span>,
        ]} />

        <Body role="metadata">
          Pulling someone else&rsquo;s changes works the same way — the post-merge hook rebuilds on pull. Just open the plugin and apply.
        </Body>
      </div>

      {/* --- Pull ---------------------------------------------------------- */}
      <div className="space-y-3">
        <Heading as="h3" className="text-base">Pull: Figma → code</Heading>
        <Body role="supporting">
          Changed a color, font size, or banner phrase in Figma? Pull the change back to code.
        </Body>

        <StepList steps={[
          <span key="1">In Claude Code, say: <CopyCode>pull from Figma</CopyCode></span>,
          <span key="2">Claude reads the live Figma file, compares it against canonical, and reports what changed.</span>,
          <span key="3">Review the diff. If it looks right, tell Claude to apply it.</span>,
          <span key="4">Claude edits <code style={{ fontFamily: "var(--font-mono)" }}>tokens.json</code>. Commit to close the loop — the hook rebuilds the plugin, then open Figma and apply.</span>,
        ]} />
      </div>

      {/* --- Propose ------------------------------------------------------- */}
      <div className="space-y-3">
        <Heading as="h3" className="text-base">Propose: new patterns</Heading>
        <Body role="supporting">
          New screens go through a staging flow before becoming canonical.
        </Body>

        <StepList steps={[
          <span key="1">Write a pattern <code style={{ fontFamily: "var(--font-mono)" }}>.md</code> file using the <a href="https://github.com/jaydjj/Construct/blob/main/design-system/pattern-template.md" target="_blank" rel="noopener" style={{ color: "var(--color-info)", textDecoration: "underline" }}>pattern template</a> and save it to <code style={{ fontFamily: "var(--font-mono)" }}>design-system/mirror/</code></span>,
          <span key="2">Commit. The hook rebuilds the plugin automatically.</span>,
          <span key="3">In Figma, run the plugin. The proposed pattern appears on <strong>Construct / Mirror</strong> with a status badge and lint results.</span>,
          <span key="4">Click <strong>Approve</strong> or <strong>Reject</strong> in the plugin UI — or say <code style={{ fontFamily: "var(--font-mono)" }}>approve name</code> in Claude.</span>,
          <span key="5">To promote an approved pattern: <CopyCode>mv design-system/mirror/name.md design-system/patterns/</CopyCode> then commit.</span>,
        ]} />

        <Body role="metadata">
          Gaps are detected automatically. Run <code style={{ fontFamily: "var(--font-mono)" }}>npm run lint:composition</code> — any screen in <code style={{ fontFamily: "var(--font-mono)" }}>screens.json</code> without a pattern gets a stub on the Mirror page.
        </Body>
      </div>

      {/* --- What you can change ------------------------------------------- */}
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
              { label: "Adding new components (use the mirror flow)", ok: false },
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
          If it requires creating or deleting nodes, use the mirror flow or edit code directly.
        </Body>
      </div>

      {/* --- Composition rules --------------------------------------------- */}
      <div className="space-y-3">
        <Heading as="h3" className="text-base">Composition rules</Heading>
        <Body role="supporting">
          25 lint rules enforce consistency. Claude reads them before generating anything. The validator catches drift.
        </Body>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Card>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.06em", color: "var(--color-text-supporting)", marginBottom: "0.375rem" }}>WHAT THE RULES COVER</div>
            <CheckTable items={[
              { label: "Glyph-color pairing (● must be red or white, never cyan)", ok: true },
              { label: "Max 3 semantic colors per screen", ok: true },
              { label: "Red is for failures only, cyan is for commands only", ok: true },
              { label: "Section headers must be ALL CAPS", ok: true },
              { label: "Close banner must match exit condition", ok: true },
              { label: "Required elements per pattern (error needs WHAT WENT WRONG + TRY)", ok: true },
            ]} />
          </Card>
          <Card>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.06em", color: "var(--color-text-supporting)", marginBottom: "0.375rem" }}>WHEN THEY RUN</div>
            <CheckTable items={[
              { label: "Build time: mirror items linted before baking into plugin", ok: true },
              { label: "On demand: npm run lint:composition validates all patterns", ok: true },
              { label: "Claude: reads composition.json before generating any screen", ok: true },
              { label: "Mirror page: lint results shown as badges on each frame", ok: true },
            ]} />
          </Card>
        </div>
      </div>

      {/* --- Figma pages --------------------------------------------------- */}
      <div className="space-y-3">
        <Heading as="h3" className="text-base">Figma pages</Heading>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { page: "Construct / Tokens", desc: "Glyph component sets + text style swatches. One component per glyph with color variants." },
            { page: "Construct / Components", desc: "Rows, sections, banners in three columns. Building blocks for patterns." },
            { page: "Construct / Patterns", desc: "One frame per canonical pattern with the terminal preview." },
            { page: "Construct / Mirror", desc: "Staging area for proposed patterns. Approve or reject from the plugin UI." },
          ].map((p) => (
            <div key={p.page} style={{ background: "var(--color-bg-terminal)", border: "1px solid var(--color-bg-panel)", borderRadius: "0.25rem", padding: "0.5rem 0.75rem" }}>
              <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--color-info)", display: "block" }}>{p.page}</code>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "var(--color-text-metadata)", marginTop: "0.125rem" }}>{p.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* --- Commands ------------------------------------------------------ */}
      <div className="space-y-3">
        <Heading as="h3" className="text-base">Commands</Heading>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
          {[
            { cmd: "npm install", desc: "Install dependencies + set up git hooks" },
            { cmd: "npm run dev", desc: "Start the playground locally" },
            { cmd: "npm run figma-plugin:rebuild", desc: "Rebuild plugin from canonical" },
            { cmd: "npm run lint:composition", desc: "Validate patterns + detect screen gaps" },
            { cmd: "npm run tokens:build", desc: "Rebuild canonical from tokens.json" },
            { cmd: "npm run figma-pull:expected", desc: "Regenerate expected Figma state" },
          ].map((r) => (
            <div key={r.cmd} style={{ background: "var(--color-bg-terminal)", border: "1px solid var(--color-bg-panel)", borderRadius: "0.25rem", padding: "0.5rem 0.75rem" }}>
              <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--color-info)", display: "block" }}>{r.cmd}</code>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "var(--color-text-metadata)", marginTop: "0.125rem" }}>{r.desc}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
          {[
            { cmd: "pull from Figma", desc: "Read Figma via MCP, diff against canonical, propose edits" },
            { cmd: "approve <name>", desc: "Promote a mirror item to canonical patterns" },
          ].map((r) => (
            <div key={r.cmd} style={{ background: "var(--color-bg-terminal)", border: "1px solid var(--color-bg-panel)", borderRadius: "0.25rem", padding: "0.5rem 0.75rem" }}>
              <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--color-warning)", display: "block" }}>{r.cmd}</code>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "var(--color-text-metadata)", marginTop: "0.125rem" }}>Say this in Claude Code. {r.desc}.</div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
