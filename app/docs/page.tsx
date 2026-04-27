import { PageLayout } from "@/components/PageLayout";
import { Section } from "@/components/Section";
import { Body } from "@/components/Body";
import { DocLink } from "@/components/DocLink";

const DOCS = [
  {
    slug: "reconciliation",
    file: "reconciliation.md",
    description: "Audit categories A–T and nineteen reconciliation decisions D-01–D-19. The evidence and rationale behind each token.",
  },
  {
    slug: "gaps",
    file: "gaps.md",
    description: "Silences surfaced during the audit, not guessed. Where the artifacts were absent, the gap is named.",
  },
  {
    slug: "rationale",
    file: "rationale.md",
    description: "Rationale behind every significant visual decision made during the audit and reconciliation phases.",
  },
  {
    slug: "intended-direction",
    file: "intended-direction.md",
    description: "Design system scope, philosophy, and intended direction. The brief that shaped what Construct is and is not.",
  },
  {
    slug: "voice",
    file: "voice.md",
    description: "Editorial conventions, tone principles, and grammar rules for all CLI-facing copy.",
  },
];

export default function DocsPage() {
  return (
    <PageLayout title="Docs">
      <Section id="docs" title="Docs">
        <Body role="supporting">
          Source documents behind the design system. Click any file to open it inline.
        </Body>

        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {DOCS.map((doc, i) => (
            <DocLink
              key={doc.slug}
              href={`/docs/${doc.slug}`}
              style={{ display: "block", textDecoration: "none", color: "inherit" }}
            >
              <div
                style={{
                  padding: "1rem 0",
                  borderTop: i > 0 ? "1px solid var(--color-bg-panel)" : undefined,
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.25rem",
                  cursor: "pointer",
                }}
              >
                <code
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.875rem",
                    color: "var(--color-info)",
                    fontWeight: 600,
                  }}
                >
                  design-system/{doc.file}
                </code>
                <span
                  style={{
                    fontSize: "0.8125rem",
                    color: "var(--color-text-supporting)",
                    lineHeight: 1.5,
                  }}
                >
                  {doc.description}
                </span>
              </div>
            </DocLink>
          ))}
        </div>
      </Section>
    </PageLayout>
  );
}
