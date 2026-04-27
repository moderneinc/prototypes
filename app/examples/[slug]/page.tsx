import { notFound } from "next/navigation";
import { SideNav } from "@/components/SideNav";
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
    <>
      <SideNav homeBase={false} />
      <main className="md:ml-56">
        <div className="mx-auto max-w-3xl space-y-6 px-6 py-6 md:py-10">
          <header className="space-y-2">
            <Link href="/#examples">← Examples on home</Link>
            <Heading as="h1" className="text-2xl">{example.title}</Heading>
          </header>
          {example.render()}
        </div>
      </main>
    </>
  );
}
