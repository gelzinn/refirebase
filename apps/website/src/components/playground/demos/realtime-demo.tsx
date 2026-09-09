"use client";

import { useEffect, useState } from "react";
import { usePlayground } from "../provider";
import { JsonView, ResultPanel } from "../result-panel";

export function RealtimeDemo() {
  const { instance } = usePlayground();
  const [path, setPath] = useState("app_status");
  const [value, setValue] = useState('{"online": true}');
  const [snapshot, setSnapshot] = useState<unknown>(null);
  const [live, setLive] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);
  const [listening, setListening] = useState(false);

  const getOnce = async () => {
    if (!instance) return;
    setError(null);
    const result = await instance.db.realtime.get(path);
    if (result && typeof result === "object" && "error" in result) {
      setError(errorMessage((result as { error: unknown }).error));
      return;
    }
    setSnapshot(result);
  };

  const write = async () => {
    if (!instance) return;
    setError(null);
    try {
      const data = JSON.parse(value);
      const result = await instance.db.realtime.set(path, data);
      if (result?.error) setError(errorMessage(result.error));
    } catch (caught) {
      setError(errorMessage(caught));
    }
  };

  useEffect(() => {
    if (!instance || !listening) return;
    let stop: (() => void) | undefined;
    instance.db.realtime
      .onValue(path, (data) => setLive(data))
      .then((unsub) => {
        stop = unsub;
      })
      .catch((caught) => setError(errorMessage(caught)));
    return () => stop?.();
  }, [instance, path, listening]);

  return (
    <div className="flex flex-col gap-6">
      <label className="flex flex-col gap-2">
        <span className="font-mono text-xs text-muted-foreground">path</span>
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

      <section id="get" className="flex flex-col gap-3">
        <h3 className="font-heading text-base font-semibold">Get</h3>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={getOnce}
            className="inline-flex items-center rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background"
          >
            Read path
          </button>
          <button
            type="button"
            onClick={write}
            className="inline-flex items-center rounded-full border border-border px-4 py-2 text-sm font-medium"
          >
            Write JSON
          </button>
        </div>
        <textarea
          value={value}
          onChange={(event) => setValue(event.target.value)}
          rows={3}
          className="rounded-2xl border border-border bg-background px-3 py-2 font-mono text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
        <ResultPanel title="db.realtime.get">
          <JsonView value={snapshot} />
        </ResultPanel>
      </section>

      <section id="on-value" className="flex flex-col gap-3">
        <h3 className="font-heading text-base font-semibold">onValue</h3>
        <button
          type="button"
          onClick={() => setListening((current) => !current)}
          className="inline-flex w-fit items-center rounded-full border border-border px-4 py-2 text-sm font-medium"
        >
          {listening ? "Stop listening" : "Listen"}
        </button>
        <ResultPanel title="db.realtime.onValue" empty={!listening && !live}>
          <JsonView value={live} />
        </ResultPanel>
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
