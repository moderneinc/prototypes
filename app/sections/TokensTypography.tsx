import { Section } from "@/components/Section";
import { Heading } from "@/components/Heading";
import { Body } from "@/components/Body";
import { Card } from "@/components/Card";
import { loadCanonical, type TypographyToken, type FontStackToken } from "@/lib/tokens";

const SAMPLE = "The terminal speaks in plain sentences.";

function TypeRow({ name, token }: { name: string; token: TypographyToken }) {
  const v = token.$value;
  const sample = v.case === "ALL CAPS" ? SAMPLE.toUpperCase() : SAMPLE;
  return (
    <Card>
      <div className="space-y-3">
        <div className="flex items-baseline gap-3">
          <code style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-primary)" }} className="font-bold">
            {name}
          </code>
        </div>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            color: "var(--color-text-body)",
            fontWeight: typeof v.weight === "number" ? v.weight : (v.weight === "regular" ? 400 : 700),
            letterSpacing: v.letterSpacing && v.letterSpacing.startsWith("0.02em") ? "0.02em" : undefined,
          }}
          className="text-base"
        >
          {sample}
        </div>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
          <dt><Body role="supporting" as="span">weight</Body></dt>
          <dd><code style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-body)" }}>{String(v.weight)}</code></dd>
          <dt><Body role="supporting" as="span">color</Body></dt>
          <dd><code style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-body)" }}>{v.color}</code></dd>
          {v.case && (
            <>
              <dt><Body role="supporting" as="span">case</Body></dt>
              <dd><code style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-body)" }}>{v.case}</code></dd>
            </>
          )}
          {v.letterSpacing && (
            <>
              <dt><Body role="supporting" as="span">letterSpacing</Body></dt>
              <dd><Body role="supporting" as="span">{v.letterSpacing}</Body></dd>
            </>
          )}
        </dl>
        {token.role && <Body role="primary">{token.role}</Body>}
        {token.applies_to && (
          <div>
            <Body role="supporting" as="span">Applies to:</Body>
            <ul className="mt-1 list-disc pl-5">
              {token.applies_to.map((a, i) => (
                <li key={i}><Body role="supporting" as="span">{a}</Body></li>
              ))}
            </ul>
          </div>
        )}
        {token.supersedes && (
          <Body role="supporting"><strong>Supersedes: </strong>{token.supersedes}</Body>
        )}
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

export function TokensTypography() {
  const t = loadCanonical().typography;
  const roles: { key: "section_header" | "primary" | "supporting" | "metadata"; label: string }[] = [
    { key: "section_header", label: "section_header" },
    { key: "primary", label: "primary" },
    { key: "supporting", label: "supporting" },
    { key: "metadata", label: "metadata" },
  ];
  const mono = t.monospace as FontStackToken;
  return (
    <Section id="tokens-typography" title="Typography">
      {t.$description && <Body role="supporting">{t.$description}</Body>}
      <div className="space-y-3">
        {roles.map((r) => (
          <TypeRow key={r.key} name={`typography.${r.key}`} token={t[r.key]} />
        ))}
      </div>
      <div className="space-y-3">
        <Heading as="h3" className="text-base">Monospace stack</Heading>
        <Card>
          <code style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-body)" }}>
            {mono.$value.join(", ")}
          </code>
          {mono.$description && <Body role="supporting" className="mt-2">{mono.$description}</Body>}
        </Card>
      </div>
    </Section>
  );
}
