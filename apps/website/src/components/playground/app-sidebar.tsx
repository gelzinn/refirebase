"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "@/components/logo";
import { site } from "@/lib/env";
import { NavMain } from "./nav-main";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";
import { usePlaygroundSidebar } from "./sidebar-context";

const SIDEBAR_SLIDE = {
  duration: 0.45,
  ease: [0.16, 1, 0.3, 1] as const,
};

const PANEL = 256;
const GUTTER = 8;
const SLOT = PANEL + GUTTER;

function SidebarPanel() {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-2">
      <div className="p-1">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-xl p-2 hover:bg-secondary/40"
        >
          <Logo className="size-8" />
          <span className="grid min-w-0 leading-tight">
            <span className="truncate font-heading text-sm font-semibold">
              {site.name}
            </span>
            <span className="truncate font-mono text-[10px] text-muted-foreground">
              Playground
            </span>
          </span>
        </Link>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-hidden px-1 py-3">
        <NavMain />
        <NavSecondary />
      </div>

      <div className="p-1">
        <NavUser />
      </div>
    </div>
  );
}

export function AppSidebar() {
  const { open, setOpen, collapsed } = usePlaygroundSidebar();

  return (
    <>
      <motion.div
        className="hidden h-full shrink-0 overflow-hidden md:block"
        initial={false}
        animate={{ width: collapsed ? 0 : SLOT }}
        transition={SIDEBAR_SLIDE}
        style={{ pointerEvents: collapsed ? "none" : "auto" }}
      >
        <motion.div
          className="flex h-full"
          style={{ width: SLOT }}
          initial={false}
          animate={{ x: collapsed ? -SLOT : 0 }}
          transition={SIDEBAR_SLIDE}
        >
          <div className="h-full shrink-0" style={{ width: PANEL }}>
            <SidebarPanel />
          </div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {open ? (
          <motion.button
            type="button"
            aria-label="Close sidebar"
            className="absolute inset-0 z-30 bg-background/70 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setOpen(false)}
          />
        ) : null}
      </AnimatePresence>

      <motion.aside
        className="absolute inset-y-0 left-0 z-40 w-64 md:hidden"
        initial={false}
        animate={{ x: open ? 0 : "calc(-100% - 0.5rem)" }}
        transition={SIDEBAR_SLIDE}
        style={{ pointerEvents: open ? "auto" : "none" }}
      >
        <SidebarPanel />
      </motion.aside>
    </>
  );
}
