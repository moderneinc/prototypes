import { Heading } from "@/components/Heading";
import { Body } from "@/components/Body";
import { Card } from "@/components/Card";
import { Link } from "@/components/Link";
import { loadVoice } from "@/lib/markdown";

export default function VoicePage() {
  const body = loadVoice();
  return (
    <main className="space-y-6">
      <header className="space-y-2">
        <Link href="/">← Home</Link>
        <Heading as="h1" className="text-2xl">Voice</Heading>
        <Body role="metadata">
          Source: <code style={{ fontFamily: "var(--font-mono)" }}>design-system/voice.md</code>
        </Body>
      </header>
      <Card>
        <pre
          style={{
            fontFamily: "var(--font-mono)",
            color: "var(--color-text-body)",
            whiteSpace: "pre-wrap",
            fontSize: "0.875rem",
            lineHeight: 1.6,
          }}
        >
          {body}
        </pre>
      </Card>
    </main>
  );
}
