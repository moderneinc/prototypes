/**
 * Example surface composers — shared between the inline embeds in
 * /#examples and the standalone /examples/[slug] routes. Each surface is
 * built only from React components, with all values pulled from
 * canonical via the components themselves.
 *
 * Captions are rendered alongside each surface (see CliSurface) and name
 * the tokens / patterns the example exercises.
 */
import * as React from "react";
import { CliSurface } from "@/components/CliSurface";
import { Glyph } from "@/components/Glyph";
import { Banner } from "@/components/Banner";
import { TextField } from "@/components/TextField";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Heading } from "@/components/Heading";
import { Body } from "@/components/Body";
import { loadCanonical, resolveColorHex } from "@/lib/tokens";

/**
 * EXAMPLE_INDEX is the catalog the inline /#examples section and the
 * /examples landing page both consume. Keep titles + slugs in sync with
 * the standalone route folder names.
 */
export const EXAMPLE_INDEX: { slug: string; title: string; render: () => React.ReactElement }[] = [
  { slug: "error", title: "Error", render: () => <ErrorSurface /> },
  { slug: "onboarding", title: "Onboarding", render: () => <OnboardingSurface /> },
  { slug: "partial-success", title: "Partial success", render: () => <PartialSuccessSurface /> },
  { slug: "settings", title: "Settings panel", render: () => <SettingsSurface /> },
];

/* ------------------------------------------------------------------ */
/* Error — full template (Tier 1)                                     */
/* ------------------------------------------------------------------ */

/**
 * ErrorSurface — the full-template error pattern from
 * design-system/patterns/error.md. The `FAILURE:` preface uses
 * color.semantic.danger, mapped explicitly via that token's
 * applies_to[0] entry "FAILURE: preface (ERR-002)" — no interpretation.
 *
 * Voice: WHAT WENT WRONG body uses the declarative-past form per
 * voice.md ("No build tool found in /home/user/project."). Recovery
 * action verbs lead with concrete imperatives ("Add a build config…").
 */
export function ErrorSurface() {
  const dangerHex = resolveColorHex("color.semantic.danger") ?? "#f87171";
  const supportingHex = resolveColorHex("color.text.supporting") ?? "#94a3b8";
  const bodyHex = resolveColorHex("color.text.body") ?? "#e2e8f0";
  const metadataHex = resolveColorHex("color.text.metadata") ?? "#64748b";
  const infoHex = resolveColorHex("color.semantic.info") ?? "#67e8f9";

  return (
    <CliSurface
      caption={
        <>
          Tokens: <code>color.semantic.danger</code> (FAILURE: preface, ● bullets,{" "}
          <code>banner.close.failure</code>); <code>glyph.section_marker</code>,{" "}
          <code>glyph.hint_marker</code>, <code>glyph.actionable_bullet</code>;{" "}
          <code>typography.section_header</code> (uppercase, weight 700);{" "}
          <code>spacing.indent.section_content</code> (2 spaces);{" "}
          <code>spacing.vertical.around_close_banner</code>. Pattern:{" "}
          <code>error.md</code> Tier 1 — full template.
        </>
      }
    >
      <span style={{ color: dangerHex, fontWeight: 700 }}>FAILURE:</span>
      <span style={{ color: bodyHex }}> mod failed with an exception</span>
      {"\n\n"}
      <Glyph name="section_marker" colorOverride="color.semantic.danger" />
      <span style={{ color: bodyHex, fontWeight: 700 }}>{" "}WHAT WENT WRONG</span>
      {"\n  "}
      <span style={{ color: bodyHex }}>No build tool found in /home/user/project.</span>
      {"\n\n  "}
      <Glyph name="hint_marker" />
      <span style={{ color: bodyHex }}>{" "}Hint: Add a Maven, Gradle, or Bazel build config — mod looks for</span>
      {"\n    "}
      <span style={{ color: bodyHex }}>pom.xml, build.gradle(.kts), build.bazel, or setup.py at the root</span>
      {"\n    "}
      <span style={{ color: bodyHex }}>of the directory you point it at.</span>
      {"\n\n"}
      <Glyph name="section_marker" colorOverride="color.semantic.danger" />
      <span style={{ color: bodyHex, fontWeight: 700 }}>{" "}TRY</span>
      {"\n  "}
      <Glyph name="actionable_bullet" />
      <span style={{ color: bodyHex }}>{" "}Add a build config to the directory.</span>
      {"\n      "}
      <span style={{ color: infoHex }}>mod build /home/user/project --only-tool maven</span>
      {"\n  "}
      <Glyph name="actionable_bullet" />
      <span style={{ color: bodyHex }}>{" "}Point the CLI at a different directory that already has one.</span>
      {"\n      "}
      <span style={{ color: infoHex }}>mod build {"<path-to-built-project>"}</span>
      {"\n  "}
      <Glyph name="actionable_bullet" colorOverride="color.text.metadata" />
      {/* Demoted support line (D-10): glyph + body in metadata color when
          other concrete suggestions precede it. Voice rule from voice.md. */}
      <span style={{ color: metadataHex }}>{" "}Still stuck? Report to support@moderne.io</span>
      {"\n\n"}
      <Banner variant="failure" duration="2s" />
    </CliSurface>
  );
}

