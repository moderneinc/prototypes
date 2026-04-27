import { PageLayout } from "@/components/PageLayout";
import { Heading } from "@/components/Heading";
import { Body } from "@/components/Body";
import { Card } from "@/components/Card";
import { Link } from "@/components/Link";
import { EXAMPLE_INDEX } from "@/lib/exampleSurfaces";

export default function ExamplesIndexPage() {
  return (
    <PageLayout title="Examples">
      <div className="space-y-6">
        <header className="space-y-2">
          <Link href="/patterns">← Patterns</Link>
          <Heading as="h1" className="text-2xl">Standalone examples</Heading>
          <Body role="supporting">
            Each example surface is also embedded inline on the patterns page. These standalone
            routes are useful for sharing a single surface or for Code Connect to point at.
          </Body>
        </header>
        <div className="grid gap-3 sm:grid-cols-2">
          {EXAMPLE_INDEX.map((ex) => (
            <Card key={ex.slug}>
              <div className="space-y-1">
                <Link href={`/examples/${ex.slug}`} className="font-bold">
                  {ex.title}
                </Link>
                <Body role="metadata">
                  <code style={{ fontFamily: "var(--font-mono)" }}>/examples/{ex.slug}</code>
                </Body>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
