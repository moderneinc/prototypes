/*
 * Examples — one real example surface, deliberately built.
 *
 * The current example is a "Settings panel" — the canvas analogue of the
 * CLI's mod config -h surface. It composes Card, Heading, Body, Link,
 * TextField, and Button against the canonical tokens. This is the shape
 * Figma will mirror when Code Connect is wired up in the next phase.
 *
 * Add additional surfaces below as separate <section> blocks. Each new
 * surface should:
 *   - read tokens via the same components (no inline color overrides)
 *   - cite which CLI surface it is the canvas analogue of
 */
import { Heading } from "@/components/Heading";
import { Body } from "@/components/Body";
import { Card } from "@/components/Card";
import { Link } from "@/components/Link";
import { TextField } from "@/components/TextField";
import { Button } from "@/components/Button";
import { Banner } from "@/components/Banner";

export default function ExamplesPage() {
  return (
    <main className="space-y-10">
      <header className="space-y-2">
        <Link href="/">← Home</Link>
        <Heading as="h1" className="text-2xl">Examples</Heading>
        <Body role="supporting">
          Real surfaces composed from the canonical tokens. The first one — a settings panel —
          is the canvas analogue of <code style={{ fontFamily: "var(--font-mono)" }}>mod config</code>.
        </Body>
      </header>

      <section className="space-y-3">
        <Heading as="h2" className="text-lg">Settings panel</Heading>
        <Card>
          <div className="space-y-6">
            <div className="space-y-1">
              <Heading as="h3" className="text-sm">Configure your environment</Heading>
              <Body role="supporting">
                These values are read by every <code style={{ fontFamily: "var(--font-mono)" }}>mod</code> command.
              </Body>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                id="tenant-url"
                label="Tenant URL"
                placeholder="https://your-org.moderne.io"
                defaultValue="https://example.moderne.io"
              />
              <TextField
                id="recipe-path"
                label="Recipe path"
                placeholder="/path/to/recipes"
                defaultValue="/Users/you/recipes"
              />
              <TextField
                id="auth-token"
                label="Auth token"
                type="password"
                placeholder="(set via mod config)"
              />
              <TextField
                id="default-branch"
                label="Default branch"
                defaultValue="main"
              />
            </div>

            <div className="flex items-center gap-3">
              <Button tone="primary">Save</Button>
              <Button tone="neutral">Cancel</Button>
              <Button tone="danger">Reset to defaults</Button>
            </div>
          </div>
        </Card>
      </section>

      <section className="space-y-3">
        <Heading as="h2" className="text-lg">Run feedback</Heading>
        <Card>
          <div className="space-y-3" style={{ fontFamily: "var(--font-mono)" }}>
            <div style={{ color: "var(--color-text-body)" }}>
              <span style={{ color: "var(--color-success)" }}>✓ </span>
              42 repositories modified
            </div>
            <div style={{ color: "var(--color-text-body)" }}>
              <span style={{ color: "var(--color-warning)" }}>⚠ </span>
              3 repositories skipped — see logs
            </div>
            <Banner variant="success" duration="00:00:42" />
          </div>
        </Card>
      </section>

      {/* TODO: additional example surfaces — error template, onboarding, list view — add below. */}
    </main>
  );
}
