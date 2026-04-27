"use client";

import * as React from "react";
import { BottomSheet } from "@/components/BottomSheet";

export type DocLinkProps = {
  href: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
};

export function DocLink({ href, children, style, className }: DocLinkProps) {
  const [doc, setDoc] = React.useState<{ slug: string; title: string; body: string } | null>(null);
  const [loading, setLoading] = React.useState(false);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (loading) return;
    const slug = href.replace(/^\/docs\//, "");
    setLoading(true);
    fetch(`/api/docs/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        setDoc(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const slug = href.replace(/^\/docs\//, "");

  return (
    <>
      <a
        href={href}
        onClick={handleClick}
        style={{ cursor: loading ? "wait" : "pointer", ...style }}
        className={className}
      >
        {children}
      </a>
      {doc && (
        <BottomSheet
          filename={`design-system/${slug}.md`}
          body={doc.body}
          onClose={() => setDoc(null)}
        />
      )}
    </>
  );
}
