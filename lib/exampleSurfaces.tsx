/**
 * Example surface composers — shared between the inline embeds in
 * /#examples and the standalone /examples/[slug] routes. Each surface is
 * built only from React components, with all values pulled from
 * canonical via the components themselves.
 *
 * Each surface targets one (or, where the patterns inherently overlap,
 * two) of the patterns in design-system/patterns/. Captions name the
 * tokens and patterns exercised.
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
 * /examples landing page both consume. Order follows a CLI session arc:
 * discover (help screens) → run (progress) → outcome (success / partial /
 * error) → primitives (inline reference) → canvas analogue (settings).
 */
export const EXAMPLE_INDEX: { slug: string; title: string; render: () => React.ReactElement }[] = [
  { slug: "help-top-level", title: "Top-level help", render: () => <HelpTopLevelSurface /> },
  { slug: "help-subcommand", title: "Subcommand help", render: () => <HelpSubcommandSurface /> },
  { slug: "help-command", title: "Leaf-command help", render: () => <HelpCommandSurface /> },
  { slug: "list", title: "List / table", render: () => <ListSurface /> },
  { slug: "progress", title: "Progress", render: () => <ProgressSurface /> },
  { slug: "success", title: "Success", render: () => <SuccessSurface /> },
  { slug: "partial-success", title: "Partial success", render: () => <PartialSuccessSurface /> },
  { slug: "error", title: "Error", render: () => <ErrorSurface /> },
  { slug: "inline-reference", title: "Inline command reference", render: () => <InlineReferenceSurface /> },
  { slug: "settings", title: "Settings panel", render: () => <SettingsSurface /> },
];

/* ------------------------------------------------------------------ */
/* Shared helpers                                                     */
/* ------------------------------------------------------------------ */

/**
 * Render a command string with placeholder spans (anything in `<…>`) in
 * supporting / dim color, per inline-command-reference.md. The literal
 * head/body color is the caller's responsibility (cyan in most uses).
 */
