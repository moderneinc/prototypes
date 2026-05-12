/**
 * Intro — what Construct is, one paragraph.
 */
import { Section } from "@/components/Section";
import { Heading } from "@/components/Heading";
import { Body } from "@/components/Body";

export function Intro() {
  return (
    <Section id="intro" className="!pt-4">
      <Heading as="h1" className="text-2xl">
        Intro
      </Heading>
      <Body role="primary" className="text-base">
        The Moderne CLI&rsquo;s existing visual system, codified. No changes to CLI output. Color and typographic hierarchy were introduced on the canvas layer only.
      </Body>
    </Section>
  );
}
