"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { PLAYGROUND_NAV } from "@/lib/playground";
import { cn } from "@/lib/utils";
import { usePlaygroundSidebar } from "./sidebar-context";

export function NavMain() {
  const pathname = usePathname();
  const { setOpen } = usePlaygroundSidebar();

  return (
    <div className="flex flex-col gap-1">
      <p className="px-2 font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
        Platform
      </p>
      <ul className="flex flex-col gap-1">
        {PLAYGROUND_NAV.map((item) => (
          <NavItem
            key={item.url}
            item={item}
            active={
              item.url === "/playground"
                ? pathname === "/playground"
                : pathname === item.url || pathname.startsWith(`${item.url}/`)
            }
            onNavigate={() => setOpen(false)}
          />
        ))}
      </ul>
    </div>
  );
}

function NavItem({
  item,
  active,
  onNavigate,
}: {
  item: (typeof PLAYGROUND_NAV)[number];
  active: boolean;
  onNavigate: () => void;
}) {
  const [open, setOpen] = useState(active);

  return (
    <li className="flex flex-col">
      <div className="flex items-center">
        <Link
          href={item.url}
          title={item.title}
          onClick={onNavigate}
          className={cn(
            "flex min-h-9 flex-1 items-center gap-2 rounded-lg px-2 text-sm transition-colors",
            active
              ? "bg-secondary/70 text-foreground"
              : "text-muted-foreground hover:bg-secondary/40 hover:text-foreground",
          )}
        >
          <span className="truncate font-medium">{item.title}</span>
        </Link>
        {item.items.length > 0 ? (
          <button
            type="button"
            aria-label={`Toggle ${item.title}`}
            onClick={() => setOpen((current) => !current)}
            className={cn(
              "flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary/40 hover:text-foreground",
              open && "rotate-90",
            )}
          >
            <ChevronRight className="size-4" />
          </button>
        ) : null}
      </div>
      {open ? (
        <ul className="ml-3.5 flex flex-col gap-0.5 border-l border-border py-1 pl-3">
          {item.items.map((sub) => (
            <li key={`${sub.url}#${sub.hash}`}>
              <Link
                href={`${sub.url}#${sub.hash}`}
                onClick={onNavigate}
                className="flex min-h-8 items-center rounded-md px-2 text-sm text-muted-foreground hover:text-foreground"
              >
                {sub.title}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </li>
  );
}
