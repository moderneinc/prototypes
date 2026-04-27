/**
 * Intro — short framing block at the top of the long-scroll page.
 * Pulls language from design-system/intended-direction.md ("explanatory
 * density", "enterprise developer onboarding intermittently",
 * "time-to-understanding").
 */
import { Section } from "@/components/Section";
import { Heading } from "@/components/Heading";
import { Body } from "@/components/Body";
import { loadCanonical } from "@/lib/tokens";

export function Intro() {
  const meta = loadCanonical().$meta;
  return (
    <Section id="intro" className="!pt-4">
      <Heading as="h1" className="text-2xl">
        Construct — visual playground
      </Heading>
      <Body role="primary" className="text-base">
        The visual layer of the Moderne CLI, codified. Tokens, patterns, voice, and example
        surfaces — all rendered from the canonical model in code.
      </Body>
      <Body role="supporting">
        Tuned for explanatory density: enterprise developers onboarding intermittently, where
        time-to-understanding wins over time-to-keystroke. Read this page top to bottom and
        you&apos;ll know what&apos;s in the system; jump via the rail to look up a specific
        token or pattern.
      </Body>
      <Body role="metadata">
        {meta.phase} · generated {meta.generated} · source{" "}
        <code style={{ fontFamily: "var(--font-mono)" }}>{meta.source}</code>
      </Body>
    </Section>
  );
}
