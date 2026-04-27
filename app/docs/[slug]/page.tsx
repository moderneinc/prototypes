import { notFound } from "next/navigation";
import { PageLayout } from "@/components/PageLayout";
import { listDocs, loadDoc } from "@/lib/markdown";
import { parseMarkdown } from "@/lib/parseMarkdown";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { Body } from "@/components/Body";

export function generateStaticParams() {
  return listDocs().map((d) => ({ slug: d.slug }));
}

export default async function DocPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let doc: ReturnType<typeof loadDoc>;
  try {
    doc = loadDoc(slug);
  } catch {
    notFound();
  }

  const blocks = parseMarkdown(doc.body);

  return (
    <PageLayout title={doc.title}>
      <Body role="metadata" className="mb-4">
        Source:{" "}
        <code style={{ fontFamily: "var(--font-mono)" }}>
          design-system/{slug}.md
        </code>
      </Body>
      <MarkdownRenderer blocks={blocks} collapsed={false} />
    </PageLayout>
  );
}
