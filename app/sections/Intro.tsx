/**
 * Intro — what Construct is.
 */
import { Section } from "@/components/Section";
import { Heading } from "@/components/Heading";
import { Body } from "@/components/Body";

export function Intro() {
  return (
    <Section id="intro" className="!pt-4">
      <Heading as="h1" className="text-2xl">
        Code is the source of truth. Figma is bidirectional. Anyone can contribute.
      </Heading>

      <div className="space-y-4 pt-2">
        <Body role="primary">
          Construct is a production-first design system built for humans and AI agents working
          together. The repository is the authority. Tokens represent semantic intent, not
          hardcoded visual values. Figma, the CLI, documentation, and runtime interfaces all
          read from the same canonical source.
        </Body>
        <Body role="primary">
          Changes flow in both directions. Figma mirrors production through a governed sync
          layer, while AI agents can read, generate, and propose updates through structured
          review workflows. Existing patterns are reused first. New patterns are introduced
          deliberately.
        </Body>
        <Body role="primary">
          Construct treats design systems as infrastructure rather than static libraries.
          Context survives every export, contribution, and implementation layer, preserving
          not just what something looks like, but what it means, where it belongs, and why
          it exists.
        </Body>
      </div>
    </Section>
  );
}
