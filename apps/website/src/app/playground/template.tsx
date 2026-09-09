"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

export default function PlaygroundTemplate({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div key={pathname} className="motion-safe:animate-page-in">
      {children}
    </div>
  );
}
