import { Heading } from "@/components/Heading";
import { Body } from "@/components/Body";
import { Card } from "@/components/Card";
import { Link } from "@/components/Link";
import { loadCanonical, type SpacingToken, type SimpleSpacingValue, type CompoundSpacingValue } from "@/lib/tokens";

function isCompound(v: SimpleSpacingValue | CompoundSpacingValue): v is CompoundSpacingValue {
  return "above" in v;
}

function HorizontalDemo({ count }: { count: number }) {
  // Render the indent as the actual number of monospace spaces, with a leading
  // pipe so the user can see where the indent ends.
  const spaces = "\u00A0".repeat(count);
  return (
    <pre
      style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-body)" }}
      className="text-sm"
    >
      <span style={{ color: "var(--color-text-metadata)" }}>|</span>
      {spaces}
      <span style={{ color: "var(--color-text-supporting)" }}>content</span>
    </pre>
  );
}

function VerticalDemo({ above, below }: { above: number; below: number }) {
  return (
    <pre
      style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-body)" }}
      className="text-sm leading-tight"
    >
      <span style={{ color: "var(--color-text-supporting)" }}>previous content</span>
      {Array.from({ length: above }).map((_, i) => (
        <span key={`a${i}`}>{"\n"}</span>
      ))}
      {"\n"}
      <span>BANNER / NEXT</span>
      {Array.from({ length: below }).map((_, i) => (
        <span key={`b${i}`}>{"\n"}</span>
      ))}
    </pre>
  );
}

function SpacingRow({ name, token }: { name: string; token: SpacingToken }) {
  return (
    <Card>
      <div className="space-y-3">
        <div className="flex items-baseline gap-3">
          <code style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-primary)" }} className="font-bold">
            {name}
          </code>
          <code style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-supporting)" }}>
            {token.$source}
          </code>
        </div>
        {!isCompound(token.$value) ? (
          <>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
              <dt><Body role="supporting" as="span">count</Body></dt>
              <dd><code style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-body)" }}>{token.$value.count}</code></dd>
              <dt><Body role="supporting" as="span">unit</Body></dt>
              <dd><code style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-body)" }}>{token.$value.unit}</code></dd>
              <dt><Body role="supporting" as="span">axis</Body></dt>
              <dd><code style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-body)" }}>{token.$value.axis}</code></dd>
              <dt><Body role="supporting" as="span">context</Body></dt>
              <dd><code style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-body)" }}>{token.$value.context}</code></dd>
            </dl>
            {token.$value.axis === "horizontal" ? (
              <HorizontalDemo count={token.$value.count} />
            ) : (
              <VerticalDemo above={0} below={token.$value.count} />
            )}
          </>
        ) : (
          <>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
              <dt><Body role="supporting" as="span">above</Body></dt>
              <dd>
                <code style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-body)" }}>
                  {token.$value.above.count} {token.$value.above.unit}
                </code>
              </dd>
              <dt><Body role="supporting" as="span">below</Body></dt>
              <dd>
                <code style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-body)" }}>
                  {token.$value.below.count} {token.$value.below.unit}
                </code>
              </dd>
              <dt><Body role="supporting" as="span">axis</Body></dt>
              <dd><code style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-body)" }}>{token.$value.axis}</code></dd>
              <dt><Body role="supporting" as="span">context</Body></dt>
              <dd><code style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-body)" }}>{token.$value.context}</code></dd>
            </dl>
            <VerticalDemo above={token.$value.above.count} below={token.$value.below.count} />
          </>
        )}
        {token.role && <Body role="primary">{token.role}</Body>}
        {token.note && <Body role="supporting"><strong>Note: </strong>{token.note}</Body>}
        {token.evidence && (
          <Body role="metadata" as="div">
            {token.evidence.map((e, i) => (
              <div key={i} style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}>· {e}</div>
            ))}
          </Body>
        )}
      </div>
    </Card>
  );
}

export default function SpacingPage() {
  const s = loadCanonical().spacing;
  return (
    <main className="space-y-10">
      <header className="space-y-2">
        <Link href="/">← Home</Link>
        <Heading as="h1" className="text-2xl">Spacing</Heading>
        {s.$description && <Body role="supporting">{s.$description}</Body>}
        <Body role="metadata">
          Stored as terminal-native semantic types (count + unit). Projection to canvas pixels
          happens in <code style={{ fontFamily: "var(--font-mono)" }}>tokens/figma-map.json</code>.
        </Body>
      </header>
      <section className="space-y-3">
        <Heading as="h2" className="text-lg">Indent (horizontal)</Heading>
        {Object.entries(s.indent).map(([k, v]) => (
          <SpacingRow key={k} name={`spacing.indent.${k}`} token={v} />
        ))}
      </section>
      <section className="space-y-3">
        <Heading as="h2" className="text-lg">Vertical</Heading>
        {Object.entries(s.vertical).map(([k, v]) => (
          <SpacingRow key={k} name={`spacing.vertical.${k}`} token={v} />
        ))}
      </section>
    </main>
  );
}
