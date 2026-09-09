"use client";

import { useEffect, useState } from "react";
import { usePlayground } from "../provider";
import { JsonView, ResultPanel } from "../result-panel";

export function FirestoreDemo() {
  const { instance } = usePlayground();
  const [path, setPath] = useState("users");
  const [payload, setPayload] = useState('{"hello": "playground"}');
  const [docs, setDocs] = useState<unknown>(null);
  const [live, setLive] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);

  const queryOnce = async () => {
    if (!instance) return;
    setLoading(true);
    setError(null);
    const result = await instance.db.firestore.get(path, { limit: 10 });
    setLoading(false);
    if (result && typeof result === "object" && "error" in result) {
      setError(errorMessage(result.error));
      return;
    }
    setDocs(result);
  };

  const addDoc = async () => {
    if (!instance) return;
    setError(null);
    try {
      const data = JSON.parse(payload);
      const result = await instance.db.firestore.add(path, data);
      if (result && typeof result === "object" && "error" in result) {
        setError(errorMessage(result.error));
      }
    } catch (caught) {
      setError(errorMessage(caught));
    }
  };

  useEffect(() => {
    if (!instance || !listening) return;
    const stop = instance.db.firestore.subscribe(
      path,
      (data) => setLive(data),
      { limit: 10 },
      (err) => setError(errorMessage(err)),
    );
    return () => stop();
  }, [instance, path, listening]);

  return (
    <div className="flex flex-col gap-6">
      <label className="flex flex-col gap-2">
        <span className="font-mono text-xs text-muted-foreground">
          collection path
        </span>
        <input
          value={path}
          onChange={(event) => setPath(event.target.value)}
          className="rounded-xl border border-border bg-background px-3 py-2 font-mono text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
      </label>

      <section id="query" className="flex scroll-mt-20 flex-col gap-3">
        <h3 className="font-heading text-base font-semibold">Query</h3>
        <button
          type="button"
          onClick={queryOnce}
          className="inline-flex w-fit items-center rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background"
        >
          Get 10 documents
        </button>
        <ResultPanel title="db.firestore.get" loading={loading} error={error}>
          <JsonView value={docs} />
        </ResultPanel>
      </section>

      <section id="subscribe" className="flex scroll-mt-20 flex-col gap-3">
        <h3 className="font-heading text-base font-semibold">Subscribe</h3>
        <button
          type="button"
          onClick={() => setListening((current) => !current)}
          className="inline-flex w-fit items-center rounded-full border border-border px-4 py-2 text-sm font-medium"
        >
          {listening ? "Stop live updates" : "Start live updates"}
        </button>
        <ResultPanel title="db.firestore.subscribe" empty={!listening && !live}>
          <JsonView value={live} />
        </ResultPanel>
      </section>

      <section id="add" className="flex scroll-mt-20 flex-col gap-3">
        <h3 className="font-heading text-base font-semibold">Add</h3>
        <textarea
          value={payload}
          onChange={(event) => setPayload(event.target.value)}
          rows={4}
          className="rounded-2xl border border-border bg-background px-3 py-2 font-mono text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
        <button
          type="button"
          onClick={addDoc}
          className="inline-flex w-fit items-center rounded-full border border-border px-4 py-2 text-sm font-medium"
        >
          Add document
        </button>
      </section>
    </div>
  );
}

function errorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error && "message" in error) {
    return String((error as { message: unknown }).message);
  }
  return String(error);
}
