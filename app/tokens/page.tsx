import { PageLayout } from "@/components/PageLayout";
import { Section } from "@/components/Section";
import { Body } from "@/components/Body";
import { TokensColor } from "@/app/sections/TokensColor";
import { TokensTypography } from "@/app/sections/TokensTypography";
import { TokensSpacing } from "@/app/sections/TokensSpacing";
import { TokensGlyphs } from "@/app/sections/TokensGlyphs";
import { TokensLinks } from "@/app/sections/TokensLinks";

const SUBSECTIONS = [
  { href: "#tokens-color", label: "Color" },
  { href: "#tokens-typography", label: "Typography" },
  { href: "#tokens-spacing", label: "Spacing" },
  { href: "#tokens-glyphs", label: "Glyphs" },
  { href: "#tokens-links", label: "Links" },
];

export default function TokensPage() {
  return (
    <PageLayout title="Tokens">
      <Section id="tokens" title="Tokens">
        <Body role="supporting">
          Six token groups. Each is rendered as the thing it controls — color swatches show the
          color, type specimens show the typography, glyphs show the actual character — with
          provenance (role, evidence, applies_to) surfaced alongside.
        </Body>

        {/* Sticky chips row — same structure as Patterns */}
        <div
          className="sticky top-0"
          style={{
            zIndex: 10,
            background: "var(--color-bg-page)",
            padding: "0.5rem 0",
            borderBottom: "1px solid var(--color-bg-panel)",
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
            {SUBSECTIONS.map((s) => (
              <a
                key={s.href}
                href={s.href}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.75rem",
                  border: "1px solid var(--color-bg-panel)",
                  padding: "0.125rem 0.5rem",
                  borderRadius: "0.25rem",
                  color: "var(--color-text-supporting)",
                  textDecoration: "none",
                }}
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>

        <TokensColor />
        <TokensTypography />
        <TokensSpacing />
        <TokensGlyphs />
        <TokensLinks />
      </Section>
    </PageLayout>
  );
}
