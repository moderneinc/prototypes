import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Construct — visual playground",
  description:
    "Production-first, AI-native playground for the Moderne CLI design system. Tokens live in code; Figma is one of many downstream consumers.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="mx-auto max-w-5xl px-6 py-10">{children}</div>
      </body>
    </html>
  );
}
