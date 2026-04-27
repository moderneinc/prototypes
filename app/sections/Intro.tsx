/**
 * Intro — framing block at the top of the long-scroll page. Explains
 * what Construct is, what it isn't (no architectural or philosophical
 * changes), and shows the audit-and-codify process at a glance via
 * ProcessDiagram. Pulls operative language from intended-direction.md
 * ("explanatory density", "enterprise developer onboarding
 * intermittently", "time-to-understanding").
 */
import { Section } from "@/components/Section";
import { Heading } from "@/components/Heading";
import { Body } from "@/components/Body";
import { ProcessDiagram } from "@/components/ProcessDiagram";
import { DocLink } from "@/components/DocLink";
import { loadCanonical } from "@/lib/tokens";

const DOCS = [
  {
    slug: "reconciliation",
    file: "reconciliation.md",
    description: "Audit categories A–T and nineteen reconciliation decisions D-01–D-19.",
  },
  {
    slug: "gaps",
    file: "gaps.md",
    description: "Silences surfaced during the audit, not guessed.",
  },
  {
    slug: "rationale",
    file: "rationale.md",
    description: "Rationale behind every significant visual decision.",
  },
  {
    slug: "intended-direction",
    file: "intended-direction.md",
    description: "Design system scope, philosophy, and intended direction.",
  },
  {
    slug: "voice",
    file: "voice.md",
    description: "Editorial conventions, tone principles, and grammar rules.",
  },
];

export function Intro() {
  const meta = loadCanonical().$meta;
  return (
    <Section id="intro" className="!pt-4">
      <Heading as="h1" className="text-2xl">
        Intro
      </Heading>
      <Body role="primary" className="text-base">
        The Moderne CLI&rsquo;s existing visual system, codified. No changes to CLI output. Color and typographic hierarchy were introduced on the canvas layer only.
      </Body>
      <div className="space-y-3 pt-2">
        <Heading as="h2" className="text-lg">How we got here</Heading>
        <Body role="primary">
          Construct was built by extracting what Moderne CLI already ships. Two design
          artifacts were audited alongside the existing CLI in four passes, surfacing every
          color, glyph, banner, spacing rule, and grammar convention already in use.
        </Body>
        <Body role="primary">
          That audit produced a canonical token set. Twenty categories were reconciled into
          nineteen named decisions, with each token carrying its provenance: which artifact
          it came from, what evidence supports it, and how conflicts were resolved. Gaps were
          named, not filled. For example, no source artifact showed a CLI prompt, so no prompt
          pattern was invented. The result is a single semantic source that can be projected into Figma,
          the CLI runtime, docs, and any future consumer.
        </Body>
      </div>

      <ProcessDiagram />

      <div className="space-y-3 pt-2">
        <Heading as="h2" className="text-lg">Source documents</Heading>
        <div>
          {DOCS.map((doc, i) => (
            <DocLink
              key={doc.slug}
              href={`/docs/${doc.slug}`}
              style={{ display: "block", textDecoration: "none", color: "inherit" }}
            >
              <div
                style={{
                  padding: "0.75rem 0",
                  borderTop: i > 0 ? "1px solid var(--color-bg-panel)" : undefined,
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.2rem",
                  cursor: "pointer",
                }}
              >
                <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.8125rem", color: "var(--color-info)", fontWeight: 600 }}>
                  design-system/{doc.file}
                </code>
                <span style={{ fontSize: "0.8125rem", color: "var(--color-text-supporting)", lineHeight: 1.5 }}>
                  {doc.description}
                </span>
              </div>
            </DocLink>
          ))}
        </div>
      </div>

    </Section>
  );
}
