/**
 * System Design — covers both how Construct is designed AND how to use it.
 * One continuous read; no collapsibles, no tabs.
 */
import { Section } from "@/components/Section";
import { Body } from "@/components/Body";
import { ApproachDiagram } from "@/components/ApproachDiagram";
import { Heading } from "@/components/Heading";

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
        <Body role="primary">
          Most design systems lose meaning at the export step. A color becomes{" "}
          <code style={{ fontFamily: "var(--font-mono)" }}>#f87171</code> and that&rsquo;s it —
          why it exists, who reads it, where it appears, all gone. Every tool downstream
          inherits that loss.
        </Body>
        <Body role="primary">
          Canonical keeps the meaning. Each token records what it&rsquo;s for, what evidence
          supports it, where it applies, and how conflicts were resolved. An LLM, a designer
          in Figma, the CLI, or this site can each read what they need.
        </Body>
        <Body role="primary">
          Terminal details stay terminal. Two spaces of indent stays two spaces of indent —
          not sixteen pixels. The translation to canvas dimensions happens at the Figma
          boundary, not in the source.
        </Body>

        <Heading as="h3" className="text-base">The loop, end to end</Heading>
        <Body role="primary">
          Canonical is one file in the repo. It holds every token, every grammar rule, and
          the evidence behind each one. Everything else that needs to know what the design
          system says reads from this file.
        </Body>
        <Body role="primary">
          The Figma plugin reads canonical and builds the design system inside the open
          Figma file. It produces variables, text styles, and the components designers
          compose with. Designers do not import or copy; they sync.
        </Body>
        <Body role="primary">
          Code Connect closes the other half. Each Figma component carries a pointer to its
          matching React implementation in the codebase. When a designer hovers a component
          in Figma&rsquo;s Dev Mode, they see the actual code an engineer would write.
        </Body>
        <Body role="primary">
          Both directions are safe to run any time. Re-running the plugin updates components
          in place; it never duplicates and never destroys. If a component disappears from
          canonical, its Figma counterpart moves to a dedicated review page rather than
          vanishing.
        </Body>
      </div>

      <ApproachDiagram />

      <div className="space-y-4">
        <Heading as="h3" className="text-base">Working in Figma</Heading>
        <Body role="primary">
          The plugin produces five layers, all bound to canonical: atoms (text styles and
          glyph variants), molecules (composed rows like &ldquo;recovery action&rdquo; or
          &ldquo;hint row&rdquo;), organisms (full sections like USAGE or WHAT WENT WRONG),
          banners, and template screens. Change a color in canonical, re-sync, every Figma
          component updates.
        </Body>

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
        ├── atoms.js
        ├── molecules.js
        ├── organisms.js
        ├── banners.js
        └── templates.js`}
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
          generic snippet. Mappings live next to each React component; designers do not
          run anything, and engineers re-publish when components change.
        </Body>

        <Heading as="h3" className="text-base">Working with Claude</Heading>
        <Body role="primary">
          A designer asks Claude to draft an error screen for a new command. Claude reads
          canonical, follows the voice rules, and proposes the screen using the right
          glyphs and colors. The designer adjusts in Figma; the conventions stay intact.
        </Body>
        <Body role="primary">
          An engineer asks Claude to add a flag to a CLI command. Claude reads the
          help-screen pattern, drafts the inline reference styled to canonical, and matches
          the voice rules without being told. The implementation lands consistent with the
          system, no separate handoff.
        </Body>
        <Body role="primary">
          When canonical itself needs to evolve, Claude proposes the change as a structured
          edit, preserving evidence and applies_to fields. The author reviews and merges.
          Nothing drifts because every consumer reads the same file.
        </Body>

        <Heading as="h3" className="text-base">Where to learn more</Heading>
        <div className="space-y-1">
          <Body role="metadata">
            <code style={{ fontFamily: "var(--font-mono)" }}>tokens/canonical.json</code>
            {" "}— the source of truth: tokens, grammar, provenance.
          </Body>
          <Body role="metadata">
            <code style={{ fontFamily: "var(--font-mono)" }}>AGENTS.md</code>
            {" "}— repo conventions and architecture for engineers.
          </Body>
          <Body role="metadata">
            <code style={{ fontFamily: "var(--font-mono)" }}>lib/interpreters/figma-plugin/README.md</code>
            {" "}— plugin install, idempotency model, alternative export paths.
          </Body>
          <Body role="metadata">
            <code style={{ fontFamily: "var(--font-mono)" }}>design-system/gaps.md</code>
            {" "}— extrapolations and what is deliberately out of scope.
          </Body>
        </div>
      </div>
    </Section>
  );
}
