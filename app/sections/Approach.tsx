/**
 * Approach — human-facing companion to AGENTS.md. Under 600 words; the
 * diagram does the heavy lifting.
 */
import { Section } from "@/components/Section";
import { Body } from "@/components/Body";
import { ApproachDiagram } from "@/components/ApproachDiagram";
import { Heading } from "@/components/Heading";

export function Approach() {
  return (
    <Section id="approach" title="Approach">
      <div className="space-y-4">
        <Heading as="h3" className="text-base">The thesis</Heading>
        <Body role="primary">
          Construct is production-first and AI-ready. Tokens are <em>semantic intent in code</em>{" "}
          — not visual values projected from a design tool. Figma is one consumer among many.
          The repo is the source of truth; everything else mirrors it.
        </Body>

        <Heading as="h3" className="text-base">Why this direction</Heading>
        <Body role="primary">
          Most design systems flatten meaning into pixels at the authoring step. A color becomes{" "}
          <code style={{ fontFamily: "var(--font-mono)" }}>#f87171</code>; the reason it exists —
          who reads it, where it appears, what it disambiguates — does not survive the export.
          Every downstream tool inherits that loss.
        </Body>
        <Body role="primary">
          Canonical preserves the meaning. Each token carries provenance —{" "}
          <code style={{ fontFamily: "var(--font-mono)" }}>role</code>,{" "}
          <code style={{ fontFamily: "var(--font-mono)" }}>evidence</code>,{" "}
          <code style={{ fontFamily: "var(--font-mono)" }}>applies_to</code>,{" "}
          <code style={{ fontFamily: "var(--font-mono)" }}>note</code>,{" "}
          <code style={{ fontFamily: "var(--font-mono)" }}>extrapolated</code>,{" "}
          <code style={{ fontFamily: "var(--font-mono)" }}>disambiguation</code> — so an LLM, a
          designer in Figma, a CLI renderer, or this docs page can each take what they need
          without privileging one consumer.
        </Body>
        <Body role="primary">
          Terminal-native types (<code style={{ fontFamily: "var(--font-mono)" }}>terminal.spacing</code>,{" "}
          <code style={{ fontFamily: "var(--font-mono)" }}>terminal.glyph</code>,{" "}
          <code style={{ fontFamily: "var(--font-mono)" }}>terminal.banner.*</code>) stay
          semantic in canonical and project out only at the boundary. Two spaces of indent
          means two spaces of indent — not 16 pixels.
        </Body>

        <Heading as="h3" className="text-base">The loop with Figma</Heading>
        <Body role="primary">
          Bidirectional. Canonical projects to DTCG; Tokens Studio imports it into Figma.
          Figma components connect back to React components via Code Connect, so the spec
          authored here in code shows up as the design source in the design tool. The code
          is the source; Figma is a mirror, not a fork.
        </Body>
      </div>

      <ApproachDiagram />

      <Body role="metadata">
        Code Connect wiring is a future phase. The components have stable named exports
        (the Code Connect requirement) so the work is non-blocking.
      </Body>
    </Section>
  );
}
