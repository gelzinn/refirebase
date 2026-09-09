import { HighlightedCodeBlock } from "@/components/code-highlight";
import { InstallTabs } from "@/components/install-tabs";
import { LIB_NAME } from "@/lib/env";

const COMMANDS = {
  bun: `bun add ${LIB_NAME}`,
  npm: `npm install ${LIB_NAME}`,
  pnpm: `pnpm add ${LIB_NAME}`,
  yarn: `yarn add ${LIB_NAME}`,
} as const;

export async function Hero() {
  return (
    <section className="flex flex-col gap-8">
      <h1 className="font-heading max-w-2xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl motion-safe:animate-fade-up">
        The easiest Firebase API
      </h1>
      <p className="max-w-xl text-pretty text-lg text-muted-foreground motion-safe:animate-fade-up [animation-delay:100ms]">
        One class for Firestore, Realtime Database, Storage, and Auth. Client
        hooks, Admin SDK, and Next.js env vars — without the boilerplate.
      </p>

      <InstallTabs
        panes={{
          bun: (
            <HighlightedCodeBlock
              code={COMMANDS.bun}
              lang="bash"
              label="bun"
              className="w-full"
            />
          ),
          npm: (
            <HighlightedCodeBlock
              code={COMMANDS.npm}
              lang="bash"
              label="npm"
              className="w-full"
            />
          ),
          pnpm: (
            <HighlightedCodeBlock
              code={COMMANDS.pnpm}
              lang="bash"
              label="pnpm"
              className="w-full"
            />
          ),
          yarn: (
            <HighlightedCodeBlock
              code={COMMANDS.yarn}
              lang="bash"
              label="yarn"
              className="w-full"
            />
          ),
        }}
      />
    </section>
  );
}
