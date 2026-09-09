import type { ReactNode } from "react";
import { PlaygroundProvider } from "@/components/playground/provider";
import { PlaygroundShell } from "@/components/playground/shell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Playground | Refirebase",
  description:
    "Try Refirebase in the browser with your own Firebase credentials. Client-side only — we never store your keys.",
};

export default function PlaygroundLayout({ children }: { children: ReactNode }) {
  return (
    <PlaygroundProvider>
      <PlaygroundShell>{children}</PlaygroundShell>
    </PlaygroundProvider>
  );
}
