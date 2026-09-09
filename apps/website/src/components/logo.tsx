import Image from "next/image";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="/logo.png"
      alt="Refirebase"
      width={40}
      height={40}
      className={cn(
        "rounded-md outline outline-black/10 dark:outline-white/10",
        className,
      )}
    />
  );
}
