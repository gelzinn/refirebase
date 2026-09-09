"use client";

import Link from "next/link";
import { BookOpen, LifeBuoy } from "lucide-react";
import { repo } from "@/lib/env";
import { usePlaygroundSidebar } from "./sidebar-context";

const ITEMS = [
  { title: "Docs", href: "/", icon: BookOpen },
  { title: "GitHub", href: repo.url, icon: LifeBuoy, external: true },
] as const;

export function NavSecondary() {
  const { setOpen } = usePlaygroundSidebar();

  return (
    <ul className="mt-auto flex flex-col gap-1">
      {ITEMS.map((item) => {
        const Icon = item.icon;
        const className =
          "flex min-h-8 items-center gap-2 rounded-lg px-2 text-sm text-muted-foreground hover:bg-secondary/40 hover:text-foreground";

        if ("external" in item && item.external) {
          return (
            <li key={item.title}>
              <a
                href={item.href}
                target="_blank"
                rel="noreferrer"
                title={item.title}
                className={className}
              >
                <Icon className="size-4 shrink-0" />
                <span>{item.title}</span>
              </a>
            </li>
          );
        }

        return (
          <li key={item.title}>
            <Link
              href={item.href}
              title={item.title}
              onClick={() => setOpen(false)}
              className={className}
            >
              <Icon className="size-4 shrink-0" />
              <span>{item.title}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
