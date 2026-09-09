import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function IconFade({
  show,
  children,
}: {
  show: boolean;
  children: ReactNode;
}) {
  return (
    <span
      aria-hidden={!show}
      className={cn(
        "absolute inset-0 transition-[opacity,filter,scale] duration-300 ease-[cubic-bezier(0.2,0,0,1)]",
        show
          ? "scale-100 opacity-100 blur-none"
          : "scale-[0.25] opacity-0 blur-[2px]",
      )}
    >
      {children}
    </span>
  );
}
