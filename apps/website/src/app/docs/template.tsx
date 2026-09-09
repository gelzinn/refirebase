"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

/**
 * Docs-scoped template: remounts only the page content (not the layout/sidebar)
 * on every docs navigation, giving a smooth page-in animation without flashing
 * the header or sidebar.
 */
export default function DocsTemplate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="motion-safe:animate-page-in">
      {children}
    </div>
  );
}
