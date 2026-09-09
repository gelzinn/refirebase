"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PanelLeft } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { PLAYGROUND_NAV } from "@/lib/playground";
import { AppSidebar } from "./app-sidebar";
import {
  PlaygroundSidebarProvider,
  usePlaygroundSidebar,
} from "./sidebar-context";

function titleFromPath(pathname: string) {
  const match = PLAYGROUND_NAV.find((item) =>
    item.url === "/playground"
      ? pathname === "/playground"
      : pathname === item.url,
  );
  return match?.title ?? "Playground";
}

function ShellHeader() {
  const pathname = usePathname();
  const { open, setOpen, toggleCollapsed } = usePlaygroundSidebar();
  const page = titleFromPath(pathname);

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 px-4">
      <button
        type="button"
        aria-label="Toggle sidebar"
        onClick={() => {
          if (window.matchMedia("(min-width: 768px)").matches) {
            toggleCollapsed();
          } else {
            setOpen(!open);
          }
        }}
        className="-ml-1 flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
      >
        <PanelLeft className="size-4" />
      </button>
      <span className="h-4 w-px bg-border" />
      <nav className="flex min-w-0 items-center gap-2 text-sm">
        <Link
          href="/playground"
          className="hidden text-muted-foreground hover:text-foreground md:inline"
        >
          Playground
        </Link>
        <span className="hidden text-muted-foreground md:inline">/</span>
        <span className="truncate font-medium">{page}</span>
      </nav>
    </header>
  );
}

function ShellFrame({ children }: { children: ReactNode }) {
  useEffect(() => {
    const html = document.documentElement;
    const { body } = document;
    const previous = {
      htmlOverflow: html.style.overflow,
      bodyOverflow: body.style.overflow,
      htmlHeight: html.style.height,
      bodyHeight: body.style.height,
    };

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    html.style.height = "100%";
    body.style.height = "100%";

    return () => {
      html.style.overflow = previous.htmlOverflow;
      body.style.overflow = previous.bodyOverflow;
      html.style.height = previous.htmlHeight;
      body.style.height = previous.bodyHeight;
    };
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden overscroll-none bg-background p-2">
      <div className="relative flex h-full min-h-0 overflow-hidden">
        <AppSidebar />
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-border bg-background">
          <ShellHeader />
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 pt-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export function PlaygroundShell({ children }: { children: ReactNode }) {
  return (
    <PlaygroundSidebarProvider>
      <ShellFrame>{children}</ShellFrame>
    </PlaygroundSidebarProvider>
  );
}
