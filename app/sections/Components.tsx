import { Section } from "@/components/Section";
import { Body } from "@/components/Body";
import { Card } from "@/components/Card";
import { Heading } from "@/components/Heading";
import { Banner, type BannerVariant } from "@/components/Banner";
import { loadCanonical, resolveColorHex } from "@/lib/tokens";

const ROW_SPECS = [
  {
    key: "section-header-row",
    description: "Section header with danger marker",
    glyph: { char: "●", colorPath: "color.semantic.danger" },
    text: { content: "WHAT WENT WRONG", style: "section-header" as const },
  },
  {
    key: "sub-task-summary",
    description: "Sub-task result with success marker",
    glyph: { char: "✓", colorPath: "color.semantic.success" },
    text: { content: "42 repositories modified", style: "primary" as const },
  },
  {
    key: "recovery-action",
    description: "Actionable suggestion",
    glyph: { char: "▶", colorPath: "color.semantic.info" },
    text: { content: "Add a build config to the directory.", style: "primary" as const },
  },
  {
    key: "inlined-command",
    description: "Command beneath a recovery action",
    glyph: { char: "▶", colorPath: "color.semantic.info" },
    text: { content: "mod build /home/user/project --only-tool maven", style: "inline-command" as const },
  },
  {
    key: "hint-row",
    description: "Surfaces ambiguity or anticipates a question",
    glyph: { char: "?", colorPath: "color.semantic.warning" },
    text: { content: "Hint: The recipe may not emit tables.", style: "primary" as const },
  },
  {
    key: "note-row",
    description: "Inline note with warning emphasis",
    glyph: { char: "!", colorPath: "color.semantic.warning" },
    text: { content: "Note: Needs read AND write access.", style: "primary" as const },
  },
  {
    key: "error-row",
    description: "Compact error — usage/parser tier",
    glyph: { char: "!", colorPath: "color.semantic.danger" },
    text: { content: "Error: Unknown command 'confg'.", style: "primary" as const },
  },
  {
    key: "warning-row",
    description: "Inline warning state with count",
    glyph: { char: "⚠", colorPath: "color.semantic.warning" },
    text: { content: "0 repositories searched — all 47 skipped (no search index).", style: "primary" as const },
  },
  {
    key: "empty-state-row",
    description: "No glyph, supporting color — empty state",
    glyph: null,
    text: { content: "No repositories configured.", style: "supporting" as const },
  },
  {
    key: "example-row",
    description: "Shell prompt + command in examples",
    glyph: { char: "$", colorPath: "color.text.metadata" },
    text: { content: "mod build /home/user/project", style: "inline-command" as const },
  },
];

const SECTION_SPECS = [
  { key: "USAGE", sample: "mod build [path] [--only-tool <tool>]" },
  { key: "WHAT WENT WRONG", marker: true, sample: "No build tool found in /home/user/project." },
  { key: "TRY", marker: true, sample: "▶ Add a build config to the directory." },
  { key: "WHAT TO DO NEXT", sample: "▶ mod study --last-recipe-run    — View results by repo." },
  { key: "FLAGS", sample: "--only-tool <tool>    Build tool to use." },
  { key: "EXAMPLES", sample: "$ mod build /home/user/project" },
  { key: "ARGUMENTS", sample: "[path]    Path to the project." },
  { key: "NEXT STEP", sample: "▶ mod build /home/user/project    — Index your code." },
  { key: "LEARN MORE", sample: "docs.moderne.io" },
];

const TEXT_COLORS: Record<string, string> = {
  "section-header": "var(--color-text-primary)",
  primary: "var(--color-text-body)",
  supporting: "var(--color-text-supporting)",
  "inline-command": "var(--color-info)",
};

const BANNER_VARIANTS: BannerVariant[] = ["success", "partial_success", "success_with_warnings", "failure"];

function RowPreview({ spec }: { spec: (typeof ROW_SPECS)[number] }) {
  const glyphHex = spec.glyph ? resolveColorHex(spec.glyph.colorPath) ?? "#fff" : undefined;
  const textColor = TEXT_COLORS[spec.text.style] ?? "var(--color-text-body)";
  const isBold = spec.text.style === "section-header";
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        gap: "0.5rem",
        fontFamily: "var(--font-mono)",
        fontSize: "0.875rem",
        padding: "0.5rem 1rem",
        background: "var(--color-bg-terminal)",
        borderRadius: "0.25rem",
      }}
    >
      {spec.glyph && (
        <span style={{ color: glyphHex, flexShrink: 0 }}>{spec.glyph.char}</span>
      )}
      <span style={{ color: textColor, fontWeight: isBold ? 700 : 400, letterSpacing: isBold ? "0.04em" : undefined }}>
        {spec.text.content}
      </span>
    </div>
  );
}

