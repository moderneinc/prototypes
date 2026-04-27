"use client";

import * as React from "react";
import ReactDOM from "react-dom";
import { parseMarkdown } from "@/lib/parseMarkdown";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";

export type BottomSheetProps = {
  filename: string;
  body: string;
  onClose: () => void;
};

const pillBase: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: "0.75rem",
  border: "1px solid var(--color-bg-panel)",
  padding: "0.125rem 0.625rem",
  background: "transparent",
  borderRadius: "0.25rem",
  cursor: "pointer",
  lineHeight: 1.5,
};

const pillActive: React.CSSProperties = {
  ...pillBase,
  background: "var(--color-bg-panel)",
  color: "var(--color-text-primary)",
};

const pillInactive: React.CSSProperties = {
  ...pillBase,
  color: "var(--color-text-supporting)",
};

export function BottomSheet({ filename, body, onClose }: BottomSheetProps) {
  const [isRaw, setIsRaw] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const blocks = React.useMemo(() => parseMarkdown(body), [body]);

  const handleCopy = () => {
    navigator.clipboard.writeText(body).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  React.useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  const sheet = (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 50,
          background: "rgba(0,0,0,0.6)",
        }}
      />

      {/* Sheet */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={filename}
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 51,
          maxHeight: "72vh",
          display: "flex",
          flexDirection: "column",
          background: "var(--color-bg-page)",
          borderTop: "1px solid var(--color-bg-panel)",
          borderRadius: "0.5rem 0.5rem 0 0",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.625rem 1rem",
            borderBottom: "1px solid var(--color-bg-panel)",
            flexShrink: 0,
          }}
        >
          <code
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.8125rem",
              color: "var(--color-text-primary)",
              fontWeight: 700,
              flex: 1,
              minWidth: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {filename}
          </code>

          <div style={{ display: "flex", gap: "0.25rem", flexShrink: 0 }}>
            <button type="button" onClick={() => setIsRaw(false)} style={!isRaw ? pillActive : pillInactive}>
              Rendered
            </button>
            <button type="button" onClick={() => setIsRaw(true)} style={isRaw ? pillActive : pillInactive}>
              Raw
            </button>
          </div>

          <button type="button" onClick={handleCopy} style={pillInactive}>
            {copied ? "Copied!" : "Copy"}
          </button>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{ ...pillInactive, padding: "0.125rem 0.5rem" }}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div style={{ overflowY: "auto", flex: 1, padding: "1.25rem 1.5rem" }}>
          {isRaw ? (
            <pre
              style={{
                fontFamily: "var(--font-mono)",
                color: "var(--color-text-body)",
                fontSize: "0.8125rem",
                lineHeight: 1.6,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                margin: 0,
              }}
            >
              {body}
            </pre>
          ) : (
            <MarkdownRenderer blocks={blocks} collapsed={false} />
          )}
        </div>
      </div>
    </>
  );

  return ReactDOM.createPortal(sheet, document.body);
}
