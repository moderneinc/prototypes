import { Section } from "@/components/Section";
import { Body } from "@/components/Body";
import { CliSurface } from "@/components/CliSurface";
import { Glyph } from "@/components/Glyph";
import { DocLink } from "@/components/DocLink";
import { resolveColorHex } from "@/lib/tokens";

/**
 * Voice — rendered as a CLI-native surface that demonstrates the voice
 * principles using the system's own visual language. Section headers in
 * ALL CAPS bold; ✓ examples use glyph.success_marker (green); ✗ examples
 * use glyph.diff_failure (red); inline command/flag references in cyan.
 *
 * voice.md remains the source of truth — surfaced via the metadata link
 * at the top of the section. The full document covers more (grammar
 * conventions per surface, phrasing rules, what voice is *not*); this
 * surface presents the load-bearing principles in their own idiom.
 */
export function Voice() {
  const primaryHex = resolveColorHex("color.text.primary") ?? "#f8fafc";
  const bodyHex = resolveColorHex("color.text.body") ?? "#e2e8f0";
  const supportingHex = resolveColorHex("color.text.supporting") ?? "#94a3b8";
  const infoHex = resolveColorHex("color.semantic.info") ?? "#67e8f9";

  const principle = (
    n: number,
    name: string,
    rule: string,
    yes: React.ReactNode,
    no: React.ReactNode
  ) => (
    <>
      <span style={{ color: primaryHex, fontWeight: 700 }}>{`${n}. ${name}`}</span>
      {"\n  "}
      <span style={{ color: supportingHex }}>{rule}</span>
      {"\n\n  "}
      <Glyph name="success_marker" />{" "}
      <span style={{ color: bodyHex }}>{yes}</span>
      {"\n  "}
      <Glyph name="diff_failure" />{" "}
      <span style={{ color: supportingHex }}>{no}</span>
      {"\n\n"}
    </>
  );

  // Grammar conventions — rendered as the list-pattern table form
  // (column alignment by padding, no rules / no borders, per list.md).
  // Widest surface label fits in 22 chars.
  const grammarRow = (surface: string, form: string, example: React.ReactNode) => (
    <>
      {"  "}
      <span style={{ color: bodyHex }}>{surface.padEnd(22, " ")}</span>
      <span style={{ color: supportingHex }}>{form.padEnd(38, " ")}</span>
      {example}
      {"\n"}
    </>
  );

  return (
    <Section id="voice" title="Voice">
      <Body role="primary">
        The original CLI had an implicit voice. Design named it, then added grammar conventions grounded in
        that baseline plus common CLI and UX principles.
      </Body>
      <Body role="metadata">
        Source:{" "}
        <DocLink href="/docs/voice" style={{ color: "var(--color-info)", fontFamily: "var(--font-mono)" }}>
          design-system/voice.md
        </DocLink>{" "}
        — includes full grammar conventions, phrasing rules, provenance, and what voice is <em>not</em>.
      </Body>

      <CliSurface
        caption={
          <>
            Six tone principles, rendered using their own idiom: ✓/✗ pairs use{" "}
            <code>glyph.success_marker</code> + <code>glyph.diff_failure</code>;{" "}
            the don&rsquo;t side drops to <code>color.text.supporting</code> to recede.
          </>
        }
      >
        <span style={{ color: primaryHex, fontWeight: 700 }}>TONE PRINCIPLES</span>
        {"\n\n"}
        {principle(
          1,
          "DIRECT, SECOND-PERSON",
          "Address the user. Imperative does most of the work.",
          "Connect to your Moderne tenant.",
          "This command configures the location used by the CLI for storing LSTs."
        )}
        {principle(
          2,
          "ACTION-ORIENTED IMPERATIVES",
          "Lead with the verb the user would take.",
          "Add a build config.",
          "Recipe execution can be triggered by …"
        )}
        {principle(
          3,
          "CONCRETE OVER ABSTRACT",
          "Name the thing — file names, defaults, real values.",
          <>
            mod looks for <span style={{ color: infoHex }}>pom.xml</span>,{" "}
            <span style={{ color: infoHex }}>build.gradle(.kts)</span>,{" "}
            <span style={{ color: infoHex }}>build.bazel</span>, …
          </>,
          "a supported build tool"
        )}
        {principle(
          4,
          "NO BLAME; NAME AMBIGUITY",
          "When the CLI can't tell causes apart, list them. Never imply user error unless certain.",
          "The recipe may not emit tables, or the run failed before any were written.",
          "You forgot to run mod build first."
        )}
        {principle(
          5,
          "LOWER JARGON, HIGHER NAMED-THING DENSITY",
          "Shrink jargon. Inflate concrete named things.",
          <>
            Without it, commands fail with{" "}
            <span style={{ color: infoHex }}>PKIX path building errors</span>.
          </>,
          "Without it, certain network operations may not function correctly."
        )}
        {principle(
          6,
          "SHORTER LINES, DENSER SCREENS",
          "Net more content per surface, fewer wasted words per line.",
          "Connect to your artifact repo for recipes.",
          "Configures the artifact repository to resolve recipes from. All subsequent recipe installation commands will use this."
        )}
      </CliSurface>

      <CliSurface
        caption={
          <>
            Grammar conventions per surface — rendered as the list/table pattern{" "}
            (<code>list.md</code>): columns aligned by padding, no rules, no borders.
            Each row is one surface and the form its strings take.
          </>
        }
      >
        <span style={{ color: primaryHex, fontWeight: 700 }}>GRAMMAR CONVENTIONS</span>
        {"\n"}
        {grammarRow("Section header", "ALL CAPS noun phrase, no period", <span style={{ color: bodyHex, fontWeight: 700 }}>WHAT WENT WRONG</span>)}
        {grammarRow(
          "Help summary",
          "Imperative present, period",
          <span style={{ color: bodyHex }}>Configure the SSL trust store.</span>
        )}
        {grammarRow(
          "Action header (●)",
          "Gerund, no period",
          <span style={{ color: bodyHex }}>Running recipe on 47 repositories</span>
        )}
        {grammarRow(
          "Sub-task ✓ summary",
          "Past tense, count leads",
          <span style={{ color: bodyHex }}>42 repositories modified</span>
        )}
        {grammarRow(
          "Inline ⚠ warning",
          "Declarative, count leads, period",
          <span style={{ color: bodyHex }}>0 repositories searched.</span>
        )}
        {grammarRow(
          "? Hint: body",
          "Declarative, period",
          <span style={{ color: bodyHex }}>Add a Maven, Gradle, or Bazel build config.</span>
        )}
        {grammarRow(
          "Error WHAT WENT WRONG",
          "Past or noun phrase, names input",
          <span style={{ color: bodyHex }}>No build tool found in /home/user/project.</span>
        )}
        {grammarRow(
          "▶ recovery action",
          "Imperative present, period",
          <span style={{ color: bodyHex }}>Add a build config to the directory.</span>
        )}
        {grammarRow(
          "▶ inlined command",
          "Verbatim shell, no period",
          <span style={{ color: infoHex }}>mod build /home/user/project --only-tool maven</span>
        )}
        {grammarRow(
          "Empty-state line",
          "No <noun-phrase>. period",
          <span style={{ color: bodyHex }}>No repositories configured.</span>
        )}
        {grammarRow(
          "Banner phrase (close)",
          "ALL CAPS verb-phrase, no period",
          <span style={{ color: bodyHex, fontWeight: 700 }}>MOD SUCCEEDED in (3m 24s)</span>
        )}
        {grammarRow(
          "Banner preface",
          "ALL CAPS noun-or-statement, colon",
          <span style={{ color: bodyHex, fontWeight: 700 }}>FAILURE: mod failed with an exception</span>
        )}
        {"\n  "}
        <span style={{ color: supportingHex }}>13 surfaces — same writer, different form per row.</span>
      </CliSurface>

      <CliSurface
        caption={
          <>
            What voice is <em>not</em> — rendered as a list of fact-rows. No glyph (the empty-state{" "}
            shape from <code>list.md</code>): each line is a constraint the system honors, not a{" "}
            recovery action.
          </>
        }
      >
        <span style={{ color: primaryHex, fontWeight: 700 }}>WHAT VOICE IS NOT</span>
        {"\n  "}
        <span style={{ color: bodyHex }}>Not friendly.   </span>
        <span style={{ color: supportingHex }}>No &ldquo;Sorry!&rdquo;, no &ldquo;Oops!&rdquo;, no exclamation marks outside the ! glyph, no emoji.</span>
        {"\n  "}
        <span style={{ color: bodyHex }}>Not formal.     </span>
        <span style={{ color: supportingHex }}>&ldquo;Please&rdquo; is not used. The imperative carries the request without softening.</span>
        {"\n  "}
        <span style={{ color: bodyHex }}>Not jargon.     </span>
        <span style={{ color: supportingHex }}>Specific named things are concrete. Abstract jargon (&ldquo;leverage&rdquo;, &ldquo;facilitate&rdquo;) is removed.</span>
        {"\n  "}
        <span style={{ color: bodyHex }}>Not coy.        </span>
        <span style={{ color: supportingHex }}>Specific recommendation when grounded; alternatives when not. Never equivocate to seem polite.</span>
      </CliSurface>
    </Section>
  );
}
