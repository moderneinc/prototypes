import { Section } from "@/components/Section";
import { Heading } from "@/components/Heading";
import { Body } from "@/components/Body";
import { Card } from "@/components/Card";
import { Banner, type BannerVariant } from "@/components/Banner";
import { loadCanonical } from "@/lib/tokens";

const VARIANTS: BannerVariant[] = ["success", "partial_success", "success_with_warnings", "failure"];

export function TokensBanners() {
  const b = loadCanonical().banner;
  return (
    <Section id="tokens-banners" title="Banners">
      {b.$description && <Body role="supporting">{b.$description}</Body>}
      <div className="space-y-3">
        <Heading as="h3" className="text-base">Start banner</Heading>
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
      </div>
      <div className="space-y-3">
        <Heading as="h3" className="text-base">Close banner — shape</Heading>
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
      </div>
      <div className="space-y-3">
        <Heading as="h3" className="text-base">Close banner — variants</Heading>
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
      </div>
    </Section>
  );
}
