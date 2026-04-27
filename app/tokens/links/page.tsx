import { Heading } from "@/components/Heading";
import { Body } from "@/components/Body";
import { Card } from "@/components/Card";
import { Link } from "@/components/Link";
import { loadCanonical } from "@/lib/tokens";

export default function LinksPage() {
  const l = loadCanonical().link;
  return (
    <main className="space-y-10">
      <header className="space-y-2">
        <Link href="/">← Home</Link>
        <Heading as="h1" className="text-2xl">Links</Heading>
        {l.$description && <Body role="supporting">{l.$description}</Body>}
      </header>
      <section className="space-y-3">
        <Heading as="h2" className="text-lg">Policy</Heading>
        <Card>
          <dl className="grid grid-cols-[10rem_1fr] gap-x-4 gap-y-2 text-sm">
            <dt><Body role="supporting" as="span">transport</Body></dt>
            <dd><Body role="primary" as="span">{l.$value.transport}</Body></dd>
            <dt><Body role="supporting" as="span">color</Body></dt>
            <dd><code style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-body)" }}>{l.$value.color}</code></dd>
            <dt><Body role="supporting" as="span">underlinePolicy</Body></dt>
            <dd><Body role="primary" as="span">{l.$value.underlinePolicy}</Body></dd>
            <dt><Body role="supporting" as="span">fallback</Body></dt>
            <dd><Body role="primary" as="span">{l.$value.fallback}</Body></dd>
          </dl>
        </Card>
      </section>
      <section className="space-y-3">
        <Heading as="h2" className="text-lg">Linkable targets</Heading>
        <Card>
          <dl className="grid grid-cols-[14rem_1fr] gap-x-4 gap-y-1 text-sm">
            {Object.entries(l.$value.linkableTargets).map(([k, v]) => (
              <div key={k} className="contents">
                <dt>
                  <code style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-primary)" }}>{k}</code>
                </dt>
                <dd>
                  <Body role="primary" as="span">{v}</Body>
                </dd>
              </div>
            ))}
          </dl>
        </Card>
      </section>
      <section className="space-y-3">
        <Heading as="h2" className="text-lg">Sample</Heading>
        <Card>
          <p style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-body)" }}>
            See logs at <Link href="#log">/var/log/mod.log</Link> or contact{" "}
            <Link href="mailto:support@moderne.io">support@moderne.io</Link>.
          </p>
        </Card>
        {l.evidence && (
          <Body role="metadata" as="div">
            {l.evidence.map((e, i) => (
              <div key={i} style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}>· {e}</div>
            ))}
          </Body>
        )}
      </section>
    </main>
  );
}