function renderWithPlaceholders(cmd: string, placeholders: string[], placeholderHex: string): React.ReactNode {
  if (placeholders.length === 0) return cmd;
  const [head, ...rest] = placeholders;
  const idx = cmd.indexOf(head);
  if (idx < 0) return renderWithPlaceholders(cmd, rest, placeholderHex);
  return (
    <>
      {cmd.slice(0, idx)}
      <span style={{ color: placeholderHex }}>{head}</span>
      {renderWithPlaceholders(cmd.slice(idx + head.length), rest, placeholderHex)}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Top-level help (`mod` no-arg) — covers help-top-level + onboarding  */
/* ------------------------------------------------------------------ */

/**
 * HelpTopLevelSurface — the full `mod` no-argument screen from
 * design-system/patterns/help-top-level.md. The body of the screen is
 * also the canonical onboarding ladder (onboarding-sequence.md): both
 * patterns share this surface.
 *
 * Start banner stub: canonical.banner.start documents the shape ("UTF-8
 * box-drawing characters", centered, no color) and an asciiFallback
 * ("@-art logo") but contains no literal asset. The example renders a
 * stylized monospace stand-in, surfaced in the caption.
 */
export function HelpTopLevelSurface() {
  const primaryHex = resolveColorHex("color.text.primary") ?? "#f8fafc";
  const successHex = resolveColorHex("color.semantic.success") ?? "#4ade80";
  const infoHex = resolveColorHex("color.semantic.info") ?? "#67e8f9";
  const bodyHex = resolveColorHex("color.text.body") ?? "#e2e8f0";
  const supportingHex = resolveColorHex("color.text.supporting") ?? "#94a3b8";

  const renderCmd = (cmd: string, placeholders: string[] = []) =>
    renderWithPlaceholders(cmd, placeholders, supportingHex);

  const step = (n: number, cmd: string, desc: string, placeholders: string[] = []) => (
    <>
      {"  "}
      <span style={{ color: successHex, fontWeight: 700 }}>{n}.</span>{" "}
      <span style={{ color: infoHex }}>{renderCmd(cmd, placeholders)}</span>
      {"\n     "}
      <Glyph name="child_connector" />{" "}
      <span style={{ color: supportingHex }}>{desc}</span>
      {"\n"}
    </>
  );

  return (
    <CliSurface
      caption={
        <>
          Covers <code>help-top-level.md</code> and <code>onboarding-sequence.md</code>. Tokens:{" "}
          <code>banner.start</code> (logo — stub, no canonical asset);{" "}
          <code>typography.section_header</code> (group headers);{" "}
          <code>color.semantic.success</code> (continuous step numbers 1–9, per applies_to);{" "}
          <code>color.semantic.info</code> (commands, links);{" "}
          <code>color.text.supporting</code> (placeholders, child descriptions, FLAGS column);{" "}
          <code>glyph.child_connector</code> (└).
        </>
      }
    >
      {/* Start-banner stub — see caption. */}
      <span style={{ color: primaryHex, fontWeight: 700 }}>
        {"   ╔═══════════════════════════╗\n"}
        {"   ║   "}<span style={{ color: infoHex }}>m o d e r n e</span>{"   ║\n"}
        {"   ║      "}<span style={{ color: supportingHex }}>v 4.2.0</span>{"      ║\n"}
        {"   ╚═══════════════════════════╝\n"}
      </span>
      {"\n   "}
      <span style={{ color: bodyHex }}>Moderne CLI 4.2.0 — Run, study, and ship recipes.</span>
      {"\n\n"}
      <span style={{ color: primaryHex, fontWeight: 700 }}>USAGE</span>
      {"\n  "}
      <span style={{ color: bodyHex }}>mod </span>
      <span style={{ color: supportingHex }}>{"<command>"}</span>
      <span style={{ color: bodyHex }}>{" "}</span>
      <span style={{ color: supportingHex }}>{"[<subcommand>] [flags]"}</span>
      {"\n\n"}
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
      {"\n"}
      <span style={{ color: primaryHex, fontWeight: 700 }}>FLAGS</span>
      {"\n  "}
      <span style={{ color: bodyHex }}>-h, --help     </span>
      <span style={{ color: supportingHex }}>Display this help message.</span>
      {"\n  "}
      <span style={{ color: bodyHex }}>-v, --version  </span>
      <span style={{ color: supportingHex }}>Display version information.</span>
      {"\n\n"}
      <span style={{ color: primaryHex, fontWeight: 700 }}>LEARN MORE</span>
      {"\n  "}
      <span style={{ color: bodyHex }}>Run </span>
      <span style={{ color: infoHex }}>mod {"<command>"} -h</span>
      <span style={{ color: bodyHex }}> for help with a specific command.</span>
      {"\n  "}
      <span style={{ color: bodyHex }}>Docs: </span>
      <span style={{ color: infoHex }}>https://docs.moderne.io</span>
    </CliSurface>
  );
}

/* ------------------------------------------------------------------ */
/* Subcommand listing help (`mod config -h`)                          */
/* ------------------------------------------------------------------ */

export function HelpSubcommandSurface() {
  const primaryHex = resolveColorHex("color.text.primary") ?? "#f8fafc";
  const bodyHex = resolveColorHex("color.text.body") ?? "#e2e8f0";
  const infoHex = resolveColorHex("color.semantic.info") ?? "#67e8f9";
  const supportingHex = resolveColorHex("color.text.supporting") ?? "#94a3b8";

  // Two-space minimum separator; widest subcommand "moderne" is 7 chars,
  // so each row pads to 7 + 3 = 10 cols before the description.
  const row = (cmd: string, desc: string) => (
    <>
      {"  "}
      <span style={{ color: infoHex }}>{cmd.padEnd(10, " ")}</span>
      <span style={{ color: supportingHex }}>{desc}</span>
      {"\n"}
    </>
  );

  return (
    <CliSurface
      caption={
        <>
          Pattern: <code>help-subcommand.md</code>. Demonstrates triaged groups{" "}
          (<code>SETUP (required)</code> / <code>AUTO-CONFIGURED</code> / <code>OPTIONAL</code>) —{" "}
          user-role groupings, not alphabetical. Tokens: <code>typography.section_header</code>,{" "}
          <code>color.semantic.info</code> (subcommand column),{" "}
          <code>color.text.supporting</code> (descriptions, summary line).
        </>
      }
    >
      <span style={{ color: supportingHex }}>Configure how mod connects to Moderne, your repos, and your build tools.</span>
      {"\n\n"}
      <span style={{ color: primaryHex, fontWeight: 700 }}>USAGE</span>
      {"\n  "}
      <span style={{ color: bodyHex }}>mod config </span>
      <span style={{ color: supportingHex }}>{"<subcommand> [flags]"}</span>
      {"\n\n"}
      <span style={{ color: primaryHex, fontWeight: 700 }}>SETUP (required)</span>
      {"\n"}
      {row("moderne", "Connect to Moderne and authenticate.")}
      {row("http", "Configure SSL trust store for HTTPS.")}
      {row("recipes", "Configure where the CLI fetches recipes from.")}
      {row("lsts", "Configure where the CLI stores LSTs.")}
      {row("build", "Configure how the CLI invokes Maven and Gradle.")}
      {"\n"}
      <span style={{ color: primaryHex, fontWeight: 700 }}>AUTO-CONFIGURED</span>
      {"\n"}
      {row("cli", "CLI runtime defaults (usually fine as-is).")}
      {row("log", "Logging level and rotation.")}
      {"\n"}
      <span style={{ color: primaryHex, fontWeight: 700 }}>OPTIONAL</span>
      {"\n"}
      {row("user", "User-level identity (overrides per-repo defaults).")}
      {"\n"}
      <span style={{ color: primaryHex, fontWeight: 700 }}>LEARN MORE</span>
      {"\n  "}
      <span style={{ color: bodyHex }}>Run </span>
      <span style={{ color: infoHex }}>mod config {"<subcommand>"} -h</span>
      <span style={{ color: bodyHex }}> for details.</span>
      {"\n  "}
      <span style={{ color: bodyHex }}>Show all subcommands: </span>
      <span style={{ color: infoHex }}>mod config -h --all</span>
    </CliSurface>
  );
}

/* ------------------------------------------------------------------ */
/* Leaf-command help (`mod config http trust-store edit file -h`)     */
/* ------------------------------------------------------------------ */

export function HelpCommandSurface() {
  const primaryHex = resolveColorHex("color.text.primary") ?? "#f8fafc";
  const bodyHex = resolveColorHex("color.text.body") ?? "#e2e8f0";
  const infoHex = resolveColorHex("color.semantic.info") ?? "#67e8f9";
  const supportingHex = resolveColorHex("color.text.supporting") ?? "#94a3b8";
  const warningHex = resolveColorHex("color.semantic.warning") ?? "#fbbf24";

  return (
    <CliSurface
      caption={
        <>
          Pattern: <code>help-command.md</code>. Summary + consequence prose pair (the explanatory{" "}
          density promise). Tokens: <code>typography.supporting</code> (summary, consequence,{" "}
          flag descriptions); <code>glyph.hint_marker</code> + warning color (? Hint:);{" "}
          flag sub-grouping (<code>Authentication (pick one):</code>);{" "}
          <code>glyph.shell_prompt</code> (<code>$</code>) for EXAMPLES;{" "}
          <code>NEXT STEP</code> verify-line.
        </>
      }
    >
      <span style={{ color: supportingHex }}>Configure the SSL trust store mod uses for HTTPS connections.</span>
      {"\n\n"}
      <span style={{ color: supportingHex }}>
        Without it, commands fail with PKIX path building errors when{"\n"}
        connecting to your tenant or artifact repos.
      </span>
      {"\n\n"}
      <span style={{ color: primaryHex, fontWeight: 700 }}>USAGE</span>
      {"\n  "}
      <span style={{ color: bodyHex }}>mod config http trust-store edit file </span>
      <span style={{ color: supportingHex }}>{"<path>"}</span>
      <span style={{ color: bodyHex }}>{" "}</span>
      <span style={{ color: supportingHex }}>{"[flags]"}</span>
      {"\n\n  "}
      <Glyph name="hint_marker" />{" "}
      <span style={{ color: warningHex, fontWeight: 700 }}>Hint:</span>{" "}
      <span style={{ color: bodyHex }}>Common locations are /etc/ssl/certs/java/cacerts (Linux),</span>
      {"\n    "}
      <span style={{ color: bodyHex }}>/Library/Java/.../cacerts (macOS), or whatever your platform team</span>
      {"\n    "}
      <span style={{ color: bodyHex }}>distributes via MDM.</span>
      {"\n\n"}
      <span style={{ color: primaryHex, fontWeight: 700 }}>FLAGS</span>
      {"\n  "}
      <span style={{ color: bodyHex }}>--password </span>
      <span style={{ color: supportingHex }}>{"<password>"}</span>
      <span style={{ color: bodyHex }}>   </span>
      <span style={{ color: supportingHex }}>Trust store password. Often </span>
      <span style={{ color: bodyHex }}>changeit</span>
      <span style={{ color: supportingHex }}>.</span>
      {"\n\n  "}
      <span style={{ color: bodyHex }}>Authentication (pick one):</span>
      {"\n    "}
      <span style={{ color: bodyHex }}>--token </span>
      <span style={{ color: supportingHex }}>{"<token>"}</span>
      <span style={{ color: bodyHex }}>       </span>
      <span style={{ color: supportingHex }}>Use a CI-friendly token.</span>
      {"\n    "}
      <span style={{ color: bodyHex }}>--user </span>
      <span style={{ color: supportingHex }}>{"<user>"}</span>
      <span style={{ color: bodyHex }}>         </span>
      <span style={{ color: supportingHex }}>Use username + interactive password prompt.</span>
      {"\n\n"}
      <span style={{ color: primaryHex, fontWeight: 700 }}>EXAMPLES</span>
      {"\n  "}
      <Glyph name="shell_prompt" />{" "}
      <span style={{ color: infoHex }}>mod config http trust-store edit file /etc/pki/java/corp-truststore.jks \</span>
      {"\n      "}
      <span style={{ color: infoHex }}>--password ****</span>
      {"\n\n  "}
      <Glyph name="shell_prompt" />{" "}
      <span style={{ color: infoHex }}>mod config http trust-store edit file /Library/Java/.../cacerts \</span>
      {"\n      "}
      <span style={{ color: infoHex }}>--token ****</span>
      {"\n\n"}
      <span style={{ color: primaryHex, fontWeight: 700 }}>NEXT STEP</span>
      {"\n  "}
      <span style={{ color: supportingHex }}>Verify the trust store loaded:</span>
      {"\n    "}
      <span style={{ color: infoHex }}>mod config http trust-store show</span>
      {"\n\n"}
      <span style={{ color: primaryHex, fontWeight: 700 }}>LEARN MORE</span>
      {"\n  "}
      <span style={{ color: bodyHex }}>Docs: </span>
      <span style={{ color: infoHex }}>https://docs.moderne.io/cli/config/http</span>
    </CliSurface>
  );
}

/* ------------------------------------------------------------------ */
/* List / table                                                       */
/* ------------------------------------------------------------------ */

export function ListSurface() {
  const primaryHex = resolveColorHex("color.text.primary") ?? "#f8fafc";
  const bodyHex = resolveColorHex("color.text.body") ?? "#e2e8f0";
  const supportingHex = resolveColorHex("color.text.supporting") ?? "#94a3b8";
  const infoHex = resolveColorHex("color.semantic.info") ?? "#67e8f9";

  return (
    <CliSurface
      caption={
        <>
          Pattern: <code>list.md</code>. Renders the table form with mixed status glyphs and a{" "}
          trailing summary, plus the empty-state recovery shape. Tokens:{" "}
          <code>typography.section_header</code>; <code>glyph.success_marker</code>{" "}
          (<code>✓</code>), <code>glyph.warning_marker</code> (<code>⚠</code>),{" "}
          <code>glyph.diff_failure</code> (<code>✗</code>); column alignment via padding —{" "}
          no rules, no borders.
        </>
      }
    >
      <span style={{ color: primaryHex, fontWeight: 700 }}>REPOSITORIES</span>
      {"\n  "}
      <Glyph name="success_marker" />{"  "}
      <span style={{ color: bodyHex }}>org/service-a       main      built 2h ago</span>
      {"\n  "}
      <Glyph name="success_marker" />{"  "}
      <span style={{ color: bodyHex }}>org/service-b       main      built 4h ago</span>
      {"\n  "}
      <Glyph name="warning_marker" />{"  "}
      <span style={{ color: bodyHex }}>org/service-c       main      no LST</span>
      {"\n  "}
      <Glyph name="diff_failure" />{"  "}
      <span style={{ color: bodyHex }}>org/service-d       feature   build failed</span>
      {"\n\n  "}
      <span style={{ color: supportingHex }}>4 repositories — 2 ready, 1 missing LST, 1 failed build.</span>
      {"\n\n\n"}
      <span style={{ color: primaryHex, fontWeight: 700 }}>RECIPE ARTIFACT REPOSITORIES</span>
      {"\n  "}
      <span style={{ color: bodyHex }}>No repositories configured.</span>
      {"\n\n  "}
      <Glyph name="actionable_bullet" />{" "}
      <span style={{ color: bodyHex }}>Add a repository.</span>
      {"\n      "}
      <span style={{ color: infoHex }}>mod config recipes artifacts artifactory add {"<url>"}</span>
    </CliSurface>
  );
}

/* ------------------------------------------------------------------ */
/* Progress                                                           */
/* ------------------------------------------------------------------ */

export function ProgressSurface() {
  const bodyHex = resolveColorHex("color.text.body") ?? "#e2e8f0";
  const supportingHex = resolveColorHex("color.text.supporting") ?? "#94a3b8";

  return (
    <CliSurface
      caption={
        <>
          Pattern: <code>progress.md</code>. The action header (<code>● Running…</code>){" "}
          persists in scrollback; the transient sub-status and bar update in place and are{" "}
          replaced by a <code>✓</code> line at resolution. Tokens: <code>glyph.section_marker</code>{" "}
          (●, primary white); <code>typography.supporting</code> (sub-status, counter);{" "}
          <code>glyph.success_marker</code> (post-bar resolution).
        </>
      }
    >
      <Glyph name="section_marker" />{" "}
      <span style={{ color: bodyHex }}>Running recipe on 47 repositories</span>
      {"\n  "}
      <span style={{ color: supportingHex }}>Resolving dependencies for spring-boot ...</span>
      {"\n  "}
      <span style={{ color: bodyHex }}>{"[████████████████░░░░░░░░░░░░░░░░] "}</span>
      <span style={{ color: supportingHex }}>23/47 (49%)</span>
      {"\n\n  "}
      <span style={{ color: supportingHex }}>— after the bar resolves, scrollback shows: —</span>
      {"\n\n"}
      <Glyph name="section_marker" />{" "}
      <span style={{ color: bodyHex }}>Running recipe on 47 repositories</span>
      {"\n  "}
      <Glyph name="success_marker" />{" "}
      <span style={{ color: bodyHex }}>47 repositories processed</span>
    </CliSurface>
  );
}

/* ------------------------------------------------------------------ */
/* Success                                                            */
/* ------------------------------------------------------------------ */

export function SuccessSurface() {
  const bodyHex = resolveColorHex("color.text.body") ?? "#e2e8f0";
  const supportingHex = resolveColorHex("color.text.supporting") ?? "#94a3b8";
  const infoHex = resolveColorHex("color.semantic.info") ?? "#67e8f9";
  const primaryHex = resolveColorHex("color.text.primary") ?? "#f8fafc";

  // WHAT TO DO NEXT row: ▶ + cyan command, padded to a fixed column,
  // then em-dash + supporting gloss. Per success.md, em-dash sits at
  // column = widest_command + 3 spaces.
  const widest = "mod git commit --last-recipe-run".length;
  const nextRow = (cmd: string, gloss: string) => (
    <>
      {"  "}
      <Glyph name="actionable_bullet" />{" "}
      <span style={{ color: infoHex }}>{cmd.padEnd(widest, " ")}</span>{"  "}
      <span style={{ color: supportingHex }}>— {gloss}</span>
      {"\n"}
    </>
  );

  return (
    <CliSurface
      caption={
        <>
          Pattern: <code>success.md</code>. Action headers (<code>●</code>), sub-task summary{" "}
          rows (<code>✓</code> + count-led body), <code>WHAT TO DO NEXT</code> forward-chain{" "}
          (<code>▶</code> + cyan command + em-dash gloss, em-dash column aligned), and the{" "}
          <code>banner.close.success</code> close banner. Forward-chain commands are{" "}
          concrete (<code>--last-recipe-run</code>), not exploratory.
        </>
      }
    >
      <Glyph name="section_marker" />{" "}
      <span style={{ color: bodyHex }}>Loading recipe</span>
      {"\n"}
      <Glyph name="section_marker" />{" "}
      <span style={{ color: bodyHex }}>Running recipe on 47 repositories</span>
      {"\n"}
      <Glyph name="section_marker" />{" "}
      <span style={{ color: bodyHex }}>Writing data tables to /home/user/.moderne/cli/recipes</span>
      {"\n\n  "}
      <Glyph name="success_marker" />{" "}
      <span style={{ color: bodyHex }}>42 repositories modified</span>
      {"\n  "}
      <Glyph name="success_marker" />{" "}
      <span style={{ color: bodyHex }}>5 unchanged</span>
      {"\n\n"}
      <span style={{ color: primaryHex, fontWeight: 700 }}>WHAT TO DO NEXT</span>
      {"\n"}
      {nextRow("mod study --last-recipe-run", "View results by repo.")}
      {nextRow("mod git commit --last-recipe-run", "Commit changes across repos.")}
      {nextRow("mod git push --last-recipe-run", "Push to remotes.")}
      {"\n"}
      <Banner variant="success" duration="3m 24s" />
    </CliSurface>
  );
}

/* ------------------------------------------------------------------ */
/* Partial success                                                    */
/* ------------------------------------------------------------------ */

export function PartialSuccessSurface() {
  const warningHex = resolveColorHex("color.semantic.warning") ?? "#fbbf24";
  const bodyHex = resolveColorHex("color.text.body") ?? "#e2e8f0";
  const infoHex = resolveColorHex("color.semantic.info") ?? "#67e8f9";

  return (
    <CliSurface
      caption={
        <>
          Pattern: <code>partial-success.md</code>. Stress-tests yellow across multiple{" "}
          expressions (PARTIAL SUCCESS preface, <code>banner.close.partial_success</code>,{" "}
          <code>glyph.warning_marker</code>) on one surface. Per D-03, yellow is a single{" "}
          token; the phrase disambiguates the meaning per expression.
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
/* Error — full template (Tier 1)                                     */
/* ------------------------------------------------------------------ */

export function ErrorSurface() {
  const dangerHex = resolveColorHex("color.semantic.danger") ?? "#f87171";
  const bodyHex = resolveColorHex("color.text.body") ?? "#e2e8f0";
  const metadataHex = resolveColorHex("color.text.metadata") ?? "#64748b";
  const infoHex = resolveColorHex("color.semantic.info") ?? "#67e8f9";

  return (
    <CliSurface
      caption={
        <>
          Pattern: <code>error.md</code> Tier 1 (full template). Tokens:{" "}
          <code>color.semantic.danger</code> (FAILURE preface — direct mapping via{" "}
          applies_to[0], ● bullets, <code>banner.close.failure</code>);{" "}
          <code>glyph.section_marker</code>, <code>glyph.hint_marker</code>,{" "}
          <code>glyph.actionable_bullet</code>; demoted support line in{" "}
          <code>color.text.metadata</code> (D-10).
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
      <span style={{ color: metadataHex }}>{" "}Still stuck? Report to support@moderne.io</span>
      {"\n\n"}
      <Banner variant="failure" duration="2s" />
    </CliSurface>
  );
}

/* ------------------------------------------------------------------ */
/* Inline command reference                                           */
/* ------------------------------------------------------------------ */

export function InlineReferenceSurface() {
  const bodyHex = resolveColorHex("color.text.body") ?? "#e2e8f0";
  const infoHex = resolveColorHex("color.semantic.info") ?? "#67e8f9";
  const supportingHex = resolveColorHex("color.text.supporting") ?? "#94a3b8";

  const placeholderTail = (cmd: string, placeholders: string[]) =>
    renderWithPlaceholders(cmd, placeholders, supportingHex);

  return (
    <CliSurface
      caption={
        <>
          Pattern: <code>inline-command-reference.md</code>. The most pervasive primitive in{" "}
          the system — runnable references inside flowing prose render in cyan{" "}
          (<code>color.semantic.info</code>), placeholders drop to{" "}
          <code>color.text.supporting</code>. Cyan is the only emphasis: no bold, no backticks,{" "}
          no quotes (per D-12 retiring the old picocli bold-via-markup).
        </>
      }
    >
      <span style={{ color: bodyHex }}>Connect to your tenant with </span>
      <span style={{ color: infoHex }}>{placeholderTail("mod config moderne edit <tenant-url>", ["<tenant-url>"])}</span>
      <span style={{ color: bodyHex }}>,</span>
      {"\n"}
      <span style={{ color: bodyHex }}>then authenticate with </span>
      <span style={{ color: infoHex }}>mod config moderne login</span>
      <span style={{ color: bodyHex }}>.</span>
      {"\n\n"}
      <span style={{ color: bodyHex }}>The last run produced 0 data tables. The recipe may not emit tables, or</span>
      {"\n"}
      <span style={{ color: bodyHex }}>the run failed before any were written. Check </span>
      <span style={{ color: infoHex }}>/home/user/.moderne/cli/runs</span>
      {"\n"}
      <span style={{ color: bodyHex }}>for the run log.</span>
      {"\n\n"}
      <span style={{ color: bodyHex }}>Pass </span>
      <span style={{ color: infoHex }}>--last-recipe-run</span>
      <span style={{ color: bodyHex }}> to scope to your most recent run.</span>
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
