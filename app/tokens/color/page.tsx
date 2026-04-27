import { Heading } from "@/components/Heading";
import { Body } from "@/components/Body";
import { Card } from "@/components/Card";
import { Link } from "@/components/Link";
import { loadCanonical, type ColorToken } from "@/lib/tokens";

function ColorRow({ name, token }: { name: string; token: ColorToken }) {
  return (
    <Card>
      <div className="flex items-start gap-4">
        <div
          className="h-16 w-16 flex-shrink-0 rounded-md border"
          style={{ background: token.$value, borderColor: "var(--color-bg-panel)" }}
          aria-label={`swatch ${token.$value}`}
        />
        <div className="space-y-2">
          <div className="flex items-baseline gap-3">
            <code
              style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-primary)" }}
              className="font-bold"
            >
              {name}
            </code>
            <code style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-supporting)" }}>
              {token.$value}
            </code>
            {token.name && <Body role="supporting" as="span">({token.name})</Body>}
            {token.extrapolated && (
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  color: "var(--color-warning)",
                  fontSize: "0.75rem",
                }}
              >
                extrapolated
              </span>
            )}
          </div>
          {token.role && <Body role="primary">{token.role}</Body>}
          {token.applies_to && token.applies_to.length > 0 && (
            <div>
              <Body role="supporting" as="span">Applies to:</Body>
              <ul className="mt-1 list-disc pl-5">
                {token.applies_to.map((a, i) => (
                  <li key={i}>
                    <Body role="supporting" as="span">{a}</Body>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {token.disambiguation && (
            <Body role="supporting">
              <strong>Disambiguation: </strong>
              {token.disambiguation}
            </Body>
          )}
          {token.evidence && token.evidence.length > 0 && (
            <Body role="metadata" as="div">
              {token.evidence.map((e, i) => (
                <div key={i} style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}>
                  · {e}
                </div>
              ))}
            </Body>
          )}
        </div>
      </div>
    </Card>
  );
}

export default function ColorPage() {
  const c = loadCanonical().color;
  const groups: { key: "background" | "text" | "semantic"; label: string }[] = [
    { key: "background", label: "Background" },
    { key: "text", label: "Text" },
    { key: "semantic", label: "Semantic" },
  ];
  return (
    <main className="space-y-10">
      <header className="space-y-2">
        <Link href="/">← Home</Link>
        <Heading as="h1" className="text-2xl">Color</Heading>
        {c.$description && <Body role="supporting">{c.$description}</Body>}
      </header>

      {groups.map((g) => (
        <section key={g.key} className="space-y-3">
          <Heading as="h2" className="text-lg">{g.label}</Heading>
          <div className="space-y-3">
            {Object.entries(c[g.key])
              .filter(([k]) => !k.startsWith("$"))
              .map(([k, v]) => (
                <ColorRow key={k} name={`color.${g.key}.${k}`} token={v as ColorToken} />
              ))}
          </div>
        </section>
      ))}

      <section className="space-y-3">
        <Heading as="h2" className="text-lg">Fallback policy</Heading>
        {typeof c.fallback === "object" && (
          <Card>
            <dl className="space-y-3">
              {Object.entries(c.fallback)
                .filter(([k]) => !k.startsWith("$"))
                .map(([k, v]) => (
                  <div key={k}>
                    <dt>
                      <code style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-primary)" }}>
                        {k}
                      </code>
                    </dt>
                    <dd>
                      <Body role="supporting">{String(v)}</Body>
                    </dd>
                  </div>
                ))}
            </dl>
          </Card>
        )}
      </section>
    </main>
  );
}
