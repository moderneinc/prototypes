import { notFound } from "next/navigation";
import { PageLayout } from "@/components/PageLayout";
import { Heading } from "@/components/Heading";
import { Link } from "@/components/Link";
import { EXAMPLE_INDEX } from "@/lib/exampleSurfaces";

export function generateStaticParams() {
  return EXAMPLE_INDEX.map((e) => ({ slug: e.slug }));
}

export default async function ExamplePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const example = EXAMPLE_INDEX.find((e) => e.slug === slug);
  if (!example) notFound();
  return (
    <PageLayout title={example.title}>
      <div className="space-y-6">
        <header className="space-y-2">
          <Link href="/patterns">← Patterns</Link>
          <Heading as="h1" className="text-2xl">{example.title}</Heading>
        </header>
        {example.render()}
      </div>
    </PageLayout>
  );
}
