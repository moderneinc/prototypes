import { notFound } from "next/navigation";
import { PageLayout } from "@/components/PageLayout";
import { Heading } from "@/components/Heading";
import { Body } from "@/components/Body";
import { Card } from "@/components/Card";
import { Link } from "@/components/Link";
import { listPatterns, loadPattern } from "@/lib/markdown";

export function generateStaticParams() {
  return listPatterns().map((p) => ({ slug: p.slug }));
}

export default async function PatternPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let pattern;
  try {
    pattern = loadPattern(slug);
  } catch {
    notFound();
  }
  if (!pattern) notFound();
  return (
    <PageLayout title={pattern.title}>
      <div className="space-y-6">
        <header className="space-y-2">
          <Link href="/patterns">← Patterns</Link>
          <Heading as="h1" className="text-2xl">{pattern.title}</Heading>
          <Body role="metadata">
            Source: <code style={{ fontFamily: "var(--font-mono)" }}>design-system/patterns/{pattern.slug}.md</code>
          </Body>
        </header>
        <Card>
          {/*
           * Pattern markdown is rendered verbatim in monospace, preserving
           * whitespace. The patterns are tightly authored ASCII renderings
           * of CLI surfaces — losing the leading spaces would lose the
           * visual itself. No markdown parser is used.
           */}
          <pre
            style={{
              fontFamily: "var(--font-mono)",
              color: "var(--color-text-body)",
              whiteSpace: "pre-wrap",
              fontSize: "0.875rem",
              lineHeight: 1.6,
            }}
          >
            {pattern.body}
          </pre>
        </Card>
      </div>
    </PageLayout>
  );
}
