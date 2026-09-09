"use client";

import { cn } from "@/lib/utils";

export function ResultPanel({
  title,
  loading,
  error,
  empty,
  children,
  className,
}: {
  title: string;
  loading?: boolean;
  error?: string | null;
  empty?: boolean;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-border bg-card",
        className,
      )}
    >
      <div className="border-b border-border bg-muted px-4 py-2 font-mono text-xs text-muted-foreground">
        {title}
      </div>
      <div className="max-h-80 overflow-auto p-4 font-mono text-[13px] leading-relaxed">
        {loading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : error ? (
          <p className="text-pretty text-foreground">{error}</p>
        ) : empty ? (
          <p className="text-muted-foreground">No data.</p>
        ) : (
          children
        )}
      </div>
    </div>
  );
}

export function JsonView({ value }: { value: unknown }) {
  return (
    <pre className="m-0 whitespace-pre-wrap break-all text-foreground">
      {JSON.stringify(value, null, 2)}
    </pre>
  );
}
