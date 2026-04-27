import { Section } from "@/components/Section";
import { Body } from "@/components/Body";
import { Card } from "@/components/Card";
import { loadVoice } from "@/lib/markdown";

export function Voice() {
  const body = loadVoice();
  return (
    <Section id="voice" title="Voice">
      <Body role="metadata">
        Source: <code style={{ fontFamily: "var(--font-mono)" }}>design-system/voice.md</code>
      </Body>
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
    </Section>
  );
}
