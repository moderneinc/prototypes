/**
 * parseMarkdown — a block-level markdown parser. No external dependencies.
 *
 * Supports: headings (h1–h3), paragraphs, fenced code blocks, blockquotes,
 * unordered lists, tables, and horizontal rules.
 */

export type InlineNode =
  | string
  | { tag: "code" | "strong" | "em"; children: string }
  | { tag: "link"; href: string; children: string };

export type Block =
  | { type: "heading"; level: number; text: string }
  | { type: "paragraph"; text: string }
  | { type: "code"; lang: string; content: string }
  | { type: "blockquote"; text: string }
  | { type: "list"; items: string[] }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "hr" };

function parseCells(row: string): string[] {
  return row
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((c) => c.trim());
}

function isSeparatorRow(cells: string[]): boolean {
  return cells.every((c) => /^[-: ]+$/.test(c));
}

export function parseMarkdown(md: string): Block[] {
  const lines = md.split("\n");
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Skip blank lines
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Fenced code block
    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      const contentLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        contentLines.push(lines[i]);
        i++;
      }
      i++; // skip closing fence
      blocks.push({ type: "code", lang, content: contentLines.join("\n") });
      continue;
    }

    // Horizontal rule
    if (/^---+$/.test(line.trim())) {
      blocks.push({ type: "hr" });
      i++;
      continue;
    }

    // Headings
    if (line.startsWith("### ")) {
      blocks.push({ type: "heading", level: 3, text: line.slice(4).trim() });
      i++;
      continue;
    }
    if (line.startsWith("## ")) {
      blocks.push({ type: "heading", level: 2, text: line.slice(3).trim() });
      i++;
      continue;
    }
    if (line.startsWith("# ")) {
      blocks.push({ type: "heading", level: 1, text: line.slice(2).trim() });
      i++;
      continue;
    }

    // Blockquote
    if (line.startsWith("> ")) {
      const texts: string[] = [];
      while (i < lines.length && lines[i].startsWith("> ")) {
        texts.push(lines[i].slice(2));
        i++;
      }
      blocks.push({ type: "blockquote", text: texts.join(" ") });
      continue;
    }

    // Unordered list
    if (/^[*-] /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[*-] /.test(lines[i])) {
        items.push(lines[i].slice(2).trim());
        i++;
      }
      blocks.push({ type: "list", items });
      continue;
    }

    // Table
    if (line.startsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].startsWith("|")) {
        tableLines.push(lines[i]);
        i++;
      }
      if (tableLines.length >= 2) {
        const headers = parseCells(tableLines[0]);
        const rows: string[][] = [];
        for (let r = 1; r < tableLines.length; r++) {
          const cells = parseCells(tableLines[r]);
          if (!isSeparatorRow(cells)) {
            rows.push(cells);
          }
        }
        blocks.push({ type: "table", headers, rows });
      }
      continue;
    }

    // Paragraph — collect until next blank line
    const paragraphLines: string[] = [];
    while (i < lines.length && lines[i].trim() !== "") {
      // Stop at a block-level starter
      const l = lines[i];
      if (
        l.startsWith("```") ||
        /^---+$/.test(l.trim()) ||
        l.startsWith("# ") ||
        l.startsWith("## ") ||
        l.startsWith("### ") ||
        l.startsWith("> ") ||
        /^[*-] /.test(l) ||
        l.startsWith("|")
      ) {
        break;
      }
      paragraphLines.push(l);
      i++;
    }
    if (paragraphLines.length > 0) {
      blocks.push({ type: "paragraph", text: paragraphLines.join(" ") });
    }
  }

  return blocks;
}
