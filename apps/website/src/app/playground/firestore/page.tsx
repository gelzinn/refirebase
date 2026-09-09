import { HighlightedCodeBlock } from "@/components/code-highlight";
import { FirestoreDemo } from "@/components/playground/demos/firestore-demo";
import { PlaygroundGate } from "@/components/playground/gated";
import { PrivacyBanner } from "@/components/playground/privacy-banner";
import { PLAYGROUND_SNIPPETS } from "@/lib/playground";

export default async function FirestorePlaygroundPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 pb-10">
      <PrivacyBanner />
      <header className="flex flex-col gap-3">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Firestore
        </h1>
        <p className="max-w-xl text-pretty text-muted-foreground">
          Query, subscribe, and add documents. Path can be a collection or a
          subcollection like <code className="rounded-md bg-secondary/50 px-1.5 py-0.5 font-mono text-sm text-foreground">inbox/uid/chats</code>.
        </p>
      </header>
      <HighlightedCodeBlock
        code={PLAYGROUND_SNIPPETS.firestore}
        lang="ts"
        label="firestore"
      />
      <PlaygroundGate>
        <FirestoreDemo />
      </PlaygroundGate>
    </div>
  );
}
