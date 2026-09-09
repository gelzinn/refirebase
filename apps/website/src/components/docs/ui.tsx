import type { ReactNode } from "react";
import { highlightToReact } from "@/lib/highlight";
import { CodeBlock } from "@/components/code-block";
import { cn } from "@/lib/utils";

// ─── Prose wrapper ──────────────────────────────────────────────────────────

export function DocPage({ children }: { children: ReactNode }) {
  return (
    <article className="prose-doc max-w-3xl flex flex-col gap-10">
      {children}
    </article>
  );
}

// ─── Page header ─────────────────────────────────────────────────────────────

export function DocHeader({
  title,
  description,
  badge,
}: {
  title: string;
  description?: string;
  badge?: "new" | "beta";
}) {
  return (
    <header className="flex flex-col gap-3 border-b border-border pb-8">
      <div className="flex items-center gap-3">
        <h1 className="font-heading text-3xl font-bold tracking-tight">
          {title}
        </h1>
        {badge && (
          <span
            className={cn(
              "self-start rounded-full px-2 py-0.5 text-xs font-semibold uppercase",
              badge === "new"
                ? "bg-accent/20 text-accent"
                : "bg-muted text-muted-foreground",
            )}
          >
            {badge}
          </span>
        )}
      </div>
      {description && (
        <p className="text-lg text-muted-foreground">{description}</p>
      )}
    </header>
  );
}

// ─── Section ─────────────────────────────────────────────────────────────────

export function DocSection({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4">
      {title && (
        <h2 className="font-heading text-xl font-semibold">{title}</h2>
      )}
      {children}
    </section>
  );
}

// ─── Prose paragraph ────────────────────────────────────────────────────────

export function P({ children }: { children: ReactNode }) {
  return (
    <p className="text-pretty leading-7 text-muted-foreground">{children}</p>
  );
}

// ─── Inline code ────────────────────────────────────────────────────────────

export function Code({ children }: { children: ReactNode }) {
  return (
    <code className="rounded-md bg-secondary/60 px-1.5 py-0.5 font-mono text-[0.875em] text-foreground">
      {children}
    </code>
  );
}

// ─── Server-side highlighted code block ──────────────────────────────────────

export async function DocCode({
  code,
  lang = "ts",
  label,
  className,
}: {
  code: string;
  lang?: string;
  label?: string;
  className?: string;
}) {
  const highlighted = await highlightToReact(code, lang);
  return (
    <CodeBlock code={code} label={label} className={className}>
      {highlighted}
    </CodeBlock>
  );
}

// ─── Callout / Alert ────────────────────────────────────────────────────────

export function Callout({
  type = "note",
  children,
}: {
  type?: "note" | "tip" | "warning" | "important";
  children: ReactNode;
}) {
  const styles = {
    note: "border-blue-500/30 bg-blue-500/5 text-blue-700 dark:text-blue-300",
    tip: "border-green-500/30 bg-green-500/5 text-green-700 dark:text-green-300",
    warning:
      "border-yellow-500/30 bg-yellow-500/5 text-yellow-700 dark:text-yellow-300",
    important:
      "border-purple-500/30 bg-purple-500/5 text-purple-700 dark:text-purple-300",
  };
  const icons = { note: "ℹ", tip: "💡", warning: "⚠️", important: "🚨" };

  return (
    <div
      className={cn(
        "flex gap-3 rounded-xl border px-4 py-3 text-sm leading-relaxed",
        styles[type],
      )}
    >
      <span className="shrink-0 text-base">{icons[type]}</span>
      <div>{children}</div>
    </div>
  );
}

// ─── Property table ─────────────────────────────────────────────────────────

export function PropTable({
  rows,
}: {
  rows: {
    name: string;
    type: string;
    required?: boolean;
    description: string;
    default?: string;
  }[];
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted">
            <th className="px-4 py-2.5 text-left font-semibold">Param</th>
            <th className="px-4 py-2.5 text-left font-semibold">Type</th>
            <th className="px-4 py-2.5 text-left font-semibold">Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={row.name}
              className={cn(
                "border-b border-border last:border-0",
                i % 2 === 0 ? "bg-card" : "bg-background",
              )}
            >
              <td className="px-4 py-2.5">
                <code className="font-mono text-xs text-foreground">
                  {row.name}
                  {row.required && (
                    <span className="ml-1 text-accent">*</span>
                  )}
                </code>
              </td>
              <td className="px-4 py-2.5">
                <code className="font-mono text-xs text-muted-foreground">
                  {row.type}
                </code>
              </td>
              <td className="px-4 py-2.5 text-muted-foreground">
                {row.description}
                {row.default && (
                  <span className="ml-1 text-xs text-muted-foreground/60">
                    (default: <code className="font-mono">{row.default}</code>)
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Returns box ─────────────────────────────────────────────────────────────

export function Returns({
  type,
  description,
}: {
  type: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card px-4 py-3">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Returns
      </p>
      <div className="flex items-start gap-3">
        <code className="shrink-0 font-mono text-sm text-foreground">
          {type}
        </code>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

// ─── Pagination ──────────────────────────────────────────────────────────────

export function DocPagination({
  prev,
  next,
}: {
  prev?: { title: string; href: string };
  next?: { title: string; href: string };
}) {
  return (
    <div className="grid grid-cols-2 gap-4 border-t border-border pt-8 mt-4">
      {prev ? (
        <a
          href={prev.href}
          className="group flex flex-col gap-1 rounded-xl border border-border bg-card px-4 py-3 text-sm transition-colors hover:border-foreground/20"
        >
          <span className="text-xs text-muted-foreground">← Previous</span>
          <span className="font-medium text-foreground">{prev.title}</span>
        </a>
      ) : (
        <span />
      )}

      {next ? (
        <a
          href={next.href}
          className="group flex flex-col items-end gap-1 rounded-xl border border-border bg-card px-4 py-3 text-sm transition-colors hover:border-foreground/20"
        >
          <span className="text-xs text-muted-foreground">Next →</span>
          <span className="font-medium text-foreground">{next.title}</span>
        </a>
      ) : (
        <span />
      )}
    </div>
  );
}
