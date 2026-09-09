import { HighlightedCodeBlock } from "@/components/code-highlight";
import { StorageDemo } from "@/components/playground/demos/storage-demo";
import { PlaygroundGate } from "@/components/playground/gated";
import { PrivacyBanner } from "@/components/playground/privacy-banner";
import { PLAYGROUND_SNIPPETS } from "@/lib/playground";

export default async function StoragePlaygroundPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 pb-10">
      <PrivacyBanner />
      <header className="flex flex-col gap-3">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Storage
        </h1>
        <p className="max-w-xl text-pretty text-muted-foreground">
          Upload stays on your bucket. By default Refirebase does not mint a
          long-lived download URL.
        </p>
      </header>
      <HighlightedCodeBlock
        code={PLAYGROUND_SNIPPETS.storage}
        lang="ts"
        label="storage"
      />
      <PlaygroundGate>
        <StorageDemo />
      </PlaygroundGate>
    </div>
  );
}