function SectionPreview({ spec }: { spec: (typeof SECTION_SPECS)[number] }) {
  const dangerHex = resolveColorHex("color.semantic.danger") ?? "#f87171";
  return (
    <div
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "0.8125rem",
        padding: "0.75rem 1rem",
        background: "var(--color-bg-terminal)",
        borderRadius: "0.25rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
        {spec.marker && <span style={{ color: dangerHex }}>●</span>}
        <span style={{ color: "var(--color-text-primary)", fontWeight: 700, letterSpacing: "0.04em" }}>
          {spec.key}
        </span>
      </div>
      <div style={{ color: "var(--color-text-body)", paddingLeft: "1rem" }}>{spec.sample}</div>
    </div>
  );
}

export function Components() {
  const canonical = loadCanonical();
  const b = canonical.banner;

  return (
    <Section id="components" title="Components">
      <Body role="supporting">
        Building blocks composed from tokens. Rows are single-line elements, sections are
        multi-line frames, and banners carry the outcome state of a CLI run.
      </Body>

      {/* Rows */}
      <div style={{ borderTop: "1px solid var(--color-bg-panel)", paddingTop: "2rem", marginTop: "1.5rem" }}>
        <Heading as="h3" className="text-base">Rows</Heading>
        <Body role="supporting">
          One glyph, one text style, one job. Each row is a single composed line used inside sections.
        </Body>
        <div className="space-y-2" style={{ marginTop: "0.75rem" }}>
          {ROW_SPECS.map((spec) => (
            <Card key={spec.key}>
              <div className="space-y-2">
                <div className="flex items-baseline gap-3">
                  <code style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-primary)", fontWeight: 700, fontSize: "0.8125rem" }}>
                    {spec.key}
                  </code>
                  <Body role="supporting" as="span">{spec.description}</Body>
                </div>
                <RowPreview spec={spec} />
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Sections */}
      <div style={{ borderTop: "1px solid var(--color-bg-panel)", paddingTop: "2rem", marginTop: "2rem" }}>
        <Heading as="h3" className="text-base">Sections</Heading>
        <Body role="supporting">
          Multi-line frames with a header and body. Designers fill them with rows. Sections with a
          danger marker use the <code style={{ fontFamily: "var(--font-mono)", color: "var(--color-info)" }}>●</code> glyph.
        </Body>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2" style={{ marginTop: "0.75rem" }}>
          {SECTION_SPECS.map((spec) => (
            <SectionPreview key={spec.key} spec={spec} />
          ))}
        </div>
      </div>

      {/* Banners */}
      <div style={{ borderTop: "1px solid var(--color-bg-panel)", paddingTop: "2rem", marginTop: "2rem" }}>
        <Heading as="h3" className="text-base">Banners</Heading>
        {b.$description && <Body role="supporting">{b.$description}</Body>}

        <div className="space-y-3" style={{ marginTop: "0.75rem" }}>
          <Heading as="h3" className="text-sm">Start banner</Heading>
          <Card>
            <dl className="grid grid-cols-[8rem_1fr] gap-x-4 gap-y-1 text-sm">
              <dt><Body role="supporting" as="span">rich</Body></dt>
              <dd><Body role="primary" as="span">{b.start.$value.rich}</Body></dd>
              <dt><Body role="supporting" as="span">asciiFallback</Body></dt>
              <dd><Body role="primary" as="span">{b.start.$value.asciiFallback}</Body></dd>
              <dt><Body role="supporting" as="span">shape</Body></dt>
              <dd><Body role="primary" as="span">{b.start.$value.shape}</Body></dd>
            </dl>
          </Card>
        </div>

        <div className="space-y-3" style={{ marginTop: "1rem" }}>
          <Heading as="h3" className="text-sm">Close banner variants</Heading>
          {BANNER_VARIANTS.map((v) => {
            const variant = b.close.variants[v];
            if (!variant) return null;
            return (
              <Card key={v}>
                <div className="space-y-3">
                  <code style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-primary)", fontWeight: 700, fontSize: "0.8125rem" }}>
                    banner.close.{v}
                  </code>
                  <Banner variant={v} duration="00:00:42" />
                  <dl className="grid grid-cols-[8rem_1fr] gap-x-4 gap-y-1 text-sm">
                    <dt><Body role="supporting" as="span">phrase</Body></dt>
                    <dd><code style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-body)" }}>{variant.$value.phrase}</code></dd>
                    <dt><Body role="supporting" as="span">color</Body></dt>
                    <dd><code style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-body)" }}>{variant.$value.color}</code></dd>
                  </dl>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