/* ------------------------------------------------------------------ */
/* Onboarding — first-run / top-level mod help                        */
/* ------------------------------------------------------------------ */

/**
 * OnboardingSurface — the onboarding ladder pattern from
 * design-system/patterns/onboarding-sequence.md, prefaced by the start
 * banner. Numbering is continuous across groups (1–9), step numbers
 * render in color.semantic.success per the canonical applies_to entry
 * "Numbered step indices (1–9) in onboarding ladder". Child connector
 * `└` pulls glyph.child_connector.
 *
 * Start banner stub: canonical.banner.start documents the rich form
 * ("UTF-8 box-drawing characters") and the asciiFallback ("@-art logo")
 * but contains no literal asset. The example renders a stylized
 * monospace stand-in, surfaced in the caption.
 */
export function OnboardingSurface() {
  const primaryHex = resolveColorHex("color.text.primary") ?? "#f8fafc";
  const successHex = resolveColorHex("color.semantic.success") ?? "#4ade80";
  const infoHex = resolveColorHex("color.semantic.info") ?? "#67e8f9";
  const bodyHex = resolveColorHex("color.text.body") ?? "#e2e8f0";
  const supportingHex = resolveColorHex("color.text.supporting") ?? "#94a3b8";

  const renderCommand = (cmd: string, placeholders: string[]): React.ReactNode => {
    if (placeholders.length === 0) return cmd;
    // Split on the first placeholder, recurse on the right tail.
    const [head, ...rest] = placeholders;
    const idx = cmd.indexOf(head);
    if (idx < 0) return renderCommand(cmd, rest);
    return (
      <>
        {cmd.slice(0, idx)}
        <span style={{ color: supportingHex }}>{head}</span>
        {renderCommand(cmd.slice(idx + head.length), rest)}
      </>
    );
  };

  const step = (n: number, cmd: string, desc: string, placeholders: string[] = []) => {
    const rendered = renderCommand(cmd, placeholders);
    return (
      <>
        {"  "}
        <span style={{ color: successHex, fontWeight: 700 }}>{n}.</span>{" "}
        <span style={{ color: infoHex }}>{rendered}</span>
        {"\n     "}
        <Glyph name="child_connector" />{" "}
        <span style={{ color: supportingHex }}>{desc}</span>
        {"\n"}
      </>
    );
  };

  return (
    <CliSurface
      caption={
        <>
          Tokens: <code>banner.start</code> (logo — stub, see assumptions);{" "}
          <code>typography.section_header</code> (group headers);{" "}
          <code>color.semantic.success</code> (step numbers 1–9, per applies_to);{" "}
          <code>color.semantic.info</code> (step commands);{" "}
          <code>color.text.supporting</code> (placeholders, child descriptions);{" "}
          <code>glyph.child_connector</code> (└). Pattern:{" "}
          <code>onboarding-sequence.md</code>.
        </>
      }
    >
      {/* Start-banner stub: the canonical banner.start carries shape
          guidance ("UTF-8 box-drawing characters", centered, no color)
          but no asset. Stylized stand-in, clearly marked in caption. */}
      <span style={{ color: primaryHex, fontWeight: 700 }}>
        {"   ╔═══════════════════════════╗\n"}
        {"   ║   "}<span style={{ color: infoHex }}>m o d e r n e</span>{"   ║\n"}
        {"   ║      "}<span style={{ color: supportingHex }}>v 4.2.0</span>{"      ║\n"}
        {"   ╚═══════════════════════════╝\n"}
      </span>
      {"\n"}
      <span style={{ color: primaryHex, fontWeight: 700 }}>GET STARTED</span>
      {"\n"}
      {step(1, "mod config moderne edit <tenant-url>", "Connect to your Moderne tenant.", ["<tenant-url>"])}
      {step(2, "mod config moderne login", "Authenticate with your account.")}
      {"\n"}
      <span style={{ color: primaryHex, fontWeight: 700 }}>CONFIGURE YOUR ENVIRONMENT</span>
      {"\n  "}
      <span style={{ color: supportingHex }}>Get these values from your platform team or admin:</span>
      {"\n\n"}
      {step(3, "mod config http trust-store edit", "SSL trust store for HTTPS connections.")}
      {step(4, "mod config recipes artifacts artifactory add", "Recipe artifact repository.")}
      {step(5, "mod config lsts artifacts artifactory add", "LST artifact repository.")}
      {step(6, "mod config build maven settings edit", "Maven settings file.")}
      {"\n"}
      <span style={{ color: primaryHex, fontWeight: 700 }}>RUN RECIPES</span>
      {"\n"}
      {step(7, "mod config recipes moderne sync", "Download recipes from Moderne.")}
      {step(8, "mod build .", "Build LSTs for your project.")}
      {step(9, "mod run . --recipe <recipe-name>", "Run a recipe.", ["<recipe-name>"])}
    </CliSurface>
  );
}

