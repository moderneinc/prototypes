import { Section } from "@/components/Section";
import { Body } from "@/components/Body";
import { Card } from "@/components/Card";
import { Link } from "@/components/Link";
import { listPatterns } from "@/lib/markdown";

export function Patterns() {
  const patterns = listPatterns();
  return (
    <Section id="patterns" title="Patterns">
      <Body role="supporting">
        Reconciled visual patterns — each composes tokens into a complete CLI surface. Click
        any pattern to read its full source markdown.
      </Body>
      <div className="grid gap-3 sm:grid-cols-2">
        {patterns.map((p) => (
          <Card key={p.slug}>
            <div className="space-y-1">
              <Link href={`/patterns/${p.slug}`} className="font-bold uppercase tracking-[0.02em]">
                {p.title}
              </Link>
              <Body role="metadata">
                <code style={{ fontFamily: "var(--font-mono)" }}>{p.slug}.md</code>
              </Body>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}
