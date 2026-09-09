"use client";

import { type ReactNode, useState } from "react";
import { cn } from "@/lib/utils";
import { BunIcon, NpmIcon, PnpmIcon, YarnIcon } from "@/components/pm-icons";

const MANAGERS = [
  { id: "bun", label: "bun", icon: BunIcon },
  { id: "npm", label: "npm", icon: NpmIcon },
  { id: "pnpm", label: "pnpm", icon: PnpmIcon },
  { id: "yarn", label: "yarn", icon: YarnIcon },
] as const;

export function InstallTabs({
  panes,
  align = "start",
}: {
  panes: Record<(typeof MANAGERS)[number]["id"], ReactNode>;
  align?: "start" | "center";
}) {
  const [active, setActive] = useState<(typeof MANAGERS)[number]["id"]>("bun");

  return (
    <div
      className={cn(
        "flex w-full min-w-0 flex-col gap-4 motion-safe:animate-fade-up [animation-delay:200ms]",
        align === "center" ? "items-center" : "items-start",
      )}
    >
      <div className="w-full">
        {MANAGERS.map((manager) => (
          <div
            key={manager.id}
            className={active === manager.id ? "block" : "hidden"}
          >
            {panes[manager.id]}
          </div>
        ))}
      </div>

      <div
        className={cn(
          "mt-1 flex flex-wrap items-center gap-3 text-sm font-medium",
          align === "center" && "sm:justify-center",
        )}
      >
        {MANAGERS.map((manager) => {
          const isActive = active === manager.id;
          const Icon = manager.icon;
          return (
            <button
              key={manager.id}
              type="button"
              onClick={() => setActive(manager.id)}
              className={cn(
                "flex min-h-10 items-center gap-2 rounded-full border px-4 py-2 font-mono text-xs transition-[background-color,color,border-color,transform] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.96]",
                isActive
                  ? "border-border bg-secondary/50 text-foreground"
                  : "border-transparent text-muted-foreground hover:bg-secondary/20 hover:text-foreground",
              )}
            >
              <Icon className="size-4 shrink-0" />
              {manager.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
