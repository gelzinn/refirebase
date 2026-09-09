import type { ReactNode } from "react";
import { DOC_SECTIONS } from "@/lib/docs";
import { DocsSidebar } from "@/components/docs/sidebar";
import { Header } from "@/components/header";

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 p-6">
      <Header />
      <div className="flex gap-8 lg:gap-12">
        <DocsSidebar sections={DOC_SECTIONS} />
        <main className="min-w-0 flex-1 py-2">{children}</main>
      </div>
    </div>
  );
}
