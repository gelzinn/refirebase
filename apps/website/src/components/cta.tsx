import Link from "next/link";
import { HighlightedCodeBlock } from "./code-highlight";
import { InstallTabs } from "./install-tabs";
import { repo, LIB_NAME } from "@/lib/env";
import { GithubIcon } from "@/components/github-icon";

const COMMANDS = {
  bun: `bun add ${LIB_NAME}`,
  npm: `npm install ${LIB_NAME}`,
  pnpm: `pnpm add ${LIB_NAME}`,
  yarn: `yarn add ${LIB_NAME}`,
} as const;

export async function Cta() {
  return (
    <section className="relative mt-24 overflow-hidden rounded-3xl border border-border bg-card/40 p-6 sm:px-16 sm:py-20 sm:text-center">
      <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-size-[24px_24px] mask-[radial-gradient(ellipse_60%_70%_at_50%_50%,#000_10%,transparent_80%)] opacity-30" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-72 w-full max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/5 blur-[100px]" />

      <div className="relative z-10 flex flex-col gap-8 sm:items-center">
        <div className="flex flex-col gap-4 sm:items-center">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-md">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-foreground/40" />
              <span className="relative inline-flex size-1.5 rounded-full bg-foreground/70" />
            </span>
            Ready in one install
          </span>

          <div className="flex flex-col gap-3 sm:items-center">
            <h2 className="font-heading text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Ship Firebase without the SDK maze
            </h2>
            <p className="max-w-md text-pretty text-base text-muted-foreground sm:text-lg">
              Client, React, and Admin — same verbs, same paths, TypeScript
              throughout.
            </p>
          </div>
        </div>

        <div className="w-full max-w-xl text-left">
          <InstallTabs
            align="center"
            panes={{
              bun: (
                <HighlightedCodeBlock
                  code={COMMANDS.bun}
                  lang="bash"
                  label="bun"
                  className="m-0! w-full"
                />
              ),
              npm: (
                <HighlightedCodeBlock
                  code={COMMANDS.npm}
                  lang="bash"
                  label="npm"
                  className="m-0! w-full"
                />
              ),
              pnpm: (
                <HighlightedCodeBlock
                  code={COMMANDS.pnpm}
                  lang="bash"
                  label="pnpm"
                  className="m-0! w-full"
                />
              ),
              yarn: (
                <HighlightedCodeBlock
                  code={COMMANDS.yarn}
                  lang="bash"
                  label="yarn"
                  className="m-0! w-full"
                />
              ),
            }}
          />
        </div>

        <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
          <Link
            href="/playground"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-transform hover:bg-foreground/90 active:scale-[0.96] sm:w-auto"
          >
            Try the playground
          </Link>
          <a
            href={repo.url}
            target="_blank"
            rel="noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-transform hover:bg-secondary/50 active:scale-[0.96] sm:w-auto"
          >
            <GithubIcon className="size-4" />
            Star on GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
