"use client";

import { useState } from "react";
import { usePlayground } from "../provider";
import { JsonView, ResultPanel } from "../result-panel";

export function StorageDemo() {
  const { instance } = usePlayground();
  const [path, setPath] = useState("playground/");
  const [file, setFile] = useState<File | null>(null);
  const [uploaded, setUploaded] = useState<unknown>(null);
  const [bytes, setBytes] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const onFileChange = (next: File | null) => {
    setFile(next);
    if (!next) return;
    setPath((current) => pathForFile(current, next.name));
  };

  const upload = async () => {
    if (!instance || !file) return;
    const destination =
      !path.trim() || path.trim().endsWith("/")
        ? pathForFile(path, file.name)
        : path.trim();
    setPath(destination);
    setPending(true);
    setError(null);
    try {
      const result = await instance.db.storage.upload(destination, file);
      setUploaded(result);
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setPending(false);
    }
  };

  const readBytes = async () => {
    if (!instance) return;
    setPending(true);
    setError(null);
    try {
      const result = await instance.db.storage.getBytes(path);
      setBytes(result.byteLength);
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <label className="flex flex-col gap-2">
        <span className="font-mono text-xs text-muted-foreground">
          storage path
        </span>
        <input
          value={path}
          onChange={(event) => setPath(event.target.value)}
          className="rounded-xl border border-border bg-background px-3 py-2 font-mono text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
      </label>

      {error ? (
        <p className="rounded-xl border border-border bg-card px-4 py-3 text-sm">
          {error}
        </p>
      ) : null}

      <section id="upload" className="flex flex-col gap-3">
        <h3 className="font-heading text-base font-semibold">Upload</h3>
        <input
          type="file"
          onChange={(event) =>
            onFileChange(event.target.files?.[0] ?? null)
          }
          className="text-sm file:mr-3 file:rounded-full file:border file:border-border file:bg-secondary/50 file:px-3 file:py-1.5"
        />
        <button
          type="button"
          disabled={!file || pending}
          onClick={upload}
          className="inline-flex w-fit items-center rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background disabled:opacity-50"
        >
          Upload
        </button>
        <ResultPanel title="db.storage.upload">
          <JsonView value={uploaded} />
        </ResultPanel>
      </section>

      <section id="bytes" className="flex flex-col gap-3">
        <h3 className="font-heading text-base font-semibold">Get bytes</h3>
        <button
          type="button"
          disabled={pending}
          onClick={readBytes}
          className="inline-flex w-fit items-center rounded-full border border-border px-4 py-2 text-sm font-medium"
        >
          Read bytes
        </button>
        <ResultPanel title="db.storage.getBytes">
          <JsonView
            value={bytes === null ? null : { byteLength: bytes }}
          />
        </ResultPanel>
      </section>
    </div>
  );
}

function pathForFile(currentPath: string, fileName: string) {
  const safeName = fileName.replaceAll("/", "_");
  const trimmed = currentPath.trim();
  if (!trimmed || trimmed.endsWith("/")) {
    return `${trimmed || "playground/"}${safeName}`;
  }
  const slash = trimmed.lastIndexOf("/");
  if (slash >= 0) {
    return `${trimmed.slice(0, slash + 1)}${safeName}`;
  }
  return safeName;
}

function errorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error && "message" in error) {
    return String((error as { message: unknown }).message);
  }
  return String(error);
}
