/**
 * Intro — styled as a CLI screen using the Construct design system.
 */
import { Section } from "@/components/Section";

const rule = "─".repeat(56);

export function Intro() {
  return (
    <Section id="intro" className="!pt-4">
      <div
        style={{
          background: "var(--color-bg-terminal)",
          border: "1px solid var(--color-bg-panel)",
          borderRadius: "0.375rem",
          padding: "2rem 2.5rem",
          fontFamily: "var(--font-mono)",
          lineHeight: 1.7,
          maxWidth: "52rem",
        }}
      >
        {/* Start banner frame */}
        <div style={{ color: "var(--color-text-metadata)", fontSize: "0.8125rem" }}>{rule}</div>
        <div style={{ color: "var(--color-text-primary)", fontSize: "1rem", fontWeight: 700, letterSpacing: "0.02em", margin: "0.25rem 0" }}>
          /// CONSTRUCT
        </div>
        <div style={{ color: "var(--color-text-metadata)", fontSize: "0.8125rem" }}>{rule}</div>

        {/* Key-value info rows */}
        <div style={{ margin: "0.75rem 0", display: "flex", flexDirection: "column", gap: "0.125rem", fontSize: "0.8125rem" }}>
          <div>
            <span style={{ color: "var(--color-text-supporting)", display: "inline-block", width: "10rem" }}>  Source of truth</span>
            <span style={{ color: "var(--color-text-primary)" }}>Code</span>
          </div>
          <div>
            <span style={{ color: "var(--color-text-supporting)", display: "inline-block", width: "10rem" }}>  Figma</span>
            <span style={{ color: "var(--color-success)" }}>Bidirectional</span>
          </div>
          <div>
            <span style={{ color: "var(--color-text-supporting)", display: "inline-block", width: "10rem" }}>  Contributors</span>
            <span style={{ color: "var(--color-text-primary)" }}>Anyone</span>
          </div>
        </div>

        <div style={{ color: "var(--color-text-metadata)", fontSize: "0.8125rem" }}>{rule}</div>

        {/* Body — styled as CLI output */}
        <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.8125rem" }}>
          <div style={{ color: "var(--color-text-body)" }}>
            <span style={{ color: "var(--color-text-primary)" }}>●</span>{" "}
            Construct is a production-first design system built for humans
            and AI agents working together. The repository is the authority.
            Tokens represent semantic intent, not hardcoded visual values.
            Figma, the CLI, documentation, and runtime interfaces all read
            from the same canonical source.
          </div>

          <div style={{ color: "var(--color-text-body)" }}>
            <span style={{ color: "var(--color-text-primary)" }}>●</span>{" "}
            Changes flow in both directions. Figma mirrors production through
            a governed sync layer, while AI agents can read, generate, and
            propose updates through structured review workflows. Existing
            patterns are reused first. New patterns are introduced deliberately.
          </div>

          <div style={{ color: "var(--color-text-body)" }}>
            <span style={{ color: "var(--color-text-primary)" }}>●</span>{" "}
            Construct treats design systems as infrastructure rather than
            static libraries. Context survives every export, contribution,
            and implementation layer, preserving not just what something
            looks like, but what it means, where it belongs, and why it exists.
          </div>
        </div>

        {/* Prompt */}
        <div style={{ marginTop: "1.25rem", fontSize: "0.8125rem" }}>
          <span style={{ color: "var(--color-text-metadata)" }}>{">"} </span>
          <span style={{ color: "var(--color-info)" }}>explore the system</span>
          <span style={{ color: "var(--color-text-metadata)" }}> — use the nav to browse tokens, components, patterns, and workflows</span>
        </div>
      </div>
    </Section>
  );
}
