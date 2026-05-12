/**
 * System Design — how Construct is architected.
 * Operational instructions live on the Workflow page.
 */
import * as React from "react";
import { Section } from "@/components/Section";
import { Body } from "@/components/Body";
import { ApproachDiagram } from "@/components/ApproachDiagram";
import { Heading } from "@/components/Heading";
import { Card } from "@/components/Card";

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

export function Approach() {
  return (
    <Section id="approach" title="System Design">
      {/* --- Thesis -------------------------------------------------------- */}
      <div className="space-y-4">
        <Heading as="h3" className="text-base">Principles</Heading>
        <Body role="primary">
          Code is the source of truth. Figma is bidirectional. Anyone can contribute.
        </Body>
        <ul style={{ padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "0.625rem" }}>
          <li style={{ fontFamily: "var(--font-sans)", fontSize: "0.9375rem", color: "var(--color-text-body)", lineHeight: 1.55 }}>
            <strong style={{ color: "var(--color-text-primary)" }}>Production-first.</strong>{" "}
            Tokens are semantic intent in code — not visual values projected from a design tool.
            The repo is the authority. Figma, the CLI, and this site all read from it.
          </li>
          <li style={{ fontFamily: "var(--font-sans)", fontSize: "0.9375rem", color: "var(--color-text-body)", lineHeight: 1.55 }}>
            <strong style={{ color: "var(--color-text-primary)" }}>Bidirectional Figma.</strong>{" "}
            A plugin pushes canonical to Figma. Claude reads Figma via MCP and pulls changes back.
            Token-level edits flow in both directions. Structural changes go through the mirror/review flow.
          </li>
          <li style={{ fontFamily: "var(--font-sans)", fontSize: "0.9375rem", color: "var(--color-text-body)", lineHeight: 1.55 }}>
            <strong style={{ color: "var(--color-text-primary)" }}>Governed creativity.</strong>{" "}
            Composition rules enforce consistency. When Claude builds a new screen, it checks
            existing patterns first. If nothing matches, it generates the screen AND a draft set
            of rules — both go through review before becoming canonical.
          </li>
          <li style={{ fontFamily: "var(--font-sans)", fontSize: "0.9375rem", color: "var(--color-text-body)", lineHeight: 1.55 }}>
            <strong style={{ color: "var(--color-text-primary)" }}>Context survives the export.</strong>{" "}
            A color isn&rsquo;t just <code style={{ fontFamily: "var(--font-mono)" }}>#f87171</code> — it
            carries what it&rsquo;s for, where it applies, and the evidence behind it.
          </li>
        </ul>
      </div>

      {/* --- Architecture -------------------------------------------------- */}
      <div className="space-y-4">
        <Heading as="h3" className="text-base">Architecture</Heading>
        <Body role="supporting">
          One authoring source, one canonical output, many consumers.
        </Body>
        <ApproachDiagram />
      </div>

      {/* --- Three layers -------------------------------------------------- */}
      <div className="space-y-4">
        <Heading as="h3" className="text-base">Three layers</Heading>
        <Body role="supporting">
          Everything in the system is organized into three layers.
          These are the same in code, in Figma, and on this site.
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

      {/* --- Composition rules --------------------------------------------- */}
      <div className="space-y-3">
        <Heading as="h3" className="text-base">Composition rules</Heading>
        <Body role="supporting">
          <code style={{ fontFamily: "var(--font-mono)" }}>composition.json</code> is a living ruleset that evolves with
          the system. It governs how screens are built — glyph-color pairing, semantic color limits, section
          ordering, required elements per pattern type.
        </Body>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Card>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.06em", color: "var(--color-text-supporting)", marginBottom: "0.375rem" }}>EXAMPLES</div>
            <CheckTable items={[
              { label: "● must be red (danger sections) or white (action headers)", ok: true },
              { label: "Max 3 semantic colors per screen", ok: true },
              { label: "Error pattern requires WHAT WENT WRONG + TRY + close banner", ok: true },
              { label: "Close banner color must match exit condition", ok: true },
              { label: "Cyan is only for commands, flags, and paths", ok: true },
            ]} />
          </Card>
          <Card>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.06em", color: "var(--color-text-supporting)", marginBottom: "0.375rem" }}>ENFORCEMENT</div>
            <CheckTable items={[
              { label: "Build time: mirror items linted before baking into plugin", ok: true },
              { label: "On demand: npm run lint:composition", ok: true },
              { label: "Claude reads composition.json before generating any screen", ok: true },
              { label: "Mirror page shows lint results as badges per frame", ok: true },
              { label: "Screen gaps auto-detected from screens.json", ok: true },
            ]} />
          </Card>
        </div>
      </div>

      {/* --- Rules evolution ------------------------------------------------ */}
      <div className="space-y-3">
        <Heading as="h3" className="text-base">Rules: how composition rules evolve</Heading>
        <Body role="supporting">
          Rules don&rsquo;t get added automatically. Every new rule goes through analysis and human review.
          The goal is consistency, not volume.
        </Body>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
          {[
            { label: "DRAFT", desc: "Claude generates rules from the new pattern's composition section", color: "var(--color-info)" },
            { label: "COMPARE", desc: "Claude checks for overlaps, conflicts, and simplification opportunities against all existing rules", color: "var(--color-warning)" },
            { label: "REVIEW", desc: "Claude shows the analysis — what's new, what's redundant, what can be combined", color: "var(--color-text-primary)" },
            { label: "APPLY", desc: "Human approves. Rules are written to composition.json", color: "var(--color-success)" },
          ].map((s) => (
            <div key={s.label} style={{ background: "var(--color-bg-terminal)", border: "1px solid var(--color-bg-panel)", borderRadius: "0.25rem", padding: "0.5rem 0.75rem" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.625rem", fontWeight: 700, letterSpacing: "0.06em", color: s.color }}>{s.label}</div>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "var(--color-text-supporting)", marginTop: "0.25rem" }}>{s.desc}</div>
            </div>
          ))}
        </div>

        <Body role="supporting">
          Claude also runs periodic health checks — scanning for redundant rules, conflicting rules, and
          rules that are too specific to one pattern and could be generalized.
        </Body>
      </div>

      {/* --- Mirror flow --------------------------------------------------- */}
      <div className="space-y-3">
        <Heading as="h3" className="text-base">Mirror: how new patterns enter the system</Heading>
        <Body role="supporting">
          New screens don&rsquo;t go straight to canonical. They land on a staging page in Figma
          for review before promotion.
        </Body>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
          {[
            { label: "PROPOSE", desc: "Write a .md file to design-system/mirror/", color: "var(--color-info)" },
            { label: "LINT", desc: "Build validates it against composition rules", color: "var(--color-warning)" },
            { label: "REVIEW", desc: "Appears on Figma Mirror page with lint badge", color: "var(--color-text-primary)" },
            { label: "PROMOTE", desc: "Move to patterns/, rebuild — now canonical", color: "var(--color-success)" },
          ].map((s) => (
            <div key={s.label} style={{ background: "var(--color-bg-terminal)", border: "1px solid var(--color-bg-panel)", borderRadius: "0.25rem", padding: "0.5rem 0.75rem" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.625rem", fontWeight: 700, letterSpacing: "0.06em", color: s.color }}>{s.label}</div>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "var(--color-text-supporting)", marginTop: "0.25rem" }}>{s.desc}</div>
            </div>
          ))}
        </div>

        <Body role="supporting">
          Gaps are detected automatically. Screens defined in <code style={{ fontFamily: "var(--font-mono)" }}>screens.json</code> that
          lack a pattern get NEEDS PATTERN stubs on the Mirror page.
        </Body>
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
├── patterns/*.md            ← canonical patterns (17)
├── mirror/*.md              ← proposed patterns (staging)
├── screens.json             ← screen manifest (gap detection)
├── composition.json         ← composition rules (living ruleset)
├── pattern-template.md      ← blank template for new patterns
├── voice.md                 ← voice rules
└── gaps.md                  ← known gaps

tokens/
├── canonical.json           ← generated source of truth
└── figma-expected.json      ← expected Figma state (for pull)

lib/interpreters/figma-plugin/
├── build.mjs                ← bakes canonical + mirror into code.js
├── ui.html                  ← plugin UI (diff, approve/reject)
└── src/builders/            ← tokens, rows, sections, banners, patterns, mirror

scripts/
├── build-tokens.mjs         ← tokens.json → canonical.json
├── figma-pull-expected.mjs  ← canonical → figma-expected.json
├── validate-composition.mjs ← lint + gap detection
├── status.mjs               ← design system health report
├── setup-hooks.mjs          ← installs git hooks on npm install
└── hooks/
    ├── pre-commit           ← auto-rebuild on commit
    └── post-merge           ← auto-rebuild on pull

.github/workflows/
└── deploy.yml               ← auto-deploy site on merge to main`}
        </pre>
      </div>

      {/* --- Reference ----------------------------------------------------- */}
      <div className="space-y-3">
        <Heading as="h3" className="text-base">Reference</Heading>
        <div className="space-y-1">
          <Body role="supporting">
            <code style={{ fontFamily: "var(--font-mono)" }}>canonical.json</code>
            {" "}— all tokens with role, evidence, and provenance.
          </Body>
          <Body role="supporting">
            <code style={{ fontFamily: "var(--font-mono)" }}>composition.json</code>
            {" "}— glyph-color rules, pattern shapes, semantic color constraints.
          </Body>
          <Body role="supporting">
            <code style={{ fontFamily: "var(--font-mono)" }}>screens.json</code>
            {" "}— screen manifest for gap detection.
          </Body>
          <Body role="supporting">
            <code style={{ fontFamily: "var(--font-mono)" }}>pattern-template.md</code>
            {" "}— blank template with example for writing new patterns.
          </Body>
          <Body role="supporting">
            <code style={{ fontFamily: "var(--font-mono)" }}>AGENTS.md</code>
            {" "}— repo conventions for Claude and other AI tools.
          </Body>
          <Body role="supporting">
            <code style={{ fontFamily: "var(--font-mono)" }}>figma-plugin/README.md</code>
            {" "}— plugin install, diff model, idempotency details.
          </Body>
        </div>
      </div>
    </Section>
  );
}
