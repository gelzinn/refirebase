"use client";

import { useEffect, useState, type FormEvent } from "react";
import { ClientHighlightedCodeBlock } from "@/components/client-code-highlight";
import {
  CONFIG_FIELDS,
  EMPTY_CONFIG,
  initSnippetFromConfig,
  parseFirebaseSnippet,
  type PlaygroundConfig,
} from "@/lib/playground";
import { cn } from "@/lib/utils";
import { usePlayground } from "./provider";

function InitSnippet({ config }: { config: PlaygroundConfig }) {
  return (
    <ClientHighlightedCodeBlock
      code={initSnippetFromConfig(config)}
      lang="ts"
      label="lib/refirebase.ts"
    />
  );
}

export function CredentialsForm() {
  const { config, save, clear, ready } = usePlayground();
  const [paste, setPaste] = useState("");
  const [pasteError, setPasteError] = useState<string | null>(null);
  const [draft, setDraft] = useState<PlaygroundConfig>(config);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setDraft(config);
  }, [config]);

  const syncDraft = (next: PlaygroundConfig) => {
    setDraft(next);
    setSaved(false);
  };

  const applyPaste = () => {
    const parsed = parseFirebaseSnippet(paste);
    const keys = Object.keys(parsed);
    if (keys.length === 0) {
      setPasteError("Could not find Firebase keys in that snippet.");
      return;
    }
    setPasteError(null);
    syncDraft({ ...draft, ...parsed });
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    save(draft);
    setSaved(true);
  };

  return (
    <form id="credentials" onSubmit={onSubmit} className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <label
          htmlFor="firebase-paste"
          className="font-heading text-sm font-semibold"
        >
          Paste your Firebase web config
        </label>
        <textarea
          id="firebase-paste"
          value={paste}
          onChange={(event) => {
            setPaste(event.target.value);
            setPasteError(null);
          }}
          placeholder={'{\n  "apiKey": "...",\n  "authDomain": "..."\n}'}
          rows={7}
          className="min-h-40 w-full resize-y rounded-2xl border border-border bg-background px-4 py-3 font-mono text-[13px] leading-relaxed outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
        {pasteError ? (
          <p className="text-sm text-muted-foreground">{pasteError}</p>
        ) : null}
        <button
          type="button"
          onClick={applyPaste}
          className="inline-flex w-fit items-center rounded-full border border-border bg-secondary/50 px-4 py-2 text-sm font-medium transition-transform hover:bg-secondary active:scale-[0.96]"
        >
          Fill fields from paste
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {CONFIG_FIELDS.map((field) => (
          <label
            key={field.key}
            className={cn(
              "flex flex-col gap-2",
              field.key === "appId" || field.key === "databaseURL"
                ? "sm:col-span-2"
                : "",
            )}
          >
            <span className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
              {field.label}
              {field.required ? null : (
                <span className="rounded-full border border-border px-1.5 py-px text-[10px] uppercase">
                  optional
                </span>
              )}
            </span>
            <input
              name={field.key}
              value={draft[field.key] ?? ""}
              onChange={(event) =>
                syncDraft({ ...draft, [field.key]: event.target.value })
              }
              autoComplete="off"
              spellCheck={false}
              className="rounded-xl border border-border bg-background px-3 py-2 font-mono text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
          </label>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-transform hover:bg-foreground/90 active:scale-[0.96]"
        >
          Use in this tab
        </button>
        <button
          type="button"
          onClick={() => {
            clear();
            syncDraft(EMPTY_CONFIG);
            setPaste("");
            setSaved(false);
          }}
          className="rounded-full border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground transition-transform hover:text-foreground active:scale-[0.96]"
        >
          Clear tab
        </button>
        {saved || ready ? (
          <span className="font-mono text-xs text-muted-foreground">
            {saved ? "Saved in this tab." : `Connected to ${config.projectId}`}
          </span>
        ) : null}
      </div>

      <InitSnippet config={draft} />
    </form>
  );
}
