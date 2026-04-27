import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Construct — CLI design system",
  description:
    "Production-first, AI-native playground for the Moderne CLI design system. Tokens live in code; Figma is one of many downstream consumers.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The body wrapper is intentionally unconstrained — the homepage hosts a
  // fixed-position SideNav and reserves its own column. Standalone routes
  // (/patterns/[slug], /examples/[slug]) wrap their main content in their
  // own `mx-auto max-w-3xl` container.
  return (
    <html lang="en">
      <body>
        <a href="#main-content" className="skip-link">Skip to main content</a>
        {children}
      </body>
    </html>
  );
}