/* ------------------------------------------------------------------ */
/* Partial success                                                    */
/* ------------------------------------------------------------------ */

/**
 * PartialSuccessSurface — the partial-success pattern. Stress-tests the
 * yellow token across two distinct expressions on the same surface
 * (preface + close banner + warning glyph), with the inline command
 * reference in cyan.
 */
export function PartialSuccessSurface() {
  const warningHex = resolveColorHex("color.semantic.warning") ?? "#fbbf24";
  const bodyHex = resolveColorHex("color.text.body") ?? "#e2e8f0";
  const infoHex = resolveColorHex("color.semantic.info") ?? "#67e8f9";

  return (
    <CliSurface
      caption={
        <>
          Tokens: <code>color.semantic.warning</code> (PARTIAL SUCCESS preface,{" "}
          <code>banner.close.partial_success</code>, <code>glyph.warning_marker</code>);{" "}
          <code>color.semantic.info</code> (inline command); <code>typography.primary</code>{" "}
          (count + cause line, recovery prose); <code>spacing.indent.section_content</code>.
          Pattern: <code>partial-success.md</code>. Per D-03, yellow is one token across all
          six expressions; the phrase disambiguates.
        </>
      }
    >
      <span style={{ color: warningHex, fontWeight: 700 }}>PARTIAL SUCCESS:</span>
      {"\n\n  "}
      <Glyph name="warning_marker" />
      <span style={{ color: bodyHex }}>{" "}0 repositories searched — all 47 skipped (no search index).</span>
      {"\n\n  "}
      <span style={{ color: bodyHex }}>Run </span>
      <span style={{ color: infoHex }}>mod postbuild search index {"<path>"}</span>
      <span style={{ color: bodyHex }}> to build indexes from</span>
      {"\n  "}
      <span style={{ color: bodyHex }}>existing LSTs, then re-run this search.</span>
      {"\n\n"}
      <Banner variant="partial_success" duration="3s" />
    </CliSurface>
  );
}

/* ------------------------------------------------------------------ */
/* Settings panel — canvas analogue of `mod config`                   */
/* ------------------------------------------------------------------ */

export function SettingsSurface() {
  return (
    <Card>
      <div className="space-y-6">
        <div className="space-y-1">
          <Heading as="h3" className="text-sm">Configure your environment</Heading>
          <Body role="supporting">
            These values are read by every <code style={{ fontFamily: "var(--font-mono)" }}>mod</code> command.
          </Body>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <TextField id="tenant-url" label="Tenant URL" placeholder="https://your-org.moderne.io" defaultValue="https://example.moderne.io" />
          <TextField id="recipe-path" label="Recipe path" placeholder="/path/to/recipes" defaultValue="/Users/you/recipes" />
          <TextField id="auth-token" label="Auth token" type="password" placeholder="(set via mod config)" />
          <TextField id="default-branch" label="Default branch" defaultValue="main" />
        </div>

        <div className="flex items-center gap-3">
          <Button tone="primary">Save</Button>
          <Button tone="neutral">Cancel</Button>
          <Button tone="danger">Reset to defaults</Button>
        </div>
      </div>
    </Card>
  );
}

export function SettingsCaption() {
  return (
    <>
      Canvas analogue of <code>mod config</code>. Tokens via{" "}
      <code>Card</code>, <code>TextField</code>, <code>Button</code>:{" "}
      <code>color.bg.terminal</code> + <code>color.bg.panel</code> (surfaces),{" "}
      <code>color.semantic.info / .danger</code> (button tones),{" "}
      <code>color.text.body / .supporting</code>, <code>typography.monospace</code>.
    </>
  );
}

// Sanity-check that the component graph compiled — silences unused-import
// warnings in environments that strip JSX type-only imports.
void loadCanonical;
