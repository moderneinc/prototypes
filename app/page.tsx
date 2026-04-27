import { Heading } from "@/components/Heading";
import { Body } from "@/components/Body";
import { Card } from "@/components/Card";
import { Link } from "@/components/Link";
import { loadCanonical } from "@/lib/tokens";

const SECTIONS: { href: string; title: string; description: string }[] = [
  { href: "/tokens/color", title: "Color", description: "Semantic palette: text, semantic (info/success/danger/warning), background, fallbacks." },
  { href: "/tokens/typography", title: "Typography", description: "Four roles — section_header, primary, supporting, metadata — plus the monospace stack." },
  { href: "/tokens/spacing", title: "Spacing", description: "Terminal-native spacing in spaces and blank lines, indent and section_gap contexts." },
  { href: "/tokens/glyphs", title: "Glyphs", description: "Sectionizers paired with semantic color: ●, ▶, ✓, ⚠, ?, !, └, $, ✗ — each with ASCII fallback." },
  { href: "/tokens/banners", title: "Banners", description: "Start banner (logo) and four close-banner variants: success, partial, success-with-warnings, failure." },
  { href: "/tokens/links", title: "Links", description: "OSC-8 transport, cyan color, terminal-honored underline policy, no bracket fallback." },
  { href: "/patterns", title: "Patterns", description: "Reconciled visual patterns: error, success, partial-success, help screens, progress, list, onboarding." },
  { href: "/voice", title: "Voice", description: "Editorial conventions for CLI surfaces — phrasing, casing, punctuation, what to omit." },
  { href: "/examples", title: "Examples", description: "One real example surface (settings panel). Future surfaces land here for Code Connect." },
];

export default function HomePage() {
  const canonical = loadCanonical();
  return (
    <main className="space-y-10">
      <header className="space-y-4">
        <Heading as="h1" className="text-2xl">
          Construct — visual playground
        </Heading>
        <Body role="primary">{canonical.$meta.summary}</Body>
        <Body role="supporting">
          {canonical.$meta.phase} · generated {canonical.$meta.generated} · source{" "}
          <code style={{ fontFamily: "var(--font-mono)" }}>{canonical.$meta.source}</code>
        </Body>
      </header>
      <section className="grid gap-4 sm:grid-cols-2">
        {SECTIONS.map((s) => (
          <Card key={s.href}>
            <div className="space-y-2">
              <Link href={s.href} className="font-bold uppercase tracking-[0.02em]">
                {s.title}
              </Link>
              <Body role="supporting">{s.description}</Body>
            </div>
          </Card>
        ))}
      </section>
      <section className="space-y-3">
        <Heading as="h2" className="text-lg">
          Read this
        </Heading>
        <Body role="supporting">
          The app reads <code style={{ fontFamily: "var(--font-mono)" }}>tokens/canonical.json</code>{" "}
          (not <code style={{ fontFamily: "var(--font-mono)" }}>dtcg.json</code>, not the authoring source).
          Token reference pages render values <em>as the thing they control</em> and surface
          provenance — role, evidence, applies_to — alongside.
        </Body>
        <Body role="supporting">
          To regenerate canonical and projections after editing{" "}
          <code style={{ fontFamily: "var(--font-mono)" }}>design-system/tokens.json</code>, run{" "}
          <code style={{ fontFamily: "var(--font-mono)" }}>npm run tokens:build</code>.
        </Body>
      </section>
    </main>
  );
}
