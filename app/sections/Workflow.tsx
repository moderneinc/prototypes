/**
 * Workflow — four scenarios, two starting points, try-it walkthroughs.
 * All commands go through Claude — users never need a terminal after setup.
 */
"use client";
import * as React from "react";
import { Section } from "@/components/Section";
import { Body } from "@/components/Body";
import { Heading } from "@/components/Heading";
import { Card } from "@/components/Card";

function CopyCode({ children, variant }: { children: string; variant?: "claude" | "terminal" }) {
  const [copied, setCopied] = React.useState(false);
  const isClause = variant === "claude";
  return (
    <div style={{ position: "relative", marginTop: "0.25rem" }}>
      <code style={{
        fontFamily: "var(--font-mono)", fontSize: "0.8125rem",
        color: isClause ? "var(--color-warning)" : "var(--color-text-body)",
        background: "var(--color-bg-terminal)", padding: "0.5rem 0.75rem", paddingRight: "3.5rem",
        borderRadius: "0.25rem", display: "block", overflowX: "auto",
      }}>{children}</code>
      <button
        onClick={() => { navigator.clipboard.writeText(children); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
        style={{
          position: "absolute", top: "0.375rem", right: "0.375rem", background: "transparent",
          border: "1px solid var(--color-bg-panel)", borderRadius: "3px",
          color: copied ? "var(--color-success)" : "var(--color-text-metadata)",
          fontFamily: "var(--font-mono)", fontSize: "0.625rem", padding: "2px 6px",
          cursor: "pointer", width: "auto", margin: 0, display: "inline", transition: "color 0.15s",
        }}
      >{copied ? "copied" : "copy"}</button>
    </div>
  );
}

const mono = { fontFamily: "var(--font-mono)" };
const stepStyle: React.CSSProperties = { fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "var(--color-text-body)", lineHeight: 1.6 };

function StepList({ steps }: { steps: React.ReactNode[] }) {
  return (
    <ol style={{ padding: "0 0 0 1.25rem", margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      {steps.map((s, i) => <li key={i} style={stepStyle}>{s}</li>)}
    </ol>
  );
}

function TryIt({ id, children }: { id: string; children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div style={{ marginTop: "0.5rem" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: "transparent", border: "1px solid var(--color-bg-panel)", borderRadius: "0.25rem",
          color: "var(--color-info)", fontFamily: "var(--font-mono)", fontSize: "0.75rem",
          padding: "0.25rem 0.75rem", cursor: "pointer", width: "auto", margin: 0, display: "inline-block",
          fontWeight: 700,
        }}
      >{open ? "▼ Close walkthrough" : "▶ Try it — step by step"}</button>
      {open && (
        <div id={id} style={{ marginTop: "0.75rem", padding: "1rem 1.25rem", background: "var(--color-bg-terminal)", border: "1px solid var(--color-bg-panel)", borderRadius: "0.375rem" }}>
          {children}
        </div>
      )}
    </div>
  );
}

function FlowDiagram({ steps }: { steps: string[] }) {
  return (
    <div style={{ ...mono, fontSize: "0.75rem", lineHeight: 1.7, color: "var(--color-text-supporting)", margin: "0.5rem 0" }}>
      {steps.map((s, i) => (
        <React.Fragment key={i}>
          {i > 0 && <div style={{ paddingLeft: "0.5rem" }}>│</div>}
          <div><span style={{ color: "var(--color-text-body)" }}>  {s}</span></div>
        </React.Fragment>
      ))}
    </div>
  );
}

const FIGMA_URL = "https://www.figma.com/design/twkYEkdg94dq5FQB6D9vDq/CLI-Design-System-Experiment";

const NAV_CHIPS = [
  { href: "#getting-started", label: "Getting started" },
  { href: "#workflows", label: "Workflows" },
  { href: "#edit-pullable", label: "1. Edit pullable" },
  { href: "#create-pullable", label: "2. Create pullable" },
  { href: "#edit-structural", label: "3. Edit structural" },
  { href: "#create-structural", label: "4. Create structural" },
  { href: "#commands", label: "All commands" },
];

export function Workflow() {
  return (
    <Section id="workflow" title="Workflow">
      {/* Nav chips */}
      <div className="sticky top-0" style={{ zIndex: 10, background: "var(--color-bg-page)", padding: "0.5rem 0", borderBottom: "1px solid var(--color-bg-panel)" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
          {NAV_CHIPS.map((c) => (
            <a key={c.href} href={c.href} style={{ ...mono, fontSize: "0.75rem", border: "1px solid var(--color-bg-panel)", padding: "0.125rem 0.5rem", borderRadius: "0.25rem", color: "var(--color-text-supporting)", textDecoration: "none" }}>{c.label}</a>
          ))}
        </div>
      </div>

      {/* ── Getting started ─────────────────────────────────────────────── */}
      <div className="space-y-3" id="getting-started">
        <Heading as="h3" className="text-base">Getting started</Heading>
        <Body role="supporting">One-time setup. These are the only terminal commands you&rsquo;ll ever run. After this, Claude handles everything.</Body>
        <StepList steps={[
          <span key="1">Clone the repo and install: <CopyCode>npm install</CopyCode></span>,
          <span key="2">Start the playground: <CopyCode>npm run dev</CopyCode>Open <strong>http://localhost:3000</strong>.</span>,
          <span key="3">Open the Figma file in the <strong>Figma desktop app</strong> (not the browser — the plugin won&rsquo;t work in browser): <a href={FIGMA_URL} target="_blank" rel="noopener" style={{ color: "var(--color-info)", textDecoration: "underline" }}>CLI Design System Experiment</a></span>,
          <span key="4">In Figma desktop: <strong>Plugins → Development → Import plugin from manifest</strong> → select <code style={mono}>lib/interpreters/figma-plugin/manifest.json</code></span>,
          <span key="5">Run the plugin: <strong>Plugins → Development → Construct</strong> → click <strong>Initialize</strong></span>,
        ]} />

        <Body role="supporting">
          That&rsquo;s it for terminal. After this, you work in <strong>Claude Code</strong> and <strong>Figma</strong> only. Claude runs all builds, syncs, and validations for you.
        </Body>

        <div style={{ marginTop: "1rem", padding: "1rem 1.25rem", background: "var(--color-bg-terminal)", border: "1px solid var(--color-bg-panel)", borderRadius: "0.375rem" }}>
          <div style={{ ...mono, fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.06em", color: "var(--color-warning)", marginBottom: "0.5rem" }}>WANT TO EXPERIMENT? SET UP A SANDBOX FIRST</div>
          <Body role="supporting">
            Create a fresh copy so demos don&rsquo;t touch your main workspace:
          </Body>
          <CopyCode>git worktree add demo origin/main && cd demo && npm install && npm run dev</CopyCode>
          <Body role="supporting">
            When done, clean up:
          </Body>
          <CopyCode>cd .. && git worktree remove demo</CopyCode>
        </div>
      </div>

      {/* ── Workflows overview ──────────────────────────────────────────── */}
      <div id="workflows" style={{ borderTop: "1px solid var(--color-bg-panel)", paddingTop: "2rem", marginTop: "2rem" }}>
        <Heading as="h3" className="text-base">Workflows</Heading>
        <Body role="supporting">
          Four scenarios. Each can start from Figma or from Claude Code. You never need a terminal — say it to Claude, and Claude does it.
        </Body>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" style={{ marginTop: "0.75rem" }}>
          <Card>
            <div style={{ ...mono, fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.06em", color: "var(--color-success)", marginBottom: "0.25rem" }}>PULLABLE (PROPERTY EDITS)</div>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.8125rem", color: "var(--color-text-body)" }}>
              Colors, fonts, glyph characters, banner phrases, padding.
            </div>
          </Card>
          <Card>
            <div style={{ ...mono, fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.06em", color: "var(--color-warning)", marginBottom: "0.25rem" }}>STRUCTURAL (NEW COMPONENTS OR LAYOUT)</div>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.8125rem", color: "var(--color-text-body)" }}>
              New patterns, new sections, rearranging composition.
            </div>
          </Card>
        </div>
      </div>

      {/* ================================================================ */}
      {/* SCENARIO 1                                                       */}
      {/* ================================================================ */}
      <div id="edit-pullable" style={{ borderTop: "1px solid var(--color-bg-panel)", paddingTop: "2rem", marginTop: "2rem" }}>
        <Heading as="h3" className="text-base">1. Edit an existing token or property</Heading>
        <Body role="supporting">Change a color, font size, glyph, banner phrase, or spacing value.</Body>
        <FlowDiagram steps={["Change the value (in Figma or tell Claude)", "Claude syncs it", "Open Figma → Plugins → Development → Construct → Apply", "Done"]} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3" style={{ marginTop: "0.75rem" }}>
          <Card>
            <div style={{ ...mono, fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.06em", color: "var(--color-info)", marginBottom: "0.375rem" }}>START IN FIGMA</div>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.8125rem", color: "var(--color-text-body)", marginBottom: "0.5rem" }}>
              Change a property in Figma. Claude reads it and updates the source files.
            </div>
            <TryIt id="try-1a">
              <div style={{ ...mono, fontSize: "0.6875rem", fontWeight: 700, color: "var(--color-warning)", marginBottom: "0.5rem" }}>SANDBOX — say this to Claude to set up</div>
              <StepList steps={[
                <span key="0">Say to Claude: <CopyCode variant="claude">demo 1</CopyCode>Claude changes the success color from green to cyan and rebuilds the plugin.</span>,
                <span key="1">Open Figma → run the plugin → <strong>Apply</strong>. Notice the success color changed.</span>,
                <span key="2">Now change it to something else in Figma (e.g. pick a different color on a banner).</span>,
                <span key="3">Say to Claude: <CopyCode variant="claude">pull from Figma</CopyCode>Claude reads the diff and shows what changed. Tell Claude to apply it.</span>,
                <span key="4">When done, say to Claude: <CopyCode variant="claude">end demo</CopyCode>Then open Figma → <strong>Plugins → Development → Construct</strong> → <strong>Apply</strong> to clean up.Everything restores. Open Figma → Apply to sync back.</span>,
              ]} />
            </TryIt>
          </Card>
          <Card>
            <div style={{ ...mono, fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.06em", color: "var(--color-success)", marginBottom: "0.375rem" }}>START IN CODE</div>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.8125rem", color: "var(--color-text-body)", marginBottom: "0.5rem" }}>
              Tell Claude what to change. Claude edits the file and rebuilds.
            </div>
            <TryIt id="try-1b">
              <div style={{ ...mono, fontSize: "0.6875rem", fontWeight: 700, color: "var(--color-warning)", marginBottom: "0.5rem" }}>SANDBOX — say this to Claude to set up</div>
              <StepList steps={[
                <span key="0">Say to Claude: <CopyCode variant="claude">demo 1</CopyCode>Claude changes the success color and rebuilds.</span>,
                <span key="1">Open Figma → run the plugin → <strong>Apply</strong>. The success color changes.</span>,
                <span key="2">When done, say to Claude: <CopyCode variant="claude">end demo</CopyCode>Then open Figma → <strong>Plugins → Development → Construct</strong> → <strong>Apply</strong> to clean up.</span>,
              ]} />
            </TryIt>
          </Card>
        </div>
      </div>

      {/* ================================================================ */}
      {/* SCENARIO 2                                                       */}
      {/* ================================================================ */}
      <div id="create-pullable" style={{ borderTop: "1px solid var(--color-bg-panel)", paddingTop: "2rem", marginTop: "2rem" }}>
        <Heading as="h3" className="text-base">2. Create a new token</Heading>
        <Body role="supporting">Propose a token that doesn&rsquo;t exist yet. Goes through the mirror for review.</Body>
        <FlowDiagram steps={["Tell Claude what you need", "Claude writes a proposal to mirror/", "Open Figma → Apply → review on Mirror page", "Approve or Reject → tell Claude"]} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3" style={{ marginTop: "0.75rem" }}>
          <Card>
            <div style={{ ...mono, fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.06em", color: "var(--color-info)", marginBottom: "0.375rem" }}>START IN FIGMA</div>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.8125rem", color: "var(--color-text-body)", marginBottom: "0.5rem" }}>
              You need a color or glyph that doesn&rsquo;t exist. Tell Claude.
            </div>
            <TryIt id="try-2a">
              <div style={{ ...mono, fontSize: "0.6875rem", fontWeight: 700, color: "var(--color-warning)", marginBottom: "0.5rem" }}>SANDBOX — say this to Claude to set up</div>
              <StepList steps={[
                <span key="0">Say to Claude: <CopyCode variant="claude">demo 2</CopyCode>Claude creates a token gap proposal and rebuilds the plugin.</span>,
                <span key="1">Open Figma → run the plugin → <strong>Apply</strong>. The proposal appears on <strong>Construct / Mirror</strong>.</span>,
                <span key="2">Click <strong>Approve</strong> or <strong>Reject</strong> with feedback.</span>,
                <span key="3">Say to Claude: <CopyCode variant="claude">check mirror</CopyCode></span>,
                <span key="4">When done, say to Claude: <CopyCode variant="claude">end demo</CopyCode>Then open Figma → <strong>Plugins → Development → Construct</strong> → <strong>Apply</strong> to clean up.</span>,
              ]} />
            </TryIt>
          </Card>
          <Card>
            <div style={{ ...mono, fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.06em", color: "var(--color-success)", marginBottom: "0.375rem" }}>START IN CODE</div>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.8125rem", color: "var(--color-text-body)", marginBottom: "0.5rem" }}>
              Tell Claude to write the token proposal directly.
            </div>
            <TryIt id="try-2b">
              <div style={{ ...mono, fontSize: "0.6875rem", fontWeight: 700, color: "var(--color-warning)", marginBottom: "0.5rem" }}>SANDBOX — say this to Claude to set up</div>
              <StepList steps={[
                <span key="0">Say to Claude: <CopyCode variant="claude">demo 2</CopyCode>Claude writes a sample proposal to mirror/.</span>,
                <span key="1">Open Figma → run plugin → <strong>Apply</strong>. The proposal appears on Mirror.</span>,
                <span key="2">Say to Claude: <CopyCode variant="claude">approve token-semantic-progress</CopyCode></span>,
                <span key="3">When done: <CopyCode variant="claude">end demo</CopyCode>Then open Figma → <strong>Plugins → Development → Construct</strong> → <strong>Apply</strong> to clean up.</span>,
              ]} />
            </TryIt>
          </Card>
        </div>
      </div>

      {/* ================================================================ */}
      {/* SCENARIO 3                                                       */}
      {/* ================================================================ */}
      <div id="edit-structural" style={{ borderTop: "1px solid var(--color-bg-panel)", paddingTop: "2rem", marginTop: "2rem" }}>
        <Heading as="h3" className="text-base">3. Edit a pattern&rsquo;s structure</Heading>
        <Body role="supporting">Add, remove, or reorder sections in an existing pattern.</Body>
        <FlowDiagram steps={["Describe the change to Claude (or share a screenshot)", "Claude edits the pattern and rebuilds", "Open Figma → Plugins → Development → Construct → Apply", "Done"]} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3" style={{ marginTop: "0.75rem" }}>
          <Card>
            <div style={{ ...mono, fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.06em", color: "var(--color-info)", marginBottom: "0.375rem" }}>START IN FIGMA</div>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.8125rem", color: "var(--color-text-body)", marginBottom: "0.5rem" }}>
              Describe the change to Claude and Claude will make it. Or: duplicate the component in Figma, edit it visually, and share a screenshot with Claude — Claude will update the pattern to match.
            </div>
            <TryIt id="try-3a">
              <div style={{ ...mono, fontSize: "0.6875rem", fontWeight: 700, color: "var(--color-warning)", marginBottom: "0.5rem" }}>SANDBOX — say this to Claude to set up</div>
              <StepList steps={[
                <span key="0">Say to Claude: <CopyCode variant="claude">demo 3</CopyCode>Claude adds a TECHNICAL DETAILS section to the error pattern and rebuilds.</span>,
                <span key="1">Open Figma → run the plugin → <strong>Apply</strong>. The error pattern now shows a stack trace section.</span>,
                <span key="2">In a real workflow, you&rsquo;d say something like: <code style={mono}>Add a TECHNICAL DETAILS section to the error pattern</code></span>,
                <span key="3">When done: <CopyCode variant="claude">end demo</CopyCode>Then open Figma → <strong>Plugins → Development → Construct</strong> → <strong>Apply</strong> to clean up.</span>,
              ]} />
            </TryIt>
          </Card>
          <Card>
            <div style={{ ...mono, fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.06em", color: "var(--color-success)", marginBottom: "0.375rem" }}>START IN CODE</div>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.8125rem", color: "var(--color-text-body)", marginBottom: "0.5rem" }}>
              Tell Claude what to edit. Claude validates against composition rules.
            </div>
            <TryIt id="try-3b">
              <div style={{ ...mono, fontSize: "0.6875rem", fontWeight: 700, color: "var(--color-warning)", marginBottom: "0.5rem" }}>SANDBOX — say this to Claude to set up</div>
              <StepList steps={[
                <span key="0">Say to Claude: <CopyCode variant="claude">demo 3</CopyCode>Claude edits error.md and rebuilds.</span>,
                <span key="1">Open Figma → run plugin → <strong>Apply</strong>. See the updated error pattern.</span>,
                <span key="2">When done: <CopyCode variant="claude">end demo</CopyCode>Then open Figma → <strong>Plugins → Development → Construct</strong> → <strong>Apply</strong> to clean up.</span>,
              ]} />
            </TryIt>
          </Card>
        </div>
      </div>

      {/* ================================================================ */}
      {/* SCENARIO 4                                                       */}
      {/* ================================================================ */}
      <div id="create-structural" style={{ borderTop: "1px solid var(--color-bg-panel)", paddingTop: "2rem", marginTop: "2rem" }}>
        <Heading as="h3" className="text-base">4. Create a new pattern</Heading>
        <Body role="supporting">Build a new CLI screen. Goes through the mirror for review.</Body>
        <FlowDiagram steps={["Tell Claude what you need (or share a screenshot)", "Claude writes the pattern and rebuilds", "Open Figma → Apply → review on Mirror page", "Approve or Reject → Claude promotes or revises"]} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3" style={{ marginTop: "0.75rem" }}>
          <Card>
            <div style={{ ...mono, fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.06em", color: "var(--color-info)", marginBottom: "0.375rem" }}>START IN FIGMA</div>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.8125rem", color: "var(--color-text-body)", marginBottom: "0.5rem" }}>
              Design the screen in a separate Figma file or scratch page, then share a screenshot with Claude. Claude generates the pattern spec from your design and validates it against the composition rules.
            </div>
            <TryIt id="try-4a">
              <div style={{ ...mono, fontSize: "0.6875rem", fontWeight: 700, color: "var(--color-warning)", marginBottom: "0.5rem" }}>SANDBOX — say this to Claude to set up</div>
              <StepList steps={[
                <span key="0">Say to Claude: <CopyCode variant="claude">demo 4</CopyCode>Claude creates a batch operation summary pattern and rebuilds.</span>,
                <span key="1">Open Figma → run the plugin → <strong>Apply</strong>. The proposed pattern appears on <strong>Construct / Mirror</strong>.</span>,
                <span key="2">Click <strong>Reject</strong> with: <code style={mono}>needs per-repo status rows showing which repos failed and why</code></span>,
                <span key="3">Say to Claude: <CopyCode variant="claude">check mirror</CopyCode>Claude reads the reason and asks: &ldquo;Do you want me to revise, or would you like to upload a screenshot?&rdquo; Tell Claude to revise.</span>,
                <span key="4">Open Figma → <strong>Plugins → Development → Construct</strong> → <strong>Apply</strong>. Review the revision. Click <strong>Approve</strong>.</span>,
                <span key="5">Say to Claude: <CopyCode variant="claude">check mirror</CopyCode>Claude promotes the pattern, then shows you a draft set of composition rules for the new pattern — what&rsquo;s required, what&rsquo;s optional, how it compares to existing rules. Review the analysis and tell Claude to apply or adjust.</span>,
                <span key="6">When done: <CopyCode variant="claude">end demo</CopyCode>Then open Figma → <strong>Plugins → Development → Construct</strong> → <strong>Apply</strong> to clean up.</span>,
              ]} />
              <Body role="supporting">
                Tip: if you want to provide a visual design instead of a text description, reject with <code style={mono}>design review needed</code> — Claude will ask you to share a screenshot.
              </Body>
            </TryIt>
          </Card>
          <Card>
            <div style={{ ...mono, fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.06em", color: "var(--color-success)", marginBottom: "0.375rem" }}>START IN CODE</div>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.8125rem", color: "var(--color-text-body)", marginBottom: "0.5rem" }}>
              Describe the screen to Claude. Claude writes the spec.
            </div>
            <TryIt id="try-4b">
              <div style={{ ...mono, fontSize: "0.6875rem", fontWeight: 700, color: "var(--color-warning)", marginBottom: "0.5rem" }}>SANDBOX — say this to Claude to set up</div>
              <StepList steps={[
                <span key="0">Say to Claude: <CopyCode variant="claude">demo 4</CopyCode>Claude writes the pattern to mirror/ and rebuilds.</span>,
                <span key="1">Open Figma → run plugin → <strong>Apply</strong>. The proposal appears on Mirror.</span>,
                <span key="2">Approve or reject. Say to Claude: <CopyCode variant="claude">check mirror</CopyCode></span>,
                <span key="3">Claude promotes it and shows a draft set of composition rules with analysis. Review and approve.</span>,
                <span key="4">When done: <CopyCode variant="claude">end demo</CopyCode>Then open Figma → <strong>Plugins → Development → Construct</strong> → <strong>Apply</strong> to clean up.</span>,
              ]} />
            </TryIt>
          </Card>
        </div>
      </div>

      {/* ── All commands ────────────────────────────────────────────────── */}
      <div id="commands" style={{ borderTop: "1px solid var(--color-bg-panel)", paddingTop: "2rem", marginTop: "2rem" }}>
        <Heading as="h3" className="text-base">All commands</Heading>
        <Body role="supporting">Say these to Claude. Claude runs everything — you stay in Claude Code and Figma.</Body>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginTop: "0.75rem" }}>
          {[
            { cmd: "status", desc: "Design system health report" },
            { cmd: "pull from Figma", desc: "Diff Figma → propose token edits" },
            { cmd: "approve <name>", desc: "Promote mirror item → canonical" },
            { cmd: "check mirror", desc: "Promote approvals, revise rejections, report status" },
            { cmd: "demo 1 / 2 / 3 / 4", desc: "Start a sandboxed demo scenario" },
            { cmd: "end demo", desc: "Clean up demo, restore everything" },
          ].map((r) => (
            <div key={r.cmd} style={{ background: "var(--color-bg-terminal)", border: "1px solid var(--color-bg-panel)", borderRadius: "0.25rem", padding: "0.5rem 0.75rem" }}>
              <code style={{ ...mono, fontSize: "0.75rem", color: "var(--color-warning)", display: "block" }}>{r.cmd}</code>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "var(--color-text-supporting)", marginTop: "0.125rem" }}>{r.desc}</div>
            </div>
          ))}
        </div>

        <Body role="supporting">
          The only time you use a terminal is the one-time setup: <code style={mono}>npm install</code> and <code style={mono}>npm run dev</code>.
        </Body>
      </div>
    </Section>
  );
}
