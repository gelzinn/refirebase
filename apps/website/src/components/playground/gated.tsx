"use client";

import Link from "next/link";
import type { ComponentType, ReactNode } from "react";
import type { Refirebase } from "refirebase";
import { RefirebaseProvider } from "refirebase/react";
import { usePlayground } from "./provider";

const Provider = RefirebaseProvider as ComponentType<{
  instance: Refirebase;
  children: ReactNode;
}>;

export function PlaygroundGate({ children }: { children: ReactNode }) {
  const { ready, instance } = usePlayground();

  if (!ready || !instance) {
    return (
      <div className="flex flex-col gap-3 rounded-2xl border border-dashed border-border bg-card/40 p-6">
        <h2 className="font-heading text-lg font-semibold tracking-tight">
          Connect a Firebase project
        </h2>
        <p className="max-w-md text-pretty text-sm text-muted-foreground">
          Paste your web config on the credentials page. Nothing is saved on
          our side — the SDK talks to Firebase from this tab only.
        </p>
        <Link
          href="/playground"
          className="mt-2 inline-flex w-fit items-center rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-transform hover:bg-foreground/90 active:scale-[0.96]"
        >
          Add credentials
        </Link>
      </div>
    );
  }

  return <Provider instance={instance}>{children}</Provider>;
}
