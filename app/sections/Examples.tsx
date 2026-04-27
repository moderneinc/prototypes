import { Section } from "@/components/Section";
import { Body } from "@/components/Body";
import { Link } from "@/components/Link";
import { Heading } from "@/components/Heading";
import { EXAMPLE_INDEX } from "@/lib/exampleSurfaces";

export function Examples() {
  return (
    <Section id="examples" title="Examples">
      <Body role="supporting">
        Real surfaces composed from the canonical tokens. Each example exercises a specific
        pattern and exposes which tokens it draws on. Click the standalone link to see the
        surface on its own.
      </Body>
      <div className="space-y-10">
        {EXAMPLE_INDEX.map((ex) => (
          <div key={ex.slug} className="space-y-3">
            <div className="flex items-baseline justify-between gap-3">
              <Heading as="h3" className="text-base">{ex.title}</Heading>
              <Link href={`/examples/${ex.slug}`} className="text-sm">
                View standalone →
              </Link>
            </div>
            {ex.render()}
          </div>
        ))}
      </div>
    </Section>
  );
}
