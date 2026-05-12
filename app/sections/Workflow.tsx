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

const NAV_CHIPS = [
  { href: "#getting-started", label: "Getting started" },
  { href: "#how-it-flows", label: "How it flows" },
  { href: "#push", label: "Push" },
  { href: "#pull", label: "Pull" },
  { href: "#propose", label: "Propose" },
  { href: "#approve", label: "Approve" },
  { href: "#reject", label: "Reject" },
  { href: "#tokens", label: "Token changes" },
  { href: "#rules", label: "Rules" },
  { href: "#figma-pages", label: "Figma pages" },
  { href: "#commands", label: "Commands" },
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
          One-time setup. After this, everything auto-updates on commit and pull.
        </Body>

        <StepList steps={[
          <span key="1">Clone the repo and install dependencies: <CopyCode>npm install</CopyCode>This installs git hooks that auto-rebuild the Figma plugin on every commit and pull.</span>,
          <span key="2">Start the playground: <CopyCode>npm run dev</CopyCode> then open <strong>http://localhost:3000</strong>. This also prints a status report showing pattern count, coverage, and anything in review.</span>,
          <span key="3">In Figma desktop, go to <strong>Plugins → Development → Import plugin from manifest</strong> and select <code style={{ fontFamily: "var(--font-mono)" }}>lib/interpreters/figma-plugin/manifest.json</code></span>,
          <span key="4">Run the plugin: <strong>Plugins → Development → Construct</strong> → click <strong>Initialize</strong>.</span>,
        ]} />

        <Body role="supporting">
          After this, you never need to re-import or rebuild manually. Commits and pulls auto-rebuild the plugin. The site auto-deploys on every merge to main.
        </Body>

        <Body role="supporting" as="div">
          <strong style={{ color: "var(--color-text-primary)" }}>Every time you start working</strong>, run <code style={{ fontFamily: "var(--font-mono)" }}>npm run status</code> or just <code style={{ fontFamily: "var(--font-mono)" }}>npm run dev</code> — it shows what&rsquo;s canonical,
          what&rsquo;s in review, and what needs attention. In Claude Code, say <code style={{ fontFamily: "var(--font-mono)" }}>status</code> or <code style={{ fontFamily: "var(--font-mono)" }}>check Figma for approvals</code> to
          see if anyone approved or rejected something in Figma since you last looked.
        </Body>
      </div>

      {/* --- How it flows --------------------------------------------------- */}
      <div className="space-y-4" id="how-it-flows" style={{ borderTop: "1px solid var(--color-bg-panel)", paddingTop: "2rem", marginTop: "2rem" }}>
        <Heading as="h3" className="text-base">How it flows</Heading>

        <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.9375rem", color: "var(--color-text-body)", lineHeight: 1.55 }}>
          Three ideas, one system:
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Card>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.06em", color: "var(--color-info)", marginBottom: "0.25rem" }}>CODE IS THE SOURCE OF TRUTH</div>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "var(--color-text-body)" }}>
              Tokens, patterns, and rules live in the repo. Everything else — Figma, the playground, the CLI — reads from it.
            </div>
          </Card>
          <Card>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.06em", color: "var(--color-success)", marginBottom: "0.25rem" }}>FIGMA IS BIDIRECTIONAL</div>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "var(--color-text-body)" }}>
              Changes push from code to Figma automatically. Changes in Figma pull back to code through Claude.
            </div>
          </Card>
          <Card>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.06em", color: "var(--color-warning)", marginBottom: "0.25rem" }}>ANYONE CAN CONTRIBUTE</div>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "var(--color-text-body)" }}>
              Approve in Figma or in Claude. Edit a token in Figma or in code. Propose a pattern from anywhere. Same outcome.
            </div>
          </Card>
        </div>

        {/* Flow diagram */}
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
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "0.75rem" }}>
            <span style={{ color: "var(--color-text-primary)", fontWeight: 700 }}>THE LOOP</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
            <div>
              <span style={{ color: "var(--color-text-body)" }}>  Edit a token or pattern</span>
              <span style={{ color: "var(--color-text-supporting)" }}> ─────────── in code, Figma, or Claude</span>
            </div>
            <div><span style={{ color: "var(--color-text-supporting)" }}>    │</span></div>
            <div>
              <span style={{ color: "var(--color-text-body)" }}>  Commit</span>
              <span style={{ color: "var(--color-text-supporting)" }}> ──────────────────────── plugin rebuilds automatically</span>
            </div>
            <div><span style={{ color: "var(--color-text-supporting)" }}>    │</span></div>
            <div>
              <span style={{ color: "var(--color-text-body)" }}>  Open Figma → run plugin → Apply</span>
              <span style={{ color: "var(--color-text-supporting)" }}> ── see what changed, one click</span>
            </div>
            <div><span style={{ color: "var(--color-text-supporting)" }}>    │</span></div>
            <div>
              <span style={{ color: "var(--color-text-body)" }}>  Done.</span>
              <span style={{ color: "var(--color-text-supporting)" }}> ─────────────────────── code and Figma are in sync</span>
            </div>
          </div>
          <div style={{ borderTop: "1px solid var(--color-bg-panel)", marginTop: "0.75rem", paddingTop: "0.75rem" }}>
            <div style={{ color: "var(--color-text-primary)", fontWeight: 700, marginBottom: "0.375rem" }}>NEW PATTERN?</div>
            <div>
              <span style={{ color: "var(--color-text-body)" }}>  Write .md to mirror/</span>
              <span style={{ color: "var(--color-text-supporting)" }}> ─────────── lands on Figma Mirror page</span>
            </div>
            <div><span style={{ color: "var(--color-text-supporting)" }}>    │</span></div>
            <div>
              <span style={{ color: "var(--color-text-body)" }}>  Review → Approve or Reject</span>
              <span style={{ color: "var(--color-text-supporting)" }}> ────── in Figma or in Claude</span>
            </div>
            <div><span style={{ color: "var(--color-text-supporting)" }}>    │</span></div>
            <div>
              <span style={{ color: "var(--color-text-body)" }}>  Promote to patterns/</span>
              <span style={{ color: "var(--color-text-supporting)" }}> ─────────── now it&rsquo;s canonical</span>
            </div>
          </div>
        </div>

        <Body role="supporting">
          The sections below explain each step in detail. You don&rsquo;t need to read them all at once —
          use the chips above to jump to what you need.
        </Body>
      </div>

      {/* --- Push ---------------------------------------------------------- */}
      <div className="space-y-3" id="push" style={{ borderTop: "1px solid var(--color-bg-panel)", paddingTop: "2rem", marginTop: "2rem" }}>
        <Heading as="h3" className="text-base">Push: code → Figma</Heading>
        <Body role="supporting">
          When tokens or patterns change in code, the plugin rebuilds automatically on commit.
        </Body>

        <StepList steps={[
          <span key="1">Commit your changes. The pre-commit hook rebuilds the plugin automatically.</span>,
          <span key="2">In Figma: <strong>Plugins → Development → Construct</strong></span>,
          <span key="3">The plugin shows a diff — what changed since last sync. Click <strong>Apply</strong>.</span>,
        ]} />

        <Body role="supporting">
          Pulling someone else&rsquo;s changes works the same way — the post-merge hook rebuilds on pull.
        </Body>
      </div>

      {/* --- Pull ---------------------------------------------------------- */}
      <div className="space-y-3" id="pull" style={{ borderTop: "1px solid var(--color-bg-panel)", paddingTop: "2rem", marginTop: "2rem" }}>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ marginTop: "0.75rem" }}>
          <Card>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.06em", color: "var(--color-success)", marginBottom: "0.5rem" }}>PULLABLE</div>
            <CheckTable items={[
              { label: "Fill colors on any component", ok: true },
              { label: "Banner phrases", ok: true },
              { label: "Font family, weight, size", ok: true },
              { label: "Glyph characters (● ✓ ▶ etc.)", ok: true },
              { label: "Component padding and gap", ok: true },
            ]} />
          </Card>
          <Card>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.06em", color: "var(--color-text-supporting)", marginBottom: "0.5rem" }}>NOT PULLABLE</div>
            <CheckTable items={[
              { label: "New components (use the propose flow)", ok: false },
              { label: "Adding or removing children", ok: false },
              { label: "Rearranging sections in a pattern", ok: false },
              { label: "Structural layout changes", ok: false },
            ]} />
          </Card>
        </div>

        <Body role="supporting">
          Rule of thumb: if you can change it in the property inspector, it&rsquo;s pullable.
          If it requires creating or deleting nodes, use the propose flow.
        </Body>
      </div>

      {/* --- Propose ------------------------------------------------------- */}
      <div className="space-y-3" id="propose" style={{ borderTop: "1px solid var(--color-bg-panel)", paddingTop: "2rem", marginTop: "2rem" }}>
        <Heading as="h3" className="text-base">Propose: new patterns</Heading>
        <Body role="supporting">
          New screens go through a staging flow before becoming canonical.
        </Body>

        <StepList steps={[
          <span key="1">Write a pattern <code style={{ fontFamily: "var(--font-mono)" }}>.md</code> file using the <a href="https://github.com/jaydjj/Construct/blob/main/design-system/pattern-template.md" target="_blank" rel="noopener" style={{ color: "var(--color-info)", textDecoration: "underline" }}>pattern template</a> and save it to <code style={{ fontFamily: "var(--font-mono)" }}>design-system/mirror/</code></span>,
          <span key="2">Commit. The hook rebuilds the plugin automatically.</span>,
          <span key="3">In Figma, run the plugin. The proposed pattern appears on <strong>Construct / Mirror</strong> with a status badge and lint results.</span>,
          <span key="4">Review the frame, then Approve or Reject (see below).</span>,
        ]} />

        <Body role="supporting">
          Gaps are detected automatically. Run <code style={{ fontFamily: "var(--font-mono)" }}>npm run lint:composition</code> — screens in <code style={{ fontFamily: "var(--font-mono)" }}>screens.json</code> without a pattern get NEEDS PATTERN stubs on the Mirror page.
        </Body>
      </div>

      {/* --- Approve ------------------------------------------------------- */}
      <div className="space-y-3" id="approve" style={{ borderTop: "1px solid var(--color-bg-panel)", paddingTop: "2rem", marginTop: "2rem" }}>
        <Heading as="h3" className="text-base">Approve a proposed pattern</Heading>
        <Body role="supporting">
          Two paths — use whichever fits your workflow.
        </Body>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Card>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.06em", color: "var(--color-text-supporting)", marginBottom: "0.375rem" }}>IN FIGMA</div>
            <StepList steps={[
              <span key="1">Open the plugin, find the Mirror item.</span>,
              <span key="2">Click <strong>Approve</strong>. The frame turns green.</span>,
              <span key="3">Tell Claude: <code style={{ fontFamily: "var(--font-mono)" }}>check Figma for approvals</code></span>,
              <span key="4">Claude promotes the file to <code style={{ fontFamily: "var(--font-mono)" }}>patterns/</code>.</span>,
            ]} />
          </Card>
          <Card>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.06em", color: "var(--color-text-supporting)", marginBottom: "0.375rem" }}>IN CLAUDE</div>
            <StepList steps={[
              <span key="1">Say: <code style={{ fontFamily: "var(--font-mono)" }}>approve [name]</code></span>,
              <span key="2">Claude moves the file from <code style={{ fontFamily: "var(--font-mono)" }}>mirror/</code> to <code style={{ fontFamily: "var(--font-mono)" }}>patterns/</code>.</span>,
              <span key="3">Commit. The pattern is now canonical.</span>,
            ]} />
          </Card>
        </div>
      </div>

      {/* --- Reject -------------------------------------------------------- */}
      <div className="space-y-3" id="reject" style={{ borderTop: "1px solid var(--color-bg-panel)", paddingTop: "2rem", marginTop: "2rem" }}>
        <Heading as="h3" className="text-base">Reject and revise</Heading>
        <Body role="supporting">
          Rejections include a reason. Claude reads the reason and proposes a revision.
        </Body>

        <StepList steps={[
          <span key="1">In the plugin, click <strong>Reject</strong> on a Mirror item. Type the reason — what&rsquo;s wrong and what should change.</span>,
          <span key="2">The frame turns red and shows the reason on the badge and in the node name.</span>,
          <span key="3">In Claude Code, say: <CopyCode>check mirror for rejections</CopyCode></span>,
          <span key="4">Claude reads the rejection reason and proposes a revision to the <code style={{ fontFamily: "var(--font-mono)" }}>.md</code> file.</span>,
          <span key="5">Commit. The revised pattern appears on the Mirror page for re-review.</span>,
        ]} />

        <div style={{ marginTop: "0.75rem" }}>
          <Body role="supporting" as="div">
            <strong style={{ color: "var(--color-text-primary)" }}>What Claude can fix automatically:</strong>
          </Body>
          <CheckTable items={[
            { label: "Token changes: wrong color, wrong glyph, fix the font", ok: true },
            { label: "Add or remove a section (NEXT STEP, TECHNICAL DETAILS)", ok: true },
            { label: "Update preview text content", ok: true },
          ]} />
        </div>
        <div style={{ marginTop: "0.5rem" }}>
          <Body role="supporting" as="div">
            <strong style={{ color: "var(--color-text-primary)" }}>What needs your direction:</strong>
          </Body>
          <CheckTable items={[
            { label: "Reorder sections (Claude proposes, you confirm)", ok: false },
            { label: "Split into multiple patterns", ok: false },
            { label: "Merge with an existing pattern", ok: false },
            { label: "Fundamental redesign", ok: false },
          ]} />
        </div>

        <Body role="supporting">
          The cycle repeats: reject → Claude revises → re-review → approve or reject again.
          Anyone can also edit the <code style={{ fontFamily: "var(--font-mono)" }}>.md</code> file directly at any point.
        </Body>
      </div>

      {/* --- Token changes ------------------------------------------------- */}
      <div className="space-y-3" id="tokens" style={{ borderTop: "1px solid var(--color-bg-panel)", paddingTop: "2rem", marginTop: "2rem" }}>
        <Heading as="h3" className="text-base">Token changes and gaps</Heading>
        <Body role="supporting">
          All colors, glyphs, and typography must reference canonical tokens. If you need a token that doesn&rsquo;t exist,
          propose it — it goes through the same mirror/review flow as patterns.
        </Body>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Card>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.06em", color: "var(--color-text-supporting)", marginBottom: "0.375rem" }}>CHANGE AN EXISTING TOKEN</div>
            <StepList steps={[
              <span key="1">Change the value in Figma (e.g. adjust a color).</span>,
              <span key="2">Say <code style={{ fontFamily: "var(--font-mono)" }}>pull from Figma</code> in Claude.</span>,
              <span key="3">Claude updates <code style={{ fontFamily: "var(--font-mono)" }}>tokens.json</code>. Commit.</span>,
            ]} />
          </Card>
          <Card>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.06em", color: "var(--color-text-supporting)", marginBottom: "0.375rem" }}>PROPOSE A NEW TOKEN</div>
            <StepList steps={[
              <span key="1">Write a token gap proposal to <code style={{ fontFamily: "var(--font-mono)" }}>design-system/mirror/</code> describing the new token, its role, and why it&rsquo;s needed.</span>,
              <span key="2">Commit. It appears on the Mirror page for review.</span>,
              <span key="3">After approval, add the token to <code style={{ fontFamily: "var(--font-mono)" }}>tokens.json</code> and commit.</span>,
            ]} />
          </Card>
        </div>

        <Body role="supporting">
          Composition rules enforce this: hardcoded hex values and unknown glyphs are lint errors unless explicitly flagged as token gap proposals.
          This prevents drift — every value traces back to canonical.
        </Body>
      </div>

      {/* --- Composition rules --------------------------------------------- */}
      <div className="space-y-3" id="rules" style={{ borderTop: "1px solid var(--color-bg-panel)", paddingTop: "2rem", marginTop: "2rem" }}>
        <Heading as="h3" className="text-base">Composition rules</Heading>
        <Body role="supporting">
          28 lint rules enforce consistency. Claude reads them before generating anything. The validator catches drift.
        </Body>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Card>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.06em", color: "var(--color-text-supporting)", marginBottom: "0.375rem" }}>WHAT THEY COVER</div>
            <CheckTable items={[
              { label: "Glyph-color pairing (● must be red or white)", ok: true },
              { label: "Max 3 semantic colors per screen", ok: true },
              { label: "Red = failures, cyan = commands only", ok: true },
              { label: "Section headers must be ALL CAPS", ok: true },
              { label: "Close banner must match exit condition", ok: true },
              { label: "Required elements per pattern type", ok: true },
              { label: "All colors must reference canonical tokens", ok: true },
              { label: "All glyphs must reference canonical tokens", ok: true },
            ]} />
          </Card>
          <Card>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.06em", color: "var(--color-text-supporting)", marginBottom: "0.375rem" }}>WHEN THEY RUN</div>
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

      {/* --- Figma pages --------------------------------------------------- */}
      <div className="space-y-3" id="figma-pages" style={{ borderTop: "1px solid var(--color-bg-panel)", paddingTop: "2rem", marginTop: "2rem" }}>
        <Heading as="h3" className="text-base">Figma pages</Heading>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { page: "Construct / Tokens", desc: "Glyph component sets + text style swatches." },
            { page: "Construct / Components", desc: "Rows, sections, banners. Building blocks." },
            { page: "Construct / Patterns", desc: "One frame per canonical pattern." },
            { page: "Construct / Mirror", desc: "Proposed patterns with lint badges. Approve or reject here." },
          ].map((p) => (
            <div key={p.page} style={{ background: "var(--color-bg-terminal)", border: "1px solid var(--color-bg-panel)", borderRadius: "0.25rem", padding: "0.5rem 0.75rem" }}>
              <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--color-info)", display: "block" }}>{p.page}</code>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "var(--color-text-supporting)", marginTop: "0.125rem" }}>{p.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* --- Commands ------------------------------------------------------ */}
      <div className="space-y-3" id="commands" style={{ borderTop: "1px solid var(--color-bg-panel)", paddingTop: "2rem", marginTop: "2rem" }}>
        <Heading as="h3" className="text-base">Commands</Heading>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
          {[
            { cmd: "npm install", desc: "Install dependencies + set up git hooks" },
            { cmd: "npm run status", desc: "Design system health: coverage, mirror, recent changes" },
            { cmd: "npm run dev", desc: "Status report + start the playground" },
            { cmd: "npm run figma-plugin:rebuild", desc: "Rebuild plugin (usually automatic)" },
            { cmd: "npm run lint:composition", desc: "Validate patterns + detect screen gaps" },
            { cmd: "npm run tokens:build", desc: "Rebuild canonical from tokens.json" },
          ].map((r) => (
            <div key={r.cmd} style={{ background: "var(--color-bg-terminal)", border: "1px solid var(--color-bg-panel)", borderRadius: "0.25rem", padding: "0.5rem 0.75rem" }}>
              <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--color-info)", display: "block" }}>{r.cmd}</code>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "var(--color-text-supporting)", marginTop: "0.125rem" }}>{r.desc}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
          {[
            { cmd: "status", desc: "Run npm run status — design system health report" },
            { cmd: "pull from Figma", desc: "Diff Figma against canonical, propose edits" },
            { cmd: "approve <name>", desc: "Promote a mirror item to canonical" },
            { cmd: "check mirror for rejections", desc: "Read rejection reasons, propose revisions" },
            { cmd: "check Figma for approvals", desc: "Read Figma approvals, promote them" },
          ].map((r) => (
            <div key={r.cmd} style={{ background: "var(--color-bg-terminal)", border: "1px solid var(--color-bg-panel)", borderRadius: "0.25rem", padding: "0.5rem 0.75rem" }}>
              <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--color-warning)", display: "block" }}>{r.cmd}</code>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "var(--color-text-supporting)", marginTop: "0.125rem" }}>Say in Claude Code. {r.desc}.</div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
