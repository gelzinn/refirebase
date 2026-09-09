"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronRight, Menu, X } from "lucide-react";
import type { DocSection } from "@/lib/docs";
import { cn } from "@/lib/utils";

function SidebarContent({
  sections,
  currentPath,
  onNavClick,
}: {
  sections: DocSection[];
  currentPath: string;
  onNavClick?: () => void;
}) {
  return (
    <nav className="flex flex-col gap-6">
      {sections.map((section) => (
        <div key={section.slug} className="flex flex-col gap-1">
          <p className="mb-1 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {section.title}
          </p>
          {section.items.map((item) => {
            const href = `/docs/${section.slug}/${item.slug}`;
            const isActive = currentPath === href;

            return (
              <Link
                key={item.slug}
                href={href}
                onClick={onNavClick}
                className={cn(
                  "group flex items-center justify-between rounded-lg px-2 py-1.5 text-sm transition-colors",
                  isActive
                    ? "bg-primary/8 font-medium text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <span>{item.title}</span>
                {item.badge && (
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase",
                      item.badge === "new"
                        ? "bg-accent/20 text-accent"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}

export function DocsSidebar({ sections }: { sections: DocSection[] }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <button
        type="button"
        className="fixed bottom-6 right-6 z-50 flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg lg:hidden"
        onClick={() => setMobileOpen((o) => !o)}
        aria-label="Toggle navigation"
      >
        {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-72 overflow-y-auto border-r border-border bg-background p-6 transition-transform lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <SidebarContent
          sections={sections}
          currentPath={pathname}
          onNavClick={() => setMobileOpen(false)}
        />
      </aside>

      {/* Desktop sidebar */}
      <aside className="sticky top-8 hidden h-[calc(100vh-4rem)] w-56 shrink-0 overflow-y-auto lg:block xl:w-64">
        <SidebarContent sections={sections} currentPath={pathname} />
      </aside>
    </>
  );
}
