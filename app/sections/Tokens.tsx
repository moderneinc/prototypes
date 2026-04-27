/**
 * Tokens — wrapper section that introduces the six token sub-sections
 * but does not directly render them; the homepage composes the
 * sub-sections in order so each one gets its own scroll anchor.
 */
import { Section } from "@/components/Section";
import { Body } from "@/components/Body";

export function TokensIntro() {
  return (
    <Section id="tokens" title="Tokens">
      <Body role="supporting">
        Six token groups. Each is rendered as the thing it controls — color swatches show the
        color, type specimens show the typography, glyphs show the actual character — with
        provenance (role, evidence, applies_to) surfaced alongside.
      </Body>
    </Section>
  );
}
