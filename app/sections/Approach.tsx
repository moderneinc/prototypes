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
