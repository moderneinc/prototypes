"use client";

/**
 * MarkdownRenderer — renders Block[] output from parseMarkdown into React nodes.
 * Uses CSS custom properties from the design token system.
 */

import * as React from "react";
import type { Block } from "@/lib/parseMarkdown";

// ---------------------------------------------------------------------------
// Inline tokenizer
// ---------------------------------------------------------------------------

type InlineToken =
  | { kind: "text"; value: string }
  | { kind: "code"; value: string }
  | { kind: "strong"; value: string }
  | { kind: "em"; value: string }
  | { kind: "link"; href: string; value: string };

function tokenizeInline(text: string): InlineToken[] {
  const tokens: InlineToken[] = [];
  // Regex matches: `code`, **bold**, *italic*, [text](href)
  const pattern = /`([^`]+)`|\*\*([^*]+)\*\*|\*([^*]+)\*|\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) {
      tokens.push({ kind: "text", value: text.slice(last, match.index) });
    }
    if (match[1] !== undefined) {
      tokens.push({ kind: "code", value: match[1] });
    } else if (match[2] !== undefined) {
      tokens.push({ kind: "strong", value: match[2] });
    } else if (match[3] !== undefined) {
      tokens.push({ kind: "em", value: match[3] });
    } else if (match[4] !== undefined && match[5] !== undefined) {
      tokens.push({ kind: "link", href: match[5], value: match[4] });
    }
    last = match.index + match[0].length;
  }

  if (last < text.length) {
    tokens.push({ kind: "text", value: text.slice(last) });
  }

  return tokens;
}

function renderInline(text: string): React.ReactNode {
  const tokens = tokenizeInline(text);
  return tokens.map((tok, idx) => {
    switch (tok.kind) {
      case "text":
        return <React.Fragment key={idx}>{tok.value}</React.Fragment>;
      case "code":
        return (
          <code
            key={idx}
            style={{
              color: "var(--color-text-body)",
              fontFamily: "var(--font-mono)",
              background: "var(--color-bg-panel)",
              padding: "0.1em 0.3em",
              borderRadius: "0.2em",
              fontSize: "0.875em",
            }}
          >
            {tok.value}
          </code>
        );
      case "strong":
        return (
          <strong key={idx} style={{ color: "var(--color-text-primary)" }}>
            {tok.value}
          </strong>
        );
      case "em":
        return (
          <em key={idx} style={{ color: "var(--color-text-body)" }}>
            {tok.value}
          </em>
        );
      case "link":
        return (
          <a
            key={idx}
            href={tok.href}
            style={{ color: "var(--color-info)", textDecoration: "underline" }}
          >
            {tok.value}
          </a>
        );
    }
  });
}

// ---------------------------------------------------------------------------
// Block renderers
// ---------------------------------------------------------------------------

function renderBlock(block: Block, idx: number): React.ReactNode {
  switch (block.type) {
    case "heading": {
      if (block.level === 1) return null; // Title shown separately in card
      if (block.level === 2) {
        return (
          <div
            key={idx}
            style={{
              color: "var(--color-text-primary)",
              fontWeight: 700,
              fontSize: "0.875rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginTop: "1rem",
            }}
          >
            {renderInline(block.text)}
          </div>
        );
      }
      // h3
      return (
        <div
          key={idx}
          style={{
            color: "var(--color-text-body)",
            fontWeight: 700,
            fontSize: "0.8125rem",
            marginTop: "0.75rem",
          }}
        >
          {renderInline(block.text)}
        </div>
      );
    }

    case "paragraph":
      return (
        <p
          key={idx}
          style={{
            color: "var(--color-text-body)",
            fontSize: "0.875rem",
            lineHeight: "1.625",
            margin: 0,
          }}
        >
          {renderInline(block.text)}
        </p>
      );

    case "code":
      return (
        <pre
          key={idx}
          style={{
            fontFamily: "var(--font-mono)",
            background: "var(--color-bg-terminal)",
            border: "1px solid var(--color-bg-panel)",
            color: "var(--color-text-body)",
            fontSize: "0.75rem",
            padding: "0.75rem",
            borderRadius: "0.25rem",
            overflowX: "auto",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            margin: 0,
          }}
        >
          {block.content}
        </pre>
      );

    case "blockquote":
      return (
        <div
          key={idx}
          style={{
            borderLeft: "2px solid var(--color-bg-panel)",
            paddingLeft: "0.75rem",
            color: "var(--color-text-supporting)",
            fontSize: "0.875rem",
            lineHeight: "1.625",
          }}
        >
          {renderInline(block.text)}
        </div>
      );

    case "list":
      return (
        <ul
          key={idx}
          style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.25rem" }}
        >
          {block.items.map((item, itemIdx) => (
            <li key={itemIdx} style={{ display: "flex", gap: "0.5rem", fontSize: "0.875rem" }}>
              <span style={{ color: "var(--color-text-supporting)", flexShrink: 0 }}>•</span>
              <span style={{ color: "var(--color-text-body)" }}>{renderInline(item)}</span>
            </li>
          ))}
        </ul>
      );

    case "table": {
      const sep = (
        <span style={{ color: "var(--color-text-supporting)" }}>  │  </span>
      );
      return (
        <div
          key={idx}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.75rem",
            overflowX: "auto",
          }}
        >
          {/* Header row */}
          <div
            style={{
              color: "var(--color-text-body)",
              fontWeight: 700,
              whiteSpace: "nowrap",
              paddingBottom: "0.25rem",
            }}
          >
            {block.headers.map((h, hi) => (
              <React.Fragment key={hi}>
                {hi > 0 && sep}
                <span>{h}</span>
              </React.Fragment>
            ))}
          </div>
          {/* Data rows */}
          {block.rows.map((row, ri) => (
            <div
              key={ri}
              style={{
                color: "var(--color-text-body)",
                whiteSpace: "nowrap",
              }}
            >
              {row.map((cell, ci) => (
                <React.Fragment key={ci}>
                  {ci > 0 && sep}
                  <span>{renderInline(cell)}</span>
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>
      );
    }

    case "hr":
      return (
        <hr
          key={idx}
          style={{
            border: "none",
            borderTop: "1px solid var(--color-bg-panel)",
            margin: "0.5rem 0",
          }}
        />
      );

    default:
      return null;
  }
}

// ---------------------------------------------------------------------------
// MarkdownRenderer component
// ---------------------------------------------------------------------------

export function MarkdownRenderer({
  blocks,
  collapsed,
}: {
  blocks: Block[];
  collapsed: boolean;
}) {
  let visibleBlocks: Block[];

  if (!collapsed) {
    visibleBlocks = blocks;
  } else {
    // Show blocks up to and including the 2nd paragraph block, skipping h1
    let paragraphCount = 0;
    const cutoff: Block[] = [];
    for (const block of blocks) {
      // Skip h1 (title block)
      if (block.type === "heading" && block.level === 1) {
        continue;
      }
      cutoff.push(block);
      if (block.type === "paragraph") {
        paragraphCount++;
        if (paragraphCount >= 2) break;
      }
    }
    visibleBlocks = cutoff;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      {visibleBlocks.map((block, idx) => renderBlock(block, idx))}
    </div>
  );
}
