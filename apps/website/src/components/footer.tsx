import { GithubIcon } from "./github-icon";
import { Logo } from "./logo";
import { site, repo } from "@/lib/env";

export function Footer() {
  return (
    <footer className="mt-16 flex flex-col items-center justify-between gap-6 text-sm text-muted-foreground sm:flex-row">
      <div className="flex items-center gap-2 font-mono font-medium opacity-70 transition-opacity hover:opacity-100">
        <Logo className="size-4" />
        <span>{site.name}</span>
      </div>

      <div className="flex items-center gap-6">
        <a
          href={`${repo.url}/blob/main/LICENSE`}
          target="_blank"
          rel="noreferrer"
          className="font-mono text-xs opacity-50 transition-colors hover:text-foreground hover:opacity-100"
        >
          MIT License
        </a>

        <a
          href={repo.url}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 transition-colors hover:text-foreground"
        >
          <GithubIcon className="size-4" />
          GitHub
        </a>
      </div>
    </footer>
  );
}
