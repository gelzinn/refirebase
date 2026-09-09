import { ArrowUpRight } from "lucide-react";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { HighlightedCodeBlock } from "@/components/code-highlight";
import { FeatureVisuals } from "@/components/features-visuals";
import { ApiReplica } from "@/components/api-replica";
import { Cta } from "@/components/cta";
import { Footer } from "@/components/footer";
import { repo } from "@/lib/env";
import {
  ADMIN_SNIPPET,
  AUTH_SNIPPET,
  FIRESTORE_SNIPPET,
  INIT_SNIPPET,
  REACT_SNIPPET,
  STORAGE_SNIPPET,
} from "@/lib/snippets";

const PRODUCTS = [
  { name: "Firestore", href: "https://firebase.google.com/docs/firestore" },
  {
    name: "Realtime Database",
    href: "https://firebase.google.com/docs/database",
  },
  { name: "Storage", href: "https://firebase.google.com/docs/storage" },
  { name: "Authentication", href: "https://firebase.google.com/docs/auth" },
  { name: "Admin SDK", href: "https://firebase.google.com/docs/admin/setup" },
  { name: "React hooks", href: `${repo.url}` },
];

export default async function Homepage() {
  let latestVersion = "v0.2.0";

  try {
    const res = await fetch(repo.apiUrl, {
      next: { revalidate: 3600 },
    });

    if (res.ok) {
      const data = await res.json();

      if (data.tag_name) {
        latestVersion = data.tag_name;
      }
    }
  } catch (error) {
    console.error("Failed to fetch github release:", error);
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 p-6 sm:gap-16 sm:py-16">
      <Header />

      <main className="mt-8 grid items-start gap-10 lg:mt-0 lg:grid-cols-2 lg:gap-16">
        <div className="relative z-10 flex min-w-0 flex-col gap-16 md:gap-32 lg:gap-48 lg:pb-32">
          <Hero />

          <section className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <h2 className="font-heading text-2xl font-semibold tracking-tight">
                Getting started
              </h2>
              <p className="max-w-xl text-pretty text-muted-foreground">
                Pass config or read{" "}
                <code className="rounded-md bg-secondary/50 px-1.5 py-0.5 font-mono text-foreground">
                  FIREBASE_*
                </code>{" "}
                /{" "}
                <code className="rounded-md bg-secondary/50 px-1.5 py-0.5 font-mono text-foreground">
                  NEXT_PUBLIC_FIREBASE_*
                </code>
                . Same verbs on client and server.
              </p>
            </div>

            <HighlightedCodeBlock
              code={INIT_SNIPPET}
              lang="ts"
              label="lib/refirebase.ts"
            />
            <HighlightedCodeBlock
              code={FIRESTORE_SNIPPET}
              lang="ts"
              label="firestore"
            />
            <HighlightedCodeBlock code={AUTH_SNIPPET} lang="ts" label="auth" />
            <HighlightedCodeBlock
              code={STORAGE_SNIPPET}
              lang="ts"
              label="storage"
            />
            <HighlightedCodeBlock
              code={ADMIN_SNIPPET}
              lang="ts"
              label="refirebase/admin"
            />
            <HighlightedCodeBlock
              code={REACT_SNIPPET}
              lang="tsx"
              label="refirebase/react"
            />
          </section>

          <section className="relative flex flex-col gap-8">
            <div className="relative z-10 flex flex-col gap-8">
              <div className="flex flex-col gap-3">
                <h2 className="font-heading text-2xl font-semibold tracking-tight">
                  Features
                </h2>
                <p className="max-w-xl text-pretty text-muted-foreground">
                  A thin, typed API over the Firebase products you already use.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-4">
                {[
                  {
                    title: "One-line queries",
                    description:
                      "get, add, set, update, delete — plus where, orderBy, and limit without building Query objects.",
                    visual: FeatureVisuals.OneLineQueries,
                  },
                  {
                    title: "Live updates",
                    description:
                      "Firestore subscribe and Realtime onValue, with onDisconnect for presence.",
                    visual: FeatureVisuals.LiveSubscribe,
                  },
                  {
                    title: "Auth that fits Next.js",
                    description:
                      "Google popup, email/password, and custom tokens so Better Auth sessions can unlock Firebase rules.",
                    visual: FeatureVisuals.AuthVisual,
                  },
                  {
                    title: "Admin, same shape",
                    description:
                      "refirebase/admin mirrors the client: transactions, signed URLs, createCustomToken.",
                    visual: FeatureVisuals.AdminVisual,
                  },
                  {
                    title: "Schema generics",
                    description:
                      "Pass a TypeScript schema and collection names autocomplete with the right document type.",
                    visual: FeatureVisuals.TypeSafeVisual,
                  },
                  {
                    title: "Next.js env",
                    description:
                      "Reads FIREBASE_* and NEXT_PUBLIC_FIREBASE_* so the client bundle stays valid.",
                    visual: FeatureVisuals.NextReadyVisual,
                  },
                ].map((feature) => (
                  <div
                    key={feature.title}
                    className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card"
                  >
                    <div className="relative flex h-52 w-full items-center justify-center overflow-hidden border-b border-border bg-background/50">
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-size-[24px_24px] mask-[linear-gradient(to_bottom,white,transparent)] opacity-50" />
                      <feature.visual />
                    </div>

                    <div className="flex flex-col gap-2 p-4">
                      <h3 className="font-heading text-lg font-semibold text-foreground">
                        {feature.title}
                      </h3>

                      <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="relative z-10 flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <h2 className="font-heading text-2xl font-semibold tracking-tight">
                Covers the Firebase surface
              </h2>
              <p className="max-w-xl text-pretty text-muted-foreground">
                One package instead of wiring each SDK yourself.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {PRODUCTS.map((product) => (
                <a
                  key={product.name}
                  href={product.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-3 rounded-2xl border border-border bg-card p-3 transition-transform hover:-translate-y-0.5 hover:border-foreground/20"
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background font-mono text-[10px] text-muted-foreground">
                    {product.name.slice(0, 2)}
                  </div>

                  <span className="font-heading text-sm font-semibold text-foreground">
                    {product.name}
                  </span>

                  <ArrowUpRight className="ml-auto size-4 text-muted-foreground/40 transition-colors group-hover:text-foreground" />
                </a>
              ))}
            </div>
          </section>
        </div>

        <aside className="z-0 hidden lg:sticky lg:top-8 lg:block lg:h-[calc(100vh-4rem)] lg:self-start">
          <ApiReplica version={latestVersion} />
        </aside>
      </main>

      <Cta />
      <Footer />
    </div>
  );
}
