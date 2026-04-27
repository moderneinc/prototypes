import { Section } from "@/components/Section";
import { Body } from "@/components/Body";
import { PatternCard } from "@/components/PatternCard";
import { listPatterns } from "@/lib/markdown";
import { EXAMPLE_INDEX } from "@/lib/exampleSurfaces";

// Map pattern slug → example slug. Some patterns share an example.
const PATTERN_TO_EXAMPLE: Record<string, string> = {
  error: "error",
  "help-command": "help-command",
  "help-subcommand": "help-subcommand",
  "help-top-level": "help-top-level",
  "inline-command-reference": "inline-reference",
  list: "list",
  "onboarding-sequence": "help-top-level",
  "partial-success": "partial-success",
  progress: "progress",
  success: "success",
};

function stripPatternPrefix(title: string): string {
  // Strip "Pattern — " or "Pattern —" prefix (with or without trailing space)
  let t = title.replace(/^Pattern\s*—\s*/, "");
  // Strip backtick-wrapped parens like (`mod`)
  t = t.replace(/\s*\(`[^`]*`\)\s*/g, "");
  return t.trim();
}

export function Patterns() {
  const patterns = listPatterns();

  return (
    <Section id="patterns" title="Patterns">
      <Body role="supporting">
        Reconciled visual patterns, each composed from canonical tokens and shown alongside its live example surface.
      </Body>

      {/* Sticky chips row */}
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
          {patterns.map((p) => (
            <a
              key={p.slug}
              href={"#pattern-" + p.slug}
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
              {stripPatternPrefix(p.title)}
            </a>
          ))}
          <a
            href="#pattern-settings"
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
            Settings panel
          </a>
        </div>
      </div>

      {/* Pattern cards */}
      <div>
        {patterns.map((p, i) => {
          const exampleSlug = PATTERN_TO_EXAMPLE[p.slug];
          const example = EXAMPLE_INDEX.find((e) => e.slug === exampleSlug);
          const exampleNote =
            p.slug === "onboarding-sequence"
              ? "Example above also covers: onboarding-sequence.md"
              : undefined;

          return (
            <div
              key={p.slug}
              style={i > 0 ? { borderTop: "1px solid var(--color-bg-panel)", paddingTop: "2.5rem", marginTop: "2.5rem" } : undefined}
            >
              <PatternCard
                slug={p.slug}
                title={stripPatternPrefix(p.title)}
                body={p.body}
                exampleNote={exampleNote}
              >
                {example ? example.render() : null}
              </PatternCard>
            </div>
          );
        })}

        {/* Settings card */}
        <div style={{ borderTop: "1px solid var(--color-bg-panel)", paddingTop: "2.5rem", marginTop: "2.5rem" }}>
          <PatternCard slug="settings" title="Settings panel" body="">
            {EXAMPLE_INDEX.find((e) => e.slug === "settings")?.render() ?? null}
          </PatternCard>
        </div>
      </div>
    </Section>
  );
}
