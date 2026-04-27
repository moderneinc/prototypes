import { Heading } from "@/components/Heading";
import { Body } from "@/components/Body";
import { Card } from "@/components/Card";
import { Link } from "@/components/Link";
import { Banner, type BannerVariant } from "@/components/Banner";
import { loadCanonical } from "@/lib/tokens";

const VARIANTS: BannerVariant[] = ["success", "partial_success", "success_with_warnings", "failure"];

export default function BannersPage() {
  const b = loadCanonical().banner;
  return (
    <main className="space-y-10">
      <header className="space-y-2">
        <Link href="/">← Home</Link>
        <Heading as="h1" className="text-2xl">Banners</Heading>
        {b.$description && <Body role="supporting">{b.$description}</Body>}
      </header>

      <section className="space-y-3">
        <Heading as="h2" className="text-lg">Start banner</Heading>
        <Card>
          <dl className="grid grid-cols-[8rem_1fr] gap-x-4 gap-y-1 text-sm">
            <dt><Body role="supporting" as="span">rich</Body></dt>
            <dd><Body role="primary" as="span">{b.start.$value.rich}</Body></dd>
            <dt><Body role="supporting" as="span">asciiFallback</Body></dt>
            <dd><Body role="primary" as="span">{b.start.$value.asciiFallback}</Body></dd>
            <dt><Body role="supporting" as="span">shape</Body></dt>
            <dd><Body role="primary" as="span">{b.start.$value.shape}</Body></dd>
          </dl>
          {b.start.evidence && (
            <Body role="metadata" as="div" className="mt-3">
              {b.start.evidence.map((e, i) => (
                <div key={i} style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}>· {e}</div>
              ))}
            </Body>
          )}
        </Card>
      </section>

      <section className="space-y-3">
        <Heading as="h2" className="text-lg">Close banner — shape</Heading>
        <Card>
          <dl className="grid grid-cols-[10rem_1fr] gap-x-4 gap-y-1 text-sm">
            <dt><Body role="supporting" as="span">$shape</Body></dt>
            <dd><code style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-body)" }}>{b.close.$shape}</code></dd>
            <dt><Body role="supporting" as="span">weight</Body></dt>
            <dd><Body role="primary" as="span">{b.close.weight}</Body></dd>
            <dt><Body role="supporting" as="span">leadingBlankLine</Body></dt>
            <dd><Body role="primary" as="span">{b.close.leadingBlankLine}</Body></dd>
            <dt><Body role="supporting" as="span">noGlyph</Body></dt>
            <dd><Body role="primary" as="span">{String(b.close.noGlyph)}</Body></dd>
          </dl>
        </Card>
      </section>

      <section className="space-y-3">
        <Heading as="h2" className="text-lg">Close banner — variants</Heading>
        {VARIANTS.map((v) => {
          const variant = b.close.variants[v];
          if (!variant) return null;
          return (
            <Card key={v}>
              <div className="space-y-3">
                <code style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-primary)" }} className="font-bold">
                  banner.close.{v}
                </code>
                <Banner variant={v} duration="00:00:42" />
                <dl className="grid grid-cols-[8rem_1fr] gap-x-4 gap-y-1 text-sm">
                  <dt><Body role="supporting" as="span">phrase</Body></dt>
                  <dd><code style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-body)" }}>{variant.$value.phrase}</code></dd>
                  <dt><Body role="supporting" as="span">color</Body></dt>
                  <dd><code style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-body)" }}>{variant.$value.color}</code></dd>
                </dl>
                {variant.evidence && (
                  <Body role="metadata" as="div">
                    {variant.evidence.map((e, i) => (
                      <div key={i} style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}>· {e}</div>
                    ))}
                  </Body>
                )}
              </div>
            </Card>
          );
        })}
      </section>
    </main>
  );
}
