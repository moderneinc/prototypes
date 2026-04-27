import { Heading } from "@/components/Heading";
import { Body } from "@/components/Body";
import { Card } from "@/components/Card";
import { Link } from "@/components/Link";
import { listPatterns } from "@/lib/markdown";

export default function PatternsPage() {
  const patterns = listPatterns();
  return (
    <main className="space-y-8">
      <header className="space-y-2">
        <Link href="/">← Home</Link>
        <Heading as="h1" className="text-2xl">Patterns</Heading>
        <Body role="supporting">
          Reconciled visual patterns sourced from{" "}
          <code style={{ fontFamily: "var(--font-mono)" }}>design-system/patterns/</code>. Each
          one combines tokens into a complete CLI surface.
        </Body>
      </header>
      <section className="grid gap-3 sm:grid-cols-2">
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
      </section>
    </main>
  );
}
