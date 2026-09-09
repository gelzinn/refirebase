"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const TABS = [
  {
    id: "firestore",
    label: "Firestore",
    lines: [
      { c: "kw", t: "const" },
      { c: "plain", t: " users = " },
      { c: "kw", t: "await" },
      { c: "plain", t: " db.firestore." },
      { c: "fn", t: "get" },
      { c: "plain", t: "(" },
      { c: "str", t: "'users'" },
      { c: "plain", t: ", {" },
    ],
    extra: [
      "  where: { role: 'admin' },",
      "  limit: 20,",
      "})",
    ],
    result: "[{ id: 'u1', role: 'admin' }]",
  },
  {
    id: "auth",
    label: "Auth",
    lines: [
      { c: "kw", t: "await" },
      { c: "plain", t: " auth." },
      { c: "fn", t: "handleCustomTokenSignIn" },
      { c: "plain", t: "(token)" },
    ],
    extra: [],
    result: "{ data: { user: { uid } } }",
  },
  {
    id: "storage",
    label: "Storage",
    lines: [
      { c: "kw", t: "const" },
      { c: "plain", t: " file = " },
      { c: "kw", t: "await" },
      { c: "plain", t: " db.storage." },
      { c: "fn", t: "upload" },
      { c: "plain", t: "(path, blob)" },
    ],
    extra: [],
    result: "{ path, byteSize: 48211 }",
  },
  {
    id: "admin",
    label: "Admin",
    lines: [
      { c: "kw", t: "const" },
      { c: "plain", t: " url = " },
      { c: "kw", t: "await" },
      { c: "plain", t: " admin.db.storage." },
      { c: "fn", t: "getSignedUrl" },
      { c: "plain", t: "(path)" },
    ],
    extra: [],
    result: "https://storage.googleapis.com/…",
  },
] as const;

function Tone({
  c,
  t,
}: {
  c: "kw" | "fn" | "str" | "plain";
  t: string;
}) {
  const color =
    c === "kw"
      ? "text-[#ffcfa3]"
      : c === "fn"
        ? "text-sky-300"
        : c === "str"
          ? "text-emerald-300"
          : "text-foreground/80";
  return <span className={color}>{t}</span>;
}

export function ApiReplica({ version }: { version: string }) {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("firestore");
  const active = TABS.find((item) => item.id === tab) ?? TABS[0];

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-red-400/70" />
          <span className="size-2.5 rounded-full bg-yellow-400/70" />
          <span className="size-2.5 rounded-full bg-emerald-400/70" />
        </div>
        <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
          refirebase {version}
        </span>
      </div>

      <div className="flex gap-1 border-b border-border px-3 py-2">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={cn(
              "min-h-9 rounded-full px-3 py-1.5 font-mono text-[11px] transition-[background-color,color,transform] active:scale-[0.96]",
              tab === item.id
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5 font-mono text-[13px] leading-relaxed">
        <pre className="text-pretty">
          <code>
            {active.lines.map((token) => (
              <Tone key={token.t + token.c} c={token.c} t={token.t} />
            ))}
            {active.extra.map((line) => (
              <span key={line} className="block text-muted-foreground">
                {line}
              </span>
            ))}
          </code>
        </pre>

        <div className="mt-auto rounded-2xl border border-border bg-background/60 p-4">
          <div className="mb-2 font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
            result
          </div>
          <div className="text-[12px] text-foreground/80">{active.result}</div>
        </div>
      </div>
    </div>
  );
}
