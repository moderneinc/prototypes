import * as React from "react";
import { SideNav } from "@/components/SideNav";

export type PageLayoutProps = {
  title: string;
  children: React.ReactNode;
};

export function PageLayout({ title: _title, children }: PageLayoutProps) {
  return (
    <>
      <SideNav />
      <div className="md:ml-56 flex flex-col">
        <main id="main-content">
          <div className="mx-auto max-w-5xl px-6 md:px-10 py-6 md:py-10">
            {children}
          </div>
        </main>
      </div>
    </>
  );
}
