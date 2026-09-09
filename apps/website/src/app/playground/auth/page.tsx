import { HighlightedCodeBlock } from "@/components/code-highlight";
import { AuthDemo } from "@/components/playground/demos/auth-demo";
import { PlaygroundGate } from "@/components/playground/gated";
import { PrivacyBanner } from "@/components/playground/privacy-banner";
import { PLAYGROUND_SNIPPETS } from "@/lib/playground";

export default async function AuthPlaygroundPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 pb-10">
      <PrivacyBanner />
      <header className="flex flex-col gap-3">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Auth
        </h1>
        <p className="max-w-xl text-pretty text-muted-foreground">
          Google popup, email/password, and sign out — same verbs you use in
          production.
        </p>
      </header>
      <HighlightedCodeBlock
        code={PLAYGROUND_SNIPPETS.auth}
        lang="ts"
        label="auth"
      />
      <PlaygroundGate>
        <AuthDemo />
      </PlaygroundGate>
    </div>
  );
}
