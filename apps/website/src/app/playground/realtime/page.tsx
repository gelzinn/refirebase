import { HighlightedCodeBlock } from "@/components/code-highlight";
import { RealtimeDemo } from "@/components/playground/demos/realtime-demo";
import { PlaygroundGate } from "@/components/playground/gated";
import { PrivacyBanner } from "@/components/playground/privacy-banner";
import { PLAYGROUND_SNIPPETS } from "@/lib/playground";

export default async function RealtimePlaygroundPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 pb-10">
      <PrivacyBanner />
      <header className="flex flex-col gap-3">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Realtime Database
        </h1>
        <p className="max-w-xl text-pretty text-muted-foreground">
          Read a path once or listen with <code className="rounded-md bg-secondary/50 px-1.5 py-0.5 font-mono text-sm text-foreground">onValue</code>.{" "}
          <code className="rounded-md bg-secondary/50 px-1.5 py-0.5 font-mono text-sm text-foreground">databaseURL</code>{" "}
          is required in your credentials.
        </p>
      </header>
      <HighlightedCodeBlock
        code={PLAYGROUND_SNIPPETS.realtime}
        lang="ts"
        label="realtime"
      />
      <PlaygroundGate>
        <RealtimeDemo />
      </PlaygroundGate>
    </div>
  );
}
