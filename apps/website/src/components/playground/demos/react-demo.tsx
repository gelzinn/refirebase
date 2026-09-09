"use client";

import { useState } from "react";
import { useCollection, useUser, useValue } from "refirebase/react";
import { JsonView, ResultPanel } from "../result-panel";

export function ReactDemo() {
  const [collection, setCollection] = useState("users");
  const [realtimePath, setRealtimePath] = useState("app_status");
  const { user, loading: authLoading } = useUser();
  const { data, loading, error } = useCollection(collection, { limit: 5 });
  const { data: realtime, loading: realtimeLoading } = useValue(realtimePath);

  return (
    <div className="flex flex-col gap-6">
      <section id="use-user" className="flex flex-col gap-3">
        <h3 className="font-heading text-base font-semibold">useUser</h3>
        <ResultPanel title="useUser()" loading={authLoading}>
          <JsonView
            value={
              user
                ? { uid: user.uid, email: user.email }
                : null
            }
          />
        </ResultPanel>
      </section>

      <section id="use-collection" className="flex flex-col gap-3">
        <h3 className="font-heading text-base font-semibold">useCollection</h3>
        <input
          value={collection}
          onChange={(event) => setCollection(event.target.value)}
          className="rounded-xl border border-border bg-background px-3 py-2 font-mono text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
        <ResultPanel
          title={`useCollection('${collection}')`}
          loading={loading}
          error={error ? String((error as Error).message ?? error) : null}
        >
          <JsonView value={data} />
        </ResultPanel>
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="font-heading text-base font-semibold">useValue</h3>
        <input
          value={realtimePath}
          onChange={(event) => setRealtimePath(event.target.value)}
          className="rounded-xl border border-border bg-background px-3 py-2 font-mono text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
        <ResultPanel
          title={`useValue('${realtimePath}')`}
          loading={realtimeLoading}
        >
          <JsonView value={realtime} />
        </ResultPanel>
      </section>
    </div>
  );
}
