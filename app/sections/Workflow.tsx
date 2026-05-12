/**
 * Workflow — four scenarios, two starting points each, with try-it walkthroughs.
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
        fontFamily: "var(--font-mono)", fontSize: "0.8125rem", color: "var(--color-text-body)",
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
        <div
          id={id}
          style={{
            marginTop: "0.75rem", padding: "1rem 1.25rem", background: "var(--color-bg-terminal)",
            border: "1px solid var(--color-bg-panel)", borderRadius: "0.375rem",
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

function FlowDiagram({ steps }: { steps: string[] }) {
  return (
    <div style={{
      fontFamily: "var(--font-mono)", fontSize: "0.75rem", lineHeight: 1.7,
      color: "var(--color-text-supporting)", margin: "0.5rem 0",
    }}>
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
        <Body role="supporting">One-time setup. After this, everything auto-updates.</Body>
        <StepList steps={[
          <span key="1">Clone the repo and install: <CopyCode>npm install</CopyCode>This installs git hooks that auto-rebuild the Figma plugin and enforce the pattern template on every commit.</span>,
          <span key="2">Start the playground: <CopyCode>npm run dev</CopyCode>Open <strong>http://localhost:3000</strong>. You&rsquo;ll see a status report showing what&rsquo;s canonical, what&rsquo;s in review, and any gaps.</span>,
          <span key="3">Open the Figma file: <a href={FIGMA_URL} target="_blank" rel="noopener" style={{ color: "var(--color-info)", textDecoration: "underline" }}>CLI Design System Experiment</a></span>,
          <span key="4">In Figma desktop: <strong>Plugins → Development → Import plugin from manifest</strong> → select <code style={mono}>lib/interpreters/figma-plugin/manifest.json</code></span>,
          <span key="5">Run the plugin: <strong>Plugins → Development → Construct</strong> → click <strong>Initialize</strong></span>,
        ]} />
        <Body role="supporting">
          After this, you never rebuild manually. Commits and pulls auto-rebuild the plugin. The site auto-deploys on merge to main.
        </Body>
      </div>

      {/* ── Workflows overview ──────────────────────────────────────────── */}
      <div id="workflows" style={{ borderTop: "1px solid var(--color-bg-panel)", paddingTop: "2rem", marginTop: "2rem" }}>
        <Heading as="h3" className="text-base">Workflows</Heading>
        <Body role="supporting">
          Four scenarios depending on what you&rsquo;re changing and whether it&rsquo;s a property edit or a structural change.
          Each one can start from Figma or from code.
        </Body>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" style={{ marginTop: "0.75rem" }}>
          <Card>
            <div style={{ ...mono, fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.06em", color: "var(--color-success)", marginBottom: "0.25rem" }}>PULLABLE (PROPERTY EDITS)</div>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.8125rem", color: "var(--color-text-body)" }}>
              Colors, fonts, glyph characters, banner phrases, padding. Things you change in the property inspector.
            </div>
          </Card>
          <Card>
            <div style={{ ...mono, fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.06em", color: "var(--color-warning)", marginBottom: "0.25rem" }}>STRUCTURAL (NEW COMPONENTS OR LAYOUT)</div>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.8125rem", color: "var(--color-text-body)" }}>
              New patterns, new sections, rearranging composition. Things that require creating or deleting nodes.
            </div>
          </Card>
        </div>
      </div>

      {/* ================================================================ */}
      {/* SCENARIO 1: Edit something pullable                              */}
      {/* ================================================================ */}
      <div id="edit-pullable" style={{ borderTop: "1px solid var(--color-bg-panel)", paddingTop: "2rem", marginTop: "2rem" }}>
        <Heading as="h3" className="text-base">1. Edit an existing token or property</Heading>
        <Body role="supporting">Change a color, font size, glyph, banner phrase, or spacing value that already exists.</Body>

        <FlowDiagram steps={[
          "Change the value (in Figma or in code)",
          "Sync it to the other side",
          "Commit → plugin rebuilds → open Figma → Apply",
          "Done — code and Figma are in sync",
        ]} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3" style={{ marginTop: "0.75rem" }}>
          {/* From Figma */}
          <Card>
            <div style={{ ...mono, fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.06em", color: "var(--color-info)", marginBottom: "0.375rem" }}>START IN FIGMA</div>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.8125rem", color: "var(--color-text-body)", marginBottom: "0.5rem" }}>
              A designer changes a fill color on a banner component directly in Figma. Claude reads the change and updates the source files.
            </div>
            <TryIt id="try-1a">
              <StepList steps={[
                <span key="1">Open the <a href={FIGMA_URL} target="_blank" rel="noopener" style={{ color: "var(--color-info)" }}>Figma file</a>. Navigate to the component you want to change (e.g. <strong>Construct / Components</strong> → a banner).</span>,
                <span key="2">Select the element and change the property (e.g. change the fill color).</span>,
                <span key="3">Open Claude Code in this repo. Say: <CopyCode>pull from Figma</CopyCode></span>,
                <span key="4">Claude reads the Figma file, compares against canonical, and shows you what changed. Review the diff.</span>,
                <span key="5">Tell Claude to apply it. Claude edits <code style={mono}>tokens.json</code>.</span>,
                <span key="6">Commit the change. The pre-commit hook rebuilds the plugin automatically.</span>,
                <span key="7">Back in Figma: run the plugin → <strong>Apply</strong>. Both sides are now in sync.</span>,
              ]} />
              <Body role="supporting">
                In a more mature setup, the commit would auto-create a PR for team review before merging.
              </Body>
            </TryIt>
          </Card>

          {/* From code */}
          <Card>
            <div style={{ ...mono, fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.06em", color: "var(--color-success)", marginBottom: "0.375rem" }}>START IN CODE</div>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.8125rem", color: "var(--color-text-body)", marginBottom: "0.5rem" }}>
              A developer updates a color value in tokens.json. The commit auto-rebuilds the plugin, and Figma picks it up.
            </div>
            <TryIt id="try-1b">
              <StepList steps={[
                <span key="1">Open <code style={mono}>design-system/tokens.json</code> in your editor.</span>,
                <span key="2">Find the token you want to change (e.g. <code style={mono}>color.semantic.success</code>) and update its <code style={mono}>$value</code>.</span>,
                <span key="3">Commit the change. The pre-commit hook rebuilds the plugin and validates composition rules.</span>,
                <span key="4">Open the <a href={FIGMA_URL} target="_blank" rel="noopener" style={{ color: "var(--color-info)" }}>Figma file</a>. Run <strong>Plugins → Development → Construct</strong>.</span>,
                <span key="5">The plugin shows the diff. Click <strong>Apply</strong>. Done.</span>,
              ]} />
            </TryIt>
          </Card>
        </div>
      </div>

      {/* ================================================================ */}
      {/* SCENARIO 2: Create something pullable (new token)                */}
      {/* ================================================================ */}
      <div id="create-pullable" style={{ borderTop: "1px solid var(--color-bg-panel)", paddingTop: "2rem", marginTop: "2rem" }}>
        <Heading as="h3" className="text-base">2. Create a new token</Heading>
        <Body role="supporting">Add a new color, glyph, or typography token that doesn&rsquo;t exist yet. Goes through the mirror for review.</Body>

        <FlowDiagram steps={[
          "Write a token gap proposal to mirror/",
          "Commit → appears on Figma Mirror page",
          "Review → Approve or Reject",
          "Add the token to tokens.json → commit → done",
        ]} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3" style={{ marginTop: "0.75rem" }}>
          <Card>
            <div style={{ ...mono, fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.06em", color: "var(--color-info)", marginBottom: "0.375rem" }}>START IN FIGMA</div>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.8125rem", color: "var(--color-text-body)", marginBottom: "0.5rem" }}>
              A designer is working on a screen and realizes they need a color that doesn&rsquo;t exist in the token set. They flag the gap through Claude.
            </div>
            <TryIt id="try-2a">
              <StepList steps={[
                <span key="1">Open Claude Code. Describe the token you need: <CopyCode>I need a new semantic color for &quot;in progress&quot; state — something between info and warning</CopyCode></span>,
                <span key="2">Claude writes a token gap proposal to <code style={mono}>design-system/mirror/</code> and commits.</span>,
                <span key="3">Open the <a href={FIGMA_URL} target="_blank" rel="noopener" style={{ color: "var(--color-info)" }}>Figma file</a>. Run the plugin → <strong>Apply</strong>. The proposal appears on <strong>Construct / Mirror</strong>.</span>,
                <span key="4">Review the frame. Click <strong>Approve</strong> or <strong>Reject</strong> with feedback.</span>,
                <span key="5">If approved, tell Claude: <CopyCode>check Figma for approvals</CopyCode></span>,
                <span key="6">Claude adds the token to <code style={mono}>tokens.json</code>. Commit. The new token is now canonical.</span>,
              ]} />
            </TryIt>
          </Card>
          <Card>
            <div style={{ ...mono, fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.06em", color: "var(--color-success)", marginBottom: "0.375rem" }}>START IN CODE</div>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.8125rem", color: "var(--color-text-body)", marginBottom: "0.5rem" }}>
              A developer knows they need a new token and writes the proposal directly.
            </div>
            <TryIt id="try-2b">
              <StepList steps={[
                <span key="1">Write a token gap proposal <code style={mono}>.md</code> file describing the new token, its role, and why it&rsquo;s needed. Save to <code style={mono}>design-system/mirror/</code></span>,
                <span key="2">Commit. The hook validates the template and rebuilds the plugin.</span>,
                <span key="3">Open Figma → run plugin → <strong>Apply</strong>. The proposal appears on Mirror.</span>,
                <span key="4">Wait for review (or approve it yourself in Claude: <code style={mono}>approve [name]</code>).</span>,
                <span key="5">Once approved, add the token to <code style={mono}>tokens.json</code> and commit.</span>,
              ]} />
            </TryIt>
          </Card>
        </div>
      </div>

      {/* ================================================================ */}
      {/* SCENARIO 3: Edit something structural                            */}
      {/* ================================================================ */}
      <div id="edit-structural" style={{ borderTop: "1px solid var(--color-bg-panel)", paddingTop: "2rem", marginTop: "2rem" }}>
        <Heading as="h3" className="text-base">3. Edit a pattern&rsquo;s structure</Heading>
        <Body role="supporting">Change the sections, ordering, or composition of an existing pattern. This can&rsquo;t be pulled from Figma — it&rsquo;s a code edit.</Body>

        <FlowDiagram steps={[
          "Edit the pattern .md file in code (or ask Claude to)",
          "Commit → plugin rebuilds",
          "Open Figma → Apply → the pattern updates",
          "Done",
        ]} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3" style={{ marginTop: "0.75rem" }}>
          <Card>
            <div style={{ ...mono, fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.06em", color: "var(--color-info)", marginBottom: "0.375rem" }}>START IN FIGMA</div>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.8125rem", color: "var(--color-text-body)", marginBottom: "0.5rem" }}>
              A designer sees that the error pattern needs a TECHNICAL DETAILS section. They can&rsquo;t add it in Figma — but they can describe the change and have Claude make it.
            </div>
            <TryIt id="try-3a">
              <StepList steps={[
                <span key="1">Open Claude Code. Describe what you want to change: <CopyCode>Add a TECHNICAL DETAILS section to the error pattern, below TRY, in metadata color</CopyCode></span>,
                <span key="2">Claude reads the composition rules, edits <code style={mono}>design-system/patterns/error.md</code>, and shows you the diff.</span>,
                <span key="3">Review the change. If it looks right, tell Claude to commit.</span>,
                <span key="4">Open the <a href={FIGMA_URL} target="_blank" rel="noopener" style={{ color: "var(--color-info)" }}>Figma file</a>. Run the plugin → <strong>Apply</strong>. The pattern updates on the Patterns page.</span>,
              ]} />
            </TryIt>
          </Card>
          <Card>
            <div style={{ ...mono, fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.06em", color: "var(--color-success)", marginBottom: "0.375rem" }}>START IN CODE</div>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.8125rem", color: "var(--color-text-body)", marginBottom: "0.5rem" }}>
              A developer edits the pattern file directly.
            </div>
            <TryIt id="try-3b">
              <StepList steps={[
                <span key="1">Open <code style={mono}>design-system/patterns/error.md</code> in your editor.</span>,
                <span key="2">Edit the &ldquo;What the user sees&rdquo; code block and the composition rules.</span>,
                <span key="3">Run <CopyCode>npm run lint:composition</CopyCode> to validate your changes against the rules.</span>,
                <span key="4">Commit. Open Figma → <strong>Apply</strong>.</span>,
              ]} />
            </TryIt>
          </Card>
        </div>
      </div>

      {/* ================================================================ */}
      {/* SCENARIO 4: Create something structural (new pattern)            */}
      {/* ================================================================ */}
      <div id="create-structural" style={{ borderTop: "1px solid var(--color-bg-panel)", paddingTop: "2rem", marginTop: "2rem" }}>
        <Heading as="h3" className="text-base">4. Create a new pattern</Heading>
        <Body role="supporting">Build a new screen that doesn&rsquo;t exist yet. Goes through the mirror for review before becoming canonical.</Body>

        <FlowDiagram steps={[
          "Write pattern .md using the template → save to mirror/",
          "Commit → lands on Figma Mirror page with lint badge",
          "Review → Approve or Reject (with feedback → Claude revises → re-review)",
          "Promote to patterns/ → now canonical",
        ]} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3" style={{ marginTop: "0.75rem" }}>
          <Card>
            <div style={{ ...mono, fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.06em", color: "var(--color-info)", marginBottom: "0.375rem" }}>START IN FIGMA</div>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.8125rem", color: "var(--color-text-body)", marginBottom: "0.5rem" }}>
              A designer mocks up a new CLI screen in a separate Figma file, then uses Claude to turn it into a pattern that follows the system&rsquo;s rules.
            </div>
            <TryIt id="try-4a">
              <StepList steps={[
                <span key="1">Design the screen in Figma (can be in a separate file or on a scratch page — not on the Construct pages).</span>,
                <span key="2">Take a screenshot or export it.</span>,
                <span key="3">Open Claude Code. Share the screenshot and describe the screen: <CopyCode>Create a new pattern for this batch operation summary screen. It shows per-repo status with success/warning/failure rows.</CopyCode></span>,
                <span key="4">Claude reads the composition rules, checks for existing patterns that might already cover this, and writes a <code style={mono}>.md</code> file to <code style={mono}>design-system/mirror/</code>. The template is enforced — Claude uses the required sections automatically.</span>,
                <span key="5">Claude commits. The plugin rebuilds automatically.</span>,
                <span key="6">Open the <a href={FIGMA_URL} target="_blank" rel="noopener" style={{ color: "var(--color-info)" }}>Construct Figma file</a>. Run the plugin → <strong>Apply</strong>. The proposed pattern appears on <strong>Construct / Mirror</strong> with a lint badge.</span>,
                <span key="7">Review the frame. Does it follow the system? Does the preview look right?</span>,
                <span key="8">Click <strong>Approve</strong> to accept it, or <strong>Reject</strong> with feedback (e.g. &ldquo;needs per-repo failure details&rdquo;).</span>,
                <span key="9">If rejected: tell Claude <code style={mono}>check mirror for rejections</code>. Claude reads the reason, revises the pattern, and commits. The Mirror page updates. Review again.</span>,
                <span key="10">Once approved, tell Claude: <CopyCode>check Figma for approvals</CopyCode> Claude promotes the file to <code style={mono}>patterns/</code>. The pattern is now canonical and appears on the Patterns page.</span>,
              ]} />
              <Body role="supporting">
                In a more mature setup, Claude&rsquo;s commit would auto-create a GitHub PR so the whole team can review the pattern before it merges to main.
              </Body>
            </TryIt>
          </Card>
          <Card>
            <div style={{ ...mono, fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.06em", color: "var(--color-success)", marginBottom: "0.375rem" }}>START IN CODE</div>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.8125rem", color: "var(--color-text-body)", marginBottom: "0.5rem" }}>
              A developer writes the pattern spec directly and waits for design review in Figma.
            </div>
            <TryIt id="try-4b">
              <StepList steps={[
                <span key="1">Copy the <a href="https://github.com/jaydjj/Construct/blob/main/design-system/pattern-template.md" target="_blank" rel="noopener" style={{ color: "var(--color-info)" }}>pattern template</a> to <code style={mono}>design-system/mirror/my-pattern.md</code></span>,
                <span key="2">Fill in the sections: title, when it applies, the terminal preview, visual anatomy, and composition rules.</span>,
                <span key="3">Commit. The hook validates the template (blocks if sections are missing) and rebuilds the plugin.</span>,
                <span key="4">Open Figma → run plugin → <strong>Apply</strong>. The proposal appears on Mirror with a lint badge.</span>,
                <span key="5">Share the Figma file with your team. Anyone can open the plugin and click <strong>Approve</strong> or <strong>Reject</strong>.</span>,
                <span key="6">Check for feedback: <CopyCode>check mirror for rejections</CopyCode> or <CopyCode>check Figma for approvals</CopyCode></span>,
                <span key="7">Once approved and promoted, the pattern is canonical. In a more mature setup, a GitHub PR would gate the merge.</span>,
              ]} />
            </TryIt>
          </Card>
        </div>
      </div>

      {/* ── All commands ────────────────────────────────────────────────── */}
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
      </div>
    </Section>
  );
}
