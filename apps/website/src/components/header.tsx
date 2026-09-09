import Link from "next/link";
import { GithubIcon } from "@/components/github-icon";
import { Logo } from "@/components/logo";
import { site, repo } from "@/lib/env";
import { cn } from "@/lib/utils";

let cachedStars: number | null = null;

async function getStarCount(): Promise<number | null> {
  try {
    const res = await fetch(repo.apiRepo, {
      headers: {
        "User-Agent": site.name,
        Accept: "application/vnd.github+json",
        ...(process.env.GITHUB_TOKEN
          ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
          : {}),
      },
      next: { revalidate: 21600 },
    });
    if (res.ok) {
      const data = await res.json();
      if (typeof data.stargazers_count === "number") {
        cachedStars = data.stargazers_count;
      }
    }
  } catch (error) {
    console.error("Failed to fetch GitHub stars:", error);
  }
  return cachedStars;
}

export async function Header() {
  const stars = await getStarCount();

  return (
    <header className="flex items-center justify-between">
      <Link
        href="/"
        className="flex items-center gap-2 font-mono text-sm font-medium transition-colors hover:text-muted-foreground"
      >
        <Logo className="size-5" />
        {site.name}
      </Link>
      <div className="flex items-center gap-4 sm:gap-6">
        <Link
          href="/docs"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Docs
        </Link>
        <Link
          href="/playground"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Playground
        </Link>
        <a
          href={repo.url}
          target="_blank"
          rel="noreferrer"
          className={cn(
            "flex items-center gap-2 rounded-full bg-white py-1.5 pl-4 text-sm font-medium text-black transition-transform hover:bg-white/90 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            stars !== null ? "pr-1.5" : "pr-4",
          )}
        >
          <GithubIcon className="-ml-1 size-4" />
          <span className="hidden sm:inline">Star on GitHub</span>
          <span className="sm:hidden">Star</span>
          {stars !== null && (
            <div className="flex items-center justify-center rounded-full bg-black/10 px-2.5 py-1 text-xs font-semibold tabular-nums">
              <span>{stars.toLocaleString()}</span>
            </div>
          )}
        </a>
      </div>
    </header>
  );
}
