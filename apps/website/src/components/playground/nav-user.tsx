"use client";

import { useState } from "react";
import { ChevronsUpDown } from "lucide-react";
import Link from "next/link";
import { usePlayground } from "./provider";
import { usePlaygroundSidebar } from "./sidebar-context";

export function NavUser() {
  const { config, ready, clear } = usePlayground();
  const { setOpen } = usePlaygroundSidebar();
  const [menuOpen, setMenuOpen] = useState(false);

  const name = ready ? config.projectId : "Not connected";
  const email = ready ? config.authDomain : "Add Firebase credentials";
  const initials = ready
    ? config.projectId.slice(0, 2).toUpperCase()
    : "RF";

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setMenuOpen((current) => !current)}
        className="flex w-full items-center gap-2 rounded-xl border border-border bg-background p-2 text-left transition-colors hover:bg-secondary/40"
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-card font-mono text-[10px]">
          {initials}
        </span>
        <span className="grid min-w-0 flex-1 text-left text-sm leading-tight">
          <span className="truncate font-medium">{name}</span>
          <span className="truncate text-xs text-muted-foreground">
            {email}
          </span>
        </span>
        <ChevronsUpDown className="size-4 text-muted-foreground" />
      </button>

      {menuOpen ? (
        <div className="absolute inset-x-0 bottom-full z-20 mb-2 overflow-hidden rounded-xl border border-border bg-card p-1 shadow-sm">
          <Link
            href="/playground"
            onClick={() => {
              setMenuOpen(false);
              setOpen(false);
            }}
            className="flex min-h-9 items-center rounded-lg px-3 text-sm hover:bg-secondary/50"
          >
            Edit credentials
          </Link>
          <button
            type="button"
            onClick={() => {
              clear();
              setMenuOpen(false);
            }}
            className="flex min-h-9 w-full items-center rounded-lg px-3 text-left text-sm hover:bg-secondary/50"
          >
            Clear this tab
          </button>
        </div>
      ) : null}
    </div>
  );
}
