import { Section } from "@/components/Section";
import { Body } from "@/components/Body";
import { Card } from "@/components/Card";
import { loadCanonical, resolveColorHex, type GlyphToken } from "@/lib/tokens";

function GlyphRow({ name, token }: { name: string; token: GlyphToken }) {
  const hex = resolveColorHex(token.$value.color) ?? "#ffffff";
  return (
    <Card>
      <div className="flex items-start gap-4">
        <div className="flex w-24 flex-shrink-0 flex-col items-center gap-1">
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "2rem", color: hex, lineHeight: 1 }}>
            {token.$value.char}
          </span>
          <code style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-metadata)", fontSize: "0.75rem" }}>
            ASCII: {token.$value.asciiFallback}
          </code>
        </div>
        <div className="space-y-2">
          <div className="flex items-baseline gap-3">
            <code style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-primary)" }} className="font-bold">
              {name}
            </code>
            {token.extrapolated && (
              <span style={{ fontFamily: "var(--font-mono)", color: "var(--color-warning)", fontSize: "0.75rem" }}>
                extrapolated
              </span>
            )}
          </div>
          <dl className="grid grid-cols-[8rem_1fr] gap-x-4 gap-y-1 text-sm">
            <dt><Body role="supporting" as="span">char</Body></dt>
            <dd><code style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-body)" }}>{token.$value.char}</code></dd>
            <dt><Body role="supporting" as="span">asciiFallback</Body></dt>
            <dd><code style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-body)" }}>{token.$value.asciiFallback}</code></dd>
            <dt><Body role="supporting" as="span">role</Body></dt>
            <dd><code style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-body)" }}>{token.$value.role}</code></dd>
            <dt><Body role="supporting" as="span">color (default)</Body></dt>
            <dd><code style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-body)" }}>{token.$value.color}</code></dd>
          </dl>
          {token.color_description && <Body role="supporting"><strong>Color: </strong>{token.color_description}</Body>}
          {token.role && <Body role="primary">{token.role}</Body>}
          {token.disambiguation && (
            <Body role="supporting"><strong>Disambiguation: </strong>{token.disambiguation}</Body>
          )}
          {token.evidence && (
            <Body role="metadata" as="div">
              {token.evidence.map((e, i) => (
                <div key={i} style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}>· {e}</div>
              ))}
            </Body>
          )}
        </div>
      </div>
    </Card>
  );
}

export function TokensGlyphs() {
  const g = loadCanonical().glyph;
  const entries = Object.entries(g).filter(
    ([k, v]) => !k.startsWith("$") && typeof v === "object" && v !== null && (v as GlyphToken).$type === "terminal.glyph"
  ) as [string, GlyphToken][];
  return (
    <Section id="tokens-glyphs" title="Glyphs">
      {typeof g.$description === "string" && <Body role="supporting">{g.$description}</Body>}
      <Body role="metadata">
        Glyphs are stored as the terminal-native <code style={{ fontFamily: "var(--font-mono)" }}>terminal.glyph</code>{" "}
        type with <code style={{ fontFamily: "var(--font-mono)" }}>{`{char, asciiFallback, role, color}`}</code>.
        They flatten to a plain string only in the projected DTCG file.
      </Body>
      <div className="space-y-3">
        {entries.map(([k, v]) => (
          <GlyphRow key={k} name={`glyph.${k}`} token={v} />
        ))}
      </div>
    </Section>
  );
}
