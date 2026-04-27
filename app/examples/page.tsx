import { SideNav } from "@/components/SideNav";
import { Heading } from "@/components/Heading";
import { Body } from "@/components/Body";
import { Card } from "@/components/Card";
import { Link } from "@/components/Link";
import { EXAMPLE_INDEX } from "@/lib/exampleSurfaces";

export default function ExamplesIndexPage() {
  return (
    <>
      <SideNav homeBase={false} />
      <main className="md:ml-56">
        <div className="mx-auto max-w-3xl space-y-6 px-6 py-6 md:py-10">
          <header className="space-y-2">
            <Link href="/#examples">← Examples on home</Link>
            <Heading as="h1" className="text-2xl">Standalone examples</Heading>
            <Body role="supporting">
              Each example surface is also embedded inline on the home page. These standalone
              routes are useful for sharing a single surface or for Code Connect to point at.
            </Body>
          </header>
          <div className="grid gap-3 sm:grid-cols-2">
            {EXAMPLE_INDEX.map((ex) => (
              <Card key={ex.slug}>
                <div className="space-y-1">
                  <Link href={`/examples/${ex.slug}`} className="font-bold uppercase tracking-[0.02em]">
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
      </main>
    </>
  );
}
