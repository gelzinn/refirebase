"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

export default function Template({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const inPlayground = pathname.startsWith("/playground");
  // Docs have their own layout with persistent sidebar — use a stable key
  // so navigating between doc pages doesn't remount the header + sidebar.
  const inDocs = pathname.startsWith("/docs");

  function getKey() {
    if (inPlayground) return "/playground";
    if (inDocs) return "/docs";
    return pathname;
  }

  return (
    <div
      key={getKey()}
      className={
        inPlayground ? "h-svh overflow-hidden" : "motion-safe:animate-page-in"
      }
    >
      {children}
    </div>
  );
}
