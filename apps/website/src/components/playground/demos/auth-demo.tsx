"use client";

import { useState } from "react";
import { useUser } from "refirebase/react";
import { usePlayground } from "../provider";
import { JsonView, ResultPanel } from "../result-panel";

export function AuthDemo() {
  const { instance } = usePlayground();
  const { user, loading } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const run = async (action: () => Promise<{ error?: unknown } | undefined>) => {
    setPending(true);
    setError(null);
    try {
      const result = await action();
      if (result && "error" in result && result.error) {
        setError(errorMessage(result.error));
      }
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <ResultPanel title="auth.currentUser" loading={loading}>
        <JsonView
          value={
            user
              ? { uid: user.uid, email: user.email, displayName: user.displayName }
              : null
          }
        />
      </ResultPanel>

      <section id="google" className="flex scroll-mt-20 flex-col gap-3">
        <h3 className="font-heading text-base font-semibold">Google popup</h3>
        <p className="text-sm text-muted-foreground">
          Add this site to Firebase Auth authorized domains first.
        </p>
        <button
          type="button"
          disabled={pending || !instance}
          onClick={() =>
            run(() => instance!.auth.handleProviderSignIn("google"))
          }
          className="inline-flex w-fit items-center rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background disabled:opacity-50"
        >
          Sign in with Google
        </button>
      </section>

      <section id="email" className="flex scroll-mt-20 flex-col gap-3">
        <h3 className="font-heading text-base font-semibold">Email / password</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="email"
            className="rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="password"
            className="rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>
        <button
          type="button"
          disabled={pending || !instance}
          onClick={() =>
            run(() => instance!.auth.handleEmailSignIn(email, password))
          }
          className="inline-flex w-fit items-center rounded-full border border-border px-4 py-2 text-sm font-medium"
        >
          Sign in with email
        </button>
      </section>

      <section id="sign-out" className="flex scroll-mt-20 flex-col gap-3">
        <h3 className="font-heading text-base font-semibold">Sign out</h3>
        <button
          type="button"
          disabled={pending || !instance || !user}
          onClick={() => run(() => instance!.auth.handleSignOut())}
          className="inline-flex w-fit items-center rounded-full border border-border px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          Sign out
        </button>
      </section>

      {error ? (
        <p className="rounded-xl border border-border bg-card px-4 py-3 text-sm">
          {error}
        </p>
      ) : null}
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
