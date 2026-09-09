export function PrivacyBanner() {
  return (
    <div
      id="privacy"
      role="status"
      className="rounded-2xl border border-amber-500/10 bg-amber-500/10 px-4 py-3 text-amber-500"
    >
      <p className="text-pretty text-sm">
        Client-side only: this playground runs in your browser. Firebase keys
        stay in{" "}
        <code className="rounded-md bg-amber-500/10 px-1.5 py-0.5 font-mono text-xs">
          sessionStorage
        </code>{" "}
        on this tab — we never send or store them on our servers.
      </p>
    </div>
  );
}
