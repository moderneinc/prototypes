/**
 * Workflow — connected workflows organized around the loop diagram.
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
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.8125rem", color: item.ok ? "var(--color-success)" : "var(--color-text-supporting)" }}>
            {item.ok ? "✓" : "✗"}
          </span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.8125rem", color: "var(--color-text-body)" }}>
            {item.label}
          </span>
        </React.Fragment>
      ))}
    </div>
  );
}

const mono = { fontFamily: "var(--font-mono)" };

const NAV_CHIPS = [
  { href: "#getting-started", label: "Getting started" },
  { href: "#the-loop", label: "The loop" },
  { href: "#new-pattern", label: "New pattern" },
  { href: "#review", label: "Review" },
  { href: "#token-changes", label: "Token changes" },
  { href: "#rules", label: "Rules" },
  { href: "#commands", label: "All commands" },
];

export function Workflow() {
  return (
    <Section id="workflow" title="Workflow">
      {/* --- Nav chips ----------------------------------------------------- */}
      <div
        className="sticky top-0"
        style={{
          zIndex: 10,
          background: "var(--color-bg-page)",
          padding: "0.5rem 0",
          borderBottom: "1px solid var(--color-bg-panel)",
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
          {NAV_CHIPS.map((c) => (
            <a
              key={c.href}
              href={c.href}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.75rem",
                border: "1px solid var(--color-bg-panel)",
                padding: "0.125rem 0.5rem",
                borderRadius: "0.25rem",
                color: "var(--color-text-supporting)",
                textDecoration: "none",
              }}
            >
              {c.label}
            </a>
          ))}
        </div>
      </div>

      {/* --- Getting started ----------------------------------------------- */}
      <div className="space-y-3" id="getting-started">
        <Heading as="h3" className="text-base">Getting started</Heading>
        <Body role="supporting">
          One-time setup. After this, everything auto-updates.
        </Body>

        <StepList steps={[
          <span key="1">Clone the repo and install: <CopyCode>npm install</CopyCode></span>,
          <span key="2">Start the playground: <CopyCode>npm run dev</CopyCode> Open <strong>http://localhost:3000</strong> — you&rsquo;ll also see a status report showing what&rsquo;s canonical, what&rsquo;s in review, and any gaps.</span>,
          <span key="3">In Figma desktop: <strong>Plugins → Development → Import plugin from manifest</strong> → select <code style={mono}>lib/interpreters/figma-plugin/manifest.json</code></span>,
          <span key="4">Run the plugin: <strong>Plugins → Development → Construct</strong> → click <strong>Initialize</strong></span>,
        ]} />

        <Body role="supporting">
          After this, you never rebuild manually. Commits and pulls auto-rebuild the plugin.
          The site auto-deploys on every merge to main.
        </Body>
      </div>

      {/* ================================================================== */}
      {/* THE LOOP                                                           */}
      {/* ================================================================== */}
      <div id="the-loop" style={{ borderTop: "1px solid var(--color-bg-panel)", paddingTop: "2rem", marginTop: "2rem" }}>
        <Heading as="h3" className="text-base">The loop</Heading>
        <Body role="supporting">
          The daily workflow. Edit something, commit, open Figma, done.
        </Body>

        {/* Diagram */}
        <div
          style={{
            background: "var(--color-bg-terminal)",
            border: "1px solid var(--color-bg-panel)",
            borderRadius: "0.375rem",
            padding: "1.25rem 1.5rem",
            fontFamily: "var(--font-mono)",
            fontSize: "0.75rem",
            lineHeight: 1.7,
            color: "var(--color-text-supporting)",
            overflowX: "auto",
            marginTop: "0.75rem",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
            <div>
              <span style={{ color: "var(--color-text-body)" }}>  Edit a token or pattern</span>
              <span> ─────────── in code, Figma, or Claude</span>
            </div>
            <div>    │</div>
            <div>
              <span style={{ color: "var(--color-text-body)" }}>  Commit</span>
              <span> ──────────────────────── plugin rebuilds automatically</span>
            </div>
            <div>    │</div>
            <div>
              <span style={{ color: "var(--color-text-body)" }}>  Open Figma → run plugin → Apply</span>
              <span> ── see what changed, one click</span>
            </div>
            <div>    │</div>
            <div>
              <span style={{ color: "var(--color-text-body)" }}>  Done.</span>
              <span> ─────────────────────── code and Figma are in sync</span>
            </div>
          </div>
        </div>

        {/* Three scenarios */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3" style={{ marginTop: "1rem" }}>
          <Card>
            <div style={{ ...mono, fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.06em", color: "var(--color-info)", marginBottom: "0.5rem" }}>I CHANGED SOMETHING IN FIGMA</div>
            <StepList steps={[
              <span key="1">In Claude Code: <code style={mono}>pull from Figma</code></span>,
              <span key="2">Claude shows the diff. Say yes to apply.</span>,
              <span key="3">Commit. Open Figma → Apply.</span>,
            ]} />
          </Card>
          <Card>
            <div style={{ ...mono, fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.06em", color: "var(--color-success)", marginBottom: "0.5rem" }}>I CHANGED SOMETHING IN CODE</div>
            <StepList steps={[
              <span key="1">Edit the <code style={mono}>.md</code> or <code style={mono}>tokens.json</code> file.</span>,
              <span key="2">Commit. Plugin rebuilds automatically.</span>,
              <span key="3">Open Figma → Apply.</span>,
            ]} />
          </Card>
          <Card>
            <div style={{ ...mono, fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.06em", color: "var(--color-warning)", marginBottom: "0.5rem" }}>I PULLED SOMEONE ELSE&rsquo;S CHANGES</div>
            <StepList steps={[
              <span key="1"><code style={mono}>git pull</code> — hook rebuilds the plugin.</span>,
              <span key="2">Open Figma → Apply.</span>,
              <span key="3">Done. You&rsquo;re in sync.</span>,
            ]} />
          </Card>
        </div>

        {/* What's pullable */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3" style={{ marginTop: "1rem" }}>
          <Card>
            <div style={{ ...mono, fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.06em", color: "var(--color-success)", marginBottom: "0.375rem" }}>PULLABLE FROM FIGMA</div>
            <CheckTable items={[
              { label: "Fill colors on any component", ok: true },
              { label: "Banner phrases", ok: true },
              { label: "Font family, weight, size", ok: true },
              { label: "Glyph characters (● ✓ ▶ etc.)", ok: true },
              { label: "Component padding and gap", ok: true },
            ]} />
          </Card>
          <Card>
            <div style={{ ...mono, fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.06em", color: "var(--color-text-supporting)", marginBottom: "0.375rem" }}>NOT PULLABLE — USE THE NEW PATTERN FLOW</div>
            <CheckTable items={[
              { label: "New components or patterns", ok: false },
              { label: "Adding or removing children", ok: false },
              { label: "Rearranging sections", ok: false },
              { label: "Structural layout changes", ok: false },
            ]} />
          </Card>
        </div>
      </div>

      {/* ================================================================== */}
      {/* NEW PATTERN                                                        */}
      {/* ================================================================== */}
      <div id="new-pattern" style={{ borderTop: "1px solid var(--color-bg-panel)", paddingTop: "2rem", marginTop: "2rem" }}>
        <Heading as="h3" className="text-base">New pattern</Heading>
        <Body role="supporting">
          New screens go through staging before becoming canonical.
        </Body>

        {/* Diagram */}
        <div
          style={{
            background: "var(--color-bg-terminal)",
            border: "1px solid var(--color-bg-panel)",
            borderRadius: "0.375rem",
            padding: "1.25rem 1.5rem",
            fontFamily: "var(--font-mono)",
            fontSize: "0.75rem",
            lineHeight: 1.7,
            color: "var(--color-text-supporting)",
            overflowX: "auto",
            marginTop: "0.75rem",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
            <div>
              <span style={{ color: "var(--color-text-body)" }}>  Write .md to mirror/</span>
              <span> ─────────── lands on Figma Mirror page with lint badge</span>
            </div>
            <div>    │</div>
            <div>
              <span style={{ color: "var(--color-text-body)" }}>  Review → Approve or Reject</span>
              <span> ────── in Figma plugin or in Claude</span>
            </div>
            <div>    │</div>
            <div>
              <span style={{ color: "var(--color-text-body)" }}>  Promote to patterns/</span>
              <span> ─────────── now it&rsquo;s canonical, shows on Patterns page</span>
            </div>
          </div>
        </div>

        <div className="space-y-3" style={{ marginTop: "1rem" }}>
          <Body role="supporting" as="div">
            <strong style={{ color: "var(--color-text-primary)" }}>Step by step:</strong>
          </Body>
          <StepList steps={[
            <span key="1">Write a pattern <code style={mono}>.md</code> file using the <a href="https://github.com/jaydjj/Construct/blob/main/design-system/pattern-template.md" target="_blank" rel="noopener" style={{ color: "var(--color-info)", textDecoration: "underline" }}>pattern template</a> and save it to <code style={mono}>design-system/mirror/</code></span>,
            <span key="2">Commit. The hook rebuilds the plugin automatically.</span>,
            <span key="3">Open Figma → run plugin → Apply. The proposed pattern appears on <strong>Construct / Mirror</strong> with a status badge and lint results.</span>,
            <span key="4">Review the frame, then approve or reject (see below).</span>,
          ]} />
        </div>

        <Body role="supporting">
          Gaps are detected automatically. <code style={mono}>npm run lint:composition</code> checks <code style={mono}>screens.json</code> — any screen without a pattern gets a NEEDS PATTERN stub on the Mirror page.
        </Body>
      </div>

      {/* ================================================================== */}
      {/* REVIEW: APPROVE + REJECT                                           */}
      {/* ================================================================== */}
      <div id="review" style={{ borderTop: "1px solid var(--color-bg-panel)", paddingTop: "2rem", marginTop: "2rem" }}>
        <Heading as="h3" className="text-base">Review: approve or reject</Heading>
        <Body role="supporting">
          Mirror items need review before they become canonical. Two outcomes, two paths each.
        </Body>

        {/* Approve */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3" style={{ marginTop: "1rem" }}>
          <Card>
            <div style={{ ...mono, fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.06em", color: "var(--color-success)", marginBottom: "0.5rem" }}>APPROVE IN FIGMA</div>
            <StepList steps={[
              <span key="1">Open the plugin. Find the Mirror item.</span>,
              <span key="2">Click <strong>Approve</strong>. Frame turns green.</span>,
              <span key="3">In Claude: <code style={mono}>check Figma for approvals</code></span>,
              <span key="4">Claude promotes the file. Commit. Done.</span>,
            ]} />
          </Card>
          <Card>
            <div style={{ ...mono, fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.06em", color: "var(--color-success)", marginBottom: "0.5rem" }}>APPROVE IN CLAUDE</div>
            <StepList steps={[
              <span key="1">Say: <code style={mono}>approve [name]</code></span>,
              <span key="2">Claude moves the file to <code style={mono}>patterns/</code>.</span>,
              <span key="3">Commit. The pattern is now canonical.</span>,
            ]} />
          </Card>
        </div>

        {/* Reject */}
        <div style={{ marginTop: "1.5rem" }}>
          <div style={{ ...mono, fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.06em", color: "var(--color-text-primary)", marginBottom: "0.5rem" }}>REJECT → REVISE → RE-REVIEW</div>
          <Body role="supporting">
            Rejections include a reason. Claude reads it and proposes a revision. The cycle repeats until approved.
          </Body>

          <StepList steps={[
            <span key="1">In the plugin, click <strong>Reject</strong>. Type what&rsquo;s wrong and what should change.</span>,
            <span key="2">Frame turns red. The reason shows on the badge and in the node name.</span>,
            <span key="3">In Claude: <CopyCode>check mirror for rejections</CopyCode></span>,
            <span key="4">Claude reads the reason, revises the <code style={mono}>.md</code> file, and commits.</span>,
            <span key="5">Open Figma → Apply. The revised pattern is back on Mirror as <strong>Proposed</strong>.</span>,
            <span key="6">Review again → approve or reject with new feedback.</span>,
          ]} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3" style={{ marginTop: "0.75rem" }}>
            <Card>
              <div style={{ ...mono, fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.06em", color: "var(--color-text-supporting)", marginBottom: "0.375rem" }}>CLAUDE AUTO-FIXES</div>
              <CheckTable items={[
                { label: "Wrong color, glyph, or font", ok: true },
                { label: "Add or remove a section", ok: true },
                { label: "Update preview text", ok: true },
              ]} />
            </Card>
            <Card>
              <div style={{ ...mono, fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.06em", color: "var(--color-text-supporting)", marginBottom: "0.375rem" }}>NEEDS YOUR DIRECTION</div>
              <CheckTable items={[
                { label: "Reorder sections", ok: false },
                { label: "Split or merge patterns", ok: false },
                { label: "Fundamental redesign", ok: false },
              ]} />
            </Card>
          </div>
        </div>
      </div>

      {/* ================================================================== */}
      {/* TOKEN CHANGES                                                      */}
      {/* ================================================================== */}
      <div id="token-changes" style={{ borderTop: "1px solid var(--color-bg-panel)", paddingTop: "2rem", marginTop: "2rem" }}>
        <Heading as="h3" className="text-base">Token changes</Heading>
        <Body role="supporting">
          All colors, glyphs, and typography must reference canonical tokens. Changing one follows the loop.
          Adding a new one follows the mirror flow.
        </Body>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3" style={{ marginTop: "0.75rem" }}>
          <Card>
            <div style={{ ...mono, fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.06em", color: "var(--color-info)", marginBottom: "0.5rem" }}>CHANGE AN EXISTING TOKEN</div>
            <div style={{ ...mono, fontSize: "0.75rem", color: "var(--color-text-supporting)", marginBottom: "0.5rem" }}>→ follows the loop</div>
            <StepList steps={[
              <span key="1">Change the value in Figma (e.g. adjust a color).</span>,
              <span key="2">In Claude: <code style={mono}>pull from Figma</code></span>,
              <span key="3">Claude updates <code style={mono}>tokens.json</code>. Commit.</span>,
            ]} />
          </Card>
          <Card>
            <div style={{ ...mono, fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.06em", color: "var(--color-warning)", marginBottom: "0.5rem" }}>PROPOSE A NEW TOKEN</div>
            <div style={{ ...mono, fontSize: "0.75rem", color: "var(--color-text-supporting)", marginBottom: "0.5rem" }}>→ follows the mirror flow</div>
            <StepList steps={[
              <span key="1">Write a token gap proposal to <code style={mono}>design-system/mirror/</code></span>,
              <span key="2">Commit → appears on Mirror page for review.</span>,
              <span key="3">After approval, add the token to <code style={mono}>tokens.json</code>.</span>,
            ]} />
          </Card>
        </div>

        <Body role="supporting">
          Hardcoded hex values and unknown glyphs are lint errors. This prevents drift — every value traces back to canonical.
        </Body>
      </div>

      {/* ================================================================== */}
      {/* RULES                                                              */}
      {/* ================================================================== */}
      <div id="rules" style={{ borderTop: "1px solid var(--color-bg-panel)", paddingTop: "2rem", marginTop: "2rem" }}>
        <Heading as="h3" className="text-base">Composition rules</Heading>
        <Body role="supporting">
          30 lint rules enforce consistency. Claude reads them before generating anything. The validator catches drift.
        </Body>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3" style={{ marginTop: "0.75rem" }}>
          <Card>
            <div style={{ ...mono, fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.06em", color: "var(--color-text-supporting)", marginBottom: "0.375rem" }}>WHAT THEY COVER</div>
            <CheckTable items={[
              { label: "Glyph-color pairing (● must be red or white)", ok: true },
              { label: "Max 3 semantic colors per screen", ok: true },
              { label: "Red = failures, cyan = commands only", ok: true },
              { label: "Close banner must match exit condition", ok: true },
              { label: "All colors/glyphs must reference tokens", ok: true },
              { label: "Required elements per pattern type", ok: true },
            ]} />
          </Card>
          <Card>
            <div style={{ ...mono, fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.06em", color: "var(--color-text-supporting)", marginBottom: "0.375rem" }}>WHEN THEY RUN</div>
            <CheckTable items={[
              { label: "Build time: mirror items linted before baking", ok: true },
              { label: "On demand: npm run lint:composition", ok: true },
              { label: "Claude reads composition.json before generating", ok: true },
              { label: "Mirror page shows lint results as badges", ok: true },
              { label: "Screen gaps auto-detected from screens.json", ok: true },
            ]} />
          </Card>
        </div>
      </div>

      {/* ================================================================== */}
      {/* ALL COMMANDS                                                       */}
      {/* ================================================================== */}
      <div id="commands" style={{ borderTop: "1px solid var(--color-bg-panel)", paddingTop: "2rem", marginTop: "2rem" }}>
        <Heading as="h3" className="text-base">All commands</Heading>

        <div style={{ marginTop: "0.75rem" }}>
          <div style={{ ...mono, fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.06em", color: "var(--color-text-supporting)", marginBottom: "0.5rem" }}>TERMINAL</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
            {[
              { cmd: "npm install", desc: "Install + set up git hooks" },
              { cmd: "npm run status", desc: "Design system health report" },
              { cmd: "npm run dev", desc: "Status + start playground" },
              { cmd: "npm run lint:composition", desc: "Validate patterns + detect gaps" },
              { cmd: "npm run figma-plugin:rebuild", desc: "Rebuild plugin (usually automatic)" },
              { cmd: "npm run tokens:build", desc: "Rebuild canonical from tokens.json" },
            ].map((r) => (
              <div key={r.cmd} style={{ background: "var(--color-bg-terminal)", border: "1px solid var(--color-bg-panel)", borderRadius: "0.25rem", padding: "0.5rem 0.75rem" }}>
                <code style={{ ...mono, fontSize: "0.75rem", color: "var(--color-info)", display: "block" }}>{r.cmd}</code>
                <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "var(--color-text-supporting)", marginTop: "0.125rem" }}>{r.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: "0.75rem" }}>
          <div style={{ ...mono, fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.06em", color: "var(--color-text-supporting)", marginBottom: "0.5rem" }}>SAY IN CLAUDE CODE</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
            {[
              { cmd: "status", desc: "Design system health report" },
              { cmd: "pull from Figma", desc: "Diff Figma → propose edits" },
              { cmd: "approve <name>", desc: "Promote mirror → canonical" },
              { cmd: "check Figma for approvals", desc: "Read Figma approvals, promote" },
              { cmd: "check mirror for rejections", desc: "Read rejections, propose revisions" },
            ].map((r) => (
              <div key={r.cmd} style={{ background: "var(--color-bg-terminal)", border: "1px solid var(--color-bg-panel)", borderRadius: "0.25rem", padding: "0.5rem 0.75rem" }}>
                <code style={{ ...mono, fontSize: "0.75rem", color: "var(--color-warning)", display: "block" }}>{r.cmd}</code>
                <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "var(--color-text-supporting)", marginTop: "0.125rem" }}>{r.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: "0.75rem" }}>
          <div style={{ ...mono, fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.06em", color: "var(--color-text-supporting)", marginBottom: "0.5rem" }}>FIGMA PAGES</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
            {[
              { page: "Construct / Tokens", desc: "Glyphs + text style swatches" },
              { page: "Construct / Components", desc: "Rows, sections, banners" },
              { page: "Construct / Patterns", desc: "Canonical pattern previews" },
              { page: "Construct / Mirror", desc: "Proposed patterns — approve or reject" },
            ].map((p) => (
              <div key={p.page} style={{ background: "var(--color-bg-terminal)", border: "1px solid var(--color-bg-panel)", borderRadius: "0.25rem", padding: "0.5rem 0.75rem" }}>
                <code style={{ ...mono, fontSize: "0.75rem", color: "var(--color-info)", display: "block" }}>{p.page}</code>
                <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "var(--color-text-supporting)", marginTop: "0.125rem" }}>{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
