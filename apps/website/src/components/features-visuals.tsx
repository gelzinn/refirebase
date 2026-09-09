import type { ReactNode } from "react";
import { Database, KeyRound, Server, Shield, Type } from "lucide-react";
import { cn } from "@/lib/utils";

function VisualStage({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative flex h-full w-full", className)}>{children}</div>
  );
}

function OneLineQueries() {
  return (
    <VisualStage className="items-center justify-center p-6">
      <div className="w-56 rounded-xl border border-border bg-card/80 p-3 font-mono text-[10px] leading-relaxed shadow-sm transition-transform duration-500 group-hover:-translate-y-1">
        <div className="text-muted-foreground">db.firestore.get(</div>
        <div className="pl-3 text-foreground">{`'users', {`}</div>
        <div className="pl-6">
          where: {"{"} role:{" "}
          <span className="text-accent">&apos;admin&apos;</span> {"}"}
        </div>
        <div className="pl-3">{"}"}</div>
        <div className="text-muted-foreground">)</div>
      </div>
    </VisualStage>
  );
}

function LiveSubscribe() {
  return (
    <VisualStage className="flex-col items-center justify-center gap-3">
      <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5">
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500/60" />
          <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
        </span>
        <span className="font-mono text-[10px] text-foreground">
          subscribe(messages)
        </span>
      </div>
      <div className="flex w-40 flex-col gap-1.5">
        {["hello", "photo.jpg", "voice"].map((label, i) => (
          <div
            key={label}
            className="h-6 rounded-md border border-border bg-card/70 px-2 font-mono text-[10px] leading-6 text-muted-foreground transition-transform duration-500 group-hover:translate-x-1"
            style={{ transitionDelay: `${i * 60}ms` }}
          >
            {label}
          </div>
        ))}
      </div>
    </VisualStage>
  );
}

function AuthVisual() {
  return (
    <VisualStage className="items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="flex size-12 items-center justify-center rounded-2xl border border-border bg-card shadow-sm transition-transform duration-500 group-hover:scale-105">
          <KeyRound className="size-5 text-foreground" />
        </div>
        <div className="rounded-full border border-border bg-background px-3 py-1 font-mono text-[10px] text-muted-foreground">
          handleCustomTokenSignIn
        </div>
      </div>
    </VisualStage>
  );
}

function AdminVisual() {
  return (
    <VisualStage className="items-center justify-center gap-4">
      <div className="flex flex-col items-center gap-1">
        <div className="flex size-10 items-center justify-center rounded-xl border border-border bg-card">
          <Database className="size-4" />
        </div>
        <span className="font-mono text-[9px] text-muted-foreground">
          client
        </span>
      </div>
      <div className="h-px w-8 bg-border transition-colors duration-500 group-hover:bg-foreground/40" />
      <div className="flex flex-col items-center gap-1">
        <div className="flex size-10 items-center justify-center rounded-xl border border-border bg-foreground text-background transition-transform duration-500 group-hover:scale-105">
          <Server className="size-4" />
        </div>
        <span className="font-mono text-[9px] text-muted-foreground">
          admin
        </span>
      </div>
    </VisualStage>
  );
}

function TypeSafeVisual() {
  return (
    <VisualStage className="items-center justify-center p-6">
      <div className="w-52 rounded-xl border border-border bg-card/80 p-3 font-mono text-[10px] leading-relaxed">
        <div>
          <span className="text-muted-foreground">new</span> Refirebase
          <span className="text-accent">&lt;Schema&gt;</span>
        </div>
        <div className="mt-2 text-muted-foreground">users: {"{"}</div>
        <div className="pl-3">email: string</div>
        <div className="text-muted-foreground">{"}"}</div>
      </div>
    </VisualStage>
  );
}

function NextReadyVisual() {
  return (
    <VisualStage className="items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <Type className="size-5 text-muted-foreground transition-colors group-hover:text-foreground" />
        <div className="rounded-full border border-border bg-card px-3 py-1 font-mono text-[10px] text-foreground">
          NEXT_PUBLIC_FIREBASE_*
        </div>
        <Shield className="size-3.5 text-muted-foreground" />
      </div>
    </VisualStage>
  );
}

export const FeatureVisuals = {
  OneLineQueries,
  LiveSubscribe,
  AuthVisual,
  AdminVisual,
  TypeSafeVisual,
  NextReadyVisual,
};
