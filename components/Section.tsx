/**
 * Section — anchored long-scroll section. Provides the id the SideNav
 * deep-links to and a consistent heading + spacing wrapper. Token
 * reference treatment lives inside each section's own component; Section
 * is just the chrome.
 */
import * as React from "react";
import { Heading } from "./Heading";

export type SectionProps = {
  id: string;
  title?: string;
  children: React.ReactNode;
  className?: string;
};

export function Section({ id, title, children, className = "" }: SectionProps) {
  return (
    <section id={id} className={`scroll-mt-8 space-y-6 py-12 ${className}`}>
      {title && (
        <Heading as="h2" className="text-xl">
          {title}
        </Heading>
      )}
      {children}
    </section>
  );
}
