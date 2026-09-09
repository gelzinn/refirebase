import { CredentialsForm } from "@/components/playground/credentials-form";
import { PrivacyBanner } from "@/components/playground/privacy-banner";

export default async function PlaygroundPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 pb-10">
      <PrivacyBanner />

      <section className="flex flex-col gap-3">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Your Firebase, in this tab
        </h1>
        <p className="max-w-xl text-pretty text-muted-foreground">
          The playground instantiates <code className="rounded-md bg-secondary/50 px-1.5 py-0.5 font-mono text-sm text-foreground">new Refirebase()</code>{" "}
          locally so you can run Auth, Firestore, Realtime, and Storage snippets
          against your project.
        </p>
      </section>

      <CredentialsForm />
    </div>
  );
}
