/**
 * Tiny markdown loader. Reads design-system/patterns/*.md and voice.md as
 * raw strings. We deliberately avoid pulling a markdown parser into the app
 * — the patterns are short and benefit from being shown verbatim, in
 * monospace, the way an agent or designer would read them. The renderer
 * preserves whitespace.
 */
import fs from "node:fs";
import path from "node:path";

const PATTERNS_DIR = path.join(process.cwd(), "design-system", "patterns");
const VOICE_FILE = path.join(process.cwd(), "design-system", "voice.md");

export type PatternFile = {
  slug: string;
  title: string;
  body: string;
};

export function listPatterns(): PatternFile[] {
  const entries = fs.readdirSync(PATTERNS_DIR);
  return entries
    .filter((f) => f.endsWith(".md"))
    .map((f) => loadPattern(f.replace(/\.md$/, "")))
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

export function loadPattern(slug: string): PatternFile {
  const file = path.join(PATTERNS_DIR, `${slug}.md`);
  const body = fs.readFileSync(file, "utf-8");
  const titleMatch = body.match(/^#\s+(.+)$/m);
  return {
    slug,
    title: titleMatch ? titleMatch[1].trim() : slug,
    body,
  };
}

export function loadVoice(): string {
  return fs.readFileSync(VOICE_FILE, "utf-8");
}
